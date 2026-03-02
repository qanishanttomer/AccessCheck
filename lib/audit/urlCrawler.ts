import * as cheerio from "cheerio";

export function extractSameDomainLinks(baseUrl: string, html: string): string[] {
    const links: Set<string> = new Set();
    const $ = cheerio.load(html);

    let baseObj: URL;
    try {
        baseObj = new URL(baseUrl);
    } catch (e) {
        return [];
    }

    $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (!href) return;

        if (
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:")
        ) {
            return;
        }

        try {
            const urlObj = new URL(href, baseUrl);
            if (urlObj.origin === baseObj.origin) {
                urlObj.hash = ""; // remove anchors
                links.add(urlObj.href);
            }
        } catch (e) {
            // Ignore invalid URLs
        }
    });

    return Array.from(links);
}
