"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * The constant ambient loop behind the hero — the one piece of motion on the
 * page that never stops and never waits for scroll.
 *
 * Modelled on the reference: a soft warm gradient field with discs drifting
 * and turning through it, rather than the design system's usual hard edges.
 * This is a deliberate, requested departure from Modernist's "no radius, no
 * decoration" rule, and it is fenced to the hero backdrop alone — nothing else
 * on the page picks up a curve or a gradient from it.
 *
 * The whole composition is weighted to the right and masked out toward the
 * left, so the ink-on-light headline keeps its contrast.
 *
 * Every layer is a CSS keyframe on `transform` (plus one `opacity`), so the
 * loop runs on the compositor with no per-frame JavaScript. The only JS is one
 * IntersectionObserver that parks it when the hero scrolls away — an animation
 * that runs forever must not keep a core busy for a reader three sections down.
 */
export default function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);

    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const paused = reduced || !onScreen || !tabVisible;

  return (
    <div
      ref={ref}
      className={`hero-backdrop${paused ? " is-paused" : ""}`}
      aria-hidden="true"
    >
      <div className="hero-field" />
      <div className="hero-glow" />
      <span className="hero-disc hero-disc-1" />
      <span className="hero-disc hero-disc-2" />
      <span className="hero-disc hero-disc-3" />
      <span className="hero-disc hero-disc-4" />
    </div>
  );
}
