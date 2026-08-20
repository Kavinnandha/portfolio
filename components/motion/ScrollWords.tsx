"use client";

import { useRef } from "react";
import { SplitText, claim, gsap, prefersReducedMotion, useGSAP } from "./gsap";

/**
 * Word-by-word reveal driven by scroll *position*, not by a timer.
 *
 * The distinction is the whole point: the copy resolves exactly as fast as the
 * reader scrolls, and un-resolves if they scroll back. That reciprocity is
 * what makes the page feel like it is answering rather than performing.
 *
 * The dim resting state is painted by CSS on the container, and swapped for
 * per-word opacity in the same frame the split happens — so the reader never
 * sees the sentence at full strength and then watch it drop back.
 */
export default function ScrollWords({
  text,
  className,
  as = "p",
  dim = 0.16,
}: {
  text: string;
  className?: string;
  as?: "p" | "blockquote" | "h2";
  /** Resting opacity of a word that has not resolved yet. */
  dim?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      claim(el);

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      const split = SplitText.create(el, {
        type: "words",
        wordsClass: "scroll-word",
        // Words never re-wrap into different words, but the container's own
        // line breaks change on resize; autoSplit keeps the DOM honest.
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(el, { opacity: 1 });
          return gsap.fromTo(
            self.words,
            { opacity: dim },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.4,
              duration: 1,
              scrollTrigger: {
                trigger: el,
                start: "top 82%",
                end: "bottom 58%",
                scrub: 0.6,
              },
            },
          );
        },
      });

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag
      ref={ref as React.Ref<HTMLParagraphElement & HTMLQuoteElement & HTMLHeadingElement>}
      className={className}
      data-motion="words"
    >
      {text}
    </Tag>
  );
}
