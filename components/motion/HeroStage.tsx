"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  EASE,
  SplitText,
  claim,
  gsap,
  hasFinePointer,
  prefersReducedMotion,
  settle,
  useGSAP,
} from "./gsap";
import { INTRO_DONE } from "./Intro";
import { MASK_LINE } from "./TextMask";

/** Ceiling on how long the hero will wait for the curtain before starting anyway. */
const CUE_TIMEOUT = 1800;

/**
 * The hero's choreography, in one timeline.
 *
 * Every element in the opening shot belongs to a single sequence rather than
 * to itself: the eyebrow, the three headline lines, the paragraph's own lines,
 * the buttons and the scroll cue all resolve on one clock, overlapping the way
 * a title sequence does. Six components each animating on mount would produce
 * six entrances that merely happen to start together — close, but visibly not
 * composed.
 *
 * The sequence is cued off the intro curtain, so it is already running as the
 * slats lift and the reader arrives mid-movement. If that cue never comes, a
 * timer starts it anyway; a hero that waits forever for an event is a blank
 * page.
 *
 * On scroll it does not simply leave. The composition drifts up at one rate
 * and the canvas behind it at another while both dissolve — the depth
 * separation is what makes the next section feel like it is arriving over the
 * hero rather than after it.
 */
export default function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      if (prefersReducedMotion()) {
        settle(root.querySelectorAll("[data-motion], [data-mask-line]"));
        settle(q(".hero-canvas, .hero-eyebrow, .hero-foot, .hero-actions .magnetic, .hero-dot"));
        claim(root);
        root.querySelectorAll("[data-motion]").forEach(claim);
        return;
      }

      const lede = q(".hero-lede")[0] as HTMLElement | undefined;

      // Flipped the moment the sequence starts, and read by `onSplit` below.
      let entered = false;

      /*
       * The paragraph is split into its own lines and masked the same way the
       * headline is, so body copy and display type enter as one family.
       *
       * Splitting by line means re-splitting whenever the text re-wraps —
       * `autoSplit` owns that, including the reflow when the web font finally
       * lands. A re-split before the entrance has to put the fresh lines back
       * into the resting pose; a re-split afterwards must not, or a reader who
       * rotates their phone mid-page would watch the paragraph vanish.
       */
      const split = lede
        ? SplitText.create(lede, {
            type: "lines",
            mask: "lines",
            linesClass: "hero-lede-line",
            autoSplit: true,
            onSplit: (self) => {
              if (!entered) gsap.set(self.lines, { yPercent: 110 });
            },
          })
        : null;

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE },
        onStart: () => {
          entered = true;
        },
      });

      tl.to(q(".hero-eyebrow"), { opacity: 1, y: 0, duration: 0.9 }, 0)
        // Both ends of the mask declared in one tween — see the note in
        // TextMask for why a separately-set skew is one GSAP cannot undo.
        .fromTo(
          q(`.hero-title ${MASK_LINE}`),
          { yPercent: 112, y: 0, skewY: 3 },
          { yPercent: 0, skewY: 0, duration: 1.25, stagger: 0.09 },
          0.08,
        )
        .to(q(".hero-canvas"), { opacity: 1, duration: 1.8, ease: "power2.out" }, 0.1)
        .to(split ? split.lines : [], { yPercent: 0, duration: 1, stagger: 0.07 }, 0.62)
        .to(q(".hero-actions .magnetic"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.8)
        .to(q(".hero-foot"), { opacity: 1, y: 0, duration: 0.8 }, 0.95)
        .to(q(".hero-eyebrow .hero-dot"), { scale: 1, duration: 0.5, ease: "back.out(2.4)" }, 0.5);

      // Cue: whichever arrives first, the curtain lifting or the deadline.
      let timer = 0;
      const start = () => {
        window.clearTimeout(timer);
        window.removeEventListener(INTRO_DONE, start);
        tl.play();
      };

      if (document.documentElement.getAttribute("data-intro") === "done") start();
      else {
        window.addEventListener(INTRO_DONE, start, { once: true });
        timer = window.setTimeout(start, CUE_TIMEOUT);
      }

      /*
       * The exit. `immediateRender: false` is load-bearing: a scrubbed `fromTo`
       * applies its start values the moment it is built, which would slam the
       * canvas back to the opacity it had before the entrance had run.
       */
      gsap
        .timeline({
          defaults: { ease: "none", immediateRender: false },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        })
        .fromTo(q(".hero-inner"), { yPercent: 0 }, { yPercent: -13, opacity: 0.12 }, 0)
        .fromTo(
          q(".hero-canvas"),
          { yPercent: 0, scale: 1 },
          { yPercent: 12, scale: 1.14, opacity: 0.2 },
          0,
        )
        .fromTo(q(".hero-foot"), { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0);

      // A few pixels of pointer lean. Separate transform channels from the
      // scroll exit (x/y here, yPercent there) so the two compose instead of
      // fighting over the same matrix component.
      let cleanupPointer: (() => void) | undefined;
      if (hasFinePointer()) {
        const inner = q(".hero-inner")[0] as HTMLElement;
        const xTo = gsap.quickTo(inner, "x", { duration: 1.1, ease: "power3.out" });
        const yTo = gsap.quickTo(inner, "y", { duration: 1.1, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          xTo(nx * -14);
          yTo(ny * -10);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanupPointer = () => window.removeEventListener("pointermove", onMove);
      }

      /*
       * Claimed last, and only on the way out of a successful build.
       *
       * The failsafe sweep in SmoothScroll leaves claimed subtrees alone, so
       * claiming at the top would mean a throw halfway through this function
       * left the hero hidden with nothing coming to rescue it. Claiming here
       * says the composition is actually wired up.
       */
      claim(root);
      root.querySelectorAll("[data-motion]").forEach(claim);

      return () => {
        window.clearTimeout(timer);
        window.removeEventListener(INTRO_DONE, start);
        cleanupPointer?.();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <section id="top" className="hero" data-motion="hero" ref={ref as React.Ref<HTMLElement>}>
      {children}
    </section>
  );
}
