"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: EASE }}
    >
      <Select defaultValue={defaultValue}>
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

export function SettingsCards() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [auditAlerts, setAuditAlerts] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [apiEncryption, setApiEncryption] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Preferences */}
      <SettingsCard
        title="Workspace Preferences"
        description="Customize your workspace appearance and behavior"
        delay={0.1}
      >
        <SettingRow
          icon={Palette}
          label="Theme"
          description="Choose your preferred color scheme"
        >
          <AnimatedSelect defaultValue="light" className="w-32">
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </AnimatedSelect>
        </SettingRow>

        <SettingRow
          icon={Globe}
          label="Language"
          description="Select your display language"
        >
          <AnimatedSelect defaultValue="en" className="w-32">
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

      {/* AI Audit Settings */}
      <SettingsCard
        title="AI Audit Settings"
        description="Configure audit frequency and monitoring preferences"
        delay={0.15}
      >
        <SettingRow
          icon={Settings2}
          label="Audit Frequency"
          description="How often to run AI usage audits"
        >
          <AnimatedSelect defaultValue="daily" className="w-32">
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
          <AnimatedSelect defaultValue="90" className="w-32">
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="365">1 year</SelectItem>
          </AnimatedSelect>
        </SettingRow>
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard
        title="Notifications"
        description="Manage how you receive updates and alerts"
        delay={0.2}
      >
        <SettingRow
          icon={Mail}
          label="Email Notifications"
          description="Receive updates via email"
        >
          <AnimatedSwitch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </SettingRow>

        <SettingRow
          icon={MessageSquare}
          label="Slack Integration"
          description="Send alerts to your Slack workspace"
        >
          <AnimatedSwitch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
        </SettingRow>

        <SettingRow
          icon={Bell}
          label="Cost Alerts"
          description="Notify when spending exceeds threshold"
        >
          <div className="flex items-center gap-2">
            <AnimatedInput
              type="number"
              placeholder="1000"
              className="w-24 h-8"
              defaultValue="1000"
            />
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
        </SettingRow>
      </SettingsCard>

      {/* Security & Privacy */}
      <SettingsCard
        title="Security & Privacy"
        description="Protect your workspace and manage data access"
        delay={0.25}
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
          <AnimatedSelect defaultValue="30" className="w-32">
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="never">Never</SelectItem>
          </AnimatedSelect>
        </SettingRow>
      </SettingsCard>

      {/* Optimization Controls */}
      <SettingsCard
        title="Optimization Controls"
        description="Configure AI cost optimization and performance settings"
        delay={0.3}
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
              placeholder="5000"
              className="w-24 h-8"
              defaultValue="5000"
            />
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
        </SettingRow>

        <SettingRow
          icon={Settings2}
          label="Optimization Strategy"
          description="Choose your optimization priority"
        >
          <AnimatedSelect defaultValue="balanced" className="w-32">
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
          </AnimatedSelect>
        </SettingRow>
      </SettingsCard>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
        className="flex justify-end pt-2"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: EASE }}
        >
          <Button
            size="sm"
            className="gap-2 relative overflow-hidden"
            onClick={handleSave}
            disabled={isSaving}
          >
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings2 className="w-4 h-4" />
                  </motion.div>
                  Saving...
                </motion.div>
              ) : (
                <motion.div
                  key="save"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Settings2 className="w-4 h-4" />
                  Save Changes
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
