"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { createContext, useContext, useRef, type ReactNode } from "react";

type StackContextValue = {
  progress: MotionValue<number>;
  total: number;
};

const StackContext = createContext<StackContextValue | null>(null);

/**
 * Scroll-driven card deck.
 *
 * Each card pins at the top of the viewport at a slightly lower offset than the
 * one before it, so the previous card stays visible as a thin ledge while the
 * next slides up and covers it. Covered cards ease back and dim, which is what
 * sells the depth — without it the cards just slide past each other.
 *
 * One `useScroll` lives on the container and is shared through context. Six
 * cards each running their own scroll listener would mean six sets of layout
 * reads per frame for information that is identical.
 */
export function CardStack({
  children,
  total,
  className,
}: {
  children: ReactNode;
  total: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <StackContext.Provider value={{ progress: scrollYProgress, total }}>
      <div ref={ref} className={`stack ${className ?? ""}`.trim()}>
        {children}
      </div>
    </StackContext.Provider>
  );
}

export function CardStackItem({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) {
  const ctx = useContext(StackContext);
  const reduced = useReducedMotion();

  // Hooks cannot be conditional, so the fallback is always created and simply
  // never driven when the item is used outside a stack.
  const fallback = useMotionValue(0);
  const progress = ctx?.progress ?? fallback;
  const total = ctx?.total ?? 1;

  // The last card is never covered by anything, so it must not recede — it is
  // the card the reader ends on.
  const isLast = index === total - 1;
  const start = index / total;
  const end = (index + 1) / total;
  const still = reduced || isLast;

  const scale = useTransform(progress, [start, end], still ? [1, 1] : [1, 0.93]);

  /*
   * The dim is a veil laid *over* the card, never `opacity` on the card itself.
   *
   * Fading the card fades its background too, so a covered card turns
   * translucent and the reader sees straight through it to the cards stacked
   * underneath — several headlines and paragraphs overlapping at once. The
   * card must stay fully opaque; only a sheet of the page ground on top of it
   * is allowed to fade in.
   */
  const veil = useTransform(progress, [start, end], still ? [0, 0] : [0, 0.62]);

  return (
    // Two elements on purpose. The outer slot owns the sticky pin and carries
    // `--i` (a custom property, which Motion's style type will not accept
    // alongside animated values); the inner card owns the scale and dim. It
    // also means the pin stays put while the card recedes from it.
    <div
      className="stack-slot"
      style={{ ["--i" as string]: index } as React.CSSProperties}
    >
      <motion.article
        className={`stack-card ${className ?? ""}`.trim()}
        style={{ scale }}
      >
        {children}
        <motion.span className="stack-veil" style={{ opacity: veil }} aria-hidden="true" />
      </motion.article>
    </div>
  );
}
