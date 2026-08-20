"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap, prefersReduced } from "@/lib/gsap";

/** Fires once the curtain is clear, so the hero knows when its stage is free. */
export const BOOT_DONE = "boot:done";

const STATUS = ["Provisioning nodes", "Draining queues", "Health checks green", "Ready"];

/**
 * The cold open.
 *
 * Two and a bit seconds of black with a counter running to 100, then the
 * curtain wipes up and hands the page to the hero. It is scroll-locked while
 * it plays: a reader who scrolls during the intro would land mid-page with
 * every entrance already spent.
 *
 * `documentElement.dataset.boot` is the contract with everything downstream —
 * "playing" while the curtain is up, "done" after. `HeroMotion` waits on it,
 * and CSS uses it to keep the fixed chrome hidden until the reveal.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGsap();
    const el = root.current;
    if (!el) return;

    const finish = () => {
      document.documentElement.dataset.boot = "done";
      document.body.classList.remove("is-booting");
      window.dispatchEvent(new CustomEvent(BOOT_DONE));
    };

    if (prefersReduced()) {
      gsap.set(el, { display: "none" });
      finish();
      return;
    }

    document.documentElement.dataset.boot = "playing";
    document.body.classList.add("is-booting");

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const digits = el.querySelector<HTMLElement>(".boot-count-value");
      const status = gsap.utils.toArray<HTMLElement>(".boot-status span");

      const tl = gsap.timeline({ onComplete: finish });

      tl.set(".boot-word", { yPercent: 115 })
        .set(status, { yPercent: 110, opacity: 0 })
        .to(".boot-word", { yPercent: 0, duration: 1.1, stagger: 0.07, ease: "hop" }, 0.15)
        .to(".boot-rule", { scaleX: 1, duration: 2.1, ease: "power2.inOut" }, 0.15)
        .to(
          counter,
          {
            v: 100,
            duration: 2.1,
            ease: "power2.inOut",
            onUpdate: () => {
              if (digits) digits.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.15,
        );

      // The status list ticks over four times across the same 2.1s, so the
      // counter and the words land together rather than racing.
      status.forEach((line, i) => {
        const at = 0.3 + i * 0.48;
        tl.to(line, { yPercent: 0, opacity: 1, duration: 0.5, ease: "hop" }, at);
        if (i < status.length - 1) {
          tl.to(line, { yPercent: -110, opacity: 0, duration: 0.45, ease: "hop" }, at + 0.44);
        }
      });

      tl.to(".boot-body", { opacity: 0, duration: 0.4, ease: "power2.in" }, 2.35)
        .to(
          el,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "swing" },
          2.45,
        )
        .set(el, { display: "none" });
    }, el);

    return () => {
      ctx.revert();
      document.body.classList.remove("is-booting");
    };
  }, []);

  return (
    <div className="boot" ref={root} aria-hidden="true">
      <div className="boot-body">
        <p className="boot-name">
          {["Kavin", "Nandha", "M K"].map((word) => (
            <span className="boot-word-mask" key={word}>
              <span className="boot-word">{word}</span>
            </span>
          ))}
        </p>

        <div className="boot-foot">
          <p className="boot-status">
            {STATUS.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className="boot-count">
            <span className="boot-count-value">000</span>
            <span className="boot-count-unit">%</span>
          </p>
        </div>

        <span className="boot-rule" />
      </div>
    </div>
  );
}
