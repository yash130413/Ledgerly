import { Module } from '@nestjs/common';
import { LeadsController } from './presentation/http/controllers/leads.controller';
import { LeadsService } from './application/services/leads.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
