export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  fullName: string | null;
  role: string;
}
