import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  mapWorkspacesToEngine,
  runAuditEngine,
  type AuditEngineResult,
} from '@credex/audit-engine';
import { AiService } from '../../../../infra/ai/ai.service';
import { MailService } from '../../../../infra/mail/mail.service';
import { AuditsRepository } from '../../infrastructure/persistence/audits.repository';
import type { CreateAuditDto, PublicAuditDto, SummarizeAuditDto } from '../../presentation/http/dto/audits.dto';

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

@Injectable()
export class AuditsService {
  constructor(
    private readonly repo: AuditsRepository,
    private readonly ai: AiService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  private origin(headerOrigin?: string) {
    return headerOrigin || this.config.get<string>('appUrl') || 'http://localhost:3000';
  }

  async create(
    dto: CreateAuditDto,
    opts: {
      userId?: string;
      userEmail?: string | null;
      userDisplayName?: string | null;
      origin?: string;
    },
  ) {
    const workspaces = mapWorkspacesToEngine(
      dto.workspaces as Array<Record<string, unknown>>,
    );
    const result = runAuditEngine(workspaces);
    const { summary, source: summarySource } = await this.ai.summarizeAudit(
      dto.title,
      result,
    );

    const { auditId, shareId } = await this.repo.saveAuditReport({
      title: dto.title,
      organizationId: dto.organizationId || NIL_UUID,
      workspaces,
      result,
      aiSummary: summary,
      userId: opts.userId,
    });

    const origin = this.origin(opts.origin);
    const shareUrl = `${origin}/results/${shareId}`;

    const recipientEmail = opts.userEmail || dto.email;
    if (recipientEmail) {
      void this.mail.sendAuditReady({
        to: recipientEmail,
        companyName: opts.userDisplayName ?? recipientEmail,
        auditTitle: dto.title,
        monthlySavings: result.totalMonthlySavings,
        annualSavings: result.totalAnnualSavings,
        totalSpend: result.totalCurrentSpend,
        optimizationScore: result.optimizationScore,
        auditUrl: shareUrl,
      });
    }

    return { auditId, shareId, shareUrl, result, summary, summarySource };
  }

  async createPublic(dto: PublicAuditDto, originHeader?: string) {
    const workspaces = mapWorkspacesToEngine(
      dto.workspaces as Array<Record<string, unknown>>,
    );
    const result = runAuditEngine(workspaces);
    const title = `AI Spend Audit - ${new Date().toLocaleDateString()}`;

    const { auditId, shareId } = await this.repo.saveAuditReport({
      title,
      organizationId: NIL_UUID,
      workspaces,
      result,
      userId: NIL_UUID,
    });

    const origin = this.origin(originHeader);
    return {
      auditId,
      shareId,
      shareUrl: `${origin}/results/${shareId}`,
      result,
    };
  }

  async publish(auditId: string, isPublic: boolean, originHeader?: string) {
    await this.repo.setAuditPublic(auditId, isPublic);
    const origin = this.origin(originHeader);
    return {
      isPublic,
      shareUrl: isPublic ? `${origin}/audit/${auditId}` : null,
    };
  }

  async summarize(dto: SummarizeAuditDto, userId: string) {
    const audit = await this.repo.getAuditRow(dto.auditId);
    if (!audit) throw new NotFoundException('Audit not found');
    if (audit.created_by !== userId) throw new ForbiddenException('Forbidden');

    const { summary, source, fallbackReason } = await this.ai.summarizeAudit(
      dto.auditTitle,
      dto.result as unknown as AuditEngineResult,
    );

    const persisted = await this.repo.updateSummary(dto.auditId, summary);
    return { summary, source, fallbackReason, persisted };
  }

  listMine(userId: string) {
    return this.repo.getMyAudits(userId);
  }

  getPublicByShareId(shareId: string) {
    return this.repo.getPublicAuditByShareId(shareId);
  }
}
