import { Injectable } from '@nestjs/common';

const mockProviders = [
  {
    id: '1',
    name: 'OpenAI Production',
    provider: 'openai' as const,
    apiKeyMasked: 'sk-••••••••abcd',
    isActive: true,
    connectedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: '2',
    name: 'Anthropic Claude',
    provider: 'anthropic' as const,
    apiKeyMasked: 'sk-ant-••••••••wxyz',
    isActive: true,
    connectedAt: '2026-02-03T14:30:00Z',
  },
  {
    id: '3',
    name: 'Gemini Workspace',
    provider: 'gemini' as const,
    apiKeyMasked: 'AIza••••••••1234',
    isActive: false,
    connectedAt: '2026-03-01T09:15:00Z',
  },
];

@Injectable()
export class IntegrationsService {
  listForUser(_userId: string) {
    return mockProviders;
  }
}
