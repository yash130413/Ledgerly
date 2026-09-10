import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../infra/supabase/supabase.service';

export type AuthedRequest = Request & { user?: User };

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const user = await this.supabase.getUserFromBearer(req.headers.authorization);
    if (user) req.user = user;
    return true;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const user = await this.supabase.getUserFromBearer(req.headers.authorization);
    if (!user) throw new UnauthorizedException('Unauthorized');
    req.user = user;
    return true;
  }
}
