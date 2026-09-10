import { track } from '@vercel/analytics';

export const analytics = {
  auditStarted: (provider: string) => {
    track('audit_started', { provider });
  },
  
  auditCompleted: (data: {
    providers: string[];
    totalSavings: number;
    recommendationCount: number;
  }) => {
    track('audit_completed', {
      providers: data.providers.join(','),
      totalSavings: data.totalSavings,
      recommendationCount: data.recommendationCount,
    });
  },
  
  leadCaptured: (source: string) => {
    track('lead_captured', { source });
  },
  
  shareClicked: (auditId: string) => {
    track('share_clicked', { auditId });
  },
};
