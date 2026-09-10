import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-backend";

export async function GET(req: NextRequest) {
  return proxyToApi(req, "/api/audits/me/latest", { method: "GET" });
}
