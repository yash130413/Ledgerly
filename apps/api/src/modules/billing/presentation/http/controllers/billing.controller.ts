import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../../../common/guards/auth.guard';
import { BillingService } from '../../../application/services/billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get(':organizationId')
  @UseGuards(AuthGuard)
  status(@Param('organizationId') organizationId: string) {
    return this.billing.getStatus(organizationId);
  }
}
