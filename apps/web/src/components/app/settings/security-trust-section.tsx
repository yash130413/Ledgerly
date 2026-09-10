"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Database,
  Eye,
  Key,
  Lock,
  Server,
  Shield,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface SecurityFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: "active" | "enabled" | "protected";
  delay?: number;
}

function SecurityFeature({
  icon: Icon,
  title,
  description,
  status,
  delay = 0,
}: SecurityFeatureProps) {
  const statusConfig = {
    active: { label: "Active", color: "text-green-600 bg-green-50 border-green-200" },
    enabled: { label: "Enabled", color: "text-green-600 bg-green-50 border-green-200" },
    protected: { label: "Protected", color: "text-green-600 bg-green-50 border-green-200" },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <Card hover={false} className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.02] via-transparent to-transparent" />
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-sm font-semibold">{title}</h3>
                <Badge
                  variant="outline"
                  className={cn("text-xs border", config.color)}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SecurityHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Security & Trust</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Enterprise-grade security protecting your AI infrastructure and sensitive data.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
          </div>
          <span className="text-sm font-medium text-green-700">All Systems Secure</span>
        </div>
      </div>
    </motion.div>
  );
}

function SecurityStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
    >
      <Card hover={false} className="relative overflow-hidden border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.05),transparent_50%)]" />
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-700/70 font-medium">Encryption</p>
                <p className="text-sm font-semibold text-green-900">AES-256</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-700/70 font-medium">Compliance</p>
                <p className="text-sm font-semibold text-green-900">SOC 2 Type II</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                <Server className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-700/70 font-medium">Uptime</p>
                <p className="text-sm font-semibold text-green-900">99.9%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SecurityTrustSection() {
  return (
    <div className="space-y-6">
      <SecurityHeader />
      
      <SecurityStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SecurityFeature
          icon={Key}
          title="Encrypted Provider Credentials"
          description="All API keys and provider credentials are encrypted at rest using AES-256 encryption and never stored in plain text."
          status="protected"
          delay={0.15}
        />

        <SecurityFeature
          icon={Database}
          title="Private Audit Storage"
          description="Your audit data is stored in isolated, encrypted databases with strict access controls and automatic backups."
          status="active"
          delay={0.2}
        />

        <SecurityFeature
          icon={Shield}
          title="Secure Integrations"
          description="All provider integrations use OAuth 2.0 and TLS 1.3 encryption for secure communication channels."
          status="enabled"
          delay={0.25}
        />

        <SecurityFeature
          icon={Server}
          title="Infrastructure Monitoring"
          description="24/7 real-time monitoring of all systems with automated threat detection and instant security alerts."
          status="active"
          delay={0.3}
        />

        <SecurityFeature
          icon={ShieldCheck}
          title="Optimization Engine Protection"
          description="AI optimization algorithms run in isolated environments with zero-trust architecture and audit logging."
          status="protected"
          delay={0.35}
        />

        <SecurityFeature
          icon={Lock}
          title="Access Control & Logging"
          description="Role-based access control with comprehensive audit trails tracking all system access and modifications."
          status="enabled"
          delay={0.4}
        />
      </div>
    </div>
  );
}
