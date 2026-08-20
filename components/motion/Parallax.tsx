"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import { claim, gsap, prefersReducedMotion, useGSAP } from "./gsap";

/**
 * Depth on a photograph, without the usual gap at the edges.
 *
 * The frame clips, and the inner layer is inset *past* the frame on both axes,
 * so translating it can never expose background. Travel is expressed as a
 * percentage of the inner layer, which keeps the effect identical at every
 * viewport size instead of overshooting on tall phones.
 *
 * `scrub` rather than a spring: the layer is welded to scroll position, so it
 * cannot drift out of step with the frame that is clipping it. The small
 * numeric scrub value is the softening — a fifth of a second of catch-up,
 * enough to take the edge off a trackpad's stair-stepping.
 */
export default function Parallax({
  children,
  className,
  /** Travel as a percentage of the frame height. */
  amount = 6,
  /** Lift the black-and-white treatment as the frame reaches centre. */
  desaturate = false,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  desaturate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const frame = ref.current;
      const inner = frame?.querySelector<HTMLElement>(".parallax-inner");
      if (!frame || !inner) return;
      claim(frame);
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        inner,
        { yPercent: amount },
        {
          yPercent: -amount,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.2,
          },
        },
      );

      if (desaturate) {
        // The photograph prints black and white and stays that way; this only
        // lifts the contrast crush as the frame settles into the middle of the
        // viewport, so the image gains presence exactly where it is being read.
        gsap.fromTo(
          frame,
          { filter: "grayscale(1) contrast(1.28) brightness(0.94)" },
          {
            filter: "grayscale(1) contrast(1.02) brightness(1.02)",
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "center center",
              scrub: 0.4,
            },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={`parallax ${className ?? ""}`.trim()}
      data-motion="parallax"
      // The bleed lives on the frame, not on the moving layer, so the inset is
      // inherited rather than recomputed per child.
      style={{ "--parallax-bleed": `${amount}%` } as CSSProperties}
    >
      <div className="parallax-inner">{children}</div>
    </div>
  );
}
