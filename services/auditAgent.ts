import dbConnect from "@/lib/mongodb";
import Audit from "@/models/Audit";
import { fetchPageSpeedData } from "@/lib/pagespeed";
import { scanSeo } from "./seoScanner";
import { scanSecurity } from "./securityScanner";
import { detectTechnologies } from "./techDetector";
import { generateAiReport } from "@/lib/openai";
import axios from "axios";

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
        const { data: html, headers } = await axios.get(formattedUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 10000,
        });
        console.log("[AuditAgent] Initial HTML fetch completed", {
            formattedUrl,
            durationMs: Date.now() - preHtml,
            contentLength: typeof html === "string" ? html.length : undefined,
            time: new Date().toISOString(),
        });

        // Run Scanners in Parallel (Performance is the longest so we run it alongside)
        const scannersStart = Date.now();
        const [psiData, seoData, securityData] = await Promise.all([
            fetchPageSpeedData(formattedUrl),
            scanSeo(formattedUrl),
            scanSecurity(formattedUrl),
        ]);
        console.log("[AuditAgent] Scanners completed", {
            formattedUrl,
            durationMs: Date.now() - scannersStart,
            psiPresent: !!psiData,
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

        // Generate AI Report
        const aiStart = Date.now();
        const aiReportMarkdown = await generateAiReport(auditResults);
        console.log("[AuditAgent] AI report generated", {
            formattedUrl,
            durationMs: Date.now() - aiStart,
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
