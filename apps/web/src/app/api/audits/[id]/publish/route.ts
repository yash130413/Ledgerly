import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-backend";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToApi(req, `/api/audits/${id}/publish`);
}
