"use client";

import { useEffect, useRef } from "react";

/**
 * One motion island for the whole page: the scroll-progress bar, the
 * on-scroll section reveals, and the magnetic pull on buttons and cards.
 * The page itself stays server-rendered — this wires the markup after
 * hydration, exactly the way the design canvas did.
 */
export default function SiteMotion() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const el = progressRef.current;
      if (!el) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      el.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const timers: ReturnType<typeof setTimeout>[] = [];
    let io: IntersectionObserver | undefined;

    if (reduced) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-visible");
            io?.unobserve(e.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
      );

      reveals.forEach((el, i) => {
        el.style.transitionDelay = Math.min(i * 40, 160) + "ms";
        io?.observe(el);
        // Safety net: never leave a section invisible if the observer
        // never fires (bfcache restores, zoomed-out viewports).
        timers.push(setTimeout(() => el.classList.add("is-visible"), 3000 + i * 60));
      });
    }

    const magnets: { el: HTMLElement; move: (ev: MouseEvent) => void; leave: () => void }[] = [];
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!reduced && canHover) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const strength = el.tagName === "ARTICLE" ? 10 : 5;
        const move = (ev: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (ev.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (ev.clientY - (r.top + r.height / 2)) / (r.height / 2);
          el.style.transform =
            "translate(" + (dx * strength).toFixed(2) + "px," + (dy * strength * 0.6).toFixed(2) + "px)";
        };
        const leave = () => {
          el.style.transform = "none";
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        magnets.push({ el, move, leave });
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      timers.forEach(clearTimeout);
      magnets.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div className="progress-track">
      <div ref={progressRef} className="progress-bar" />
    </div>
  );
}
