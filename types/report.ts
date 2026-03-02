export interface ReportData {
  url: string;
  overallScore: number;
  summary: {
    pass: number;
    warning: number;
    fail: number;
  };
  rules: Array<{
    id: string;
    title: string;
    whyItMatters: readonly string[];
    howToFix: readonly string[];
    score: number;
    status: "PASS" | "WARNING" | "FAIL";
    issues: Array<{
      selector: string;
      issue: string;
      url?: string;
    }>;
  }>;
}