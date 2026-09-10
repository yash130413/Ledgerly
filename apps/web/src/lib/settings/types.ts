export type UserPreferences = {
  theme: "light" | "dark" | "system";
  language: "en" | "es" | "fr";
  darkMode: boolean;
  auditFrequency: "hourly" | "daily" | "weekly";
  auditAlerts: boolean;
  dataRetentionDays: 30 | 90 | 365;
  emailNotifications: boolean;
  slackNotifications: boolean;
  costAlertUsd: number;
  autoOptimization: boolean;
  costThresholdUsd: number;
  optimizationStrategy: "cost" | "balanced" | "performance";
  twoFactorAuth: boolean;
  apiEncryption: boolean;
  sessionTimeoutMinutes: 15 | 30 | 60 | 0;
};

export type RequiredPreferences = UserPreferences;

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "light",
  language: "en",
  darkMode: false,
  auditFrequency: "daily",
  auditAlerts: true,
  dataRetentionDays: 90,
  emailNotifications: true,
  slackNotifications: false,
  costAlertUsd: 1000,
  autoOptimization: true,
  costThresholdUsd: 5000,
  optimizationStrategy: "balanced",
  twoFactorAuth: false,
  apiEncryption: true,
  sessionTimeoutMinutes: 30,
};

export function mergePreferences(
  raw?: Partial<UserPreferences> | null
): UserPreferences {
  return { ...DEFAULT_PREFERENCES, ...(raw ?? {}) };
}
