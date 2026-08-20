"use client";

import { useRef } from "react";
import { EASE, claim, gsap, prefersReducedMotion, useGSAP } from "./gsap";

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
 *
 * The count is a tween over a plain object whose value is written to
 * `textContent` on update. Rendering each frame through React would be a
 * re-render per frame for a string that changes and is then thrown away.
 */
export default function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 2,
  group = true,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);

  const format = (n: number) => `${prefix}${group ? n.toLocaleString("en-US") : n}${suffix}`;
  const truth = format(to);

  useGSAP(
    () => {
      const el = ref.current;
      const out = outRef.current;
      if (!el || !out) return;
      claim(el);

      if (prefersReducedMotion()) {
        out.textContent = truth;
        return;
      }

      const value = { n: 0 };
      gsap.to(value, {
        n: to,
        duration,
        ease: EASE,
        // Integers only: a statistic flickering through 847.3 reads as broken.
        snap: { n: 1 },
        onUpdate: () => {
          out.textContent = format(value.n);
        },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} data-motion="count">
      <span className="count-anim" ref={outRef} aria-hidden="true">
        {prefix}0{suffix}
      </span>
      <span className="count-true visually-hidden">{truth}</span>
    </span>
  );
}
