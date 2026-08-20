"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import { claim, gsap, prefersReducedMotion, useGSAP } from "./gsap";

/**
 * Scroll-driven card deck.
 *
 * Each card pins at the top of the viewport a little lower than the one before
 * it, so the previous card stays visible as a thin ledge while the next slides
 * up and covers it. Covered cards ease back and dim, which is what sells the
 * depth — without it the cards merely slide past each other.
 *
 * One scrubbed timeline for the whole deck, driven by a single ScrollTrigger
 * on the container. Six cards each measuring their own scroll position would
 * be six sets of layout reads per frame for information that is identical.
 */
export function CardStack({
  children,
  total,
  className,
}: {
  children: ReactNode;
  total: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      claim(root);
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      /*
       * Desktop only, and that is a layout fact rather than a taste call:
       * below this width the slots are `position: static`, so nothing pins,
       * and a card taller than the viewport cannot read as covered because it
       * never sits still long enough to be covered.
       */
      mm.add("(min-width: 901px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".stack-card"));
        if (cards.length < 2) return;

        // `total` is the deck's declared length, and the scroll range is cut
        // from the container's own height — so the timeline is measured
        // against what the page was laid out for, not against however many
        // cards happen to be in the DOM at the moment it is built.
        const steps = Math.max(total, cards.length);

        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        });

        cards.forEach((card, i) => {
          // The last card is never covered by anything, so it must not recede.
          // It is the card the reader ends on.
          if (i === cards.length - 1) return;
          tl.to(card, { scale: 0.93, yPercent: -1.4 }, i);
          tl.to(card.querySelector(".stack-veil"), { opacity: 0.62 }, i);
        });

        // A held beat at the end, so the deck's scroll range covers the final
        // card's stay on screen instead of finishing one card early.
        tl.to({}, { duration: 1 }, steps - 1);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`stack ${className ?? ""}`.trim()} data-motion="stack">
      {children}
    </div>
  );
}

export function CardStackItem({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) {
  return (
    // Two elements on purpose. The outer slot owns the sticky pin and carries
    // `--i`, which sets how far down the ledge for this card sits; the inner
    // card owns the scale and the dim, so the pin stays put while the card
    // recedes from it.
    <div className="stack-slot" style={{ ["--i" as string]: index } as CSSProperties}>
      <article className={`stack-card ${className ?? ""}`.trim()}>
        {children}
        <span className="stack-veil" aria-hidden="true" />
      </article>
    </div>
  );
}
