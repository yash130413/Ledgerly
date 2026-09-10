import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-backend";

export async function POST(req: NextRequest) {
  return proxyToApi(req, "/api/leads");
}
