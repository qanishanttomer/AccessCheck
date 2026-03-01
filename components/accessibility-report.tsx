"use client";

import { useState } from "react";
import { ReportData, RuleResult } from "@/types";
import useAccessibilityReport from "@/hooks/useAccessibilityReport";
import OverallScoreCard from "./overall-score-card";
import IndividualScoreCard from "./individual-score-card";
import ScoreListHeader from "./score-list-header";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface AccessibilityReportProps {
  data: ReportData;
}

export function AccessibilityReport({ data }: AccessibilityReportProps) {
  const {
    animatedScore,
    expandedRules,
    toggleRule,
    expandAll,
    collapseAll,
    getScoreColor,
    getScoreGradient,
    getScoreLabel,
  } = useAccessibilityReport(data);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById("accessibility-report-container");
    if (!reportElement) return;

    try {
      setIsGeneratingPdf(true);

      // Temporarily expand all rules for the PDF
      const currentlyExpanded = [...expandedRules];
      expandAll();

      // Wait a moment for animations/expansions to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      const imgData = await toPng(reportElement, {
        pixelRatio: 2, // Higher resolution
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (reportElement.offsetHeight * pdfWidth) / reportElement.offsetWidth;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("accessibility-report.pdf");

      // Restore expanded state
      collapseAll();
      currentlyExpanded.forEach(ruleId => toggleRule(ruleId));

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div id="accessibility-report-container" className="space-y-6 sm:space-y-8 bg-background p-4 sm:p-6 rounded-xl">
      {/* PDF Generation Header (Only visible during export) */}
      {isGeneratingPdf && (
        <div className="flex justify-center items-center py-6 sm:py-8 border-b border-border/50 mb-6 sm:mb-8">
          <img
            src="/ratl-logo.png"
            alt="Ratl AI Logo"
            className="h-12 sm:h-16 object-contain"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Overall Score Card */}
      <OverallScoreCard
        data={data}
        animatedScore={animatedScore}
        getScoreGradient={getScoreGradient}
        getScoreColor={getScoreColor}
        getScoreLabel={getScoreLabel}
      />

      {/* Rules List */}
      <div className="space-y-3 sm:space-y-4">
        {/* Score List Header */}
        <ScoreListHeader
          data={data}
          expandAll={expandAll}
          collapseAll={collapseAll}
          isGeneratingPdf={isGeneratingPdf}
          onDownloadPdf={handleDownloadPdf}
        />

        {/* Individual Score Cards */}
        <div className="space-y-2 sm:space-y-3">
          {data.rules.map((rule, index) => (
            <IndividualScoreCard
              key={index}
              rule={rule as RuleResult}
              toggleRule={(ruleId: string) => toggleRule(ruleId)}
              index={index}
              expandedRules={expandedRules}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
