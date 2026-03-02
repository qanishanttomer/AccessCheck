import { ReportData, AuditResult } from "@/types";
import { useState } from "react";

const useAudit = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);

  const mergeResults = (
    current: ReportData | null,
    newPageResult: AuditResult
  ): ReportData => {
    if (!current) {
      const rules = newPageResult.rules.map((rule) => ({
        ...rule,
        issues: rule.issues.map((issue) => ({ ...issue, url: newPageResult.url })),
      }));

      return {
        url: newPageResult.url,
        overallScore: newPageResult.overallScore,
        summary: { ...newPageResult.summary },
        rules,
      };
    }

    const rulesMap = new Map(current.rules.map((r) => [r.id, { ...r }]));

    for (const newRule of newPageResult.rules) {
      const taggedIssues = newRule.issues.map((iss) => ({ ...iss, url: newPageResult.url }));
      if (rulesMap.has(newRule.id)) {
        const existingRule = rulesMap.get(newRule.id)!;
        existingRule.issues = [...existingRule.issues, ...taggedIssues];

        if (newRule.status === "FAIL") {
          existingRule.status = "FAIL";
          existingRule.score = 0;
        } else if (newRule.status === "WARNING" && existingRule.status === "PASS") {
          existingRule.status = "WARNING";
          existingRule.score = 5;
        }
      } else {
        rulesMap.set(newRule.id, { ...newRule, issues: taggedIssues });
      }
    }

    const mergedRules = Array.from(rulesMap.values());

    let pass = 0, warning = 0, fail = 0, totalScore = 0;
    for (const r of mergedRules) {
      if (r.status === "PASS") { pass++; totalScore += 10; }
      else if (r.status === "WARNING") { warning++; totalScore += 5; }
      else if (r.status === "FAIL") fail++;
    }

    const overallScore = Math.floor((totalScore / (mergedRules.length * 10)) * 100) || 0;

    return {
      url: "Multiple Pages Scanned",
      overallScore,
      summary: { pass, warning, fail },
      rules: mergedRules,
    };
  };

  const generateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    let sanitizedUrl = url.trim().toLowerCase();

    if (!sanitizedUrl) {
      setError("Please enter a valid URL");
      return;
    }

    if (!sanitizedUrl.startsWith("http://") && !sanitizedUrl.startsWith("https://")) {
      sanitizedUrl = "https://" + sanitizedUrl;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);
    setProgressMsg("Starting crawler...");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sanitizedUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report. Please try again.");
      }

      if (!response.body) throw new Error("Stream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let currentReportState: ReportData | null = null;
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // retain incomplete line

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);

            if (event.type === "progress") {
              setProgressMsg(`Scanning: ${event.url} (Found: ${event.queueLength + event.visitedCount}, Scanned: ${event.visitedCount})`);
            } else if (event.type === "result") {
              currentReportState = mergeResults(currentReportState, event.data);
              setReport(currentReportState);
            } else if (event.type === "error") {
              console.warn("Error scanning a page:", event.error);
            } else if (event.type === "done") {
              setProgressMsg(null);
            }
          } catch (e) {
            console.error("Failed to parse NDJSON line", line);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setProgressMsg(null);
    }
  };

  return { url, setUrl, isLoading, report, error, progressMsg, generateReport };
};

export default useAudit;
