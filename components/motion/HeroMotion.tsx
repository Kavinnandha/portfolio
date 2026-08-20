"use client";

import { useEffect } from "react";
import { gsap, initGsap, prefersReduced, SplitText } from "@/lib/gsap";
import { BOOT_DONE } from "./Preloader";

/**
 * The hero's own timeline — kept out of `MotionRoot` because it is the one
 * piece of the page that does not start on scroll. It starts when the curtain
 * clears, and the two have to be sequenced or the title plays to a black
 * screen and the reader arrives after it is over.
 *
 * Two halves:
 *   • the entrance, built paused and released by the `boot:done` event
 *   • the exit, a scrubbed lift-and-blur as the hero scrolls out from under
 *     the next section
 */
export default function HeroMotion() {
  useEffect(() => {
    initGsap();

    const ctx = gsap.context(() => {
      const title = document.querySelector<HTMLElement>(".hero-title");
      if (!title) return;

      /* ── entrance ─────────────────────────────────────────────────── */

      if (prefersReduced()) {
        gsap.set(".hero-title, .hero-badge, .hero-lede, .hero-actions, .hero-meta, .hero-cue", {
          opacity: 1,
          y: 0,
        });
      } else {
        const tl = gsap.timeline({ paused: true });

        SplitText.create(title, {
          type: "chars,words,lines",
          mask: "chars",
          autoSplit: true,
          onSplit(self) {
            gsap.set(title, { opacity: 1 });
            // Nested inside the parent timeline so a re-split (font load,
            // resize) replaces this tween without restarting the rest.
            return tl.fromTo(
              self.chars,
              { yPercent: 116 },
              { yPercent: 0, duration: 1.25, stagger: 0.026, ease: "hop" },
              0.05,
            );
          },
        });

        tl.fromTo(
          ".hero-badge",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9 },
          0,
        )
          .fromTo(
            ".hero-lede",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 1 },
            0.75,
          )
          .fromTo(
            ".hero-actions > *",
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
            0.85,
          )
          .fromTo(
            ".hero-meta li",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 },
            0.95,
          )
          .fromTo(".hero-cue", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.2);

        if (document.documentElement.dataset.boot === "done") tl.play();
        else window.addEventListener(BOOT_DONE, () => tl.play(), { once: true });

        // The cue keeps breathing after the entrance settles.
        gsap.to(".hero-cue-dot", {
          y: 7,
          repeat: -1,
          yoyo: true,
          duration: 1.3,
          ease: "sine.inOut",
        });
      }

      /* ── exit ─────────────────────────────────────────────────────── */

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-inner", {
          y: -90,
          opacity: 0,
          filter: "blur(9px)",
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            // Gone by two thirds, so the reader is not scrolling past a ghost.
            end: "65% top",
            scrub: 0.6,
          },
        });

        gsap.to(".hero-cue", {
          opacity: 0,
          y: 20,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "18% top", scrub: 0.4 },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
