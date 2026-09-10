"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Lock,
  Palette,
  Settings2,
  Shield,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface SettingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  comingSoon?: boolean;
  delay?: number;
  onClick?: () => void;
}

function SettingCard({
  icon: Icon,
  title,
  description,
  badge,
  comingSoon = false,
  delay = 0,
  onClick,
}: SettingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <Card
        hover={!comingSoon}
        className={cn(
          "relative overflow-hidden group cursor-pointer",
          comingSoon && "opacity-60 cursor-not-allowed"
        )}
        onClick={!comingSoon ? onClick : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold">{title}</h3>
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
                {comingSoon && (
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {!comingSoon && (
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function SettingsSections() {
  return (
    <div className="space-y-12">
      {/* Core Settings */}
      <SettingsSection
        title="Core Settings"
        description="Manage your workspace and AI infrastructure preferences"
      >
        <SettingCard
          icon={Palette}
          title="Workspace Preferences"
          description="Customize your workspace name, theme, and display preferences"
          delay={0.1}
          onClick={() => console.log("Navigate to workspace preferences")}
        />
        
        <SettingCard
          icon={Settings2}
          title="AI Audit Settings"
          description="Configure audit frequency, data retention, and analysis preferences"
          badge="Active"
          delay={0.15}
          onClick={() => console.log("Navigate to audit settings")}
        />
        
        <SettingCard
          icon={Bell}
          title="Notifications"
          description="Control email alerts, Slack integrations, and notification preferences"
          delay={0.2}
          onClick={() => console.log("Navigate to notifications")}
        />
      </SettingsSection>

      {/* Security & Privacy */}
      <SettingsSection
        title="Security & Privacy"
        description="Protect your AI infrastructure and manage data access"
      >
        <SettingCard
          icon={Shield}
          title="Security & Privacy"
          description="Manage API key encryption, access controls, and security policies"
          badge="Verified"
          delay={0.25}
          onClick={() => console.log("Navigate to security")}
        />
        
        <SettingCard
          icon={Lock}
          title="Team Access Controls"
          description="Configure role-based permissions and team member access levels"
          comingSoon
          delay={0.3}
        />
      </SettingsSection>

      {/* AI Infrastructure */}
      <SettingsSection
        title="AI Infrastructure"
        description="Fine-tune optimization and provider management"
      >
        <SettingCard
          icon={Zap}
          title="Optimization Preferences"
          description="Set cost thresholds, performance targets, and auto-optimization rules"
          delay={0.35}
          onClick={() => console.log("Navigate to optimization")}
        />
        
        <SettingCard
          icon={Sparkles}
          title="Provider Controls"
          description="Manage fallback strategies, rate limits, and provider-specific configurations"
          delay={0.4}
          onClick={() => console.log("Navigate to provider controls")}
        />
      </SettingsSection>
    </div>
  );
}
