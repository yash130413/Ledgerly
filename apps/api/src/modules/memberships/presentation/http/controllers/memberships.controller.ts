import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../../../common/guards/auth.guard';
import { MembershipsService } from '../../../application/services/memberships.service';

@Controller('organizations/:orgId/members')
export class MembershipsController {
  constructor(private readonly memberships: MembershipsService) {}

  @Get()
  @UseGuards(AuthGuard)
  list(@Param('orgId') orgId: string) {
    return this.memberships.listMembers(orgId);
  }
}
