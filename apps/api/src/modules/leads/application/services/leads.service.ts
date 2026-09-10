import { Injectable } from '@nestjs/common';
import { MailService } from '../../../../infra/mail/mail.service';
import { SupabaseService } from '../../../../infra/supabase/supabase.service';
import type { CaptureLeadDto } from '../../presentation/http/dto/capture-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly mail: MailService,
  ) {}

  isHoneypotTripped(website?: string): boolean {
    return typeof website === 'string' && website.trim().length > 0;
  }

  async capture(dto: CaptureLeadDto): Promise<void> {
    const { error } = await this.supabase.getAdmin().from('leads').upsert(
      {
        email: dto.email,
        company: dto.company,
        name: dto.role,
        company_size: dto.teamSize,
        source: 'results_page',
      },
      { onConflict: 'email', ignoreDuplicates: false },
    );

    if (error) {
      console.error('[LeadsService]', error.message);
      throw new Error('Failed to save');
    }

    void this.mail.sendLeadWelcome({
      to: dto.email,
      company: dto.company,
      role: dto.role,
    });
  }
}
