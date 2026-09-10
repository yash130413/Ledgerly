import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuditDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsArray()
  @ArrayMinSize(1)
  workspaces!: unknown[];

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class PublicAuditDto {
  @IsArray()
  @ArrayMinSize(1)
  workspaces!: unknown[];

  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @IsOptional()
  @IsString()
  useCase?: string;
}

export class PublishAuditDto {
  @IsBoolean()
  isPublic!: boolean;
}

export class SummarizeAuditDto {
  @IsUUID()
  auditId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  auditTitle!: string;

  @IsObject()
  result!: Record<string, unknown>;
}
