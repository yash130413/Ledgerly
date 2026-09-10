export const ACCESS_COOKIE = "ledgerly_access_token";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
};
