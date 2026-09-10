import { Injectable, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../../../../infra/supabase/supabase.service';
import type { Json } from '../../../../types/database';

export type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  language?: 'en' | 'es' | 'fr';
  darkMode?: boolean;
  auditFrequency?: 'hourly' | 'daily' | 'weekly';
  auditAlerts?: boolean;
  dataRetentionDays?: 30 | 90 | 365;
  emailNotifications?: boolean;
  slackNotifications?: boolean;
  costAlertUsd?: number;
  autoOptimization?: boolean;
  costThresholdUsd?: number;
  optimizationStrategy?: 'cost' | 'balanced' | 'performance';
  twoFactorAuth?: boolean;
  apiEncryption?: boolean;
  sessionTimeoutMinutes?: 15 | 30 | 60 | 0;
};

export const DEFAULT_PREFERENCES: Required<UserPreferences> = {
  theme: 'light',
  language: 'en',
  darkMode: false,
  auditFrequency: 'daily',
  auditAlerts: true,
  dataRetentionDays: 90,
  emailNotifications: true,
  slackNotifications: false,
  costAlertUsd: 1000,
  autoOptimization: true,
  costThresholdUsd: 5000,
  optimizationStrategy: 'balanced',
  twoFactorAuth: false,
  apiEncryption: true,
  sessionTimeoutMinutes: 30,
};

export interface AppUserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
  preferences: UserPreferences | null;
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
        preferences: DEFAULT_PREFERENCES as unknown as Json,
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

  async updateProfile(
    id: string,
    input: { fullName: string; companyName?: string | null },
  ): Promise<AppUserRow> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('app_users')
      .update({
        full_name: input.fullName,
        company_name: input.companyName ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[UsersRepository.updateProfile]', error.message);
      throw error;
    }
    return data as AppUserRow;
  }

  async updatePreferences(
    id: string,
    preferences: UserPreferences,
  ): Promise<AppUserRow> {
    const { data, error } = await this.supabase
      .getAdmin()
      .from('app_users')
      .update({
        preferences: preferences as unknown as Json,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[UsersRepository.updatePreferences]', error.message);
      throw error;
    }
    return data as AppUserRow;
  }
}
