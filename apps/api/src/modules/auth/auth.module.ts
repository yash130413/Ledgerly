import { Module } from '@nestjs/common';

/**
 * Scaffold only — wire domain/application/infrastructure/presentation later.
 * Existing runtime modules still live under apps/api/src/{audits,leads,...} until migration.
 */
@Module({})
export class AuthModule {}
