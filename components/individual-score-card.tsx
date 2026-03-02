import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Code,
  Lightbulb,
  Wrench,
  XCircle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { RuleIssue, RuleResult } from "@/types";

interface IndividualScoreCardProps {
  rule: RuleResult;
  index: number;
  expandedRules: Set<string>;
  toggleRule: (id: string) => void;
}

const IndividualScoreCard = ({
  rule,
  index,
  expandedRules,
  toggleRule,
}: IndividualScoreCardProps) => {
  const isExpanded = expandedRules.has(rule.id);
  const statusConfig = {
    PASS: {
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200/50 dark:border-emerald-800/50",
      badgeVariant: "default" as const,
    },
    WARNING: {
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200/50 dark:border-amber-800/50",
      badgeVariant: "secondary" as const,
    },
    FAIL: {
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200/50 dark:border-rose-800/50",
      badgeVariant: "secondary" as const,
    },
  };

  const config = statusConfig[rule.status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <Card
      key={rule.id}
      className="border-2 border-border/50 overflow-hidden hover:border-border py-0 transition-colors space-y-0 gap-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={() => toggleRule(rule.id)}
        className="w-full text-left p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div
            className={`h-9 w-9 sm:h-10 md:h-11 sm:w-10 md:w-11 rounded-lg sm:rounded-xl ${config.bg} flex items-center justify-center shrink-0 border ${config.border}`}
          >
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-1.5 sm:gap-2 mb-1">
              <h3 className="font-semibold text-sm sm:text-base leading-tight">
                {rule.title}
              </h3>

              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant={config.badgeVariant}
                  className="text-[10px] sm:text-xs font-medium"
                >
                  {rule.status}
                </Badge>
                {rule.issues.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs font-normal"
                  >
                    {rule.issues.length}{" "}
                    {rule.issues.length === 1 ? "issue" : "issues"}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1 sm:h-1.5 w-14 sm:w-20 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${rule.score >= 8
                        ? "from-emerald-500 to-teal-500"
                        : rule.score >= 5
                          ? "from-amber-500 to-orange-500"
                          : "from-rose-500 to-red-500"
                      }`}
                    style={{ width: `${rule.score * 10}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {rule.score}/10
                </span>
              </div>
            </div>
          </div>

          <div
            className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
              }`}
          >
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 sm:px-4 md:px-5 pb-4 sm:pb-5 md:pb-6 space-y-4 sm:space-y-5 md:space-y-6 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Why It Matters */}
          <div className="pt-3 sm:pt-4 md:pt-5">
            <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm">
              <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              Why It Matters
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 pl-5 sm:pl-6">
              {rule.whyItMatters.map((reason: string, idx: number) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-muted-foreground list-disc"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* How To Fix */}
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm">
              <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              How To Fix
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 pl-5 sm:pl-6">
              {rule.howToFix.map((fix: string, idx: number) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-muted-foreground list-disc"
                >
                  {fix}
                </li>
              ))}
            </ul>
          </div>

          {/* Issues */}
          {rule.issues.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm">
                <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                Issues Found
              </h4>
              <div className="space-y-3">
                {rule.issues.map((issue: RuleIssue, idx: number) => (
                  <div
                    key={idx}
                    className={`p-2.5 sm:p-3 md:p-4 rounded-lg border ${config.border} ${config.bg} flex flex-col gap-2`}
                  >
                    {issue.url && (
                      <div className="text-[10px] sm:text-xs font-semibold text-primary break-all">
                        📄 {issue.url}
                      </div>
                    )}
                    <div className="font-mono text-[10px] sm:text-xs text-muted-foreground break-all bg-background/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded inline-block max-w-full overflow-x-auto">
                      {issue.selector}
                    </div>
                    <div className="text-xs sm:text-sm">{issue.issue}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default IndividualScoreCard;
