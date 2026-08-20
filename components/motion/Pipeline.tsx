"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";

export type PipelineStep = {
  num: string;
  kicker: string;
  title: string;
  body: string;
  tags: string[];
};

/**
 * The delivery pipeline, told as one sideways move.
 *
 * The section pins and vertical scroll is re-spent as horizontal travel across
 * five panels. The distance is measured from the track rather than guessed, and
 * `invalidateOnRefresh` re-measures it on every resize — a hard-coded `end`
 * means the last panel is either cut off or followed by dead scroll on any
 * viewport but the one it was tuned on.
 *
 * Everything that animates *inside* the track hangs off `containerAnimation`,
 * which is how a ScrollTrigger reads position along a horizontal tween instead
 * of down the page.
 *
 * Below 900px the pin is dropped entirely: horizontal scroll-jacking on a phone
 * fights the reader's own gesture, so the panels simply stack.
 */
export default function Pipeline({ id, steps }: { id?: string; steps: PipelineStep[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGsap();
    const sectionEl = section.current;
    const trackEl = track.current;
    if (!sectionEl || !trackEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          wide: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
          narrow: "(max-width: 899.98px), (prefers-reduced-motion: reduce)",
        },
        (context) => {
          const panels = gsap.utils.toArray<HTMLElement>(".pipe-panel", trackEl);
          const fill = sectionEl.querySelector<HTMLElement>(".pipe-fill");
          const index = sectionEl.querySelector<HTMLElement>(".pipe-index-now");

          if (!context.conditions?.wide) {
            gsap.set(trackEl, { clearProps: "all" });
            gsap.fromTo(
              panels,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.1,
                scrollTrigger: { trigger: trackEl, start: "top 80%", once: true },
              },
            );
            if (fill) gsap.set(fill, { scaleX: 1 });
            return;
          }

          const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
          let shown = -1;

          const travel = gsap.to(trackEl, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (fill) gsap.set(fill, { scaleX: self.progress });
                const at = Math.min(panels.length, Math.floor(self.progress * panels.length) + 1);
                if (at !== shown && index) {
                  shown = at;
                  index.textContent = String(at).padStart(2, "0");
                }
              },
            },
          });

          // Per-panel life, read off the horizontal tween rather than the page.
          panels.forEach((panel) => {
            const ghost = panel.querySelector<HTMLElement>(".pipe-ghost");
            const lines = panel.querySelectorAll<HTMLElement>(".pipe-reveal");

            if (ghost) {
              gsap.fromTo(
                ghost,
                { xPercent: 18 },
                {
                  xPercent: -18,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: travel,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                },
              );
            }

            if (lines.length) {
              gsap.fromTo(
                lines,
                { opacity: 0, y: 34 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  stagger: 0.07,
                  ease: "hop",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: travel,
                    start: "left 78%",
                    once: true,
                  },
                },
              );
            }
          });
        },
      );
    }, sectionEl);

    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section className="pipe" id={id} ref={section}>
      <div className="pipe-stage">
        <div className="pipe-glow" aria-hidden="true" />

        <header className="pipe-head">
          <span className="eyebrow">The pipeline</span>
          <h2 className="pipe-title">Every change takes the same road.</h2>
        </header>

        <div className="pipe-track" ref={track}>
          {steps.map((step) => (
            <article className="pipe-panel" key={step.num}>
              <span className="pipe-ghost" aria-hidden="true">
                {step.num}
              </span>
              <div className="pipe-panel-body">
                <p className="pipe-kicker pipe-reveal">
                  <span className="pipe-kicker-num">{step.num}</span>
                  {step.kicker}
                </p>
                <h3 className="pipe-step-title pipe-reveal">{step.title}</h3>
                <p className="pipe-step-body pipe-reveal">{step.body}</p>
                <ul className="pipe-tags pipe-reveal">
                  {step.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <footer className="pipe-foot">
          <p className="pipe-index">
            <span className="pipe-index-now">01</span>
            <span className="pipe-index-sep">/</span>
            <span>{String(steps.length).padStart(2, "0")}</span>
          </p>
          <div className="pipe-rail">
            <span className="pipe-fill" />
          </div>
          <p className="pipe-hint">Scroll</p>
        </footer>
      </div>
    </section>
  );
}
