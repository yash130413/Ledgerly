"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Bell,
  Globe,
  Lock,
  Mail,
  Palette,
  Settings2,
  Shield,
  MessageSquare,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { savePreferences, saveProfile } from "@/lib/settings/api";
import {
  DEFAULT_PREFERENCES,
  type UserPreferences,
} from "@/lib/settings/types";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface SettingRowProps {
  icon: LucideIcon;
  label: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ icon: Icon, label, description, children }: SettingRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <motion.div
          className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5"
          animate={{
            scale: isHovered ? 1.05 : 1,
            backgroundColor: isHovered ? "rgba(34, 197, 94, 0.1)" : "rgba(0, 0, 0, 0.05)",
          }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          <motion.div
            animate={{
              rotate: isHovered ? 5 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <Icon className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
        <div className="flex-1 min-w-0 space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </motion.div>
  );
}

function SettingsCard({
  title,
  description,
  children,
  delay = 0,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          y: isHovered ? -2 : 0,
          boxShadow: isHovered
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        <Card hover={false} className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-500/[0.02] via-transparent to-transparent pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          />
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0 divide-y">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function AnimatedSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1, ease: EASE }}
    >
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </motion.div>
  );
}

function AnimatedSelect({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: EASE }}
    >
      <Select
        value={value}
        onValueChange={(v) => {
          if (v != null) onValueChange(v);
        }}
      >
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </motion.div>
  );
}

function AnimatedInput(props: React.ComponentProps<typeof Input>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      animate={{
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <Input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
    </motion.div>
  );
}

export function ProfileSettingsSection({
  fullName: initialName,
  email,
  companyName: initialCompany = "",
}: {
  fullName: string;
  email: string;
  companyName?: string | null;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [companyName, setCompanyName] = useState(initialCompany ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (fullName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    setIsSaving(true);
    const result = await saveProfile({
      fullName: fullName.trim(),
      companyName: companyName.trim() || null,
    });
    setIsSaving(false);
    if (!result.ok) {
      toast.error(result.error || "Could not save profile");
      return;
    }
    toast.success("Profile saved");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Profile"
        description="Your account identity on Ledgerly"
        delay={0.05}
      >
        <SettingRow icon={Mail} label="Email" description="Sign-in email (read-only for now)">
          <AnimatedInput className="w-56 h-8" value={email} readOnly />
        </SettingRow>
        <SettingRow icon={Globe} label="Full name" description="Displayed across the dashboard">
          <AnimatedInput
            className="w-56 h-8"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </SettingRow>
        <SettingRow icon={Globe} label="Company" description="Optional organization name">
          <AnimatedInput
            className="w-56 h-8"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc."
          />
        </SettingRow>
      </SettingsCard>
      <SaveBar onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}

export function SecuritySettingsSection({
  initial,
}: {
  initial?: Partial<UserPreferences> | null;
}) {
  const router = useRouter();
  const prefs = { ...DEFAULT_PREFERENCES, ...(initial ?? {}) };
  const [twoFactorAuth, setTwoFactorAuth] = useState(prefs.twoFactorAuth);
  const [apiEncryption, setApiEncryption] = useState(prefs.apiEncryption);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(
    String(prefs.sessionTimeoutMinutes)
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await savePreferences({
      twoFactorAuth,
      apiEncryption,
      sessionTimeoutMinutes: Number(sessionTimeoutMinutes) as 15 | 30 | 60 | 0,
    });
    setIsSaving(false);
    if (!result.ok) {
      toast.error(result.error || "Could not save security settings");
      return;
    }
    toast.success("Security settings saved");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Security & Privacy"
        description="Protect your workspace and manage data access"
        delay={0.05}
      >
        <SettingRow
          icon={Shield}
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        >
          <AnimatedSwitch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
        </SettingRow>
        <SettingRow
          icon={Lock}
          label="API Key Encryption"
          description="Encrypt stored API keys at rest"
        >
          <AnimatedSwitch checked={apiEncryption} onCheckedChange={setApiEncryption} />
        </SettingRow>
        <SettingRow
          icon={Shield}
          label="Session Timeout"
          description="Auto-logout after period of inactivity"
        >
          <AnimatedSelect
            value={sessionTimeoutMinutes}
            onValueChange={setSessionTimeoutMinutes}
            className="w-32"
          >
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="0">Never</SelectItem>
          </AnimatedSelect>
        </SettingRow>
      </SettingsCard>
      <SaveBar onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}

export function PreferencesSettingsSection({
  initial,
}: {
  initial?: Partial<UserPreferences> | null;
}) {
  const router = useRouter();
  const prefs = { ...DEFAULT_PREFERENCES, ...(initial ?? {}) };
  const [theme, setTheme] = useState(prefs.theme);
  const [language, setLanguage] = useState(prefs.language);
  const [darkMode, setDarkMode] = useState(prefs.darkMode);
  const [auditFrequency, setAuditFrequency] = useState(prefs.auditFrequency);
  const [auditAlerts, setAuditAlerts] = useState(prefs.auditAlerts);
  const [dataRetentionDays, setDataRetentionDays] = useState(
    String(prefs.dataRetentionDays)
  );
  const [emailNotifications, setEmailNotifications] = useState(
    prefs.emailNotifications
  );
  const [slackNotifications, setSlackNotifications] = useState(
    prefs.slackNotifications
  );
  const [costAlertUsd, setCostAlertUsd] = useState(String(prefs.costAlertUsd));
  const [autoOptimization, setAutoOptimization] = useState(prefs.autoOptimization);
  const [costThresholdUsd, setCostThresholdUsd] = useState(
    String(prefs.costThresholdUsd)
  );
  const [optimizationStrategy, setOptimizationStrategy] = useState(
    prefs.optimizationStrategy
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await savePreferences({
      theme,
      language,
      darkMode,
      auditFrequency,
      auditAlerts,
      dataRetentionDays: Number(dataRetentionDays) as 30 | 90 | 365,
      emailNotifications,
      slackNotifications,
      costAlertUsd: Number(costAlertUsd) || 0,
      autoOptimization,
      costThresholdUsd: Number(costThresholdUsd) || 0,
      optimizationStrategy,
    });
    setIsSaving(false);
    if (!result.ok) {
      toast.error(result.error || "Could not save preferences");
      return;
    }
    toast.success("Preferences saved");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Workspace Preferences"
        description="Customize your workspace appearance and behavior"
        delay={0.05}
      >
        <SettingRow icon={Palette} label="Theme" description="Choose your preferred color scheme">
          <AnimatedSelect value={theme} onValueChange={(v) => setTheme(v as typeof theme)} className="w-32">
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </AnimatedSelect>
        </SettingRow>
        <SettingRow icon={Globe} label="Language" description="Select your display language">
          <AnimatedSelect
            value={language}
            onValueChange={(v) => setLanguage(v as typeof language)}
            className="w-32"
          >
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </AnimatedSelect>
        </SettingRow>
        <SettingRow
          icon={Palette}
          label="Dark Mode"
          description="Enable dark mode for reduced eye strain"
        >
          <AnimatedSwitch checked={darkMode} onCheckedChange={setDarkMode} />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="AI Audit Settings"
        description="Configure audit frequency and monitoring preferences"
        delay={0.1}
      >
        <SettingRow
          icon={Settings2}
          label="Audit Frequency"
          description="How often to run AI usage audits"
        >
          <AnimatedSelect
            value={auditFrequency}
            onValueChange={(v) => setAuditFrequency(v as typeof auditFrequency)}
            className="w-32"
          >
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </AnimatedSelect>
        </SettingRow>
        <SettingRow
          icon={Bell}
          label="Audit Alerts"
          description="Receive notifications when audits complete"
        >
          <AnimatedSwitch checked={auditAlerts} onCheckedChange={setAuditAlerts} />
        </SettingRow>
        <SettingRow
          icon={TrendingUp}
          label="Data Retention"
          description="How long to keep audit history"
        >
          <AnimatedSelect
            value={dataRetentionDays}
            onValueChange={setDataRetentionDays}
            className="w-32"
          >
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="365">1 year</SelectItem>
          </AnimatedSelect>
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Notifications"
        description="Manage how you receive updates and alerts"
        delay={0.15}
      >
        <SettingRow
          icon={Mail}
          label="Email Notifications"
          description="Receive updates via email"
        >
          <AnimatedSwitch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </SettingRow>
        <SettingRow
          icon={MessageSquare}
          label="Slack Integration"
          description="Send alerts to your Slack workspace"
        >
          <AnimatedSwitch
            checked={slackNotifications}
            onCheckedChange={setSlackNotifications}
          />
        </SettingRow>
        <SettingRow
          icon={Bell}
          label="Cost Alerts"
          description="Notify when spending exceeds threshold"
        >
          <div className="flex items-center gap-2">
            <AnimatedInput
              type="number"
              className="w-24 h-8"
              value={costAlertUsd}
              onChange={(e) => setCostAlertUsd(e.target.value)}
            />
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Optimization Controls"
        description="Configure AI cost optimization and performance settings"
        delay={0.2}
      >
        <SettingRow
          icon={Zap}
          label="Auto-Optimization"
          description="Automatically optimize AI provider selection"
        >
          <AnimatedSwitch checked={autoOptimization} onCheckedChange={setAutoOptimization} />
        </SettingRow>
        <SettingRow
          icon={TrendingUp}
          label="Cost Threshold"
          description="Maximum monthly spend per provider"
        >
          <div className="flex items-center gap-2">
            <AnimatedInput
              type="number"
              className="w-24 h-8"
              value={costThresholdUsd}
              onChange={(e) => setCostThresholdUsd(e.target.value)}
            />
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
        </SettingRow>
        <SettingRow
          icon={Settings2}
          label="Optimization Strategy"
          description="Choose your optimization priority"
        >
          <AnimatedSelect
            value={optimizationStrategy}
            onValueChange={(v) =>
              setOptimizationStrategy(v as typeof optimizationStrategy)
            }
            className="w-32"
          >
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
          </AnimatedSelect>
        </SettingRow>
      </SettingsCard>

      <SaveBar onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}

function SaveBar({
  onSave,
  isSaving,
}: {
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex justify-end pt-2"
    >
      <Button size="sm" className="gap-2" onClick={onSave} disabled={isSaving}>
        <Settings2 className={cn("w-4 h-4", isSaving && "animate-spin")} />
        {isSaving ? "Saving…" : "Save Changes"}
      </Button>
    </motion.div>
  );
}

/** @deprecated Prefer section components on settings sub-routes */
export function SettingsCards() {
  return <PreferencesSettingsSection />;
}
