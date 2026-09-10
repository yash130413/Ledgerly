import { Module } from '@nestjs/common';
import { AuditsController } from './presentation/http/controllers/audits.controller';
import { AuditsService } from './application/services/audits.service';
import { AuditsRepository } from './infrastructure/persistence/audits.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuditsController],
  providers: [AuditsService, AuditsRepository],
  exports: [AuditsService],
})
export class AuditsModule {}
