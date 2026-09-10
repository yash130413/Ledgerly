import { NextRequest, NextResponse } from "next/server";
import { callApiJson } from "@/lib/api-backend";
import { ACCESS_COOKIE } from "@/lib/auth/constants";
import { accessCookieOptions } from "@/lib/auth/session";

function nestErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const msg = (data as { message?: unknown; error?: unknown }).message;
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg) && msg.length > 0) return String(msg[0]);
  const err = (data as { error?: unknown }).error;
  if (typeof err === "string") return err;
  return fallback;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const { ok, status, data } = await callApiJson("/api/auth/login", {
    method: "POST",
    body,
  });

  const payload = data as { accessToken?: string; user?: unknown } | null;
  if (!ok || !payload?.accessToken) {
    return NextResponse.json(
      { error: nestErrorMessage(data, "Login failed") },
      { status: status || 500 }
    );
  }

  const res = NextResponse.json({ user: payload.user });
  res.cookies.set(ACCESS_COOKIE, payload.accessToken, accessCookieOptions());
  return res;
}
