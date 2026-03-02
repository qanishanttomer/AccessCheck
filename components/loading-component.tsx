import { Loader2 } from "lucide-react";

interface LoadingComponentProps {
  progressMsg?: string | null;
}

const LoadingComponent = ({ progressMsg }: LoadingComponentProps) => {
  return (
    <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4 animate-in fade-in">
      <div className="relative">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-primary/20 animate-pulse-ring" />
      </div>
      <div className="text-center">
        <p className="font-medium text-sm sm:text-base">
          {progressMsg || "Analyzing your website..."}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {progressMsg ? "Deep scan in progress... This may take a few minutes." : "Building crawler context..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingComponent;
