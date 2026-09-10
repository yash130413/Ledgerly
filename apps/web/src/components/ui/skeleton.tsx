"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <motion.div
      data-slot="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-md bg-muted animate-[skeleton-pulse_2s_ease-in-out_infinite]",
        className
      )}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      <div className="shimmer" aria-hidden="true" />
    </motion.div>
  );
}

export { Skeleton };
