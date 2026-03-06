import axios from "axios";
import * as cheerio from "cheerio";

export async function scanSeo(url: string, preFetchedHtml?: string) {
    try {
        let html = preFetchedHtml;

        if (!html) {
            const response = await axios.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
                timeout: 10000,
            });
            html = response.data;
        }

        const $ = cheerio.load(html as string);

        const title = $("title").text() || "";
        const metaDescription = $('meta[name="description"]').attr("content") || "";
        const h1Tags = $("h1")
            .map((_, el) => $(el).text())
            .get();

        // Alt tags
        const images = $("img");
        let missingAlt = 0;
        images.each((_, el) => {
            if (!$(el).attr("alt")) {
                missingAlt++;
            }
        });

        // Sitemap/Robots check (basic check for standard locations)
        const baseUrl = new URL(url).origin;

        let hasSitemap = false;
        let hasRobotsTxt = false;

        try {
            const robotsRes = await axios.get(`${baseUrl}/robots.txt`, { timeout: 3000 });
            hasRobotsTxt = robotsRes.status === 200;
            hasSitemap = robotsRes.data.includes("Sitemap:");
        } catch (e) { }

        return {
            title,
            metaDescription,
            h1Tags,
            imageAltTags: { total: images.length, missing: missingAlt },
            hasSitemap,
            hasRobotsTxt,
        };
    } catch (error: any) {
        console.error("SEO Scanner Error:", error.message);
        return {
            title: "",
            metaDescription: "",
            h1Tags: [],
            imageAltTags: { total: 0, missing: 0 },
            hasSitemap: false,
            hasRobotsTxt: false,
        };
    }
}
