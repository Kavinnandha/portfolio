"use client";

import { useLenis } from "lenis/react";
import Magnetic from "./motion/Magnetic";

export default function BackToTop() {
  const lenis = useLenis();

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Hand the scroll to Lenis when it owns the page, so the return trip uses
    // the same easing as every other scroll rather than jumping out of it.
    if (lenis && !reduced) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <Magnetic strength={7}>
      <button type="button" className="btn btn-quiet" onClick={toTop}>
        Back to top <span aria-hidden="true">↑</span>
      </button>
    </Magnetic>
  );
}
