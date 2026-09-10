import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

/** Supabase used as Postgres only (service role). No Supabase Auth. */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private admin!: SupabaseClient<Database>;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>('supabase.url');
    const secret = this.config.get<string>('supabase.secretKey');

    if (!url || !secret) {
      console.warn(
        '[SupabaseService] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY missing — DB calls will fail',
      );
    }

    this.admin = createClient<Database>(url ?? '', secret ?? '');
  }

  getAdmin() {
    return this.admin;
  }
}
