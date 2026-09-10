import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/session";

const API_BASE =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

/**
 * BFF proxy: browser keeps calling /api/* on Next;
 * Next forwards to Nest with JWT from httpOnly cookie.
 */
export async function proxyToApi(
  req: NextRequest,
  path: string,
  init?: {
    method?: string;
    body?: string | null;
    skipAuthForward?: boolean;
  }
): Promise<NextResponse> {
  const method = init?.method ?? req.method;
  const body =
    init?.body !== undefined
      ? init.body
      : method === "GET" || method === "HEAD"
        ? undefined
        : await req.text();

  const headers = new Headers();
  headers.set("content-type", "application/json");
  headers.set("x-app-origin", req.nextUrl.origin);

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) headers.set("x-forwarded-for", forwarded);

  if (!init?.skipAuthForward) {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      headers.set("authorization", authHeader);
    } else {
      const token = await getAccessToken();
      if (token) headers.set("authorization", `Bearer ${token}`);
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body && body.length > 0 ? body : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "API backend unreachable. Start Nest with `npm run dev:api` (port 3001).",
      },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  const responseHeaders = new Headers();
  const remaining = upstream.headers.get("x-ratelimit-remaining");
  if (remaining) responseHeaders.set("X-RateLimit-Remaining", remaining);
  responseHeaders.set(
    "content-type",
    upstream.headers.get("content-type") ?? "application/json"
  );

  return new NextResponse(text, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

/** Low-level fetch to Nest returning parsed JSON (for auth BFF). */
export async function callApiJson(
  path: string,
  init: { method: string; body?: string; token?: string | null }
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const headers = new Headers({ "content-type": "application/json" });
  if (init.token) headers.set("authorization", `Bearer ${init.token}`);

  const method = init.method.toUpperCase();
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body:
        init.body && method !== "GET" && method !== "HEAD"
          ? init.body
          : undefined,
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: 502,
      data: { error: "API backend unreachable" },
    };
  }
}
