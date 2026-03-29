import dbConnect from "@/lib/mongodb";
import Audit from "@/models/Audit";
import { fetchPageSpeedData } from "@/lib/pagespeed";
import { scanSeo } from "./seoScanner";
import { scanSecurity } from "./securityScanner";
import { detectTechnologies } from "./techDetector";
import { generateAiReport } from "@/lib/openai";
import axios from "axios";

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            console.warn(`[AuditAgent] ${label} timed out after ${ms}ms`);
            resolve(null);
        }, ms);

        promise
            .then((value) => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}

export async function runFullAudit(url: string, userId: string) {
    try {
        console.log("[AuditAgent] runFullAudit called", {
            rawUrl: url,
            userId,
            time: new Date().toISOString(),
        });

        const preDb = Date.now();
        await dbConnect();
        console.log("[AuditAgent] dbConnect completed", {
            durationMs: Date.now() - preDb,
            time: new Date().toISOString(),
        });

        // Ensure valid URL
        const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

        console.log("[AuditAgent] Starting audit for URL", {
            formattedUrl,
            userId,
            time: new Date().toISOString(),
        });

        // Fetch HTML for SEO & Tech Detection
        const preHtml = Date.now();
        let html: any = "";
        let headers: any = {};
        try {
            const htmlResp = await axios.get(formattedUrl, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
                timeout: 5000,
            });
            html = htmlResp.data;
            headers = htmlResp.headers;
            console.log("[AuditAgent] Initial HTML fetch completed", {
                formattedUrl,
                durationMs: Date.now() - preHtml,
                contentLength: typeof html === "string" ? html.length : undefined,
                time: new Date().toISOString(),
            });
        } catch (err: any) {
            console.warn("[AuditAgent] Initial HTML fetch failed, continuing without HTML", {
                formattedUrl,
                durationMs: Date.now() - preHtml,
                message: err?.message,
                code: err?.code,
                time: new Date().toISOString(),
            });
        }

        // Run Scanners in Parallel (Performance is the longest so we run it alongside)
        const scannersStart = Date.now();
        const [psiDataRaw, seoData, securityData] = await Promise.all([
            // Give PageSpeed 40s to complete — it's slow but important
            withTimeout(fetchPageSpeedData(formattedUrl), 40000, "fetchPageSpeedData"),
            scanSeo(formattedUrl, html),
            scanSecurity(formattedUrl, headers),
        ]);
        const psiData =
            psiDataRaw || {
                performanceScore: 0,
                accessibilityScore: 0,
                bestPracticesScore: 0,
                seoScore: 0,
                details: {},
            };
        console.log("[AuditAgent] Scanners completed", {
            formattedUrl,
            durationMs: Date.now() - scannersStart,
            psiPresent: !!psiDataRaw,
            seoTitlePresent: !!seoData?.title,
            securityIssuesCount: securityData?.securityIssues?.length,
            time: new Date().toISOString(),
        });

        // Detect Tech from initial fetch
        const techStack = detectTechnologies(html, headers);
        console.log("[AuditAgent] Tech detection completed", {
            formattedUrl,
            techCount: Array.isArray(techStack) ? techStack.length : undefined,
            time: new Date().toISOString(),
        });

        const auditResults = {
            url: formattedUrl,
            performanceScore: psiData.performanceScore,
            seoScore: seoData.title ? (seoData.metaDescription ? 100 : 70) : 40, // simplified score if PSI is slow/unavailable
            accessibilityScore: psiData.accessibilityScore,
            bestPracticesScore: psiData.bestPracticesScore,
            securityScore: securityData.securityScore,

            performanceDetails: psiData.details,
            seoDetails: seoData,
            securityIssues: securityData.securityIssues,
            techStack: techStack,
        };

        // Use higher of PSI SEO score vs our custom scan if possible
        if (psiData.seoScore > 0) {
            auditResults.seoScore = psiData.seoScore;
        }

        // Generate AI Report (still timeboxed, but longer so full report usually comes through)
        const aiStart = Date.now();
        const aiReportMarkdownRaw = await withTimeout(
            generateAiReport(auditResults),
            15000,
            "generateAiReport"
        );
        const aiReportMarkdown =
            aiReportMarkdownRaw ||
            `# Automated Audit Report\n\nThe detailed AI report could not be generated in time, but core audit metrics have been collected for ${formattedUrl}.`;
        console.log("[AuditAgent] AI report generated (may be fallback)", {
            formattedUrl,
            durationMs: Date.now() - aiStart,
            usedFallback: !aiReportMarkdownRaw,
            time: new Date().toISOString(),
        });

        // Save to Database
        const saveStart = Date.now();
        const audit = new Audit({
            ...auditResults,
            userId,
            aiReport: aiReportMarkdown,
        });

        await audit.save();
        console.log("[AuditAgent] Audit saved to DB", {
            formattedUrl,
            userId,
            auditId: audit?._id?.toString?.(),
            durationMs: Date.now() - saveStart,
            time: new Date().toISOString(),
        });

        return audit;
    } catch (error: any) {
        console.error("[AuditAgent] Audit Agent Failed:", {
            time: new Date().toISOString(),
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
        });
        throw new Error(`Audit failed: ${error.message}`);
    }
}
