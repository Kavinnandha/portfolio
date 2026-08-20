"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Read-out for how far down the page you are: a hairline across the top, and
 * a percentage in the corner.
 *
 * Both come off one ScrollTrigger driving the whole document, so the bar and
 * the number can never disagree.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null);
  const value = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    initGsap();
    const barEl = bar.current;
    if (!barEl) return;

    const setScale = gsap.quickSetter(barEl, "scaleX");
    let shown = -1;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setScale(self.progress);
        const pct = Math.round(self.progress * 100);
        if (pct !== shown && value.current) {
          shown = pct;
          value.current.textContent = String(pct).padStart(2, "0");
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span className="progress-bar" ref={bar} />
      </div>
      <p className="progress-read" aria-hidden="true">
        <span ref={value}>00</span>
        <span className="progress-read-unit">%</span>
      </p>
    </>
  );
}
