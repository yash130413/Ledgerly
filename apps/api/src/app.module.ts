import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { InfraModule } from './infra/infra.module';
import { AuditsModule } from './modules/audits/audits.module';
import { LeadsModule } from './modules/leads/leads.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { BillingModule } from './modules/billing/billing.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env', '../../.env.local', '../../.env'],
    }),
    InfraModule,
    AuditsModule,
    LeadsModule,
    OrganizationsModule,
    MembershipsModule,
    IntegrationsModule,
    BillingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
