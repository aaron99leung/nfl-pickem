"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EmojiTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  emojis?: string[];
  threshold?: number;
  minDelay?: number;
  duration?: number;
  maxItems?: number;
  rotationRange?: number;
  emojiClassName?: string;
  overlayClassName?: string;
  transition?: Transition;
  exitTransition?: Transition;
  disabled?: boolean;
}

interface TrailItem {
  id: string;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
}

const DEFAULT_EMOJIS = ["🏈", "🍿", "🏆", "🦅", "🦬", "🧀", "⚜️", "🐦‍⬛", "🐅", "🐏"];

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 22,
};

const DEFAULT_EXIT_TRANSITION: Transition = {
  duration: 0.4,
  ease: "easeInOut",
};

export function EmojiTrail({
  emojis = DEFAULT_EMOJIS,
  threshold = 100,
  minDelay = 150,
  duration = 1000,
  maxItems = 10,
  rotationRange = 40,
  emojiClassName,
  overlayClassName,
  transition = DEFAULT_TRANSITION,
  exitTransition = DEFAULT_EXIT_TRANSITION,
  disabled = false,
  className,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: EmojiTrailProps) {
  const [trail, setTrail] = React.useState<TrailItem[]>([]);
  const lastPositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = React.useRef(0);
  const emojiIndexRef = React.useRef(0);
  const timeoutRefs = React.useRef<Set<number>>(new Set());
  const safeThreshold = Math.max(0, threshold);
  const safeMinDelay = Math.max(0, minDelay);
  const safeDuration = Math.max(0, duration);
  const safeMaxItems = Math.max(0, Math.floor(maxItems));
  const safeRotationRange = Math.max(0, rotationRange);

  React.useEffect(() => {
    const timeouts = timeoutRefs.current;

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setTrail((current) => current.filter((item) => item.id !== id));
  }, []);

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);

      if (disabled || !emojis.length || safeMaxItems === 0) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      const lastPosition = lastPositionRef.current;
      const now = window.performance.now();

      if (lastPosition) {
        const distance = Math.hypot(position.x - lastPosition.x, position.y - lastPosition.y);

        if (distance < safeThreshold || now - lastTimeRef.current < safeMinDelay) {
          return;
        }
      }

      const emoji = emojis[emojiIndexRef.current % emojis.length];
      const id = `${Math.round(now)}-${Math.random().toString(36).slice(2)}`;
      const rotation = Math.random() * safeRotationRange - safeRotationRange / 2;

      emojiIndexRef.current = (emojiIndexRef.current + 1) % emojis.length;
      lastPositionRef.current = position;
      lastTimeRef.current = now;

      setTrail((current) => {
        const next = [...current, { id, x: position.x, y: position.y, emoji, rotation }];
        return next.slice(Math.max(0, next.length - safeMaxItems));
      });

      const timeout = window.setTimeout(() => {
        timeoutRefs.current.delete(timeout);
        removeItem(id);
      }, safeDuration);
      timeoutRefs.current.add(timeout);
    },
    [
      disabled,
      emojis,
      onPointerMove,
      removeItem,
      safeDuration,
      safeMaxItems,
      safeMinDelay,
      safeRotationRange,
      safeThreshold,
    ]
  );

  const handlePointerLeave = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      lastPositionRef.current = null;
      onPointerLeave?.(event);
    },
    [onPointerLeave]
  );

  return (
    <div
      className={cn("relative z-0 overflow-hidden", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}

      <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", overlayClassName)}>
        <AnimatePresence>
          {trail.map((item) => (
            <motion.div
              key={item.id}
              className="absolute"
              style={{ left: item.x, top: item.y }}
              initial={{ x: "-50%", y: "-50%", scale: 0.82, opacity: 0, rotate: item.rotation }}
              animate={{ x: "-50%", y: "-50%", scale: 1, opacity: 1, rotate: item.rotation }}
              exit={{
                x: "-50%",
                y: "-50%",
                scale: 0.5,
                opacity: 0,
                rotate: item.rotation * 0.75,
                transition: exitTransition,
              }}
              transition={transition}
            >
              <span className={cn("block select-none text-7xl", emojiClassName)}>
                {item.emoji}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default EmojiTrail;
