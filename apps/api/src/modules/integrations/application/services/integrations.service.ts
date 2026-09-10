import { Injectable } from '@nestjs/common';

/** Available providers users can connect — none connected until OAuth lands. */
const AVAILABLE = [
  {
    id: 'openai',
    name: 'OpenAI / ChatGPT',
    provider: 'openai' as const,
    description: 'Read usage and seat data from your OpenAI org.',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    provider: 'anthropic' as const,
    description: 'Connect Claude Team / API billing for seat audits.',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    provider: 'gemini' as const,
    description: 'Pull Gemini Workspace and API spend signals.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    provider: 'custom' as const,
    description: 'Track Cursor Pro seat utilization (coming soon).',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    provider: 'custom' as const,
    description: 'Import Copilot Business seat activity (coming soon).',
  },
];

@Injectable()
export class IntegrationsService {
  listForUser(_userId: string) {
    return {
      connected: [] as Array<{
        id: string;
        name: string;
        provider: string;
        apiKeyMasked: string;
        isActive: boolean;
        connectedAt: string;
      }>,
      available: AVAILABLE,
    };
  }
}
