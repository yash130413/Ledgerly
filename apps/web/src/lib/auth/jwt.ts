import { jwtVerify } from "jose";
import type { SessionUser } from "./constants";

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || "dev-ledgerly-jwt-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function verifyAccessToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== "string" || typeof email !== "string") return null;

    return {
      id: sub,
      email,
      fullName:
        typeof payload.fullName === "string" || payload.fullName === null
          ? (payload.fullName as string | null)
          : null,
      role: typeof payload.role === "string" ? payload.role : "member",
    };
  } catch {
    return null;
  }
}
