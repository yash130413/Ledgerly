import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  getStatus(_organizationId: string) {
    return { plan: 'free' as const, status: 'inactive' as const };
  }
}
