"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** Fraction of the element visible before it plays in. */
  threshold?: number;
}

/**
 * Scroll-into-view reveal that degrades safely. The default render is fully
 * visible: the hidden state is only applied by JS (and only when motion is
 * allowed), so SSR, no-JS, headless renderers, and reduced-motion users all
 * get the content immediately. The IntersectionObserver then plays it in once.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  threshold = 0.18,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Apply the hidden state now (JS is running), then observe.
    el.classList.add("reveal");
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);

    const show = () => el.classList.add("is-in");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
            clearTimeout(fallback);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);

    // Safety net: never leave content hidden if the observer can't fire
    // (background tab, JS-running headless renderer, observer quirks).
    const fallback = window.setTimeout(() => {
      show();
      observer.disconnect();
    }, 2600);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [delay, threshold]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
