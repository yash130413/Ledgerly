/**
 * Honeypot spam protection (client field name + helpers).
 * Server-side trip check lives in Nest LeadsService.
 */
export const HONEYPOT_FIELD = "website" as const;

export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}
