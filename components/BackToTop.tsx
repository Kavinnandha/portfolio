"use client";

import Magnetic from "./motion/Magnetic";
import { prefersReducedMotion } from "./motion/gsap";
import { useSmoothScroll } from "./motion/SmoothScroll";

export default function BackToTop() {
  const lenis = useSmoothScroll();

  const toTop = () => {
    // Hand the trip to Lenis when it owns the page, so the return uses the
    // same easing as every other scroll rather than jumping out of it.
    if (lenis && !prefersReducedMotion()) {
      lenis.scrollTo(0, { duration: 1.4 });
      return;
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <Magnetic strength={10}>
      <button type="button" className="btn btn-ghost" onClick={toTop}>
        Back to top ↑
      </button>
    </Magnetic>
  );
}
