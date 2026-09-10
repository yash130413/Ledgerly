import { Injectable } from '@nestjs/common';
import type { AuditEngineResult, WorkspaceMetrics } from '@ledgerly/audit-engine';
import { SupabaseService } from '../../../../infra/supabase/supabase.service';
import type {
  AuditRecommendationRow,
  AuditRow,
  PublicAudit,
  PublicAuditSafe,
} from '../../../../types/database';

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

export interface SaveAuditInput {
  title: string;
  organizationId: string;
  workspaces: WorkspaceMetrics[];
  result: AuditEngineResult;
  aiSummary?: string;
  userId?: string;
}

@Injectable()
export class AuditsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async saveAuditReport(input: SaveAuditInput): Promise<{ auditId: string; shareId: string }> {
    const admin = this.supabase.getAdmin();
    const avgUtilization =
      input.workspaces.reduce((s, w) => s + w.utilizationRate, 0) / input.workspaces.length;

    const { data: audit, error: auditError } = await admin
      .from('audits')
      .insert({
        organization_id: input.organizationId || NIL_UUID,
        title: input.title,
        provider: input.result.providersScanned.join(', '),
        total_monthly_spend: input.result.totalCurrentSpend,
        total_annual_spend: input.result.totalCurrentSpend * 12,
        estimated_monthly_savings: input.result.totalMonthlySavings,
        estimated_annual_savings: input.result.totalAnnualSavings,
        utilization_rate: Math.round(avgUtilization * 100) / 100,
        optimization_score: input.result.optimizationScore,
        ai_summary: input.aiSummary ?? null,
        is_public: true,
        created_by: input.userId ?? NIL_UUID,
      })
      .select('id, share_id')
      .single();

    if (auditError || !audit) {
      console.error('Audit insert error:', auditError);
      throw auditError ?? new Error('Failed to save audit');
    }

    const recommendationRows: Omit<AuditRecommendationRow, 'id' | 'created_at'>[] =
      input.result.recommendations.map((r) => ({
        audit_id: audit.id,
        provider: r.provider,
        title: r.title,
        recommendation: r.recommendation,
        reason: r.reason,
        confidence_score: r.confidenceScore,
        priority: r.priority,
        monthly_savings: r.monthlySavings,
        annual_savings: r.annualSavings,
        affected_users: r.affectedUsers ?? 0,
        rule_id: r.ruleId,
      }));

    const { error: recsError } = await admin
      .from('audit_recommendations')
      .insert(recommendationRows);

    if (recsError) {
      await admin.from('audits').delete().eq('id', audit.id);
      throw recsError;
    }

    return { auditId: audit.id, shareId: audit.share_id };
  }

  async getMyAudits(userId: string): Promise<AuditRow[]> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('audits')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getPublicAuditByShareId(shareId: string): Promise<PublicAuditSafe> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('audits')
      .select('*, audit_recommendations(*)')
      .eq('share_id', shareId)
      .eq('is_public', true)
      .single();
    if (error) throw error;
    return this.stripSensitiveData(data as PublicAudit);
  }

  async setAuditPublic(auditId: string, isPublic: boolean): Promise<void> {
    const { error } = await this.supabase
      .getAdmin()
      .from('audits')
      .update({ is_public: isPublic })
      .eq('id', auditId);
    if (error) throw error;
  }

  async getAuditRow(auditId: string): Promise<AuditRow | null> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single();
    if (error) return null;
    return data as AuditRow;
  }

  async updateSummary(auditId: string, summary: string): Promise<boolean> {
    const { error } = await this.supabase
      .getAdmin()
      .from('audits')
      .update({ ai_summary: summary })
      .eq('id', auditId);
    return !error;
  }

  stripSensitiveData(audit: PublicAudit): PublicAuditSafe {
    return {
      title: audit.title,
      share_id: audit.share_id,
      created_at: audit.created_at,
      estimated_monthly_savings: audit.estimated_monthly_savings,
      estimated_annual_savings: audit.estimated_annual_savings,
      optimization_score: audit.optimization_score,
      ai_summary: audit.ai_summary,
      recommendations: audit.audit_recommendations.map((r) => ({
        id: r.id,
        provider: r.provider,
        title: r.title,
        recommendation: r.recommendation,
        reason: r.reason,
        priority: r.priority,
        monthly_savings: r.monthly_savings,
        annual_savings: r.annual_savings,
        affected_users: r.affected_users,
      })),
    };
  }
}
