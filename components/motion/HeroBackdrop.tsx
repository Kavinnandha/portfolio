"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const COINS = [1, 2, 3, 4, 5];

/**
 * The constant ambient loop behind the hero.
 *
 * Modelled on jeton.com, whose hero is a full-bleed looping MP4 of a
 * pre-rendered 3D coin animation over a solid orange field. That exact asset
 * cannot be reproduced in CSS — and it is theirs — so this rebuilds the
 * *technique*: discs tumbling in real 3D space, each one a circle flattened
 * into an ellipse by `rotateX` exactly as a physical coin is, drifting through
 * a warm gradient field.
 *
 * Each coin is two nested layers with independent loops: the outer drifts and
 * scales, the inner tumbles. Because the two periods differ and do not divide
 * evenly, the pair never visibly repeats — the trick that keeps a short CSS
 * loop from reading as a loop.
 *
 * All of it is `transform`/`opacity` keyframes, so the whole composition lives
 * on the compositor with no per-frame JavaScript. The only JS is one
 * IntersectionObserver that parks it when the hero scrolls away.
 *
 * If a real 3D render is produced later, drop it in as a `<video autoplay loop
 * muted playsInline>` inside `.hero-backdrop` and delete the coins — that is
 * precisely how the reference does it.
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
      <div className="hero-stage">
        {COINS.map((n) => (
          <span className={`hero-coin hero-coin-${n}`} key={n}>
            <i className="hero-coin-face" />
          </span>
        ))}
      </div>
    </div>
  );
}
