import * as cheerio from "cheerio";

export function detectTechnologies(html: string, headers: Record<string, any>) {
    const technologies = new Set<string>();
    const $ = cheerio.load(html);

    const scripts = $("script").map((_, el) => $(el).attr("src") || "").get();
    const metaTags = $("meta").map((_, el) => ({
        name: $(el).attr("name"),
        content: $(el).attr("content"),
        generator: $(el).attr("generator")
    })).get();

    // 1. Framework & Library Detection
    if (html.includes("__NEXT_DATA__") || scripts.some(src => src.includes("/_next/"))) {
        technologies.add("Next.js");
    }

    if (scripts.some(src => src.includes("react"))) {
        technologies.add("React");
    }

    if (html.includes("wp-content") || metaTags.some(meta => meta.generator?.includes("WordPress"))) {
        technologies.add("WordPress");
    }

    // 2. Styling
    if (html.includes("tailwind") || html.includes("tw-")) {
        technologies.add("Tailwind CSS");
    }

    // 3. Hosting & Security
    const server = headers["server"]?.toLowerCase() || "";
    if (server.includes("cloudflare") || headers["cf-ray"]) {
        technologies.add("Cloudflare");
    }

    if (server.includes("nginx")) {
        technologies.add("Nginx");
    }

    // 4. Analytics & Marketing
    if (html.includes("googletagmanager.com") || html.includes("gtag")) {
        technologies.add("Google Analytics");
    }

    if (html.includes("stripe")) {
        technologies.add("Stripe");
    }

    return Array.from(technologies);
}
