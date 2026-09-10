import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RateLimitService } from '../../../../../infra/rate-limit/rate-limit.service';
import { CaptureLeadDto } from '../dto/capture-lead.dto';
import { LeadsService } from '../../../application/services/leads.service';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leads: LeadsService,
    private readonly rateLimit: RateLimitService,
  ) {}

  @Post()
  async capture(
    @Body() body: CaptureLeadDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = `leads:${this.rateLimit.identifierFromRequest(req)}`;
    const { success, remaining } = this.rateLimit.check(id);
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    if (!success) {
      res.status(429);
      return { error: 'Too many requests. Please try again later.' };
    }

    if (this.leads.isHoneypotTripped(body.website)) {
      return { ok: true };
    }

    try {
      await this.leads.capture(body);
      res.status(201);
      return { ok: true };
    } catch {
      res.status(500);
      return { error: 'Failed to save' };
    }
  }
}
