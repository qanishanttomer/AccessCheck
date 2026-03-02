import { Page } from "playwright";
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

export default async function runAuditOnPage(page: Page): Promise<RuleResult[]> {
  const results: RuleResult[] = [];

  try {
    // Run Axe-core scan
    const axeResults = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22a",    // Added WCAG 2.2 Level A
        "wcag22aa",   // Added WCAG 2.2 Level AA
        "section508", // Covers Section 508 (US)
        "en-301-549", // Covers EN 301 549 (EU)
        "best-practice" // Added structural/semantic best practices (e.g. heading order)
        // Note: ADA and AODA do not have specific explicit "tags" in axe-core because 
        // both legally require WCAG 2.0/2.1 AA compliance, which is covered by the wcag tags above.
      ])
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
    console.error(`Failed to audit page:`, error);
    throw error;
  }

  // Ensure we sort or limit results if needed, or just return them all.
  // The UI currently expects exactly 10, but since Axe returns dynamic counts,
  // we are adapting the UI to render whatever Axe finds.
  return results;
}
