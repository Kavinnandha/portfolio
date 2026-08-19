"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Inertial scrolling — the single thing that makes a page feel like Jeton or
 * Klarna rather than a document. Lenis drives the real window scroll position
 * (it does not transform a wrapper), so every `useScroll` in the tree stays
 * correct and anchor links still work.
 *
 * With `root` no wrapper element is rendered, so the server and client trees
 * are identical whichever branch runs — no hydration mismatch when the
 * reduced-motion check flips after mount.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        // Touch scrolling stays native: hijacking it costs more in feel than
        // it buys, and it breaks pull-to-refresh on Android.
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
