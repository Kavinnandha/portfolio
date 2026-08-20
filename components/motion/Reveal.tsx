"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import { EASE, claim, gsap, prefersReducedMotion, settle, useGSAP } from "./gsap";

type Tag = "div" | "section" | "article" | "figure" | "li" | "tbody" | "tr";

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
  as?: Tag;
  /** Seconds before the entrance starts once the element qualifies. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  /**
   * Where the element's top must reach before the entrance fires, as a
   * ScrollTrigger start string. The default holds until the element is
   * meaningfully on screen rather than the instant its first pixel is.
   */
  start?: string;
};

/** The line every entrance on the site crosses. */
const START = "top 86%";

/**
 * The workhorse entrance: a block fades and lifts once it crosses into view.
 *
 * Fires once. Re-animating on every pass reads as a gimmick by the third
 * scroll, and it makes the page feel like it is performing rather than
 * responding.
 *
 * The resting state lives in CSS (`[data-motion="reveal"]`), not in an inline
 * style written at render, so the prerendered HTML is already hidden before a
 * single line of JavaScript has parsed — there is no frame where the content
 * is visible and then yanked away.
 */
export function Reveal({
  children,
  className,
  id,
  style,
  as = "div",
  delay = 0,
  y = 28,
  start = START,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      claim(el);

      if (prefersReducedMotion()) {
        settle(el);
        return;
      }

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: EASE,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag
      id={id}
      className={className}
      style={{ ...style, ["--reveal-y" as string]: `${y}px` } as CSSProperties}
      data-motion="reveal"
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger container. Any `<RevealItem>` beneath it enters as part of one
 * cascade, so a grid resolves cell by cell instead of snapping in as a block —
 * the detail that separates a considered entrance from a CSS transition.
 *
 * One ScrollTrigger for the whole group, not one per cell: eight cells in the
 * toolkit grid would otherwise mean eight independent triggers measuring eight
 * elements that all cross the same line within a few pixels of each other.
 */
export function RevealGroup({
  children,
  className,
  id,
  style,
  as = "div",
  stagger = 0.075,
  delayChildren = 0,
  start = START,
}: Omit<RevealProps, "delay" | "y"> & {
  stagger?: number;
  delayChildren?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll('[data-motion="reveal-item"]'),
      );
      claim(el);
      items.forEach(claim);
      if (!items.length) return;

      if (prefersReducedMotion()) {
        settle(items);
        return;
      }

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        delay: delayChildren,
        ease: EASE,
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag
      id={id}
      className={className}
      style={style}
      data-motion="reveal-group"
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  style,
  as = "div",
  y = 26,
}: Omit<RevealProps, "delay" | "id" | "start">) {
  const Tag = as as "div";

  return (
    <Tag
      className={className}
      style={{ ...style, ["--reveal-y" as string]: `${y}px` } as CSSProperties}
      data-motion="reveal-item"
    >
      {children}
    </Tag>
  );
}

/**
 * A 2px rule that draws itself left to right.
 *
 * The design organises the page with dividers, so animating the divider is the
 * most on-system motion available — it animates the structure itself rather
 * than decorating it.
 */
export function RuleDraw({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      claim(el);

      if (prefersReducedMotion()) {
        gsap.set(el, { scaleX: 1 });
        return;
      }

      gsap.to(el, {
        scaleX: 1,
        duration: 1.1,
        delay,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 94%", once: true },
      });
    },
    { scope: ref },
  );

  return <span ref={ref} aria-hidden="true" className={className} data-motion="rule" />;
}
