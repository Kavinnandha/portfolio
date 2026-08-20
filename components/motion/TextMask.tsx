"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EASE_OUT } from "./easing";

type TextMaskProps = {
  lines: ReactNode[];
  className?: string;
  /**
   * Per-line class, positionally matched to `lines` — e.g. the accent colour
   * on the last hero line. An array rather than a callback because this
   * component is rendered from a Server Component, and functions cannot cross
   * that boundary.
   */
  lineClassNames?: (string | undefined)[];
  delay?: number;
  stagger?: number;
  /** Play on mount (hero) or when scrolled into view (section headings). */
  trigger?: "mount" | "view";
};

/**
 * Line-by-line mask reveal: each line sits in an `overflow: hidden` box and
 * slides up from fully clipped.
 *
 * The mask is a real element rather than a `clip-path`, so the type stays
 * selectable and screen readers get one uninterrupted string.
 *
 * Note the failsafe. Masked text is *clipped*, not merely transparent — if the
 * reveal never runs, the headline is not faint, it is absent. That is a much
 * worse failure than a missed animation, and it is the site's two largest
 * lines. So the reveal also fires on a timer: whichever comes first, the
 * viewport callback or the deadline. Off-screen headings are already past the
 * fold when the timer wins, so the entrance is not visibly skipped.
 */
export default function TextMask({
  lines,
  className,
  lineClassNames,
  delay = 0,
  stagger = 0.11,
  trigger = "mount",
}: TextMaskProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDeadlinePassed(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const show = trigger === "mount" || inView || deadlinePassed;
  const hidden = reduced ? "0%" : "108%";

  return (
    <span ref={ref} className={className} data-motion="mask">
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            className={lineClassNames?.[i]}
            initial={{ y: hidden }}
            animate={{ y: show ? "0%" : hidden }}
            transition={{
              duration: reduced ? 0 : 0.95,
              ease: EASE_OUT,
              delay: reduced ? 0 : delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
