export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          name: string;
          created_by: string;
        };
        Update: {
          name?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      audits: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          provider: string;
          total_monthly_spend: number;
          total_annual_spend: number;
          estimated_monthly_savings: number;
          estimated_annual_savings: number;
          utilization_rate: number;
          optimization_score: number;
          ai_summary: string | null;
          share_id: string;
          is_public: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          organization_id: string;
          title: string;
          provider: string;
          total_monthly_spend: number;
          total_annual_spend: number;
          estimated_monthly_savings: number;
          estimated_annual_savings: number;
          utilization_rate: number;
          optimization_score: number;
          ai_summary?: string | null;
          is_public: boolean;
          created_by: string;
        };
        Update: {
          organization_id?: string;
          title?: string;
          provider?: string;
          total_monthly_spend?: number;
          total_annual_spend?: number;
          estimated_monthly_savings?: number;
          estimated_annual_savings?: number;
          utilization_rate?: number;
          optimization_score?: number;
          ai_summary?: string | null;
          is_public?: boolean;
          created_by?: string;
        };
        Relationships: [];
      };
      audit_recommendations: {
        Row: {
          id: string;
          audit_id: string;
          provider: string;
          title: string;
          recommendation: string;
          reason: string;
          confidence_score: number;
          priority: "Low" | "Medium" | "High" | "Critical";
          monthly_savings: number;
          annual_savings: number;
          affected_users: number;
          rule_id: string;
          created_at: string;
        };
        Insert: {
          audit_id: string;
          provider: string;
          title: string;
          recommendation: string;
          reason: string;
          confidence_score: number;
          priority: "Low" | "Medium" | "High" | "Critical";
          monthly_savings: number;
          annual_savings: number;
          affected_users: number;
          rule_id: string;
        };
        Update: {
          audit_id?: string;
          provider?: string;
          title?: string;
          recommendation?: string;
          reason?: string;
          confidence_score?: number;
          priority?: "Low" | "Medium" | "High" | "Critical";
          monthly_savings?: number;
          annual_savings?: number;
          affected_users?: number;
          rule_id?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          company: string | null;
          company_size: string | null;
          estimated_ai_spend: number | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          email: string;
          name?: string | null;
          company?: string | null;
          company_size?: string | null;
          estimated_ai_spend?: number | null;
          source?: string | null;
        };
        Update: {
          email?: string;
          name?: string | null;
          company?: string | null;
          company_size?: string | null;
          estimated_ai_spend?: number | null;
          source?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          company_name: string | null;
          role: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          company_name?: string | null;
          role?: string | null;
        };
        Update: {
          full_name?: string | null;
          company_name?: string | null;
          role?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience row types
export type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"];
export type AuditRow = Database["public"]["Tables"]["audits"]["Row"];
export type AuditRecommendationRow = Database["public"]["Tables"]["audit_recommendations"]["Row"];
export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
export type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];

// Public audit with joined recommendations
export type PublicAudit = AuditRow & {
  audit_recommendations: AuditRecommendationRow[];
};

// Sanitized shape safe to return to unauthenticated callers
export type PublicAuditSafe = Pick<
  AuditRow,
  "title" | "share_id" | "created_at" | "estimated_monthly_savings" | "estimated_annual_savings" | "optimization_score" | "ai_summary"
> & {
  recommendations: Pick<
    AuditRecommendationRow,
    "id" | "provider" | "title" | "recommendation" | "reason" | "priority" | "monthly_savings" | "annual_savings" | "affected_users"
  >[];
};
