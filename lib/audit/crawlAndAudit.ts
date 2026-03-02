import { chromium } from "playwright";
import runAuditOnPage from "./runAudit";
import { extractSameDomainLinks } from "./urlCrawler";
import prepareAuditResult from "./prepareAuditResult";

export async function* crawlAndAuditGenerator(startUrl: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const visited = new Set<string>();
    const queue: string[] = [startUrl];

    try {
        while (queue.length > 0) {
            const currentUrl = queue.shift();
            if (!currentUrl || visited.has(currentUrl)) continue;

            visited.add(currentUrl);

            // Yield progress
            yield { type: "progress", url: currentUrl, queueLength: queue.length, visitedCount: visited.size };

            try {
                await page.goto(currentUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

                // Run Axe-core scan directly on this page context
                const tests = await runAuditOnPage(page);
                const result = prepareAuditResult(currentUrl, tests);
                yield { type: "result", data: result };

                // Extract links
                const html = await page.content();
                const links = extractSameDomainLinks(startUrl, html);
                for (const link of links) {
                    if (!visited.has(link) && !queue.includes(link)) {
                        queue.push(link);
                    }
                }
            } catch (error) {
                console.error(`Failed to audit ${currentUrl}:`, error);
                yield { type: "error", url: currentUrl, error: String(error) };
            }
        }
    } finally {
        await browser.close();
    }
}
