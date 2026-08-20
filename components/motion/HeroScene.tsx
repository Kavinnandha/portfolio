"use client";

import { useEffect, useRef } from "react";
import { initGsap, prefersReduced, ScrollTrigger } from "@/lib/gsap";

/** Nodes on the sphere. Enough to read as a cluster, few enough for a phone. */
const NODES = 96;

/** Two nodes are wired together when they are closer than this on the unit sphere. */
const LINK_DIST = 0.62;

/** Packets in flight at any moment. */
const PACKETS = 14;

type Node = { x: number; y: number; z: number; seed: number };
type Edge = { a: number; b: number };
type Packet = { edge: number; t: number; speed: number };

/**
 * The hero backdrop: a slowly turning cluster of nodes with traffic moving
 * between them.
 *
 * It is the subject of the page rendered literally — a scheduler's worth of
 * machines, wired up, with packets crossing the links — rather than a generic
 * particle field. Depth does the work: nodes on the far side of the sphere dim
 * and shrink, links fade with the pair's average depth, and the whole thing
 * leans a few degrees toward the pointer.
 *
 * One canvas, one composited layer, no WebGL context to lose. Scroll position
 * feeds in through a single ScrollTrigger that writes to a plain object the
 * draw loop reads, so scrolling never triggers layout work per frame.
 */
export default function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initGsap();
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = prefersReduced();
    const style = getComputedStyle(document.documentElement);
    const accent = readRgb(style.getPropertyValue("--accent"), [255, 59, 22]);
    const cool = readRgb(style.getPropertyValue("--accent-cool"), [108, 132, 255]);

    /* ── the cluster ──────────────────────────────────────────────────── */

    // Fibonacci sphere: an even spread without the pole clustering you get
    // from naive lat/long sampling.
    const nodes: Node[] = Array.from({ length: NODES }, (_, i) => {
      const t = (i + 0.5) / NODES;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      // A little jitter in radius so it reads as a swarm, not a shell.
      const r = 0.82 + ((i * 37) % 11) / 55;
      return {
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.cos(phi) * r * 0.82,
        z: Math.sin(phi) * Math.sin(theta) * r,
        seed: (i % 17) / 17,
      };
    });

    const edges: Edge[] = [];
    for (let a = 0; a < NODES; a++) {
      for (let b = a + 1; b < NODES; b++) {
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        const dz = nodes[a].z - nodes[b].z;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < LINK_DIST) edges.push({ a, b });
      }
    }

    const packets: Packet[] = Array.from({ length: PACKETS }, (_, i) => ({
      edge: Math.floor((i / PACKETS) * edges.length),
      t: (i % 7) / 7,
      speed: 0.28 + ((i * 13) % 9) / 26,
    }));

    /* ── state the loop reads ─────────────────────────────────────────── */

    const view = { scroll: 0, pointerX: 0, pointerY: 0, spin: 0 };
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let last = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Past ~1.75 the extra pixels are invisible on soft gradients and cost
      // real fill rate on a 3x phone.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (n: Node, cosY: number, sinY: number, tiltX: number) => {
      // Yaw first, then a small pitch — cheaper than a full matrix and the
      // cluster never rolls, which is what would make it read as a toy.
      const x1 = n.x * cosY - n.z * sinY;
      const z1 = n.x * sinY + n.z * cosY;
      const y1 = n.y * Math.cos(tiltX) - z1 * Math.sin(tiltX);
      const z2 = n.y * Math.sin(tiltX) + z1 * Math.cos(tiltX);

      const depth = (z2 + 1.4) / 2.8; // 0 far, 1 near
      const persp = 1.9 / (2.9 - z2);
      const scale = Math.min(width, height) * (0.42 - view.scroll * 0.06);
      return {
        sx: width / 2 + x1 * scale * persp + view.pointerX * 26,
        sy: height / 2 + y1 * scale * persp + view.pointerY * 20 - view.scroll * height * 0.12,
        depth,
        persp,
      };
    };

    const draw = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016;
      last = time;
      if (!still) view.spin += dt * 0.085;

      ctx.clearRect(0, 0, width, height);

      const cosY = Math.cos(view.spin);
      const sinY = Math.sin(view.spin);
      const tiltX = -0.22 + view.pointerY * 0.14;
      const points = nodes.map((n) => project(n, cosY, sinY, tiltX));
      const fade = 1 - view.scroll * 0.75;
      if (fade <= 0) {
        if (visible) raf = requestAnimationFrame(draw);
        return;
      }

      /* links */
      ctx.lineWidth = 1;
      for (const edge of edges) {
        const p = points[edge.a];
        const q = points[edge.b];
        const depth = (p.depth + q.depth) / 2;
        const alpha = (depth - 0.18) * 0.3 * fade;
        if (alpha <= 0.004) continue;
        ctx.strokeStyle = `rgba(${cool[0]},${cool[1]},${cool[2]},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.lineTo(q.sx, q.sy);
        ctx.stroke();
      }

      /* packets in flight */
      for (const packet of packets) {
        if (!still) {
          packet.t += dt * packet.speed;
          while (packet.t > 1) {
            packet.t -= 1;
            packet.edge = (packet.edge + 7 + ((packet.speed * 100) | 0)) % edges.length;
          }
        }
        const edge = edges[packet.edge];
        if (!edge) continue;
        const p = points[edge.a];
        const q = points[edge.b];
        const depth = (p.depth + q.depth) / 2;
        const x = p.sx + (q.sx - p.sx) * packet.t;
        const y = p.sy + (q.sy - p.sy) * packet.t;
        const alpha = Math.max(0, (depth - 0.25) * 1.5) * fade;
        if (alpha <= 0.01) continue;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 14 * depth);
        glow.addColorStop(0, `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha * 0.85})`);
        glow.addColorStop(1, `rgba(${accent[0]},${accent[1]},${accent[2]},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 14 * depth, 0, Math.PI * 2);
        ctx.fill();
      }

      /* nodes, far to near so the near ones sit on top */
      const order = points.map((p, i) => i).sort((a, b) => points[a].depth - points[b].depth);
      for (const i of order) {
        const p = points[i];
        const node = nodes[i];
        const pulse = still ? 0.5 : 0.5 + Math.sin(time / 900 + node.seed * 9) * 0.5;
        const radius = (0.7 + p.depth * 2.1) * p.persp;
        const hot = node.seed > 0.78;
        const alpha = Math.max(0, (p.depth - 0.1) * (hot ? 1.05 : 0.62)) * fade;
        if (alpha <= 0.01) continue;

        const rgb = hot ? accent : [235, 232, 228];
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * (0.55 + pulse * 0.45)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fill();

        if (hot && p.depth > 0.55) {
          ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha * 0.28 * pulse})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, radius + 5 + pulse * 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (visible) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (raf) return;
      last = 0;
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

    /* ── inputs ───────────────────────────────────────────────────────── */

    const trigger = ScrollTrigger.create({
      trigger: canvas.closest("section") || canvas,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        view.scroll = self.progress;
        if (still) draw(0);
      },
    });

    const onPointer = (event: PointerEvent) => {
      if (still) return;
      view.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      view.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onResize = () => {
      resize();
      if (still) draw(0);
    };
    window.addEventListener("resize", onResize);

    // The hero is the top of a very long page; once it is behind you the loop
    // is invisible work. Same for a backgrounded tab.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !still;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      trigger.kill();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas className="hero-canvas" ref={ref} aria-hidden="true" />;
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
