"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

/**
 * Word-by-word reveal driven by scroll *position*, not by a timer.
 *
 * The distinction matters: the copy resolves exactly as fast as the reader
 * scrolls, and it un-resolves if they scroll back. That reciprocity is what
 * makes the effect feel like the page is responding rather than performing,
 * and it is the signature scroll move on both reference sites.
 */
function Word({
  children,
  progress,
  range,
  dim,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return (
    <motion.span className="scroll-word" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

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
  const reduced = useReducedMotion();

  // Start once the block is well into the viewport and finish before it
  // leaves, so the last word lands while the reader is still looking at it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = text.split(" ");
  const Tag = as;
  const resting = reduced ? 1 : dim;

  return (
    <Tag
      ref={ref as React.Ref<HTMLParagraphElement & HTMLQuoteElement & HTMLHeadingElement>}
      className={className}
      data-motion="words"
    >
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          dim={resting}
        >
          {word}
        </Word>
      ))}
    </Tag>
  );
}
