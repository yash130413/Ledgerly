import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class RateLimitService {
  private readonly store = new Map<string, { count: number; resetAt: number }>();
  private readonly windowMs = 60_000;
  private readonly maxRequests = 10;

  check(identifier: string): { success: boolean; remaining: number } {
    const now = Date.now();
    const record = this.store.get(identifier);

    if (record && now > record.resetAt) {
      this.store.delete(identifier);
    }

    const current = this.store.get(identifier);
    if (!current) {
      this.store.set(identifier, { count: 1, resetAt: now + this.windowMs });
      return { success: true, remaining: this.maxRequests - 1 };
    }

    if (current.count >= this.maxRequests) {
      return { success: false, remaining: 0 };
    }

    current.count++;
    return { success: true, remaining: this.maxRequests - current.count };
  }

  identifierFromRequest(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }
    return req.ip ?? 'unknown';
  }
}
