"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ResultsError({ error, reset }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ResultsPage]", error);
    }
  }, [error]);

  const isNotFound =
    error.message.toLowerCase().includes("not found") ||
    error.message.includes("PGRST116");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">
            {isNotFound ? "Report not found" : "Something went wrong"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNotFound
              ? "This audit report doesn't exist or is no longer public."
              : "We couldn't load this report. It may have been removed or made private."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isNotFound && (
            <Button variant="outline" onClick={reset} size="sm">
              Try again
            </Button>
          )}
          <Button size="sm" render={<Link href="/" />}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
