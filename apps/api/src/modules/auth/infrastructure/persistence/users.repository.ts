import { Injectable, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../../../../infra/supabase/supabase.service';

export interface AppUserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findByEmail(email: string): Promise<AppUserRow | null> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('app_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('[UsersRepository.findByEmail]', error.message);
      throw error;
    }
    return (data as AppUserRow | null) ?? null;
  }

  async findById(id: string): Promise<AppUserRow | null> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('app_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[UsersRepository.findById]', error.message);
      throw error;
    }
    return (data as AppUserRow | null) ?? null;
  }

  async create(input: {
    email: string;
    passwordHash: string;
    fullName: string;
  }): Promise<AppUserRow> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('app_users')
      .insert({
        email: input.email.toLowerCase(),
        password_hash: input.passwordHash,
        full_name: input.fullName,
        role: 'member',
      })
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already registered');
      }
      console.error('[UsersRepository.create]', error.message);
      throw error;
    }

    return data as AppUserRow;
  }
}
