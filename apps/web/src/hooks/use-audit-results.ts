"use client";

import { useLocalStorage } from "./use-local-storage";
import type { AuditEngineResult } from "@ledgerly/audit-engine";

export function useAuditResults() {
  const [results, setResults, isHydrated] = useLocalStorage<AuditEngineResult | null>(
    "audit-results",
    null
  );

  const clearResults = () => setResults(null);

  return { results, setResults, clearResults, isHydrated };
}
