import { Module } from '@nestjs/common';
import { MembershipsController } from './presentation/http/controllers/memberships.controller';
import { MembershipsService } from './application/services/memberships.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
