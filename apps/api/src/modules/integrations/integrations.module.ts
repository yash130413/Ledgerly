import { Module } from '@nestjs/common';
import { IntegrationsController } from './presentation/http/controllers/integrations.controller';
import { IntegrationsService } from './application/services/integrations.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, AuthGuard],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
