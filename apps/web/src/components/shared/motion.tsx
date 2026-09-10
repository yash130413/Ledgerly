"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
  type MotionProps,
} from "framer-motion";

// ── Shared easing ─────────────────────────────────────────────────────────────

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// ── Variant factories ─────────────────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.25, delay },
  }),
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay },
  }),
};

const scaleReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.25, delay },
  }),
};

const slideVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE, delay },
  }),
};

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const staggerReducedVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

const itemReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

// ── Page transition wrapper ───────────────────────────────────────────────────

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -8 }}
      transition={{ duration: reduce ? 0.2 : 0.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ── FadeIn ────────────────────────────────────────────────────────────────────

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function FadeIn({ delay = 0, className, children, ...props }: FadeInProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? reducedVariants : fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={delay}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── ScaleIn — for cards, modals, panels ──────────────────────────────────────

interface ScaleInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function ScaleIn({ delay = 0, className, children, ...props }: ScaleInProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? scaleReducedVariants : scaleVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── SlideIn — for sidebar items, list rows ────────────────────────────────────

interface SlideInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function SlideIn({ delay = 0, className, children, ...props }: SlideInProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? reducedVariants : slideVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── HoverCard — subtle lift + border brighten on hover ────────────────────────

interface HoverCardProps extends MotionProps {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li" | "article";
}

export function HoverCard({ className, children, as = "div", ...props }: HoverCardProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      whileHover={reduce ? {} : { y: -2, scale: 1.005 }}
      whileTap={reduce ? {} : { scale: 0.995 }}
      transition={{ duration: 0.2, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ── StaggerChildren ───────────────────────────────────────────────────────────

export function StaggerChildren({
  className,
  children,
  animate = "visible",
}: {
  className?: string;
  children: React.ReactNode;
  animate?: "visible" | "hidden";
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? staggerReducedVariants : staggerVariants}
      initial="hidden"
      whileInView={animate}
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── StaggerItem ───────────────────────────────────────────────────────────────

export function StaggerItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? itemReducedVariants : itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── AnimateList — stagger animate on mount (not scroll) ───────────────────────

export function AnimateList({
  className,
  children,
  stagger = 0.07,
}: {
  className?: string;
  children: React.ReactNode;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0.03 : stagger, delayChildren: 0.05 },
    },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── AnimateItem — child of AnimateList ────────────────────────────────────────

export function AnimateItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? itemReducedVariants : itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Re-export AnimatePresence for convenience ─────────────────────────────────

export { AnimatePresence };
