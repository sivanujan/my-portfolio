import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-4xl font-bold font-display text-soil dark:text-terminal-green mb-2">
        404 - Page Not Found
      </h2>
      <p className="text-sm font-mono text-muted-foreground mb-6">
        The requested directory or transit path could not be located.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-soil text-sand dark:bg-terminal-green dark:text-dark font-mono text-sm border-2 border-foreground shadow-[3px_3px_0px_0px_var(--foreground)] hover:translate-y-0.5 transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
