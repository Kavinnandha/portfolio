"use client";

import Lenis from "lenis";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { ScrollTrigger, gsap, prefersReducedMotion, settle } from "./gsap";

/*
 * The Lenis instance is an external system, not React state — it is created
 * once, imperatively, and outlives every render. Holding it in a tiny store
 * and reading it through `useSyncExternalStore` says exactly that, and avoids
 * the setState-inside-an-effect that a context provider would need.
 */
let instance: Lenis | null = null;
const listeners = new Set<() => void>();

function publish(next: Lenis | null) {
  instance = next;
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const getSnapshot = () => instance;
/** Nothing is smoothing on the server, and the value must be referentially stable. */
const getServerSnapshot = () => null;

/** The page's Lenis instance, or `null` when smoothing is off. */
export function useSmoothScroll() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Height of the sticky nav, so scrolled-to headings do not land underneath it. */
function navOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed + 18 : 82;
}

/**
 * Inertial scrolling, and the clock the whole site runs on.
 *
 * Lenis drives the real window scroll position rather than transforming a
 * wrapper, which is the reason `position: sticky` still works — the pinned
 * card deck and the sticky nav would both break inside a transformed ancestor,
 * so ScrollSmoother is deliberately not the tool here.
 *
 * The three lines that matter are the handshake:
 *
 *   - GSAP's ticker drives `lenis.raf`, so scrolling and every tween advance
 *     on the same frame instead of two loops racing each other,
 *   - `ScrollTrigger.update` runs on Lenis's scroll event, so triggers read
 *     the smoothed position rather than the raw one,
 *   - `autoRaf: false`, so Lenis never starts a second loop of its own.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useSmoothScroll();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenisInstance = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      // Touch scrolling stays native: hijacking it costs more in feel than it
      // buys, and it breaks pull-to-refresh on Android.
      syncTouch: false,
      autoRaf: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenisInstance.on("scroll", onScroll);

    const tick = (time: number) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(tick);

    publish(lenisInstance);

    return () => {
      gsap.ticker.remove(tick);
      lenisInstance.off("scroll", onScroll);
      lenisInstance.destroy();
      publish(null);
    };
  }, []);

  // Anchor navigation, handed to Lenis so the trip uses the site's easing
  // instead of dropping out of the smoothing for one jump. Delegated from the
  // document so a link added anywhere on the page is covered.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      // Keep the URL honest — deep links and the back button both depend on it.
      history.pushState(null, "", href);

      if (!lenis) {
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      lenis.scrollTo(target as HTMLElement, { offset: -navOffset(), duration: 1.25 });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  /*
   * Two measurement passes and a failsafe.
   *
   * Web fonts land after first paint and reflow every line of type, so every
   * trigger measured before that is measuring the fallback font's layout.
   * Images do the same to anything below them.
   *
   * The failsafe is the important half. Entrances ship pre-hidden in CSS so
   * the prerendered HTML cannot flash — which means a component that throws
   * during setup does not merely skip its animation, it leaves its content
   * invisible. Anything still hidden and unclaimed once the page has settled
   * is put back by hand.
   */
  useEffect(() => {
    let raf = 0;
    const refresh = () => ScrollTrigger.refresh();

    document.fonts?.ready.then(() => {
      raf = requestAnimationFrame(refresh);
    });
    window.addEventListener("load", refresh);

    const failsafe = window.setTimeout(() => {
      const stranded = document.querySelectorAll<HTMLElement>(
        "[data-motion]:not([data-motion-ready])",
      );
      stranded.forEach((el) => {
        settle(el);
        settle(el.querySelectorAll("*"));
      });
    }, 3200);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      window.clearTimeout(failsafe);
    };
  }, []);

  return <>{children}</>;
}
