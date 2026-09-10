import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AuthUser, JwtPayload } from '../types/auth-user';

export type AuthedRequest = Request & { user?: AuthUser };

function bearerToken(authorization?: string): string | null {
  if (!authorization?.startsWith('Bearer ')) return null;
  const token = authorization.slice('Bearer '.length).trim();
  return token || null;
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const token = bearerToken(req.headers.authorization);
    if (!token) return true;

    try {
      const payload = this.jwt.verify<JwtPayload>(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        fullName: payload.fullName ?? null,
        role: payload.role ?? 'member',
      };
    } catch {
      // optional — ignore invalid token
    }
    return true;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const token = bearerToken(req.headers.authorization);
    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const payload = this.jwt.verify<JwtPayload>(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        fullName: payload.fullName ?? null,
        role: payload.role ?? 'member',
      };
      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
