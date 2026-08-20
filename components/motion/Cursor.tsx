"use client";

import { useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from "./gsap";

/** Anything the ring should react to, whether or not it opts in by hand. */
const INTERACTIVE = 'a, button, input, textarea, [data-cursor]';

/**
 * A two-part cursor: a hard accent square that tracks the pointer exactly, and
 * a hairline ring that trails it.
 *
 * The lag between the two is the whole effect. The square says where the
 * pointer is; the ring says where it has been, and how fast. On an
 * interactive element the ring swells and squares up around it, so hover
 * feedback arrives before the element itself has to light up.
 *
 * Mouse only. On touch there is nothing to track, and the native caret is left
 * alone entirely for anyone who prefers reduced motion.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const dot = root?.querySelector<HTMLElement>(".cursor-dot");
      const ring = root?.querySelector<HTMLElement>(".cursor-ring");
      if (!root || !dot || !ring) return;
      if (!hasFinePointer() || prefersReducedMotion()) return;

      document.body.classList.add("has-cursor");

      // Two speeds, one pointer. The dot is near-instant; the ring is given
      // enough duration to visibly fall behind on a fast move and catch up on
      // a slow one.
      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

      let visible = false;

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        if (!visible) {
          visible = true;
          // Placed before the fade, so the cursor appears where the pointer
          // already is instead of flying in from the last known position.
          gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
          gsap.to(root, { autoAlpha: 1, duration: 0.3 });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      let hovering = false;

      const onOver = (event: PointerEvent) => {
        const target = !!(event.target as Element | null)?.closest?.(INTERACTIVE);
        if (target === hovering) return;
        hovering = target;
        // The colour swap is a class, not a tween: the palette is written in
        // `color-mix` and custom properties, which GSAP cannot interpolate —
        // and CSS transitions the two endpoints perfectly well on its own.
        ring.classList.toggle("is-active", hovering);
        gsap.to(ring, { scale: hovering ? 2.1 : 1, duration: 0.4, ease: "power3.out" });
        gsap.to(dot, { scale: hovering ? 0.4 : 1, duration: 0.35, ease: "power3.out" });
      };

      // Press keeps whatever hover state is current and squeezes it, so
      // clicking a link does not drop the ring back to its resting size.
      const onDown = () =>
        gsap.to(ring, { scale: (hovering ? 2.1 : 1) * 0.8, duration: 0.2, ease: "power2.out" });
      const onUp = () =>
        gsap.to(ring, { scale: hovering ? 2.1 : 1, duration: 0.35, ease: "power3.out" });
      const onLeave = () => {
        visible = false;
        gsap.to(root, { autoAlpha: 0, duration: 0.25 });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      document.addEventListener("pointerleave", onLeave);

      return () => {
        document.body.classList.remove("has-cursor");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div className="cursor" aria-hidden="true" ref={ref}>
      <span className="cursor-ring" />
      <span className="cursor-dot" />
    </div>
  );
}
