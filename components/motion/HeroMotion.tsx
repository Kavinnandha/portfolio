"use client";

import { useEffect } from "react";
import { gsap, initGsap, prefersReduced, SplitText } from "@/lib/gsap";
import { BOOT_DONE } from "./Preloader";

/**
 * The hero's own timeline — kept out of `MotionRoot` because it is the one
 * piece of the page that does not start on scroll. It starts when the curtain
 * clears, and the two have to be sequenced or the title plays to a blank
 * screen and the reader arrives after it is over.
 *
 * Three parts:
 *   • the entrance — characters rise out of their masks while the whole
 *     headline's tracking tightens from loose to its final, very negative
 *     value. The tracking is what sells it: letters arriving *and* closing
 *     ranks reads as type setting itself, where a plain rise reads as a list
 *     of letters moving.
 *   • the exit — the two lines drift apart in opposite directions as the
 *     section scrolls away, so the headline comes apart rather than sliding
 *     off in one block.
 *   • the supporting copy, on its own gentler lift.
 */
export default function HeroMotion() {
  useEffect(() => {
    initGsap();

    const ctx = gsap.context(() => {
      const title = document.querySelector<HTMLElement>(".hero-title");
      if (!title) return;

      const support = ".hero-badge, .hero-lede, .hero-actions, .hero-meta, .hero-cue";

      if (prefersReduced()) {
        gsap.set([title, ...gsap.utils.toArray<HTMLElement>(support)], { opacity: 1, y: 0 });
        gsap.set(title, { letterSpacing: "-0.055em" });
        gsap.set(".hero-rule", { scaleX: 1 });
        return;
      }

      /* ── entrance ─────────────────────────────────────────────────── */

      const tl = gsap.timeline({ paused: true });

      SplitText.create(".hero-line", {
        type: "chars,words",
        mask: "chars",
        autoSplit: true,
        onSplit(self) {
          gsap.set(title, { opacity: 1 });
          // Nested in the parent timeline so a re-split (font load, resize)
          // swaps this tween out without restarting everything else.
          return tl.fromTo(
            self.chars,
            { yPercent: 118 },
            { yPercent: 0, duration: 1.3, stagger: 0.022, ease: "hop" },
            0.05,
          );
        },
      });

      tl.fromTo(
        title,
        { letterSpacing: "0.06em" },
        { letterSpacing: "-0.055em", duration: 1.9, ease: "hop" },
        0.05,
      )
        .fromTo(".hero-badge", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "hop" }, 0.4)
        .fromTo(".hero-lede", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1 }, 0.8)
        .fromTo(
          ".hero-actions > *",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          0.9,
        )
        .fromTo(
          ".hero-meta li",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 },
          1,
        )
        .fromTo(".hero-cue", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.25);

      if (document.documentElement.dataset.boot === "done") tl.play();
      else window.addEventListener(BOOT_DONE, () => tl.play(), { once: true });

      gsap.to(".hero-cue-dot", {
        y: 7,
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: "sine.inOut",
      });

      /* ── exit ─────────────────────────────────────────────────────── */

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const drift = gsap.timeline({
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
        });

        drift
          .to('.hero-line[data-line="0"]', { xPercent: -9, ease: "none" }, 0)
          .to('.hero-line[data-line="1"]', { xPercent: 7, ease: "none" }, 0)
          .to(".hero-title", { opacity: 0.06, ease: "none" }, 0)
          .to(".hero-support, .hero-badge", { y: -70, opacity: 0, ease: "none" }, 0)
          .to(".hero-cue", { opacity: 0, ease: "none" }, 0);
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
