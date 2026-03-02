"use client";

import { AccessibilityReport } from "./accessibility-report";
import LoadingComponent from "./loading-component";
import useAudit from "@/hooks/useAudit";
import SearchCard from "./search-card";
import HeroSection from "./hero-section";

export function AccessibilityChecker() {
  const { isLoading, report, generateReport, error, url, setUrl, progressMsg } = useAudit();

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-6 sm:pb-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Search Card */}
        <SearchCard
          url={url}
          setUrl={setUrl}
          isLoading={isLoading}
          error={error}
          generateReport={generateReport}
        />

        {/* Loading state */}
        {isLoading && <LoadingComponent progressMsg={progressMsg} />}
      </div>

      {/* Report Section */}
      {report && (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <AccessibilityReport data={report} />
        </div>
      )}
    </div>
  );
}
