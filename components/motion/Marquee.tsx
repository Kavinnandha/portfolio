"use client";

import { useRef } from "react";
import { ScrollTrigger, claim, gsap, prefersReducedMotion, useGSAP } from "./gsap";

/**
 * Declared at module scope, not inside the render. A component defined during
 * render is a brand-new type on every pass, so React unmounts and remounts the
 * whole list each time — which is exactly the subtree that must stay stable
 * for the loop to look seamless.
 */
function MarqueeList({ items, clone }: { items: string[]; clone?: boolean }) {
  return (
    <ul className="marquee-list" aria-hidden={clone || undefined}>
      {items.map((item) => (
        <li key={item} className="marquee-item">
          <span className="marquee-dot" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * An endless ticker of the stack that answers the scroll.
 *
 * The track holds the list twice and travels exactly -50%, so the seam lands
 * on an identical frame and the loop is invisible. Duration scales with item
 * count, which keeps pixels-per-second constant however long the list grows.
 *
 * What lifts it above a CSS keyframe is the coupling: scrolling down speeds
 * the strip up, scrolling up runs it backwards, and the type skews a few
 * degrees against the direction of travel before settling. The strip reads as
 * something with mass that the page is dragging, rather than a loop playing
 * next to the content.
 */
export default function Marquee({
  items,
  secondsPerItem = 2.6,
  reverse = false,
}: {
  items: string[];
  secondsPerItem?: number;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const duration = items.length * secondsPerItem;

  useGSAP(
    () => {
      const root = ref.current;
      const track = root?.querySelector<HTMLElement>(".marquee-track");
      if (!root || !track) return;
      claim(root);
      if (prefersReducedMotion()) return;

      const base = reverse ? -1 : 1;
      const loop = gsap
        .timeline({ repeat: -1 })
        .to(track, { xPercent: -50, duration, ease: "none" });

      /*
       * Park the playhead a hundred cycles in.
       *
       * An infinitely repeating timeline cannot run backwards past time zero —
       * it would simply stop. Starting deep inside the repeat stack means a
       * negative `timeScale` has hours of timeline behind it to travel
       * through, which is what makes the direction flip possible at all.
       */
      loop.totalTime(duration * 100);
      loop.timeScale(base);

      const words = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".marquee-item"));
      const toSkew = gsap.quickTo(words, "skewX", { duration: 0.5, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-7, 7);

      // Fired once scrolling stops, so the strip eases back to its own pace
      // instead of holding whatever speed the last gesture left it at.
      const settleBack = gsap.delayedCall(0.4, () => {
        gsap.to(loop, { timeScale: base, duration: 0.9, ease: "power2.out", overwrite: true });
        toSkew(0);
      });
      settleBack.pause();

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (!velocity) return;

          const direction = velocity > 0 ? base : -base;
          // Magnitude is capped: past ~4× the strip is a blur and the seam
          // starts to read.
          const speed = gsap.utils.clamp(1, 4, 1 + Math.abs(velocity) / 1400);

          gsap.to(loop, {
            timeScale: direction * speed,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
          });
          toSkew(clamp(-velocity / 260));
          settleBack.restart(true);
        },
      });

      return () => {
        settleBack.kill();
        trigger.kill();
        loop.kill();
      };
    },
    { scope: ref },
  );

  return (
    <div className="marquee" data-motion="marquee" ref={ref}>
      <div className="marquee-track">
        <MarqueeList items={items} />
        <MarqueeList items={items} clone />
      </div>
    </div>
  );
}
