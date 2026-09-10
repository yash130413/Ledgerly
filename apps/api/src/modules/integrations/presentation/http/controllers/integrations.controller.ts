import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, type AuthedRequest } from '../../../../../common/guards/auth.guard';
import { IntegrationsService } from '../../../application/services/integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  list(@Req() req: AuthedRequest) {
    return this.integrations.listForUser(req.user!.id);
  }
}
