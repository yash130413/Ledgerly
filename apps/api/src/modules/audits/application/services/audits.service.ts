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
  type WorkspaceMetrics,
} from '@ledgerly/audit-engine';
import { AiService } from '../../../../infra/ai/ai.service';
import { MailService } from '../../../../infra/mail/mail.service';
import { AuditsRepository } from '../../infrastructure/persistence/audits.repository';
import type { CreateAuditDto, PublicAuditDto, SummarizeAuditDto } from '../../presentation/http/dto/audits.dto';
import type {
  AuditRecommendationRow,
  AuditRow,
} from '../../../../types/database';

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

  private toDetailPayload(packed: {
    audit: AuditRow;
    recommendations: AuditRecommendationRow[];
  }) {
    const { audit: row, recommendations } = packed;
    const workspaces = (row.workspaces as unknown as WorkspaceMetrics[]) ?? [];
    const result: AuditEngineResult = {
      recommendations: recommendations.map((r) => ({
        id: r.id,
        provider: r.provider as AuditEngineResult['recommendations'][number]['provider'],
        title: r.title,
        recommendation: r.recommendation,
        reason: r.reason,
        confidenceScore: r.confidence_score,
        priority: r.priority,
        monthlySavings: Number(r.monthly_savings),
        annualSavings: Number(r.annual_savings),
        affectedUsers: r.affected_users,
        ruleId: r.rule_id,
      })),
      totalMonthlySavings: Number(row.estimated_monthly_savings),
      totalAnnualSavings: Number(row.estimated_annual_savings),
      totalCurrentSpend: Number(row.total_monthly_spend),
      criticalCount: recommendations.filter((r) => r.priority === 'Critical').length,
      highCount: recommendations.filter((r) => r.priority === 'High').length,
      providersScanned: [
        ...new Set(
          recommendations.map(
            (r) => r.provider as AuditEngineResult['recommendations'][number]['provider'],
          ),
        ),
      ],
      optimizationScore: row.optimization_score,
      generatedAt: row.created_at,
    };

    return {
      audit: {
        id: row.id,
        title: row.title,
        shareId: row.share_id,
        isPublic: row.is_public,
        createdAt: row.created_at,
        aiSummary: row.ai_summary,
        optimizationScore: row.optimization_score,
        estimatedMonthlySavings: Number(row.estimated_monthly_savings),
        totalMonthlySpend: Number(row.total_monthly_spend),
      },
      workspaces,
      result,
    };
  }

  async getLatestMine(userId: string) {
    const packed = await this.repo.getMyLatestAuditWithDetails(userId);
    if (!packed) return null;
    return this.toDetailPayload(packed);
  }

  async getMineById(userId: string, auditId: string) {
    const packed = await this.repo.getMyAuditWithDetails(userId, auditId);
    if (!packed) return null;
    return this.toDetailPayload(packed);
  }

  getPublicByShareId(shareId: string) {
    return this.repo.getPublicAuditByShareId(shareId);
  }
}
