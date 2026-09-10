"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  formatter?: (v: number) => string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  formatter = (v) => String(Math.round(v)),
  className,
  duration = 1.4,
}: AnimatedCounterProps) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    stiffness: 60,
    damping: 20,
    duration,
  });
  const displayed = useTransform(spring, (v) => formatter(v));
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      // Small delay so the element is in view before counting
      const t = setTimeout(() => motionVal.set(value), 120);
      return () => clearTimeout(t);
    } else {
      motionVal.set(value);
    }
  }, [value, motionVal]);

  return <motion.span className={className}>{displayed}</motion.span>;
}
