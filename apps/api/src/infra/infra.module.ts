import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';
import { MailService } from './mail/mail.service';
import { AiService } from './ai/ai.service';
import { RateLimitService } from './rate-limit/rate-limit.service';

@Global()
@Module({
  providers: [SupabaseService, MailService, AiService, RateLimitService],
  exports: [SupabaseService, MailService, AiService, RateLimitService],
})
export class InfraModule {}
