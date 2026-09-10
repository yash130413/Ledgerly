import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/infra/supabase/server";

const API_BASE =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

/**
 * BFF proxy: browser keeps calling /api/* on Next;
 * Next forwards to Nest (`apps/api`) so the Nest backend owns business logic.
 */
export async function proxyToApi(
  req: NextRequest,
  path: string,
  init?: { method?: string; body?: string | null }
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

  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set("authorization", `Bearer ${session.access_token}`);
    }
  } catch {
    // local/dev without supabase — public routes still work
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader) headers.set("authorization", authHeader);

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
