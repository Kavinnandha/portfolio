"use client";

import { useEffect, useRef, useState } from "react";
import Magnetic from "./motion/Magnetic";
import { EASE, EASE_IO, ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from "./motion/gsap";
import { useSmoothScroll } from "./motion/SmoothScroll";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#case", label: "Case study" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#record", label: "Record" },
];

export default function SiteNav() {
  const ref = useRef<HTMLDivElement>(null);
  const drawerTl = useRef<gsap.core.Timeline | null>(null);
  const lenis = useSmoothScroll();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // The scroll handler needs to know whether the drawer is up, but it is built
  // once and never rebuilt — reading state through a ref keeps it current
  // without making the whole GSAP setup depend on a value that toggles.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useGSAP(
    () => {
      const root = ref.current;
      const nav = root?.querySelector<HTMLElement>(".nav");
      if (!root || !nav) return;

      /*
       * Hide on the way down, return on the way up.
       *
       * The reader gets the whole viewport while moving forward and the nav
       * back the instant they reverse — which is also the moment they are most
       * likely to be looking for it. Held down until 240px so the bar does not
       * flinch at the top of the page.
       */
      if (!prefersReducedMotion()) {
        const show = gsap.quickTo(nav, "yPercent", { duration: 0.45, ease: EASE });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            nav.classList.toggle("is-scrolled", self.scroll() > 8);
            if (openRef.current) return;
            show(self.direction === 1 && self.scroll() > 240 ? -100 : 0);
          },
        });
      }

      // Scroll spy. The trigger line sits a third of the way down the viewport
      // so the highlight matches the section being read, not the one whose
      // first pixel has appeared.
      LINKS.forEach(({ href }) => {
        const section = document.querySelector(href);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 33%",
          end: "bottom 33%",
          onToggle: (self) => {
            // Clearing on the way out matters as much as setting on the way
            // in: past the last tracked section — in the contact block, or the
            // footer — nothing should be highlighted, and without this the nav
            // keeps pointing at whatever the reader last passed through.
            setActive((current) => (self.isActive ? href : current === href ? "" : current));
          },
        });
      });

      // Built once and parked. Playing and reversing one timeline keeps the
      // drawer's exit as considered as its entrance — and, unlike unmounting
      // it, cannot strand a half-open panel if a frame is dropped.
      const items = root.querySelectorAll(".nav-drawer-list li");
      drawerTl.current = gsap
        .timeline({ paused: true })
        // A zero-duration set at the head of the timeline: playing it makes the
        // panel renderable, and reversing past it puts it back out of the
        // paint tree entirely rather than leaving a clipped full-screen layer
        // under the nav's backdrop blur.
        .set(root.querySelector(".nav-drawer"), { visibility: "visible", pointerEvents: "auto" })
        .to(root.querySelector(".nav-drawer"), {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
          ease: EASE_IO,
        })
        .to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: EASE }, 0.18)
        .to(
          root.querySelector(".nav-drawer-foot"),
          { opacity: 1, y: 0, duration: 0.5, ease: EASE },
          0.34,
        );
    },
    { scope: ref },
  );

  // The drawer owns the scroll while it is up.
  useEffect(() => {
    const tl = drawerTl.current;
    if (!tl) return;

    if (open) {
      lenis?.stop();
      tl.timeScale(1).play();
    } else {
      lenis?.start();
      // Out faster than in: an exit that takes as long as the entrance reads
      // as the interface hesitating.
      tl.timeScale(1.5).reverse();
    }
    document.body.classList.toggle("nav-locked", open);

    return () => {
      lenis?.start();
      document.body.classList.remove("nav-locked");
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={ref}>
      <nav className="nav">
        <a className="nav-brand" href="#top" onClick={() => setOpen(false)}>
          Kavin Nandha M K
        </a>

        <div className="nav-links">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? "is-active" : undefined}
              aria-current={active === l.href ? "true" : undefined}
            >
              {l.label}
              <span className="nav-underline" aria-hidden="true" />
            </a>
          ))}
        </div>

        <Magnetic className="nav-cta">
          <a className="btn btn-primary" href="#contact">
            Get in touch
          </a>
        </Magnetic>

        <button
          type="button"
          className={`nav-toggle${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      {/* Always in the tree, clipped shut. `inert` is what keeps a closed
          drawer out of the tab order and away from screen readers — a panel
          that is merely invisible is still focusable. */}
      <div id="nav-drawer" className="nav-drawer" inert={!open}>
        <ul className="nav-drawer-list">
          {[...LINKS, { href: "#contact", label: "Get in touch" }].map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-drawer-foot">
          <a href="mailto:kavinnandhakavin@gmail.com">kavinnandhakavin@gmail.com</a>
          <a href="tel:+919345569707">+91 93455 69707</a>
        </div>
      </div>
    </div>
  );
}
