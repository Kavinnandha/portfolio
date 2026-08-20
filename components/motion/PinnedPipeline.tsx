"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

export type PipelineStep = {
  num: string;
  title: string;
  body: string;
  tags: string[];
  /** The last stage lands on the accent field — it is the one you finish on. */
  accent?: boolean;
};

/**
 * Where a card sits in its own life at scroll position `p`.
 *
 * `local` is how far the deck has advanced past this card: below 0 it has not
 * arrived, 0–1 it is the card on screen, above 1 it is being pushed off by the
 * next one. Enter and exit run over different fractions (0.28 vs 0.35) so a
 * card is fully legible for most of its slot rather than permanently mid-fade.
 */
function frame(local: number) {
  if (local >= 1.35) return { opacity: 0, y: -40, scale: 0.9 };
  if (local < 0) return { opacity: 0, y: 60, scale: 0.94 };
  const enter = Math.min(1, local / 0.28);
  const exit = local > 1 ? Math.min(1, (local - 1) / 0.35) : 0;
  return {
    opacity: enter * (1 - exit),
    y: (1 - enter) * 60 - exit * 40,
    scale: 0.94 + enter * 0.06 - exit * 0.05,
  };
}

function Step({
  step,
  index,
  count,
  progress,
}: {
  step: PipelineStep;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const local = useTransform(progress, (p) => p * count - index);
  const opacity = useTransform(local, (l) => frame(l).opacity);
  const y = useTransform(local, (l) => frame(l).y);
  const scale = useTransform(local, (l) => frame(l).scale);
  // A card faded to nothing is still on top of the one behind it, so it has to
  // stop taking the pointer or its links stay clickable through the stack.
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <motion.article
      className={`step${step.accent ? " is-accent" : ""}`}
      style={{ opacity, y, scale, pointerEvents }}
      aria-hidden={undefined}
    >
      <StepBody step={step} />
    </motion.article>
  );
}

function StepBody({ step }: { step: PipelineStep }) {
  return (
    <>
      <span className="step-num">{step.num}</span>
      <h3 className="step-title">{step.title}</h3>
      <p className="step-body">{step.body}</p>
      <div className="step-tags">
        {step.tags.map((t) => (
          <span className="tagchip" key={t}>
            {t}
          </span>
        ))}
      </div>
    </>
  );
}

function Rail({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const scaleX = useTransform(progress, (p) => Math.min(1, Math.max(0, p * count - index)));
  return (
    <span className="rail">
      <motion.span className="rail-fill" style={{ scaleX }} />
    </span>
  );
}

/**
 * The pipeline slab: 420vh of scroll driving five cards through one sticky
 * viewport, with a five-segment rail that fills as each stage is read.
 *
 * The cards are absolutely stacked rather than laid out in flow — only one is
 * legible at a time, and the scrub is what moves between them.
 *
 * Under reduced motion the pin is dropped entirely and the five cards become a
 * plain list. Freezing the scrub instead would leave four of the five cards at
 * `opacity: 0` with no way to reach them.
 */
export default function PinnedPipeline({
  id,
  steps,
}: {
  id?: string;
  steps: PipelineStep[];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const count = steps.length;

  const glowX = useTransform(scrollYProgress, [0, 1], ["-13vw", "13vw"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["-9vh", "9vh"]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);

  return (
    <section id={id} ref={ref} className="pipeline">
      <div className="pipeline-sticky">
        <div className="pipeline-glow" aria-hidden="true">
          {reduced ? (
            <span className="pipeline-glow-inner" />
          ) : (
            <motion.span
              className="pipeline-glow-inner"
              style={{ x: glowX, y: glowY, scale: glowScale }}
            />
          )}
        </div>

        <div className="pipeline-inner">
          <div>
            <span className="eyebrow on-ink">How it runs</span>
            <h2 className="pipeline-title">From commit to calm.</h2>
            <p className="pipeline-lede">
              The five stages I own on every service — and what each one is actually protecting
              against.
            </p>
            <div className="pipeline-rail">
              {steps.map((s, i) =>
                reduced ? (
                  <span className="rail" key={s.num}>
                    <span className="rail-fill" />
                  </span>
                ) : (
                  <Rail key={s.num} index={i} count={count} progress={scrollYProgress} />
                ),
              )}
            </div>
          </div>

          <div className="steps">
            {steps.map((s, i) =>
              reduced ? (
                <article className={`step${s.accent ? " is-accent" : ""}`} key={s.num}>
                  <StepBody step={s} />
                </article>
              ) : (
                <Step key={s.num} step={s} index={i} count={count} progress={scrollYProgress} />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
