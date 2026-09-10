import { Module } from '@nestjs/common';
import { MembershipsController } from './presentation/http/controllers/memberships.controller';
import { MembershipsService } from './application/services/memberships.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService, AuthGuard],
  exports: [MembershipsService],
})
export class MembershipsModule {}
