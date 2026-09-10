import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CaptureLeadDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  company!: string;

  @IsString()
  @MinLength(1)
  role!: string;

  @IsString()
  @MinLength(1)
  teamSize!: string;

  /** Honeypot — must stay empty */
  @IsOptional()
  @IsString()
  website?: string;
}
