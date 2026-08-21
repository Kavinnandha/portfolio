"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Magnetic from "./motion/Magnetic";
import { EASE_IN_OUT, EASE_OUT } from "./motion/easing";

const WORK_PANEL = [
  { title: "Moodle on k3s", sub: "1,000+ concurrent users, bare metal", tone: "" },
  { title: "Zero Trust edge", sub: "Tunnel, Tailscale, OpenWRT", tone: " is-ink" },
  { title: "HR Connect", sub: "Microservices, RBAC, Redis", tone: " is-soft" },
];

const TOOLKIT_PANEL = [
  "Containers & orchestration",
  "CI/CD & automation",
  "Cloud & edge",
  "Observability",
  "Networking",
  "Security & access",
];

const DRAWER_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#toolkit", label: "Capabilities" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#record", label: "Record" },
  { href: "#contact", label: "Let's talk" },
];

type MenuKey = "work" | "toolkit" | null;

export default function SiteNav() {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  const [condensed, setCondensed] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The brand mark is a wheel: it turns with the page, which is the cheapest
  // possible read on "you are moving" and costs one compositor property.
  const markRotate = useTransform(scrollY, (y) => (reduced ? 0 : y * 0.28));

  // Deferred to the next frame rather than run inline: a reload that restores
  // a mid-page scroll position fires no scroll event, so the initial state has
  // to be read once — just not synchronously inside the effect.
  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setCondensed(y > 90));
    const id = requestAnimationFrame(() => setCondensed(scrollY.get() > 90));
    return () => {
      unsub();
      cancelAnimationFrame(id);
    };
  }, [scrollY]);

  // A short close delay, so crossing the gap between a trigger and its panel
  // does not snap the panel shut under the pointer.
  const open = useCallback((key: Exclude<MenuKey, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(key);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  }, []);

  const openWork = useCallback(() => open("work"), [open]);
  const openToolkit = useCallback(() => open("toolkit"), [open]);
  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The drawer owns the scroll while it is up.
  useEffect(() => {
    if (drawer) lenis?.stop();
    else lenis?.start();
    document.body.classList.toggle("nav-locked", drawer);
    return () => {
      lenis?.start();
      document.body.classList.remove("nav-locked");
    };
  }, [drawer, lenis]);

  return (
    <>
      {/* The wrapper drops in once on load; the full-bleed-to-pill morph is
          pure CSS from `is-condensed`, so this entrance and that transition
          never touch the same property. */}
      <motion.div
        className={`nav-wrap${condensed ? " is-condensed" : ""}`}
        initial={reduced ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.9, ease: EASE_OUT, delay: 0.1 }}
      >
        <nav className={`nav${condensed ? " is-condensed" : ""}`} aria-label="Primary">
          <a className="nav-brand" href="#top" onClick={() => setDrawer(false)}>
            <motion.span className="nav-mark" style={{ rotate: markRotate }} aria-hidden="true" />
            Kavin Nandha
          </a>

          <div className="nav-links">
            <div
              className={`nav-item${menu === "work" ? " is-open" : ""}`}
              onMouseEnter={openWork}
              onMouseLeave={scheduleClose}
            >
              <a
                className="nav-link"
                href="#work"
                aria-expanded={menu === "work"}
                onFocus={openWork}
                onClick={closeMenu}
              >
                Work
                <span className="nav-caret" aria-hidden="true">
                  ▾
                </span>
              </a>
            </div>

            <div
              className={`nav-item${menu === "toolkit" ? " is-open" : ""}`}
              onMouseEnter={openToolkit}
              onMouseLeave={scheduleClose}
            >
              <a
                className="nav-link"
                href="#toolkit"
                aria-expanded={menu === "toolkit"}
                onFocus={openToolkit}
                onClick={closeMenu}
              >
                Capabilities
                <span className="nav-caret" aria-hidden="true">
                  ▾
                </span>
              </a>
            </div>

            <a className="nav-link" href="#pipeline">
              Pipeline
            </a>
            <a className="nav-link" href="#record">
              Record
            </a>
          </div>

          <div className="nav-actions">
            <a
              className="nav-ghost"
              href="https://github.com/kavinnandha"
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>
            <Magnetic strength={7}>
              <a className="nav-cta" href="#contact" onClick={() => setDrawer(false)}>
                Let&rsquo;s talk
                <span className="nav-cta-dot" aria-hidden="true" />
              </a>
            </Magnetic>
            <button
              type="button"
              className={`nav-toggle${drawer ? " is-open" : ""}`}
              aria-label={drawer ? "Close menu" : "Open menu"}
              aria-expanded={drawer}
              aria-controls="nav-drawer"
              onClick={() => setDrawer((v) => !v)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          <div
            className={`nav-panel nav-panel-work${menu === "work" ? " is-open" : ""}`}
            onMouseEnter={openWork}
            onMouseLeave={scheduleClose}
          >
            {WORK_PANEL.map((p) => (
              <a className="panel-card" href="#work" key={p.title} onClick={closeMenu}>
                <span className={`panel-dot${p.tone}`} aria-hidden="true" />
                <span className="panel-title">{p.title}</span>
                <span className="panel-sub">{p.sub}</span>
              </a>
            ))}
          </div>

          <div
            className={`nav-panel nav-panel-toolkit${menu === "toolkit" ? " is-open" : ""}`}
            onMouseEnter={openToolkit}
            onMouseLeave={scheduleClose}
          >
            {TOOLKIT_PANEL.map((label) => (
              <a className="panel-row" href="#toolkit" key={label} onClick={closeMenu}>
                <span className="panel-bullet" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </nav>
      </motion.div>

      {/* The canvas hides the link row below 960px and puts nothing in its
          place. This is that replacement, assembled from the same parts. */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            id="nav-drawer"
            className="nav-drawer"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.5, ease: EASE_IN_OUT }}
          >
            <ul className="nav-drawer-list">
              {DRAWER_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setDrawer(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-drawer-foot">
              <a href="mailto:kavinnandhakavin@gmail.com">kavinnandhakavin@gmail.com</a>
              <a href="tel:+919345569707">+91 93455 69707</a>
              <a href="https://github.com/kavinnandha" target="_blank" rel="noopener">
                github.com/kavinnandha
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
