import { Injectable } from '@nestjs/common';

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';

@Injectable()
export class MembershipsService {
  async listMembers(_organizationId: string): Promise<never[]> {
    return [];
  }

  async inviteMember(_input: {
    organizationId: string;
    email: string;
    role: OrgRole;
  }): Promise<void> {
    throw new Error('memberships.inviteMember is not implemented yet');
  }
}
