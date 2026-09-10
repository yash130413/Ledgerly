import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend | null = null;

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('resendApiKey');
    if (key) this.resend = new Resend(key);
  }

  private from() {
    return this.config.get<string>('emailFrom') ?? 'Ledgerly <onboarding@resend.dev>';
  }

  async sendAuditReady(params: {
    to: string;
    companyName: string;
    auditTitle: string;
    monthlySavings: number;
    annualSavings: number;
    totalSpend: number;
    optimizationScore: number;
    auditUrl: string;
  }): Promise<void> {
    if (!this.resend) return;

    const { error } = await this.resend.emails.send({
      from: this.from(),
      to: params.to,
      subject: `Your AI spend audit is ready — ${params.auditTitle}`,
      html: `
        <h1>Your Ledgerly audit is ready</h1>
        <p>Hi ${params.companyName},</p>
        <p><strong>${params.auditTitle}</strong></p>
        <ul>
          <li>Monthly savings: $${params.monthlySavings.toFixed(2)}</li>
          <li>Annual savings: $${params.annualSavings.toFixed(2)}</li>
          <li>Current spend: $${params.totalSpend.toFixed(2)}</li>
          <li>Optimization score: ${params.optimizationScore}</li>
        </ul>
        <p><a href="${params.auditUrl}">View your report</a></p>
      `,
    });

    if (error) console.error('[MailService.sendAuditReady]', error);
  }

  async sendLeadWelcome(params: {
    to: string;
    company: string;
    role: string;
  }): Promise<void> {
    if (!this.resend) return;

    const { error } = await this.resend.emails.send({
      from: this.from(),
      to: params.to,
      subject: "Welcome to Ledgerly — you're on the list",
      html: `
        <h1>Welcome to Ledgerly</h1>
        <p>Thanks ${params.role} at ${params.company} — you're on the list.</p>
      `,
    });

    if (error) console.error('[MailService.sendLeadWelcome]', error);
  }
}
