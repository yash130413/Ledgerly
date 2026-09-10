import { Module } from '@nestjs/common';
import { IntegrationsController } from './presentation/http/controllers/integrations.controller';
import { IntegrationsService } from './application/services/integrations.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
