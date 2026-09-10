import { Module } from '@nestjs/common';
import { OrganizationsController } from './presentation/http/controllers/organizations.controller';
import { OrganizationsService } from './application/services/organizations.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, AuthGuard],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
