import { Injectable } from '@nestjs/common';

/** Stub — org membership schema lands next */
@Injectable()
export class OrganizationsService {
  async listForUser(_userId: string): Promise<never[]> {
    return [];
  }

  async create(_input: { name: string; createdBy: string }): Promise<never> {
    throw new Error('organizations.create is not implemented yet');
  }
}
