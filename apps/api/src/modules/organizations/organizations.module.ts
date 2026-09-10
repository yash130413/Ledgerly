import { Module } from '@nestjs/common';
import { OrganizationsController } from './presentation/http/controllers/organizations.controller';
import { OrganizationsService } from './application/services/organizations.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
