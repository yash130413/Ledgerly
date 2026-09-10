import { Module } from '@nestjs/common';
import { AuditsController } from './presentation/http/controllers/audits.controller';
import { AuditsService } from './application/services/audits.service';
import { AuditsRepository } from './infrastructure/persistence/audits.repository';
import { AuthGuard, OptionalAuthGuard } from '../../common/guards/auth.guard';

@Module({
  controllers: [AuditsController],
  providers: [AuditsService, AuditsRepository, AuthGuard, OptionalAuthGuard],
  exports: [AuditsService],
})
export class AuditsModule {}
