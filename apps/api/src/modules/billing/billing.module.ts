import { Module } from '@nestjs/common';
import { BillingController } from './presentation/http/controllers/billing.controller';
import { BillingService } from './application/services/billing.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  controllers: [BillingController],
  providers: [BillingService, AuthGuard],
  exports: [BillingService],
})
export class BillingModule {}
