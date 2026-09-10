import { callApiJson } from "@/lib/api-backend";
import { getAccessToken } from "@/lib/auth/session";
import {
  DEFAULT_PREFERENCES,
  mergePreferences,
  type UserPreferences,
} from "@/lib/settings/types";

export type MeUser = {
  id: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  role: string;
  preferences: UserPreferences;
};

export async function fetchMeServer(): Promise<MeUser | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const { ok, data } = await callApiJson("/api/auth/me", {
    method: "GET",
    token,
  });
  if (!ok || !data || typeof data !== "object") return null;

  const row = data as {
    id: string;
    email: string;
    fullName: string | null;
    companyName?: string | null;
    role: string;
    preferences?: Partial<UserPreferences> | null;
  };

  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName ?? null,
    companyName: row.companyName ?? null,
    role: row.role,
    preferences: mergePreferences(row.preferences),
  };
}

export { DEFAULT_PREFERENCES, mergePreferences };
