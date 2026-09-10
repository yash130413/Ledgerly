import type { AuditProvider, WorkspaceMetrics } from "./types";

/** Form / API provider ids → engine provider labels */
const PROVIDER_ID_MAP: Record<string, AuditProvider> = {
  chatgpt: "ChatGPT",
  openai: "ChatGPT",
  ChatGPT: "ChatGPT",
  claude: "Claude",
  anthropic: "Claude",
  Claude: "Claude",
  cursor: "Cursor",
  Cursor: "Cursor",
  copilot: "Copilot",
  "github-copilot": "Copilot",
  Copilot: "Copilot",
  gemini: "Gemini",
  google: "Gemini",
  Gemini: "Gemini",
};

export function mapProviderId(id: string): AuditProvider | null {
  return PROVIDER_ID_MAP[id] ?? PROVIDER_ID_MAP[id.toLowerCase()] ?? null;
}

/**
 * Normalize workspace payloads from the public form (lowercase ids) into
 * engine-ready WorkspaceMetrics without changing unknown fields.
 */
export function mapWorkspacesToEngine(
  workspaces: Array<Record<string, unknown>>
): WorkspaceMetrics[] {
  return workspaces.map((w) => {
    const rawProvider = String(w.provider ?? "");
    const provider = mapProviderId(rawProvider) ?? (rawProvider as AuditProvider);
    const duplicates = Array.isArray(w.duplicateTools)
      ? (w.duplicateTools as string[])
          .map((d) => mapProviderId(d) ?? (d as AuditProvider))
          .filter(Boolean)
      : [];

    return {
      ...(w as unknown as WorkspaceMetrics),
      provider,
      duplicateTools: duplicates,
    };
  });
}
