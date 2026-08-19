"use client";

export default function BackToTop() {
  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button type="button" className="btn btn-ghost" onClick={toTop} data-magnetic="1">
      Back to top ↑
    </button>
  );
}
