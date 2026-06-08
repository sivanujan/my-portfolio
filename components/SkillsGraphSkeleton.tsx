import React from "react";
import { Loader2 } from "lucide-react";

export default function SkillsGraphSkeleton() {
  return (
    <div className="w-full h-[450px] bg-sand dark:bg-dark relative flex items-center justify-center border-4 border-foreground shadow-[6px_6px_0px_0px_var(--color-soil)] dark:shadow-[6px_6px_0px_0px_var(--terminal-green)] brutalist-border overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      
      <div className="flex flex-col items-center gap-3 relative z-10">
        <Loader2 className="w-8 h-8 text-soil dark:text-terminal-green animate-spin" />
        <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green">
          Initializing System Graph...
        </span>
      </div>
    </div>
  );
}
