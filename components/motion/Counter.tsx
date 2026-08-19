"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "./easing";

type CounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** Thousands separators. Off for small figures like "2". */
  group?: boolean;
};

/**
 * A statistic that counts up the first time it is seen.
 *
 * The real figure is always in the DOM inside a visually-hidden span, so
 * assistive tech and crawlers read "1,000+" rather than whatever frame the
 * animation happens to be on — and the `<noscript>` rule in the layout swaps
 * the two if JavaScript never arrives.
 */
export default function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
  group = true,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  const count = useMotionValue(0);
  const text = useTransform(count, (v) => {
    const n = Math.round(v);
    return `${prefix}${group ? n.toLocaleString("en-US") : n}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, reduced, to, duration, count]);

  const truth = `${prefix}${group ? to.toLocaleString("en-US") : to}${suffix}`;

  return (
    <span ref={ref}>
      <motion.span className="count-anim" aria-hidden="true">
        {text}
      </motion.span>
      <span className="count-true visually-hidden">{truth}</span>
    </span>
  );
}
