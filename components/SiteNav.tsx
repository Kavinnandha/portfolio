"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import Magnetic from "./motion/Magnetic";
import { EASE_IN_OUT, EASE_OUT } from "./motion/easing";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#case", label: "Case study" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#record", label: "Record" },
];

export default function SiteNav() {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Hide on scroll down, reveal on scroll up — the reader gets the full
  // viewport while moving forward and the nav back the instant they reverse.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    if (open) return;
    setHidden(y > prev && y > 240);
  });

  // Scroll spy. `rootMargin` biases the trigger line to a third of the way
  // down, so the highlight matches the section the reader is actually reading.
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el != null,
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-33% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // The drawer owns the scroll while it is up.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
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
    <>
      <motion.nav
        className={`nav${scrolled ? " is-scrolled" : ""}`}
        initial={false}
        animate={{ y: hidden && !reduced ? "-100%" : "0%" }}
        transition={{ duration: reduced ? 0 : 0.45, ease: EASE_OUT }}
      >
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
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-drawer"
            className="nav-drawer"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.55, ease: EASE_IN_OUT }}
          >
            <motion.ul
              className="nav-drawer-list"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: 0.16 } },
              }}
            >
              {LINKS.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: reduced ? 0 : 24 },
                    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.5, ease: EASE_OUT } },
                  }}
                >
                  <a href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: reduced ? 0 : 24 },
                  show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.5, ease: EASE_OUT } },
                }}
              >
                <a href="#contact" onClick={() => setOpen(false)}>
                  Get in touch
                </a>
              </motion.li>
            </motion.ul>

            <div className="nav-drawer-foot">
              <a href="mailto:kavinnandhakavin@gmail.com">kavinnandhakavin@gmail.com</a>
              <a href="tel:+919345569707">+91 93455 69707</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
