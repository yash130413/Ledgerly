import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-backend";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyToApi(req, `/api/audits/me/${id}`, { method: "GET" });
}
