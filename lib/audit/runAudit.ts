import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { RuleResult, RuleStatus, RuleIssue } from "@/types";

// Helper function to calculate score based on status
const calculateScore = (status: RuleStatus): number => {
  switch (status) {
    case RuleStatus.PASS:
      return 10;
    case RuleStatus.WARNING:
      return 5;
    case RuleStatus.FAIL:
      return 0;
    default:
      return 0;
  }
};

export default async function runAuditWithAxe(url: string): Promise<RuleResult[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results: RuleResult[] = [];

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Run Axe-core scan
    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]) // Covering overarching principles
      .analyze();

    // Map passed rules
    for (const pass of axeResults.passes) {
      results.push({
        id: pass.id,
        title: pass.help,
        score: calculateScore(RuleStatus.PASS),
        status: RuleStatus.PASS,
        whyItMatters: [pass.description],
        howToFix: pass.helpUrl ? [pass.helpUrl] : [],
        issues: [],
      });
    }

    // Map failed rules
    for (const violation of axeResults.violations) {
      const isWarning = violation.impact === 'minor';
      const status = isWarning ? RuleStatus.WARNING : RuleStatus.FAIL;

      const issues: RuleIssue[] = violation.nodes.map(node => ({
        selector: node.target.join(", "),
        issue: node.failureSummary || "Unknown issue",
      }));

      results.push({
        id: violation.id,
        title: violation.help,
        score: calculateScore(status),
        status,
        whyItMatters: [violation.description],
        howToFix: violation.helpUrl ? [violation.helpUrl] : [],
        issues,
      });
    }

    // Incomplete results can be treated as warnings
    for (const incomplete of axeResults.incomplete) {
      const issues: RuleIssue[] = incomplete.nodes.map(node => ({
        selector: node.target.join(", "),
        issue: node.failureSummary || "Needs manual review",
      }));

      results.push({
        id: incomplete.id,
        title: incomplete.help + " (Review)",
        score: calculateScore(RuleStatus.WARNING),
        status: RuleStatus.WARNING,
        whyItMatters: [incomplete.description],
        howToFix: incomplete.helpUrl ? [incomplete.helpUrl] : [],
        issues,
      });
    }

  } catch (error) {
    console.error(`Failed to audit ${url}:`, error);
    throw error;
  } finally {
    await browser.close();
  }

  // Ensure we sort or limit results if needed, or just return them all.
  // The UI currently expects exactly 10, but since Axe returns dynamic counts,
  // we are adapting the UI to render whatever Axe finds.
  return results;
}
