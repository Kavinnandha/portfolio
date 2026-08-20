"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { gsap, initGsap, prefersReduced, ScrollTrigger } from "@/lib/gsap";
import { BOOT_DONE } from "./Preloader";

let instance: Lenis | null = null;

/**
 * The page's Lenis instance, or null when smooth scroll is off (reduced
 * motion, or before the provider has mounted).
 *
 * Deliberately not React state. Publishing it through `useState` would mean a
 * `setState` inside an effect and a second render of the whole tree for a
 * value nothing renders from — every consumer only ever touches it inside an
 * event handler or another effect.
 */
export const getLenis = () => instance;

/**
 * Smooth scroll, driven by GSAP's ticker.
 *
 * Lenis owns the scroll position and GSAP owns the clock: running Lenis on its
 * own rAF alongside ScrollTrigger's means two loops reading layout in an order
 * nobody controls, which shows up as pinned sections lagging a frame behind
 * the content scrolling past them.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    initGsap();
    if (prefersReduced()) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      // Touch devices already have momentum in hardware; overlaying ours makes
      // the page feel like it is skating.
      syncTouch: false,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /*
     * The preloader is a child, so its effect has already run and stamped the
     * boot state by the time this one does. Reading the flag here — rather
     * than having the preloader reach for an instance that does not exist yet
     * — is what keeps the two in the right order.
     */
    let release: (() => void) | undefined;
    if (document.documentElement.dataset.boot === "playing") {
      lenis.stop();
      release = () => lenis.start();
      window.addEventListener(BOOT_DONE, release, { once: true });
    }

    // In-page anchors have to go through Lenis, otherwise a nav click teleports
    // out of the smoothed scroll and every ScrollTrigger resolves at once.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      if (release) window.removeEventListener(BOOT_DONE, release);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  return <>{children}</>;
}
