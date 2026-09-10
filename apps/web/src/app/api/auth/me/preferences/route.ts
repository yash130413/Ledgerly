import { NextRequest, NextResponse } from "next/server";
import { callApiJson } from "@/lib/api-backend";
import { getAccessToken } from "@/lib/auth/session";

export async function PATCH(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  const { ok, status, data } = await callApiJson("/api/auth/me/preferences", {
    method: "PATCH",
    body,
    token,
  });

  if (!ok) {
    return NextResponse.json(data ?? { error: "Update failed" }, {
      status: status || 500,
    });
  }

  return NextResponse.json({ user: data });
}
