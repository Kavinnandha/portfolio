"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

/**
 * The 3px accent rule across the top.
 *
 * Driven by `scaleX` on a full-width bar rather than an animated `width`, so
 * it runs on the compositor and never touches layout. The small scrub value
 * is what keeps it from stair-stepping on a trackpad.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(ref.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
      });
    },
    { scope: ref },
  );

  return (
    <div className="progress-track" aria-hidden="true">
      <div className="progress-bar" ref={ref} />
    </div>
  );
}
