"use client";

import { useEffect, useRef } from "react";
import { initGsap, prefersReduced, ScrollTrigger } from "@/lib/gsap";

/** Hairlines in the field. */
const LINES = 46;

/** Samples along each line. ~10px apart at 1440 — smooth without curve maths. */
const SEGMENTS = 132;

/** How far the pointer's influence reaches, as a fraction of the short side. */
const LENS_RADIUS = 0.42;

/**
 * The hero field.
 *
 * A band of horizontal hairlines carrying three layered waves. It is turbulent
 * at the top of the page and **settles into perfectly flat, evenly spaced
 * order as you scroll** — the headline says infrastructure that stays boring,
 * and the background is that sentence. The scroll is not decorating the type;
 * it is finishing it.
 *
 * Everything else serves that one idea:
 *   • an amplitude envelope, so the disturbance lives in the middle of the
 *     band and the outer lines are already calm — the eye reads a system with
 *     a centre, not a texture
 *   • a pointer lens that pushes lines apart locally, so the field answers to
 *     the reader before the scroll takes it away
 *   • gradient strokes, so lines dissolve at both edges instead of being
 *     chopped off by the viewport
 *
 * One canvas, one composited layer, no WebGL context to lose. Scroll feeds in
 * through a single ScrollTrigger writing to a plain object the loop reads, so
 * scrolling never costs a layout read per frame.
 */
export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initGsap();
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = prefersReduced();
    const css = getComputedStyle(document.documentElement);
    const ink = readRgb(css.getPropertyValue("--ink"), [18, 17, 16]);
    const accent = readRgb(css.getPropertyValue("--accent"), [232, 51, 15]);

    /* ── state the loop reads ─────────────────────────────────────────── */

    const view = { calm: 0, px: -1, py: -1, lens: 0, lensTarget: 0 };
    let width = 0;
    let height = 0;
    let inkStroke: CanvasGradient | null = null;
    let accentStroke: CanvasGradient | null = null;
    let raf = 0;
    let onScreen = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Past ~1.75 the extra pixels are invisible on a hairline and cost real
      // fill rate on a 3x phone.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Built once per resize and shared by every line: the stops only vary
      // along x, so one gradient serves all 46 strokes.
      inkStroke = edgeFade(ctx, width, ink);
      accentStroke = edgeFade(ctx, width, accent);
    };

    const draw = (time: number) => {
      const t = still ? 6 : time / 1000;
      ctx.clearRect(0, 0, width, height);

      // The lens eases in and out rather than snapping: a field that jumps to
      // full deflection on the first pointer sample reads as a glitch.
      view.lens += (view.lensTarget - view.lens) * 0.07;

      const calm = view.calm;
      const settle = Math.pow(1 - calm, 1.6);
      const band = height * 0.72;
      const top = height * 0.5 - band / 2;
      const gap = band / (LINES - 1);
      const lensR = Math.min(width, height) * LENS_RADIUS;

      for (let i = 0; i < LINES; i++) {
        const row = i / (LINES - 1);
        const baseY = top + row * band;

        // Disturbance peaks at the centre of the band and dies at its edges.
        const envelope = Math.pow(Math.sin(Math.PI * row), 1.35);
        const amp = gap * 3.4 * envelope * settle;

        // Every ninth line runs hot, so the field has a pulse rather than
        // being one flat grey texture.
        const hot = i % 9 === 4;
        ctx.strokeStyle = (hot ? accentStroke : inkStroke) as CanvasGradient;
        ctx.globalAlpha = hot ? 0.5 - calm * 0.32 : 0.34 - calm * 0.2;
        ctx.lineWidth = hot ? 1.15 : 1;

        ctx.beginPath();
        for (let s = 0; s < SEGMENTS; s++) {
          const u = s / (SEGMENTS - 1);
          const x = u * width;

          const wave =
            Math.sin(u * 6.1 + t * 0.34 + i * 0.21) * 0.56 +
            Math.sin(u * 3.0 - t * 0.23 + i * 0.11) * 0.29 +
            Math.sin(u * 11.6 + t * 0.47 + i * 0.38) * 0.15;

          let y = baseY + wave * amp;

          // The pointer pushes lines away from itself, hardest at its centre.
          if (view.lens > 0.001) {
            const dx = x - view.px;
            const dy = baseY - view.py;
            const falloff = Math.exp(-(dx * dx + dy * dy) / (lensR * lensR));
            y += Math.sign(dy || 1) * falloff * gap * 3.2 * view.lens;
          }

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      if (onScreen && !still) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (raf || still) return;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(0);
    start();

    /* ── inputs ───────────────────────────────────────────────────────── */

    const trigger = ScrollTrigger.create({
      trigger: canvas.closest("section") || canvas,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        view.calm = self.progress;
        if (still) draw(0);
      },
    });

    const onPointer = (event: PointerEvent) => {
      if (still) return;
      const rect = canvas.getBoundingClientRect();
      view.px = event.clientX - rect.left;
      view.py = event.clientY - rect.top;
      view.lensTarget = 1;
    };
    const onLeave = () => {
      view.lensTarget = 0;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const onResize = () => {
      resize();
      draw(0);
    };
    window.addEventListener("resize", onResize);

    // The hero is the top of a very long page. Once it is behind you the loop
    // is invisible work — same for a backgrounded tab.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      trigger.kill();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas className="hero-canvas" ref={ref} aria-hidden="true" />;
}

/** A stroke that dissolves at both edges instead of being cut by the viewport. */
function edgeFade(ctx: CanvasRenderingContext2D, width: number, rgb: number[]) {
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  const solid = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  const clear = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`;
  gradient.addColorStop(0, clear);
  gradient.addColorStop(0.14, solid);
  gradient.addColorStop(0.86, solid);
  gradient.addColorStop(1, clear);
  return gradient;
}

/** `#rrggbb` or `rgb(...)` from a custom property, with a fallback triple. */
function readRgb(value: string, fallback: [number, number, number]) {
  const raw = value.trim();
  if (raw.startsWith("#")) {
    const hex = raw.slice(1);
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const n = Number.parseInt(full, 16);
    if (Number.isNaN(n)) return fallback;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as [number, number, number];
  }
  const parts = raw.match(/\d+/g);
  if (parts && parts.length >= 3) {
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])] as [number, number, number];
  }
  return fallback;
}
