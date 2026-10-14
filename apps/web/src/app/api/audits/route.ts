import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-backend";

export async function POST(req: NextRequest) {
  const isGuest =
    req.nextUrl.searchParams.get("guest") === "true" ||
    req.headers.get("x-guest-mode") === "true";

  if (isGuest) {
    return proxyToApi(req, "/api/audits/public", { skipAuthForward: true });
  }

  return proxyToApi(req, "/api/audits");
}
