"use client";

import { useEffect, useRef, useState } from "react";
import { EASE, EASE_IO, gsap, prefersReducedMotion, useGSAP } from "./gsap";
import { useSmoothScroll } from "./SmoothScroll";

/** Broadcast the instant the curtain starts lifting, for anything cueing off it. */
export const INTRO_DONE = "intro:done";

const SLATS = 5;

/**
 * The curtain that opens the site.
 *
 * An accent field with the name struck across it and a rule drawing
 * underneath, which then breaks into vertical slats and lifts off the top of
 * the page in a stagger — the panels leave in sequence, so the hero is
 * uncovered in strips rather than by one sheet sliding away.
 *
 * Deliberately brief, and deliberately overlapping. The hero's own entrance
 * starts *underneath* the curtain, so by the time the slats clear the reader
 * is watching a composition already in motion rather than a page waiting to
 * begin. Anything past roughly a second and a half of dead time reads as
 * latency and costs real LCP.
 *
 * It is removed from the tree once it finishes so it can never trap a click,
 * and the `<noscript>` rule in the layout hides it outright — without
 * JavaScript it would otherwise sit over the page forever.
 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const lenis = useSmoothScroll();

  // The curtain holds the scroll still while it is up. A wheel gesture during
  // the opening would otherwise scroll a page the reader cannot see yet, and
  // they would arrive somewhere in the middle of it.
  useEffect(() => {
    if (done) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [done, lenis]);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const finish = () => {
        window.dispatchEvent(new Event(INTRO_DONE));
        document.documentElement.setAttribute("data-intro", "done");
      };

      if (prefersReducedMotion()) {
        finish();
        setDone(true);
        return;
      }

      // Covers the frames before `lenis.stop()` above takes hold — see globals.css.
      document.body.classList.add("intro-locked");

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove("intro-locked");
          setDone(true);
        },
      });

      tl.fromTo(
        root.querySelectorAll("[data-intro-line]"),
        { yPercent: 112, y: 0, skewY: 3 },
        { yPercent: 0, skewY: 0, duration: 0.85, ease: EASE, stagger: 0.06 },
      )
        .to(
          root.querySelector(".intro-rule"),
          { scaleX: 1, duration: 0.7, ease: EASE_IO },
          0.15,
        )
        .to(
          root.querySelector(".intro-inner"),
          { yPercent: -110, opacity: 0, duration: 0.55, ease: EASE_IO },
          0.72,
        )
        .to(
          root.querySelectorAll(".intro-slat"),
          {
            yPercent: -100,
            duration: 0.8,
            ease: EASE_IO,
            stagger: 0.06,
            // Fired here rather than in `onComplete`: the page underneath is
            // already visible through the first lifted slat, so the hero
            // should be moving before the last one clears.
            onStart: finish,
          },
          0.84,
        );
    },
    { scope: ref },
  );

  // Rendered unconditionally on the server. The reduced-motion branch above
  // dismisses it in a layout effect, which runs before paint, so a reader who
  // asked for no motion never sees a frame of it — and the server and client
  // trees still agree on the first pass.
  if (done) return null;

  return (
    <div className="intro" aria-hidden="true" ref={ref}>
      <div className="intro-slats">
        {Array.from({ length: SLATS }, (_, i) => (
          <span className="intro-slat" key={i} />
        ))}
      </div>

      <div className="intro-inner">
        <span className="intro-mark">
          <span className="mask-line">
            <span data-intro-line="">Kavin Nandha M K</span>
          </span>
          <span className="mask-line intro-sub">
            <span data-intro-line="">Cloud / DevOps engineer</span>
          </span>
        </span>
        <span className="intro-rule" />
      </div>
    </div>
  );
}
