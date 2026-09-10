import type { DashboardStats, SpendChartData, AIProvider } from "@/types";

export const mockStats: DashboardStats = {
  totalSpend: 4821.5,
  spendChange: 12.4,
  totalTokens: 182_400_000,
  tokensChange: 8.1,
  activeProviders: 3,
  auditsRun: 12,
  estimatedSavings: 1240.0,
};

export const mockSpendChart: SpendChartData[] = [
  { date: "Jan", openai: 820, anthropic: 340, gemini: 120, other: 60 },
  { date: "Feb", openai: 932, anthropic: 410, gemini: 145, other: 80 },
  { date: "Mar", openai: 1100, anthropic: 390, gemini: 200, other: 95 },
  { date: "Apr", openai: 980, anthropic: 450, gemini: 180, other: 70 },
  { date: "May", openai: 1240, anthropic: 520, gemini: 210, other: 110 },
  { date: "Jun", openai: 1380, anthropic: 600, gemini: 260, other: 130 },
];

export const mockProviders: AIProvider[] = [
  {
    id: "1",
    name: "OpenAI Production",
    provider: "openai",
    apiKeyMasked: "sk-••••••••••••••••••••1234",
    isActive: true,
    connectedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Anthropic Claude",
    provider: "anthropic",
    apiKeyMasked: "sk-ant-••••••••••••••••••••5678",
    isActive: true,
    connectedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    name: "Google Gemini",
    provider: "gemini",
    apiKeyMasked: "AIza••••••••••••••••••••9012",
    isActive: false,
    connectedAt: "2024-03-10T10:00:00Z",
  },
];


