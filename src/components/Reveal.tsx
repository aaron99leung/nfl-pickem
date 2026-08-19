"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export interface RevealProps {
  children: ReactNode;
  /** "scroll" fades in once the element enters the viewport; "mount" fades in immediately on first render. */
  mode?: "scroll" | "mount";
  delay?: number;
  duration?: number;
  className?: string;
}

export function Reveal({ children, mode = "scroll", delay = 0, duration = 0.6, className }: RevealProps) {
  const transition = { duration, ease: "easeInOut" as const, delay };

  if (mode === "mount") {
    return (
      <motion.div initial="hidden" animate="visible" variants={variants} transition={transition} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
