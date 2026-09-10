import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private admin!: SupabaseClient<Database>;
  private authClient!: SupabaseClient<Database>;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>('supabase.url');
    const secret = this.config.get<string>('supabase.secretKey');
    const publishable = this.config.get<string>('supabase.publishableKey');

    if (!url || !secret) {
      console.warn(
        '[SupabaseService] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY missing — DB calls will fail',
      );
    }

    this.admin = createClient<Database>(url ?? '', secret ?? publishable ?? '');
    this.authClient = createClient<Database>(url ?? '', publishable ?? secret ?? '');
  }

  getAdmin() {
    return this.admin;
  }

  async getUserFromBearer(authorization?: string): Promise<User | null> {
    if (!authorization?.startsWith('Bearer ')) return null;
    const token = authorization.slice('Bearer '.length).trim();
    if (!token) return null;
    const { data, error } = await this.authClient.auth.getUser(token);
    if (error) return null;
    return data.user;
  }
}
