import { NextRequest, NextResponse } from "next/server";
import { callApiJson } from "@/lib/api-backend";
import { getAccessToken, accessCookieOptions } from "@/lib/auth/session";
import { ACCESS_COOKIE } from "@/lib/auth/constants";

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ok, status, data } = await callApiJson("/api/auth/me", {
    method: "GET",
    token,
  });

  if (!ok) {
    return NextResponse.json(data ?? { error: "Unauthorized" }, {
      status: status || 401,
    });
  }

  return NextResponse.json({ user: data });
}

export async function PATCH(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  const { ok, status, data } = await callApiJson("/api/auth/me", {
    method: "PATCH",
    body,
    token,
  });

  if (!ok) {
    return NextResponse.json(data ?? { error: "Update failed" }, {
      status: status || 500,
    });
  }

  const payload = data as { accessToken?: string; user?: unknown } | null;
  const res = NextResponse.json({ user: payload?.user ?? data });
  if (payload?.accessToken) {
    res.cookies.set(ACCESS_COOKIE, payload.accessToken, accessCookieOptions());
  }
  return res;
}
