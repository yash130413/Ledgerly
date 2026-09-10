import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard, type AuthedRequest } from '../../../../../common/guards/auth.guard';
import { OrganizationsService } from '../../../application/services/organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgs: OrganizationsService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  listMine(@Req() req: AuthedRequest) {
    return this.orgs.listForUser(req.user!.id);
  }
}
