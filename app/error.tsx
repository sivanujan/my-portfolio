"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold font-display text-soil dark:text-terminal-green mb-4">
        Something went wrong!
      </h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-soil text-sand dark:bg-terminal-green dark:text-dark font-mono text-sm border-2 border-foreground shadow-[3px_3px_0px_0px_var(--foreground)] hover:translate-y-0.5 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
