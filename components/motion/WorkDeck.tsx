"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, initGsap } from "@/lib/gsap";

/**
 * The case-study deck.
 *
 * Each card sticks a little lower than the one before it, so the previous card
 * stays visible as a ledge while the next slides up and covers it. GSAP adds
 * the depth: a covered card scales back and darkens across exactly the span in
 * which the next card climbs over it, which is the difference between a stack
 * and a pile of cards sliding past each other.
 *
 * The dim is `brightness`, not `opacity`. Fading a card fades its background
 * too, and the reader would see straight through it to the cards beneath.
 *
 * Below 900px the sticky behaviour is dropped in CSS and the cards just run
 * down the page — a phone viewport cannot hold a card and its ledge at once.
 */
export default function WorkDeck({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const slots = gsap.utils.toArray<HTMLElement>(".deck-slot", rootEl);

        slots.forEach((slot, i) => {
          const card = slot.querySelector<HTMLElement>(".deck-card");
          const next = slots[i + 1];
          if (!card) return;

          gsap.fromTo(
            card,
            { yPercent: 6, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: slot, start: "top bottom", end: "top 62%", scrub: 0.5 },
            },
          );

          if (!next) return;

          // The start filter is stated explicitly. Tweening to a filter from a
          // computed `none` makes GSAP read the missing brightness as 0, and
          // the card slams to black on the first frame before climbing back.
          gsap.fromTo(
            card,
            { scale: 1, filter: "brightness(1) saturate(1)" },
            {
              scale: 0.9,
              filter: "brightness(0.42) saturate(0.7)",
              ease: "none",
              scrollTrigger: {
                // The cover motion is exactly the span in which the *next*
                // slot travels from the bottom of the viewport to the top.
                trigger: next,
                start: "top bottom",
                end: "top top",
                scrub: 0.5,
              },
            },
          );
        });
      });
    }, rootEl);

    return () => ctx.revert();
  }, []);

  return (
    <div className="deck" ref={root}>
      {children}
    </div>
  );
}
