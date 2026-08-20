"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** The four slow-drifting colour fields the discs travel over. */
const BLOBS = [
  { x: 0.18, y: 0.3, r: 0.42, tone: "accent", a: 0.4, sx: 0.11, sy: 0.07, px: 0.16, py: 0.2 },
  { x: 0.78, y: 0.24, r: 0.34, tone: "accent", a: 0.22, sx: -0.08, sy: 0.1, px: 0.2, py: 0.14 },
  { x: 0.62, y: 0.76, r: 0.46, tone: "ink", a: 0.14, sx: 0.06, sy: -0.09, px: 0.18, py: 0.16 },
  { x: 0.34, y: 0.84, r: 0.3, tone: "accent", a: 0.16, sx: -0.12, sy: -0.06, px: 0.14, py: 0.12 },
] as const;

/** Discs on the ribbon. Enough to read as a continuous band, few enough to
    stay cheap on a phone. */
const COUNT = 26;

type Disc = { x: number; y: number; depth: number; spin: number; fade: number; i: number };

/**
 * The ambient loop behind the hero: soft colour fields with a ribbon of coins
 * tumbling across them, drawn on one canvas.
 *
 * Each disc is a circle squashed into an ellipse by its own rotation — the
 * same way a physical coin flattens as it turns edge-on — and the band is
 * depth-sorted every frame so the near discs occlude the far ones. That sort
 * is the whole trick: without it the ribbon reads as a flat row of ovals.
 *
 * Painting rather than animating DOM keeps the cost to a single composited
 * layer no matter how many discs are on the band, and lets the colours come
 * straight off the design tokens instead of being duplicated in CSS.
 */
export default function HeroBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const cs = getComputedStyle(document.body);
    const accent = cs.getPropertyValue("--color-accent").trim() || "#ec3013";
    const ink = cs.getPropertyValue("--color-text").trim() || "#201e1d";
    const still = !!reduced;

    let w = 0;
    let h = 0;
    let raf = 0;
    let onScreen = true;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      // Capped: past ~1.6 the extra pixels are invisible on a soft gradient
      // and cost real fill rate on a 3x phone.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      w = r.width;
      h = r.height;
      cv.width = Math.max(1, Math.round(w * dpr));
      cv.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rgba = (c: string, alpha: number) => {
      const m = c.replace("#", "");
      const v = m.length === 3 ? m.split("").map((x) => x + x).join("") : m;
      const n = parseInt(v, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
    };

    const ribbon = (t: number): Disc[] => {
      const discs: Disc[] = [];
      for (let i = 0; i < COUNT; i++) {
        const u = i / (COUNT - 1);
        const flow = still ? 0.18 : t * 0.075;
        const s = (u + flow) % 1;
        const ang = s * Math.PI * 2;
        const x = (-0.14 + s * 1.28) * w;
        const y = h * (0.52 + Math.sin(ang * 1.15 + 0.4) * 0.2 + Math.sin(ang * 2.3) * 0.045);
        const depth = 0.62 + Math.cos(ang * 1.15 + 0.4) * 0.38;
        const spin = ang * 2.15 + i * 0.22 + (still ? 0.7 : t * 0.85);
        // Fade the two ends of the band so discs are not seen popping in.
        const edgeIn = Math.min(1, s / 0.09);
        const edgeOut = Math.min(1, (1 - s) / 0.09);
        discs.push({ x, y, depth, spin, fade: Math.min(edgeIn, edgeOut), i });
      }
      return discs.sort((a, b) => a.depth - b.depth);
    };

    const drawDisc = (d: Disc, base: number) => {
      const r = base * (0.055 + d.depth * 0.055);
      const ry = r;
      // The horizontal radius collapses as the coin turns; the floor keeps it
      // a sliver rather than a zero-width nothing at exactly edge-on.
      const rx = Math.max(r * 0.045, Math.abs(Math.cos(d.spin)) * r);
      const tilt = -0.32 + Math.sin(d.spin * 0.5) * 0.16;
      const facing = Math.abs(Math.cos(d.spin));
      const isAccent = d.i % 3 === 0;
      const body = isAccent ? accent : d.i % 3 === 1 ? ink : "#ffffff";
      const alpha = (0.2 + d.depth * 0.68) * d.fade;

      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(tilt);

      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      const g = ctx.createLinearGradient(-rx, -ry, rx, ry);
      g.addColorStop(0, rgba(body, alpha * (isAccent ? 1 : 0.92)));
      g.addColorStop(0.52, rgba(body, alpha * (isAccent ? 0.78 : 0.6)));
      g.addColorStop(1, rgba(body, alpha * (isAccent ? 0.95 : 0.85)));
      ctx.fillStyle = g;
      ctx.fill();

      ctx.lineWidth = Math.max(1, r * 0.055);
      ctx.strokeStyle = rgba(isAccent ? "#ffffff" : ink, alpha * 0.32);
      ctx.stroke();

      // The inner ring only exists on a coin turned far enough toward you to
      // show its face.
      if (facing > 0.34) {
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.52, ry * 0.52, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(
          isAccent ? "#ffffff" : d.i % 3 === 1 ? "#ffffff" : accent,
          alpha * 0.34 * facing,
        );
        ctx.lineWidth = Math.max(1, r * 0.05);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.ellipse(-rx * 0.3, -ry * 0.34, rx * 0.42, ry * 0.3, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba("#ffffff", alpha * 0.2 * (1 - facing * 0.5));
      ctx.fill();
      ctx.restore();
    };

    const draw = (ts: number) => {
      const t = ts / 1000;
      ctx.clearRect(0, 0, w, h);
      const base = Math.max(w, h);
      const small = Math.min(w, h);

      BLOBS.forEach((b) => {
        const c = b.tone === "ink" ? ink : accent;
        const cx = (b.x + (still ? 0 : Math.sin(t * b.sx) * b.px)) * w;
        const cy = (b.y + (still ? 0 : Math.cos(t * b.sy) * b.py)) * h;
        const rad = b.r * base * (still ? 1 : 1 + Math.sin(t * 0.14) * 0.06);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, rgba(c, b.a * 0.75));
        g.addColorStop(0.55, rgba(c, b.a * 0.26));
        g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      ribbon(t).forEach((d) => drawDisc(d, small));

      if (!still && onScreen) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (still || raf) return;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (still) draw(0);
    else start();

    const onResize = () => {
      resize();
      if (still) draw(0);
    };
    window.addEventListener("resize", onResize);

    // The hero is the top of a very long page. Once it is off screen the loop
    // is invisible work, so it parks — same for a backgrounded tab.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(cv);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
