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
        await dbConnect();

        // Ensure valid URL
        const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

        console.log(`Starting audit for: ${formattedUrl}`);

        // Fetch HTML for SEO & Tech Detection
        const { data: html, headers } = await axios.get(formattedUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 10000,
        });

        // Run Scanners in Parallel (Performance is the longest so we run it alongside)
        const [psiData, seoData, securityData] = await Promise.all([
            fetchPageSpeedData(formattedUrl),
            scanSeo(formattedUrl),
            scanSecurity(formattedUrl),
        ]);

        // Detect Tech from initial fetch
        const techStack = detectTechnologies(html, headers);

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
        const aiReportMarkdown = await generateAiReport(auditResults);

        // Save to Database
        const audit = new Audit({
            ...auditResults,
            userId,
            aiReport: aiReportMarkdown,
        });

        await audit.save();

        return audit;
    } catch (error: any) {
        console.error("Audit Agent Failed:", error.message);
        throw new Error(`Audit failed: ${error.message}`);
    }
}
