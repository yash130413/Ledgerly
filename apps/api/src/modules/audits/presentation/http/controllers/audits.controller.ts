import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  AuthGuard,
  OptionalAuthGuard,
  type AuthedRequest,
} from '../../../../../common/guards/auth.guard';
import { RateLimitService } from '../../../../../infra/rate-limit/rate-limit.service';
import { AuditsService } from '../../../application/services/audits.service';
import {
  CreateAuditDto,
  PublicAuditDto,
  PublishAuditDto,
  SummarizeAuditDto,
} from '../dto/audits.dto';

@Controller('audits')
export class AuditsController {
  constructor(
    private readonly audits: AuditsService,
    private readonly rateLimit: RateLimitService,
  ) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  async create(
    @Body() body: CreateAuditDto,
    @Req() req: AuthedRequest,
    @Headers('x-app-origin') origin: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = this.rateLimit.identifierFromRequest(req);
    const { success, remaining } = this.rateLimit.check(id);
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    if (!success) {
      res.status(429);
      return { error: 'Too many requests. Please try again later.' };
    }

    return this.audits.create(body, {
      userId: req.user?.id,
      userEmail: req.user?.email,
      userDisplayName: req.user?.fullName ?? null,
      origin,
    });
  }

  @Post('public')
  async createPublic(
    @Body() body: PublicAuditDto,
    @Headers('x-app-origin') origin: string | undefined,
  ) {
    return this.audits.createPublic(body, origin);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  listMine(@Req() req: AuthedRequest) {
    return this.audits.listMine(req.user!.id);
  }

  @Get('me/latest')
  @UseGuards(AuthGuard)
  latestMine(@Req() req: AuthedRequest) {
    return this.audits.getLatestMine(req.user!.id);
  }

  @Get('me/:id')
  @UseGuards(AuthGuard)
  async mineById(@Req() req: AuthedRequest, @Param('id') id: string) {
    const detail = await this.audits.getMineById(req.user!.id, id);
    if (!detail) throw new NotFoundException('Audit not found');
    return detail;
  }

  @Get('public/:shareId')
  getPublic(@Param('shareId') shareId: string) {
    return this.audits.getPublicByShareId(shareId);
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard)
  publish(
    @Param('id') id: string,
    @Body() body: PublishAuditDto,
    @Headers('x-app-origin') origin: string | undefined,
  ) {
    return this.audits.publish(id, body.isPublic, origin);
  }

  @Post('summarize')
  @UseGuards(AuthGuard)
  async summarize(
    @Body() body: SummarizeAuditDto,
    @Req() req: AuthedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = `summarize:${this.rateLimit.identifierFromRequest(req)}`;
    const { success, remaining } = this.rateLimit.check(id);
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    if (!success) {
      res.status(429);
      return { error: 'Too many requests. Please try again later.' };
    }

    const result = await this.audits.summarize(body, req.user!.id);
    if (!result.persisted) {
      res.status(207);
    }
    return result;
  }
}
