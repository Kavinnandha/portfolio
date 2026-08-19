"use client";

import { useEffect, useRef } from "react";

/** Grid pitch in CSS pixels. Also the unit the roaming cursor snaps to. */
const CELL = 76;

/** How far from the pointer a grid line still brightens, in CSS pixels. */
const FALLOFF = 240;

type Packet = {
  /** Travels top-to-bottom when true, left-to-right when false. */
  vertical: boolean;
  /** Which grid line it rides, 1-indexed. */
  lane: number;
  /** Head position along the lane, 0–1. Runs past 1 before recycling. */
  t: number;
  speed: number;
  /** Trail length as a fraction of the lane. */
  len: number;
  /** Hot packets are accent-coloured and carry a square head. */
  hot: boolean;
};

/**
 * The ambient loop behind the hero: a network diagram that is actually moving.
 *
 * A grid of hairlines stands in for the fabric, packets run the lanes, and a
 * single accent block roams the intersections like a scheduler placing work.
 * The grid brightens within {@link FALLOFF} of the pointer, so the surface
 * responds without anything having to light up on hover.
 *
 * One canvas, one `requestAnimationFrame`. Drawing this as DOM would mean
 * dozens of absolutely-positioned elements each with their own transform, and
 * the grid alone would be ~40 more; the canvas holds the entire composition in
 * a single composited layer.
 *
 * The loop parks itself when the hero leaves the viewport or the tab goes to
 * the background — an animation nobody can see should not be costing frames.
 */
export default function HeroBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  // Deliberately no React state: every value here changes at frame rate, and
  // routing any of it through a re-render would be a re-render per frame.
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Tokens are read from the DOM rather than hardcoded so retuning
    // `--color-accent` in globals.css retunes the backdrop with it.
    const styles = getComputedStyle(document.body);
    const ink = styles.getPropertyValue("--color-text").trim() || "#201e1d";
    const accent = styles.getPropertyValue("--color-accent").trim() || "#ec3013";

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    // Pointer position is lerped toward the raw target so the highlight glides
    // instead of snapping. Off-canvas start keeps the grid flat until entry.
    let px = -9999;
    let py = -9999;
    let targetX = -9999;
    let targetY = -9999;

    let packets: Packet[] = [];
    let raf = 0;
    let running = false;
    let last = 0;
    /** Last animation clock, so a repaint outside the loop resumes the pose. */
    let lastElapsed = 0;

    const seed = () => {
      // Density tracks area, so a wide desktop hero is not the same handful of
      // packets stretched thin. Clamped at both ends: enough to read as
      // traffic, few enough to stay cheap.
      const count = Math.max(14, Math.min(46, Math.round((width * height) / 26000)));
      packets = Array.from({ length: count }, () => {
        const vertical = Math.random() < 0.42;
        return {
          vertical,
          lane: Math.floor(Math.random() * (vertical ? cols : rows)) + 1,
          t: Math.random(),
          // Vertical lanes are shorter on a landscape hero, so they are slowed
          // to keep apparent speed roughly even in both directions.
          speed: (vertical ? 0.055 : 0.085) * (0.5 + Math.random()),
          len: 0.05 + Math.random() * 0.13,
          hot: Math.random() < 0.3,
        };
      });
    };

    /** True once the canvas has had a real box to size against. */
    let sized = false;
    /** Kept by the IntersectionObserver so every caller of `start` agrees. */
    let onScreen = true;

    /** Returns whether the canvas now has a usable backing store. */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // The hero can still be laid out at zero on the first effect pass; a
      // ResizeObserver calls back with the real box the moment there is one.
      if (!rect.width || !rect.height) return false;
      sized = true;
      // Capped at 2: beyond that the extra pixels are invisible and the fill
      // cost is real, especially on phones that report 3 or 4.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      seed();
      return true;
    };

    const draw = (elapsed: number, dt: number) => {
      px += (targetX - px) * 0.08;
      py += (targetY - py) * 0.08;
      ctx.clearRect(0, 0, width, height);

      // — the grid —
      ctx.lineWidth = 2;
      ctx.strokeStyle = ink;
      for (let c = 1; c <= cols; c += 1) {
        // The half-pixel offset lands the 2px line on the device pixel grid;
        // without it every hairline renders as two half-intensity rows.
        const x = Math.round(c * CELL) + 0.5;
        const d = Math.abs(x - px);
        const near = d < FALLOFF ? 1 - d / FALLOFF : 0;
        ctx.globalAlpha = 0.032 + near * 0.055;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let r = 1; r <= rows; r += 1) {
        const y = Math.round(r * CELL) + 0.5;
        const d = Math.abs(y - py);
        const near = d < FALLOFF ? 1 - d / FALLOFF : 0;
        ctx.globalAlpha = 0.032 + near * 0.055;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // — traffic —
      for (const p of packets) {
        if (!reduced) p.t += p.speed * dt;
        if (p.t > 1 + p.len) {
          // Recycled rather than reallocated, and re-randomised on the way so
          // the same lane does not pulse forever.
          p.t = -p.len;
          p.lane = Math.floor(Math.random() * (p.vertical ? cols : rows)) + 1;
          p.hot = Math.random() < 0.3;
        }
        const tail = Math.max(0, p.t - p.len);
        const head = Math.min(1, p.t);
        if (head <= 0 || tail >= 1) continue;

        const lane = Math.round(p.lane * CELL) + 0.5;
        ctx.lineWidth = p.hot ? 3 : 2;
        ctx.strokeStyle = p.hot ? accent : ink;
        ctx.globalAlpha = p.hot ? 0.5 : 0.18;
        ctx.beginPath();
        if (p.vertical) {
          ctx.moveTo(lane, tail * height);
          ctx.lineTo(lane, head * height);
        } else {
          ctx.moveTo(tail * width, lane);
          ctx.lineTo(head * width, lane);
        }
        ctx.stroke();

        if (p.hot) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = accent;
          const hx = p.vertical ? lane : head * width;
          const hy = p.vertical ? head * height : lane;
          ctx.fillRect(hx - 3, hy - 3, 6, 6);
        }
      }

      // — the roaming cursor —
      if (!reduced) {
        // Two sine periods that do not divide evenly, so the path never
        // visibly repeats; snapping to CELL keeps it on the intersections.
        const bx = width * (0.5 + 0.34 * Math.sin(elapsed * 0.19));
        const by = height * (0.5 + 0.3 * Math.cos(elapsed * 0.13));
        const gx = Math.round(bx / CELL) * CELL + 0.5;
        const gy = Math.round(by / CELL) * CELL + 0.5;
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = accent;
        ctx.fillRect(gx - 4, gy - 4, 8, 8);
        ctx.globalAlpha = 0.085;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(gx - CELL, gy - CELL, CELL * 2, CELL * 2);
      }

      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      // Real elapsed time, clamped: a backgrounded tab that misses frames must
      // not hand the next frame a huge delta and teleport every packet.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      lastElapsed = now / 1000;
      draw(lastElapsed, dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced || !sized || !onScreen || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    // A ResizeObserver rather than a window `resize` listener: it fires once
    // on observe with the element's real box — covering the case where the
    // hero has not been laid out yet on this pass — and again for every later
    // change, including ones no window resize accompanies (font swap, the
    // scrollbar appearing, a phone's URL bar collapsing).
    const ro = new ResizeObserver(() => {
      if (!resize()) return;
      // Sizing the backing store clears it, so paint one frame synchronously
      // before deciding whether to animate. Otherwise a canvas resized while
      // the loop is parked — reduced motion, hero off-screen, tab in the
      // background — would sit blank until something restarted it.
      draw(lastElapsed, 0);
      start();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Pointer tracking is a hover affordance; on touch there is no pointer to
    // follow and the listener would only cost work.
    let onMove: ((e: PointerEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;
    if (fine && !reduced) {
      onMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      };
      onLeave = () => {
        targetX = -9999;
        targetY = -9999;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (onLeave) document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
