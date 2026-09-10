"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plug, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimateList, AnimateItem } from "@/components/shared/motion";
import { PROVIDER_LABELS } from "@/lib/utils";
import type { AIProvider } from "@/types";
import type { AvailableIntegration } from "@/lib/integrations/fetch";
import { toast } from "sonner";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function IntegrationsList({
  connected,
  available,
}: {
  connected: AIProvider[];
  available: AvailableIntegration[];
}) {
  const onConnect = (name: string) => {
    toast.message(`Connect ${name}`, {
      description: "OAuth connect is coming soon. Use a free audit for now.",
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Connected</h2>
          <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.12, ease: EASE }}>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => onConnect("a provider")}
            >
              <Plug className="w-4 h-4" /> Connect provider
            </Button>
          </motion.div>
        </div>

        {connected.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No providers connected yet. Pick one below to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimateList className="flex flex-col gap-3">
            {connected.map((p) => (
              <AnimateItem key={p.id}>
                <Card hover>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{p.name}</span>
                        <Badge
                          variant={p.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {PROVIDER_LABELS[p.provider] ?? p.provider} ·{" "}
                        {p.apiKeyMasked}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </AnimateItem>
            ))}
          </AnimateList>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-900">Available to connect</h2>
        <AnimateList className="grid sm:grid-cols-2 gap-3">
          {available.map((p) => (
            <AnimateItem key={p.id}>
              <Card hover={false} className="h-full">
                <CardContent className="p-4 flex flex-col gap-3 h-full">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="self-start gap-1.5"
                    onClick={() => onConnect(p.name)}
                  >
                    <Plug className="w-3.5 h-3.5" /> Connect
                  </Button>
                </CardContent>
              </Card>
            </AnimateItem>
          ))}
        </AnimateList>
      </section>
    </div>
  );
}
