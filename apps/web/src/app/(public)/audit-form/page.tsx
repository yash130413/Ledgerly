"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, TrendingDown, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { analytics } from "@/lib/analytics";

// Provider options
const PROVIDERS = [
  { id: "chatgpt", name: "ChatGPT", plans: ["Plus", "Team", "Enterprise", "API"] },
  { id: "claude", name: "Claude", plans: ["Free", "Pro", "Team", "Enterprise", "API"] },
  { id: "cursor", name: "Cursor", plans: ["Hobby", "Pro", "Business", "Enterprise"] },
  { id: "copilot", name: "GitHub Copilot", plans: ["Individual", "Business", "Enterprise"] },
  { id: "gemini", name: "Gemini", plans: ["Pro", "Ultra", "API"] },
  { id: "windsurf", name: "Windsurf", plans: ["Free", "Pro", "Teams", "Enterprise"] },
];

const USE_CASES = ["Coding", "Writing", "Data Analysis", "Research", "Mixed"];

type ToolInput = {
  provider: string;
  plan: string;
  monthlySpend: string;
  seats: string;
};

export default function AuditFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state with localStorage persistence
  const [tools, setTools] = useLocalStorage<ToolInput[]>("audit-tools", [
    { provider: "", plan: "", monthlySpend: "", seats: "" },
  ]);
  const [teamSize, setTeamSize] = useLocalStorage("audit-team-size", "");
  const [useCase, setUseCase] = useLocalStorage("audit-use-case", "");
  const [email, setEmail] = useLocalStorage("audit-email", "");

  const addTool = () => {
    setTools([...tools, { provider: "", plan: "", monthlySpend: "", seats: "" }]);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const updateTool = (index: number, field: keyof ToolInput, value: string) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: value };
    setTools(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Transform tools data into workspace metrics format
      const workspaces = tools
        .filter((t) => t.provider && t.plan)
        .map((t) => ({
          provider: t.provider,
          plan: t.plan,
          totalSeats: parseInt(t.seats) || 1,
          activeSeats30d: Math.floor((parseInt(t.seats) || 1) * 0.7), // Estimate 70% active
          inactiveSeats30d: Math.ceil((parseInt(t.seats) || 1) * 0.3), // Estimate 30% inactive
          monthlySpend: parseFloat(t.monthlySpend) || 0,
          subscriptionSpend: parseFloat(t.monthlySpend) || 0,
          apiSpend: 0,
          avgPromptsPerUser: 15,
          avgSessionsPerUser: 4,
          powerUsers: Math.floor((parseInt(t.seats) || 1) * 0.3),
          casualUsers: Math.ceil((parseInt(t.seats) || 1) * 0.7),
          utilizationRate: 0.7,
          duplicateTools: [],
          annualCommitment: false,
        }));

      // Track audit start
      analytics.auditStarted(workspaces[0]?.provider || 'unknown');

      // Call audit API
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `AI Audit - ${new Date().toLocaleDateString()}`,
          workspaces,
          email: email || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error("Audit failed");
      }

      const data = await response.json();
      
      // Track audit completion
      analytics.auditCompleted({
        providers: workspaces.map(w => w.provider),
        totalSavings: data.result?.totalAnnualSavings || 0,
        recommendationCount: data.result?.recommendations?.length || 0,
      });
      
      // Redirect to results page using shareId
      router.push(`/results/${data.shareId}`);
    } catch (error) {
      console.error("Audit submission error:", error);
      alert("Failed to run audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Credex
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap className="w-4 h-4 text-green-600" />
            Free AI Spend Audit
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Audit Your AI Spend
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Get instant insights into wasted spend, inactive seats, and duplicate tools.
            No signup required.
          </p>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              Avg. 34% cost reduction
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              Results in 2 minutes
            </span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8"
        >
          {/* Tools Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What AI tools do you pay for?
            </h2>
            
            <div className="space-y-4">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50"
                >
                  {/* Provider */}
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5">Provider</Label>
                    <select
                      value={tool.provider}
                      onChange={(e) => updateTool(index, "provider", e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                      required
                    >
                      <option value="">Select...</option>
                      {PROVIDERS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plan */}
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5">Plan</Label>
                    <select
                      value={tool.plan}
                      onChange={(e) => updateTool(index, "plan", e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                      required
                      disabled={!tool.provider}
                    >
                      <option value="">Select...</option>
                      {tool.provider &&
                        PROVIDERS.find((p) => p.name === tool.provider)?.plans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Monthly Spend */}
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5">Monthly Spend</Label>
                    <Input
                      type="number"
                      placeholder="$500"
                      value={tool.monthlySpend}
                      onChange={(e) => updateTool(index, "monthlySpend", e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>

                  {/* Seats */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600 mb-1.5">Seats</Label>
                      <Input
                        type="number"
                        placeholder="10"
                        value={tool.seats}
                        onChange={(e) => updateTool(index, "seats", e.target.value)}
                        className="h-10"
                        required
                      />
                    </div>
                    {tools.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTool(index)}
                        className="h-10 px-3"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addTool}
              className="mt-4 w-full sm:w-auto"
            >
              + Add Another Tool
            </Button>
          </div>

          {/* Email */}
          <div className="mb-8">
            <Label className="text-sm font-medium text-gray-700 mb-2">
              Email (optional - to receive results)
            </Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Team Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Team Size
              </Label>
              <Input
                type="number"
                placeholder="e.g., 25"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Primary Use Case
              </Label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white"
                required
              >
                <option value="">Select...</option>
                {USE_CASES.map((uc) => (
                  <option key={uc} value={uc}>
                    {uc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Audit...
              </>
            ) : (
              <>
                Run Free Audit
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            No credit card required · Results in ~30 seconds · Your data stays private
          </p>
        </motion.form>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Form data is saved locally. Refresh the page and your inputs will persist.
        </p>
      </main>
    </div>
  );
}
