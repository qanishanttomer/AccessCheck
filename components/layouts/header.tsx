import { Accessibility } from "lucide-react";
import Link from "next/link";
const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group transition-smooth"
          >
            <div className="relative">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-smooth group-hover:scale-105">
                <Accessibility className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-smooth -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight">
                Ratl AccessCheck
              </span>
              <span className="hidden xs:block text-[9px] sm:text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                WCAG Compliance
              </span>
            </div>
          </Link>


        </div>
      </div>
    </header>
  );
};

export default Header;
