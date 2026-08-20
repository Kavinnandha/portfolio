"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, initGsap, prefersReduced, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "./motion/SmoothScroll";

const LINKS = [
  { href: "#work", label: "Work", index: "01" },
  { href: "#pipeline", label: "Pipeline", index: "02" },
  { href: "#toolkit", label: "Toolkit", index: "03" },
  { href: "#record", label: "Record", index: "04" },
  { href: "#contact", label: "Contact", index: "05" },
];

const DIRECT = [
  { href: "mailto:kavinnandhakavin@gmail.com", label: "kavinnandhakavin@gmail.com" },
  { href: "tel:+919345569707", label: "+91 93455 69707" },
  { href: "https://github.com/kavinnandha", label: "github.com/kavinnandha" },
  { href: "https://linkedin.com/in/kavinnandha", label: "linkedin.com/in/kavinnandha" },
];

/**
 * The bar and the overlay menu.
 *
 * Two scroll behaviours, both off one ScrollTrigger: the bar condenses into a
 * floating pill once the hero is behind you, and it retracts while you scroll
 * down and returns the moment you scroll up. Retracting on direction rather
 * than on position is what keeps a fixed bar from eating the top of a pinned
 * section for the whole time you are reading it.
 *
 * The menu is animated imperatively rather than by class, because the links
 * have to cascade in and cascade back out — a CSS transition can do the first
 * half of that and not the second.
 */
export default function SiteNav() {
  const wrap = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  /* ── scroll behaviour ─────────────────────────────────────────────── */
  useEffect(() => {
    initGsap();
    const el = wrap.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mark = el.querySelector<HTMLElement>(".nav-mark");
      const show = gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "hop" });

      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          el.classList.toggle("is-solid", y > 80);
          // Never retract while the menu is up, and never at the very top.
          const hide = self.direction === 1 && y > 320 && !el.classList.contains("is-locked");
          show(hide ? -140 : 0);
          if (mark) gsap.set(mark, { rotate: y * 0.22 });
        },
      });

      return () => trigger.kill();
    }, el);

    return () => ctx.revert();
  }, []);

  /* ── the overlay ──────────────────────────────────────────────────── */
  useEffect(() => {
    const el = overlay.current;
    const bar = wrap.current;
    if (!el) return;

    bar?.classList.toggle("is-locked", open);
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.classList.toggle("menu-open", open);

    if (prefersReduced()) {
      gsap.set(el, { autoAlpha: open ? 1 : 0 });
      gsap.set(".menu-line, .menu-direct li", { opacity: 1, yPercent: 0 });
      return;
    }

    const tl = gsap.timeline();
    if (open) {
      tl.set(el, { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" })
        .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "swing" })
        .fromTo(
          ".menu-line",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.85, stagger: 0.06, ease: "hop" },
          0.28,
        )
        .fromTo(
          ".menu-direct li",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 },
          0.5,
        );
    } else {
      tl.to(".menu-line", { yPercent: -115, duration: 0.4, stagger: 0.03, ease: "hop" })
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "swing" }, 0.1)
        .set(el, { autoAlpha: 0 });
    }

    return () => {
      tl.kill();
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, []);

  return (
    <>
      <div className="nav-wrap" ref={wrap}>
        <nav className="nav" aria-label="Primary">
          <a className="nav-brand" href="#top" data-cursor onClick={() => setOpen(false)}>
            <span className="nav-mark" aria-hidden="true" />
            <span className="nav-brand-text">
              Kavin Nandha
              <span className="nav-brand-sub">Cloud / DevOps</span>
            </span>
          </a>

          <ul className="nav-links">
            {LINKS.slice(0, 4).map((link) => (
              <li key={link.href}>
                <a className="nav-link" href={link.href}>
                  <span className="nav-link-index">{link.index}</span>
                  <span className="nav-link-text" data-text={link.label}>
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <span className="nav-status">
              <span className="nav-status-dot" aria-hidden="true" />
              Available
            </span>
            <a
              className="nav-cta"
              href="#contact"
              data-magnetic="0.25"
              data-cursor
              onClick={() => setOpen(false)}
            >
              Let&rsquo;s talk
            </a>
            <button
              type="button"
              className={`nav-burger${open ? " is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>

      <div className="menu" id="site-menu" ref={overlay} aria-hidden={!open} inert={!open}>
        <ul className="menu-list">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} data-cursor>
                <span className="menu-mask">
                  <span className="menu-line">
                    <span className="menu-index">{link.index}</span>
                    {link.label}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <ul className="menu-direct">
          {DIRECT.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
