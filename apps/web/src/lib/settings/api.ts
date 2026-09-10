import type { RequiredPreferences } from "@/lib/settings/types";

export type { UserPreferences, RequiredPreferences } from "@/lib/settings/types";

export type MeUser = {
  id: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  role: string;
  preferences: RequiredPreferences;
};

export async function fetchMe(): Promise<MeUser | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  // Support both { user } (legacy cookie-only) and flat Nest me payload
  if (data?.user?.preferences) return data.user as MeUser;
  if (data?.id && data?.preferences) return data as MeUser;
  if (data?.user) {
    return {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName ?? null,
      companyName: null,
      role: data.user.role ?? "member",
      preferences: data.user.preferences,
    } as MeUser;
  }
  return null;
}

export async function saveProfile(input: {
  fullName: string;
  companyName?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/auth/me", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error:
        (typeof data.message === "string" && data.message) ||
        data.error ||
        "Could not save profile",
    };
  }
  return { ok: true };
}

export async function savePreferences(
  preferences: Partial<RequiredPreferences>
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/auth/me/preferences", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ preferences }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error:
        (typeof data.message === "string" && data.message) ||
        data.error ||
        "Could not save preferences",
    };
  }
  return { ok: true };
}
