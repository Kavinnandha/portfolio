"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap, prefersReduced, ScrollTrigger } from "@/lib/gsap";

export type Chip = { label: string; hot?: boolean };

/**
 * The technology ticker.
 *
 * Two identical rows sit side by side and the track is translated by exactly
 * one row's width before wrapping, which is what makes the loop seamless — an
 * approximate distance shows up as a visible stutter once a second.
 *
 * Scrolling bends it: the wrap tween's `timeScale` picks up the page's scroll
 * velocity and the whole track skews slightly in the direction of travel, then
 * eases back to its resting speed. It is the cheapest way to make a page feel
 * like it has mass.
 */
export default function Marquee({ items, reverse = false }: { items: Chip[]; reverse?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    const trackEl = track.current;
    if (!rootEl || !trackEl) return;
    if (prefersReduced()) return;

    const ctx = gsap.context(() => {
      const row = trackEl.querySelector<HTMLElement>(".marquee-row");
      if (!row) return;

      const direction = reverse ? 1 : -1;
      let loop: gsap.core.Tween | null = null;

      const build = () => {
        loop?.kill();
        const distance = row.offsetWidth;
        if (!distance) return;
        gsap.set(trackEl, { x: reverse ? -distance : 0 });
        loop = gsap.to(trackEl, {
          x: `+=${direction * distance}`,
          duration: distance / 46, // constant pixels-per-second at any width
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (raw) => `${gsap.utils.wrap(-distance, 0, parseFloat(raw))}px`,
          },
        });
      };

      build();
      const onResize = () => build();
      window.addEventListener("resize", onResize);

      const skew = gsap.quickTo(trackEl, "skewX", { duration: 0.7, ease: "power3.out" });
      let settle: number | undefined;

      const velocityTrigger = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-2200, 2200, self.getVelocity());
          if (loop) loop.timeScale(1 + Math.abs(v) / 900);
          skew(gsap.utils.clamp(-7, 7, (-v / 340) * direction));
          window.clearTimeout(settle);
          settle = window.setTimeout(() => {
            loop?.timeScale(1);
            skew(0);
          }, 160);
        },
      });

      return () => {
        window.clearTimeout(settle);
        window.removeEventListener("resize", onResize);
        velocityTrigger.kill();
        loop?.kill();
      };
    }, rootEl);

    return () => ctx.revert();
  }, [reverse]);

  const row = (
    <div className="marquee-row" aria-hidden="true">
      {items.map((item) => (
        <span className={`chip${item.hot ? " is-hot" : ""}`} key={item.label}>
          <span className="chip-dot" />
          {item.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" ref={root}>
      {/* One accessible copy of the list; the visible rows are decoration. */}
      <p className="visually-hidden">{items.map((item) => item.label).join(", ")}</p>
      <div className="marquee-track" ref={track}>
        {row}
        {row}
      </div>
    </div>
  );
}
