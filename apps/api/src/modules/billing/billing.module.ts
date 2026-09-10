import { Module } from '@nestjs/common';
import { BillingController } from './presentation/http/controllers/billing.controller';
import { BillingService } from './application/services/billing.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
