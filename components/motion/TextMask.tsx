"use client";

import { useRef, type ReactNode } from "react";
import { EASE, claim, gsap, prefersReducedMotion, useGSAP } from "./gsap";

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
  /**
   * `mount` plays on load, `view` when the block is scrolled to, and
   * `external` hands the lines to a parent timeline — the hero uses that so
   * its headline is one movement with the rest of the composition rather than
   * a separate animation that happens to start at the same moment.
   */
  trigger?: "mount" | "view" | "external";
};

/** Selector a parent timeline uses to pick up externally driven lines. */
export const MASK_LINE = "[data-mask-line]";

/**
 * Line-by-line mask reveal: each line sits in an `overflow: hidden` box and
 * slides up from fully clipped, with a whisper of skew on the way so the type
 * arrives with weight instead of sliding like a panel.
 *
 * The mask is a real element rather than a `clip-path`, so the type stays
 * selectable and screen readers get one uninterrupted string.
 *
 * Masked text is *clipped*, not merely transparent — if the reveal never runs
 * the headline is not faint, it is absent, and this is the largest type on the
 * page. So the resting state is CSS, the entrance is claimed the moment GSAP
 * takes ownership, and anything unclaimed is swept visible by the failsafe in
 * SmoothScroll.
 */
export default function TextMask({
  lines,
  className,
  lineClassNames,
  delay = 0,
  stagger = 0.11,
  trigger = "mount",
}: TextMaskProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(MASK_LINE));
      if (!targets.length) return;

      // An external owner claims and animates these itself.
      if (trigger === "external") return;
      claim(el);

      if (prefersReducedMotion()) {
        gsap.set(targets, { y: 0, yPercent: 0, skewY: 0 });
        return;
      }

      /*
       * Both endpoints live in the tween, and that is the whole trick.
       *
       * GSAP stores a skew as part of a decomposed transform, and any matrix it
       * has to re-read — which is what happens when a tween is built now and
       * rendered later, on scroll — decomposes to rotation plus skewX instead.
       * A `skewY` set separately from the tween is therefore a value the tween
       * can no longer find, and the line arrives permanently askew. Declaring
       * the from-state here means GSAP writes and animates the same channel in
       * the same render pass.
       *
       * `yPercent` for the same reason it is safe here and not in CSS: this is
       * GSAP's own channel, not a percentage it has to recover from a computed
       * pixel matrix.
       */
      gsap.fromTo(
        targets,
        { yPercent: 112, y: 0, skewY: 3 },
        {
          yPercent: 0,
          skewY: 0,
          duration: 1.15,
          delay: trigger === "mount" ? delay : 0,
          ease: EASE,
          stagger,
          scrollTrigger:
            trigger === "view" ? { trigger: el, start: "top 84%", once: true } : undefined,
        },
      );
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className} data-motion="mask">
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <span className={lineClassNames?.[i]} data-mask-line="">
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
