import axios from "axios";

const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const PSI_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export interface PageSpeedResult {
    performanceScore: number;
    accessibilityScore: number;
    bestPracticesScore: number;
    seoScore: number;
    details: {
        lcp: string;
        cls: string;
        loadTime: string;
        totalByteSize: number;
    };
}

/** Fallback result returned when PSI times out or fails */
const PSI_FALLBACK: PageSpeedResult = {
    performanceScore: 0,
    accessibilityScore: 0,
    bestPracticesScore: 0,
    seoScore: 0,
    details: {
        lcp: "N/A",
        cls: "N/A",
        loadTime: "N/A",
        totalByteSize: 0,
    },
};

export async function fetchPageSpeedData(url: string): Promise<PageSpeedResult> {
    try {
        const response = await axios.get(PSI_URL, {
            params: {
                url: url,
                key: PAGESPEED_API_KEY,
                category: ["performance", "accessibility", "best-practices", "seo"],
                strategy: "desktop",
            },
            // Strict timeout — PSI can be very slow and cause 504s on serverless
            timeout: 8000,
        });

        const data = response.data.lighthouseResult;
        const categories = data.categories;
        const audits = data.audits;

        return {
            performanceScore: Math.round((categories.performance?.score || 0) * 100),
            accessibilityScore: Math.round((categories.accessibility?.score || 0) * 100),
            bestPracticesScore: Math.round((categories["best-practices"]?.score || 0) * 100),
            seoScore: Math.round((categories.seo?.score || 0) * 100),
            details: {
                lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
                cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
                loadTime: audits["speed-index"]?.displayValue || "N/A",
                totalByteSize: audits["total-byte-weight"]?.numericValue || 0,
            },
        };
    } catch (error: any) {
        // Return fallback scores instead of throwing — keeps the audit alive
        // even when PSI is slow or unreachable from the serverless environment
        console.warn("PageSpeed API timed-out or failed — using fallback scores.", error.message);
        return PSI_FALLBACK;
    }
}
