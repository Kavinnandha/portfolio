"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { EASE_OUT } from "./easing";

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  figure: motion.figure,
  li: motion.li,
  // Table parts, so the spec table can stagger row by row without giving up
  // its semantics for a grid of divs.
  tbody: motion.tbody,
  tr: motion.tr,
};

type Tag = keyof typeof TAGS;

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
  as?: Tag;
  /** Seconds before the entrance starts once the element qualifies. */
  delay?: number;
  /** Travel distance in px. Negative values enter from below. */
  y?: number;
  /**
   * How much of the element must be visible to trigger.
   *
   * Defaults to `"some"` (threshold 0) rather than a fraction, and that is
   * deliberate: `intersectionRatio` is visible-area over *element* area, so it
   * caps at viewportHeight / elementHeight. Any element taller than the
   * viewport divided by the threshold can never reach it — the stacked work
   * grid on a landscape phone would sit at `opacity: 0` forever. The negative
   * bottom margin below is what actually holds the entrance back until the
   * element is meaningfully on screen.
   */
  amount?: number | "some" | "all";
};

/**
 * The workhorse entrance: a section fades and lifts once it crosses into view.
 *
 * `once` is always on — re-animating on every pass reads as a gimmick by the
 * third scroll. Under reduced motion the element still mounts and still uses
 * the same component tree, it just has nothing to travel and no duration.
 */
export function Reveal({
  children,
  className,
  id,
  style,
  as = "div",
  delay = 0,
  y = 28,
  amount = "some",
}: RevealProps) {
  const reduced = useReducedMotion();
  const C = TAGS[as] as typeof motion.div;

  return (
    <C
      id={id}
      className={className}
      style={style}
      data-motion="reveal"
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: reduced ? 0 : 0.8,
        ease: EASE_OUT,
        delay: reduced ? 0 : delay,
      }}
    >
      {children}
    </C>
  );
}

/**
 * Stagger container. Children rendered as `<RevealItem>` inherit the cascade,
 * so a grid resolves cell by cell instead of snapping in as one block — the
 * detail that separates a considered entrance from a CSS transition.
 */
export function RevealGroup({
  children,
  className,
  id,
  style,
  as = "div",
  stagger = 0.075,
  delayChildren = 0,
  amount = "some",
}: Omit<RevealProps, "delay" | "y"> & {
  stagger?: number;
  delayChildren?: number;
}) {
  const reduced = useReducedMotion();
  const C = TAGS[as] as typeof motion.div;

  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  };

  return (
    <C
      id={id}
      className={className}
      style={style}
      data-motion="reveal"
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </C>
  );
}

export function RevealItem({
  children,
  className,
  style,
  as = "div",
  y = 26,
}: Omit<RevealProps, "delay" | "amount" | "id">) {
  const reduced = useReducedMotion();
  const C = TAGS[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.8, ease: EASE_OUT },
    },
  };

  return (
    <C className={className} style={style} variants={variants}>
      {children}
    </C>
  );
}

/**
 * A 2px rule that draws itself left-to-right. Modernist organises the page
 * with dividers, so animating the divider is the most on-system motion the
 * design can carry — it animates the structure, not a decoration.
 */
export function RuleDraw({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className={className}
      data-motion="rule"
      initial={{ scaleX: reduced ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: reduced ? 0 : 0.9, ease: EASE_OUT, delay }}
      style={{ transformOrigin: "left center", display: "block" }}
    />
  );
}
