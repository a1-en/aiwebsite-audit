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

export async function fetchPageSpeedData(url: string): Promise<PageSpeedResult> {
    try {
        const response = await axios.get(PSI_URL, {
            params: {
                url: url,
                key: PAGESPEED_API_KEY,
                category: ["performance", "accessibility", "best-practices", "seo"],
                strategy: "desktop", // we can use mobile if preferred
            },
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
        console.error("PageSpeed API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch reports from Google PageSpeed Insights.");
    }
}
