"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from "./gsap";

/**
 * Magnetic pull toward the cursor.
 *
 * `quickTo` rather than a tween per `mousemove`: it reuses one tween instance
 * and only overwrites its end value, so a fast drag across a row of buttons
 * costs a handful of property writes instead of a new tween sixty times a
 * second. The easing is what makes it feel weighted — the control chases the
 * pointer and settles rather than tracking it rigidly.
 *
 * Gated on a real hover-capable pointer: on touch, `mousemove` fires once on
 * tap and would leave the control permanently offset. Vertical travel is
 * damped to 60% of horizontal, which keeps rows of buttons on their baseline.
 */
export default function Magnetic({
  children,
  strength = 16,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!hasFinePointer() || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (event.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (event.clientY - (r.top + r.height / 2)) / (r.height / 2);
        xTo(dx * strength);
        yTo(dy * strength * 0.6);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`magnetic ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
}
