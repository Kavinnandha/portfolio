"use client";

import { useEffect } from "react";
import { gsap, initGsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/**
 * The site's animation engine.
 *
 * Everything scroll-driven is declared in markup as a `data-*` attribute and
 * wired up here, once, after the tree is in the DOM. That keeps `page.tsx` a
 * server component — no client boundary around content just so a heading can
 * fade in — and it puts the whole motion vocabulary in one readable file
 * instead of a dozen wrapper components.
 *
 * The vocabulary:
 *
 *   data-split="lines|words|chars"  masked type reveal, split on the client
 *   data-anim="rise|fade|clip|scale|blur"   entrance for a single element
 *   data-stagger                    container whose [data-item] children cascade
 *   data-parallax="-0.2"            scrubbed drift, in fractions of the element
 *   data-count="1000"               number that counts up when it arrives
 *   data-magnetic                   control that leans toward the pointer
 *   data-tilt                       card that tips away from the pointer
 *   data-glow                       surface with a pointer-tracking highlight
 *   data-rule                       hairline that draws itself left to right
 *
 * Anything with `data-delay` waits that many seconds after its own trigger.
 */
export default function MotionRoot() {
  useEffect(() => {
    initGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ── reduced motion: state, not movement ──────────────────────────── */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-anim], [data-split], [data-item], [data-rule]", {
          opacity: 1,
          y: 0,
          scaleX: 1,
          clearProps: "filter,clipPath",
        });
        countUp(true);
      });

      /* ── the real thing ───────────────────────────────────────────────── */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        splitType();
        entrances();
        staggers();
        parallax();
        countUp(false);
        rules();
      });

      /* Pointer behaviour is not motion-sensitive in the same way — a magnet
         that does not move is simply a normal button — but the fine-pointer
         gate matters, because none of it can be reached by touch. */
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const kills = [magnets(), tilts(), glows()];
        return () => kills.forEach((kill) => kill());
      });
    });

    // Web fonts change every line box, and every pin start/end measured before
    // they land was measured against fallback metrics.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return null;
}

/* ══════════════════════════════════════════════════════════════════════════
   Type
   ══════════════════════════════════════════════════════════════════════════ */

function splitType() {
  gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
    const type = el.dataset.split || "lines";
    const delay = Number(el.dataset.delay || 0);
    const immediate = el.hasAttribute("data-split-now");

    SplitText.create(el, {
      type: type === "chars" ? "chars,words,lines" : type === "words" ? "words,lines" : "lines",
      mask: type === "chars" ? "chars" : type === "words" ? "words" : "lines",
      // Re-splits itself when the font lands or the line boxes change width.
      autoSplit: true,
      linesClass: "split-line",
      // Screen readers get the untouched string; the per-glyph spans are
      // decoration and would otherwise be announced one letter at a time.
      aria: "hidden",
      onSplit(self) {
        const parts = type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
        gsap.set(el, { opacity: 1 });

        return gsap.fromTo(
          parts,
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: type === "chars" ? 0.9 : 1.15,
            stagger: type === "chars" ? 0.018 : type === "words" ? 0.035 : 0.09,
            delay,
            ease: "hop",
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          },
        );
      },
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   Entrances
   ══════════════════════════════════════════════════════════════════════════ */

const FROM: Record<string, gsap.TweenVars> = {
  rise: { opacity: 0, y: 44 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.94 },
  blur: { opacity: 0, filter: "blur(14px)", y: 20 },
  clip: { opacity: 1, clipPath: "inset(0% 0% 100% 0%)", scale: 1.06 },
};

const TO: Record<string, gsap.TweenVars> = {
  rise: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  scale: { opacity: 1, scale: 1 },
  blur: { opacity: 1, filter: "blur(0px)", y: 0 },
  clip: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
};

function entrances() {
  gsap.utils.toArray<HTMLElement>("[data-anim]").forEach((el) => {
    const kind = el.dataset.anim || "rise";
    if (!FROM[kind]) return;

    gsap.fromTo(el, FROM[kind], {
      ...TO[kind],
      duration: kind === "clip" ? 1.5 : 1.1,
      delay: Number(el.dataset.delay || 0),
      ease: "hop",
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
    });
  });
}

function staggers() {
  gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>("[data-item]");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 38 },
      {
        opacity: 1,
        y: 0,
        duration: 1.05,
        ease: "hop",
        stagger: Number(group.dataset.stagger || 0.08),
        scrollTrigger: { trigger: group, start: "top 84%", once: true },
      },
    );
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   Scrubbed motion
   ══════════════════════════════════════════════════════════════════════════ */

function parallax() {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax || -0.15);
    gsap.fromTo(
      el,
      { yPercent: -amount * 50 },
      {
        yPercent: amount * 50,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

/** Hairlines that draw themselves as their section arrives. */
function rules() {
  gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.6,
        ease: "hop",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   Counters
   ══════════════════════════════════════════════════════════════════════════ */

function countUp(instant: boolean) {
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    const to = Number(el.dataset.count || 0);
    const group = el.hasAttribute("data-count-group");
    const suffix = el.dataset.countSuffix || "";
    const write = (value: number) => {
      const n = Math.round(value);
      el.textContent = (group ? n.toLocaleString("en-US") : String(n)) + suffix;
    };

    if (instant) {
      write(to);
      return;
    }

    write(0);
    const box = { v: 0 };
    gsap.to(box, {
      v: to,
      duration: 2.1,
      ease: "power2.out",
      onUpdate: () => write(box.v),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   Pointer behaviour
   ══════════════════════════════════════════════════════════════════════════ */

/** Controls that lean a few pixels toward the cursor and snap back on exit. */
function magnets() {
  const cleanups: Array<() => void> = [];

  gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.3);
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((event.clientX - (r.left + r.width / 2)) * strength);
      y((event.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { x: 0, y: 0 });
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/** Cards that tip away from the pointer, on a very shallow perspective. */
function tilts() {
  const cleanups: Array<() => void> = [];

  gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
    const max = Number(el.dataset.tilt || 5);
    // `rotationX` / `rotationY`, not the `rotateX` / `rotateY` aliases:
    // quickTo resolves the property name once, up front, and does not run it
    // through CSSPlugin's alias table, so an alias silently animates nothing.
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      rx(((event.clientY - r.top) / r.height - 0.5) * -2 * max);
      ry(((event.clientX - r.left) / r.width - 0.5) * 2 * max);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };

    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * A soft highlight that follows the pointer across a surface. The position is
 * published as custom properties and the gradient itself lives in CSS, so the
 * paint stays where the rest of the look is defined.
 */
function glows() {
  const cleanups: Array<() => void> = [];

  gsap.utils.toArray<HTMLElement>("[data-glow]").forEach((el) => {
    const setX = gsap.quickSetter(el, "--gx", "%");
    const setY = gsap.quickSetter(el, "--gy", "%");
    const setO = gsap.quickTo(el, "--go", { duration: 0.4 });

    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setX(((event.clientX - r.left) / r.width) * 100);
      setY(((event.clientY - r.top) / r.height) * 100);
    };
    const enter = () => setO(1);
    const leave = () => setO(0);

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
