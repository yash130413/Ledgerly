import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { AuditEngineResult } from '@ledgerly/audit-engine';

export interface SummarizeOutput {
  summary: string;
  source: 'anthropic' | 'fallback';
  fallbackReason?: string;
}

@Injectable()
export class AiService {
  private readonly model = 'claude-3-5-haiku-20241022';
  private readonly maxTokens = 400;
  private readonly timeoutMs = 12_000;

  constructor(private readonly config: ConfigService) {}

  private formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  private buildFallback(auditTitle: string, result: AuditEngineResult) {
    const top = result.recommendations[0];
    return top
      ? `${auditTitle}: estimated ${this.formatCurrency(result.totalAnnualSavings)}/yr in savings. Top action: ${top.title}.`
      : `${auditTitle}: spend looks optimized — no major savings found.`;
  }

  private buildPrompt(auditTitle: string, result: AuditEngineResult) {
    const topRecs = result.recommendations
      .slice(0, 5)
      .map(
        (r, i) =>
          `${i + 1}. [${r.priority}] ${r.provider}: ${r.title} (save ${this.formatCurrency(r.annualSavings)}/yr)`,
      )
      .join('\n');

    return `Write a 2-3 sentence finance-friendly summary for an AI spend audit titled "${auditTitle}".
Current annualized spend context: monthly ${this.formatCurrency(result.totalCurrentSpend)}, potential annual savings ${this.formatCurrency(result.totalAnnualSavings)}, optimization score ${result.optimizationScore}/100.
Top recommendations:
${topRecs || '(none)'}
Be concrete and non-hype. No markdown.`;
  }

  async summarizeAudit(
    auditTitle: string,
    result: AuditEngineResult,
  ): Promise<SummarizeOutput> {
    const apiKey = this.config.get<string>('anthropicApiKey');
    if (!apiKey) {
      return {
        summary: this.buildFallback(auditTitle, result),
        source: 'fallback',
        fallbackReason: 'ANTHROPIC_API_KEY not configured',
      };
    }

    const client = new Anthropic({ apiKey });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const message = await client.messages.create(
        {
          model: this.model,
          max_tokens: this.maxTokens,
          messages: [{ role: 'user', content: this.buildPrompt(auditTitle, result) }],
        },
        { signal: controller.signal },
      );

      const block = message.content[0];
      if (block.type !== 'text' || !block.text.trim()) {
        throw new Error('Empty response from Anthropic');
      }

      return { summary: block.text.trim(), source: 'anthropic' };
    } catch (err) {
      return {
        summary: this.buildFallback(auditTitle, result),
        source: 'fallback',
        fallbackReason: err instanceof Error ? err.message : 'unknown',
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
