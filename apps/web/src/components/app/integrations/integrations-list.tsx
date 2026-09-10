"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plug, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimateList, AnimateItem } from "@/components/shared/motion";
import { PROVIDER_LABELS } from "@/lib/utils";
import type { AIProvider } from "@/types";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function IntegrationsList({ providers }: { providers: AIProvider[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.12, ease: EASE }}>
          <Button size="sm" className="gap-2">
            <Plug className="w-4 h-4" /> Connect provider
          </Button>
        </motion.div>
      </div>

      <AnimateList className="flex flex-col gap-3">
        {providers.map((p) => (
          <AnimateItem key={p.id}>
            <Card hover>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.name}</span>
                    <Badge variant={p.isActive ? "default" : "secondary"} className="text-xs">
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {PROVIDER_LABELS[p.provider]} · {p.apiKeyMasked}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </AnimateItem>
        ))}
      </AnimateList>
    </div>
  );
}
