"use client";

import { useRef } from "react";
import { EASE, claim, gsap, prefersReducedMotion, useGSAP } from "./gsap";

/**
 * The rule between sections, drawn rather than printed.
 *
 * The page is organised by dividers, so the divider arriving *as a movement*
 * is the most structural motion available — each section is introduced by the
 * line that separates it, sweeping in from the left edge of the measure.
 */
export default function Divider() {
  const ref = useRef<HTMLHRElement>(null);

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
        duration: 1.2,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 96%", once: true },
      });
    },
    { scope: ref },
  );

  return <hr className="hr" data-motion="rule" ref={ref} />;
}
