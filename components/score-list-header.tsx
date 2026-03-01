import { Badge } from "./ui/badge";
import { ReportData } from "@/types";

import { Loader2 } from "lucide-react";

interface ScoreListHeaderProps {
  data: ReportData;
  expandAll: () => void;
  collapseAll: () => void;
  isGeneratingPdf?: boolean;
  onDownloadPdf?: () => void;
}

const ScoreListHeader = ({
  data,
  expandAll,
  collapseAll,
  isGeneratingPdf = false,
  onDownloadPdf,
}: ScoreListHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
      <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
        <span>Detailed Results</span>
        <Badge variant="outline" className="font-normal text-xs sm:text-sm">
          {data.rules.length} rules
        </Badge>
      </h2>
      <div className="flex gap-2 text-xs sm:text-sm items-center">
        {onDownloadPdf && (
          <>
            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md shadow flex items-center gap-1 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                "Download PDF"
              )}
            </button>
            <span className="text-muted-foreground hidden sm:inline">·</span>
          </>
        )}
        <button
          onClick={expandAll}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Expand all
        </button>
        <span className="text-muted-foreground">·</span>
        <button
          onClick={collapseAll}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Collapse all
        </button>
      </div>
    </div>
  );
};

export default ScoreListHeader;
