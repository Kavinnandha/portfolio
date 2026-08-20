"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap, prefersReduced } from "@/lib/gsap";

/**
 * A two-part cursor: a hard dot that tracks the pointer almost exactly, and a
 * ring that lags behind it. The lag is the whole effect — a ring locked to the
 * dot reads as one fat cursor, while a ring a few frames behind reads as
 * weight.
 *
 * Anything with `data-cursor` swells the ring on hover; `data-cursor="text"`
 * writes that element's `data-cursor-label` into the middle of it.
 *
 * Only mounted for fine pointers. On touch there is no cursor to replace, and
 * the real one is never hidden — `body` keeps its native cursor so a dropped
 * frame or a JS error can never leave the reader without one.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGsap();
    if (prefersReduced()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    const label = ringEl.querySelector<HTMLElement>(".cursor-label");
    document.body.classList.add("has-cursor");

    const ctx = gsap.context(() => {
      const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3.out" });
      const ringY = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3.out" });

      let awake = false;
      const move = (event: PointerEvent) => {
        if (!awake) {
          awake = true;
          gsap.to([dotEl, ringEl], { autoAlpha: 1, duration: 0.3 });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const over = (event: PointerEvent) => {
        const target = (event.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-cursor]");
        if (!target) return;
        const text = target.dataset.cursorLabel || "";
        if (label) label.textContent = text;
        // The labelled size is a class, not a scale: the box grows in CSS and
        // the text is laid out at its real size instead of being stretched.
        ringEl.classList.toggle("has-label", Boolean(text));
        gsap.to(ringEl, { scale: text ? 1 : 1.9, duration: 0.45, ease: "hop" });
        gsap.to(dotEl, { scale: 0.2, duration: 0.45, ease: "hop" });
      };

      const out = (event: PointerEvent) => {
        if (!(event.target as HTMLElement | null)?.closest?.("[data-cursor]")) return;
        if (label) label.textContent = "";
        ringEl.classList.remove("has-label");
        gsap.to(ringEl, { scale: 1, duration: 0.45, ease: "hop" });
        gsap.to(dotEl, { scale: 1, duration: 0.45, ease: "hop" });
      };

      const leaveWindow = () => gsap.to([dotEl, ringEl], { autoAlpha: 0, duration: 0.25 });

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over);
      document.addEventListener("pointerout", out);
      document.addEventListener("pointerleave", leaveWindow);

      return () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.removeEventListener("pointerout", out);
        document.removeEventListener("pointerleave", leaveWindow);
      };
    });

    return () => {
      ctx.revert();
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring}>
        <span className="cursor-label" />
      </div>
    </div>
  );
}
