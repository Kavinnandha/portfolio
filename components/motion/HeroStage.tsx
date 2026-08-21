"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { EASE_OUT } from "./easing";

/**
 * The floating stack behind the hero headline.
 *
 * Every object is a real DOM tile rather than a canvas painting, because each
 * one has to carry a legible label — the cluster is a list of what I run, laid
 * out as objects instead of as a paragraph. Canvas would cost the text.
 *
 * Three movements are layered on the same elements and never fight, because
 * each owns a different transform channel:
 *   • the entrance — scale and rotate from a collapsed stack out into the fan
 *   • the drift — an infinite CSS keyframe on an inner wrapper, so it survives
 *     while the outer element is being driven by Motion
 *   • the pointer and the scroll — translate only, on the outer element, both
 *     scaled by the tile's own `depth` so near tiles travel further than far
 *     ones and the cluster reads as having thickness
 */

type Tile = {
  id: string;
  /** Percent of the hero box. The tile is centred on this point. */
  x: number;
  y: number;
  /** Resting rotation, degrees. */
  r: number;
  /** 0 = far (barely moves), 1 = near (moves most). */
  depth: number;
  /** Width, in the shared tile unit. Height follows from the content. */
  w: number;
  /** Seconds of entrance delay, and the drift cycle's phase. */
  delay: number;
  /** Kept on narrow viewports, where most of the cluster is dropped. */
  keep?: boolean;
  className?: string;
  children: ReactNode;
};

const BOLT = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13.5 2 4 13.6h6.2L9.8 22 20 10.2h-6.4L13.5 2Z" fill="currentColor" />
  </svg>
);

const LOCK = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="3.4" fill="currentColor" />
    <path
      d="M8 10V7.6a4 4 0 0 1 8 0V10"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const SHIELD = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2.6 20 5.4v6.1c0 4.6-3.2 8.4-8 10-4.8-1.6-8-5.4-8-10V5.4L12 2.6Z"
      fill="currentColor"
    />
    <path
      d="m8.6 11.9 2.4 2.4 4.4-4.5"
      stroke="var(--color-accent)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HEX = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2.4 20.2 7v10L12 21.6 3.8 17V7L12 2.4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M12 8.2 16 10.5v4.6L12 17.4 8 15.1v-4.6L12 8.2Z" fill="currentColor" />
  </svg>
);

const CURSOR = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 2.6 19.4 11l-6.2 1.5L10 19.6 5 2.6Z"
      fill="var(--color-text)"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const TILES: Tile[] = [
  /* ── the fan, left ─────────────────────────────────────────────────── */
  {
    id: "actions",
    x: 8,
    y: 24,
    r: -17,
    depth: 0.34,
    w: 1,
    delay: 0.06,
    className: "tile-card is-paper",
    children: (
      <>
        <span className="tile-mark is-ink">{HEX}</span>
        <span className="tile-name">GitHub Actions</span>
        <span className="tile-sub">build · tag · push</span>
      </>
    ),
  },
  {
    id: "terraform",
    x: 13,
    y: 40,
    r: -9,
    depth: 0.5,
    w: 1,
    delay: 0.12,
    keep: true,
    className: "tile-card is-ink",
    children: (
      <>
        <span className="tile-mark is-paper">{HEX}</span>
        <span className="tile-name">Terraform</span>
        <span className="tile-sub">plan · apply</span>
      </>
    ),
  },
  {
    id: "k3s",
    x: 20,
    y: 57,
    r: -3,
    depth: 0.72,
    w: 1.06,
    delay: 0.18,
    keep: true,
    className: "tile-card is-accent",
    children: (
      <>
        <span className="tile-mark is-glass">{HEX}</span>
        <span className="tile-name">Kubernetes · k3s</span>
        <span className="tile-sub">18 pods scheduled</span>
      </>
    ),
  },
  {
    id: "shell",
    x: 12,
    y: 75,
    r: 7,
    depth: 0.92,
    w: 1.24,
    delay: 0.24,
    className: "tile-shell",
    children: (
      <>
        <span className="shell-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code className="shell-line">
          <span className="shell-prompt">$</span> kubectl rollout status
        </code>
        <code className="shell-line is-ok">deployment successfully rolled out</code>
      </>
    ),
  },
  {
    id: "cursor",
    x: 26.5,
    y: 68,
    r: 0,
    depth: 1,
    w: 0.26,
    delay: 0.3,
    className: "tile-cursor",
    children: CURSOR,
  },

  /* ── the objects, right ────────────────────────────────────────────── */
  {
    id: "uptime",
    x: 88,
    y: 15,
    r: -7,
    depth: 0.42,
    w: 0.78,
    delay: 0.1,
    keep: true,
    className: "tile-toggle",
    children: (
      <>
        <span className="toggle-track" aria-hidden="true">
          <i />
        </span>
        <span className="tile-sub">99.98% up</span>
      </>
    ),
  },
  {
    id: "edge",
    x: 85,
    y: 52,
    r: -5,
    depth: 0.66,
    w: 0.5,
    delay: 0.16,
    className: "tile-glyph is-ink",
    children: <span className="glyph is-hot">{BOLT}</span>,
  },
  {
    id: "zero-trust",
    x: 91,
    y: 56,
    r: 10,
    depth: 0.86,
    w: 0.5,
    delay: 0.2,
    keep: true,
    className: "tile-glyph is-paper",
    children: <span className="glyph is-shield">{SHIELD}</span>,
  },
  {
    id: "tls",
    x: 80,
    y: 68,
    r: 6,
    depth: 1,
    w: 0.5,
    delay: 0.26,
    className: "tile-glyph is-accent",
    children: <span className="glyph is-lock">{LOCK}</span>,
  },
  {
    id: "graf",
    x: 91,
    y: 76,
    r: -6,
    depth: 0.78,
    w: 0.92,
    delay: 0.32,
    className: "tile-graph",
    children: (
      <>
        <span className="tile-sub">p95 latency</span>
        <svg viewBox="0 0 120 34" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 26 12 22 24 27 36 14 48 19 60 9 72 15 84 6 96 12 108 4 120 8"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    ),
  },
];

function Floater({
  tile,
  px,
  py,
  drift,
  reduced,
}: {
  tile: Tile;
  px: MotionValue<number>;
  py: MotionValue<number>;
  drift: MotionValue<number>;
  reduced: boolean | null;
}) {
  // Pointer travel and scroll travel both scale with depth, so the cluster
  // separates into planes instead of sliding as one sheet.
  //
  // Both feed the *same* x, summed here rather than split across `x` and
  // `translateX`: those are the one transform channel, and writing both would
  // leave whichever Motion resolved last as the only one that survived.
  const side = tile.x < 50 ? -1 : 1;
  const x = useTransform([px, drift], ([p, d]: number[]) =>
    reduced ? 0 : p * tile.depth + d * side * tile.depth,
  );
  const y = useTransform(py, (v) => (reduced ? 0 : v * tile.depth));

  return (
    <motion.div
      className={`tile ${tile.className ?? ""}`.trim()}
      style={{
        // Position travels as custom properties rather than as `left`/`top`
        // directly. Inline declarations outrank any stylesheet, and the narrow
        // breakpoint has to be able to re-place the four surviving tiles into
        // the corners — which it cannot do against inline longhands without a
        // wall of `!important`. Cast on its own, so the animated values below
        // keep Motion's types rather than being flattened into CSSProperties.
        ...({
          "--tx": `${tile.x}%`,
          "--ty": `${tile.y}%`,
          "--tw": tile.w,
        } as React.CSSProperties),
        x,
        y,
      }}
      data-tile={tile.id}
      data-keep={tile.keep ? "" : undefined}
      initial={reduced ? false : { opacity: 0, scale: 0.62, rotate: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, rotate: tile.r, filter: "blur(0px)" }}
      transition={{
        duration: reduced ? 0 : 1.1,
        delay: reduced ? 0 : 0.25 + tile.delay,
        ease: EASE_OUT,
      }}
      aria-hidden="true"
    >
      <span
        className="tile-drift"
        style={{ animationDelay: `${-tile.delay * 6}s`, animationDuration: `${7 + tile.depth * 4}s` }}
      >
        {tile.children}
      </span>
    </motion.div>
  );
}

export default function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Raw pointer offsets in px, springed once here rather than per tile: ten
  // springs chasing the same input is ten times the work for one number.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.5 });
  const py = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.5 });

  const drift = useTransform(scrollYProgress, [0, 1], [0, 180]);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        // Normalised to the hero's own box, so the same gesture means the
        // same thing on a laptop and on an ultrawide.
        rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 46);
        rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 34);
      });
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, rawX, rawY]);

  return (
    <div className="hero-stage" ref={ref} aria-hidden="true">
      {TILES.map((tile) => (
        <Floater key={tile.id} tile={tile} px={px} py={py} drift={drift} reduced={reduced} />
      ))}
    </div>
  );
}
