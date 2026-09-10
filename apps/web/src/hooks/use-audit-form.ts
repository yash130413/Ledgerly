"use client";

import { useLocalStorage } from "./use-local-storage";
import type { AuditPriority, AuditProvider } from "@credex/audit-engine";

interface AuditFormState {
  priorityFilter: AuditPriority | "All";
  providerFilter: AuditProvider | "All";
}

const DEFAULTS: AuditFormState = {
  priorityFilter: "All",
  providerFilter: "All",
};

export function useAuditForm() {
  const [state, setState, isHydrated] = useLocalStorage<AuditFormState>(
    "audit-form",
    DEFAULTS
  );

  const setPriorityFilter = (priorityFilter: AuditPriority | "All") =>
    setState((prev) => ({ ...prev, priorityFilter }));

  const setProviderFilter = (providerFilter: AuditProvider | "All") =>
    setState((prev) => ({ ...prev, providerFilter }));

  const reset = () => setState(DEFAULTS);

  return { ...state, setPriorityFilter, setProviderFilter, reset, isHydrated };
}
