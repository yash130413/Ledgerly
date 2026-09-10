import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  companyName?: string | null;
}

export class UserPreferencesDto {
  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  theme?: 'light' | 'dark' | 'system';

  @IsOptional()
  @IsIn(['en', 'es', 'fr'])
  language?: 'en' | 'es' | 'fr';

  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @IsOptional()
  @IsIn(['hourly', 'daily', 'weekly'])
  auditFrequency?: 'hourly' | 'daily' | 'weekly';

  @IsOptional()
  @IsBoolean()
  auditAlerts?: boolean;

  @IsOptional()
  @IsIn([30, 90, 365])
  dataRetentionDays?: 30 | 90 | 365;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  slackNotifications?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  costAlertUsd?: number;

  @IsOptional()
  @IsBoolean()
  autoOptimization?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  costThresholdUsd?: number;

  @IsOptional()
  @IsIn(['cost', 'balanced', 'performance'])
  optimizationStrategy?: 'cost' | 'balanced' | 'performance';

  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;

  @IsOptional()
  @IsBoolean()
  apiEncryption?: boolean;

  @IsOptional()
  @IsIn([15, 30, 60, 0])
  sessionTimeoutMinutes?: 15 | 30 | 60 | 0;
}

export class UpdatePreferencesDto {
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences!: UserPreferencesDto;
}
