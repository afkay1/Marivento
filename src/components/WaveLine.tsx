"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Hand-drawn wave that draws itself when it scrolls into view. */
export default function WaveLine({ className = "", color = "#C66A3D" }: { className?: string; color?: string }) {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const p = ref.current;
    if (!p || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", scrollTrigger: { trigger: p, start: "top 92%", once: true } });
    });
    return () => ctx.revert();
  }, []);
  return (
    <svg viewBox="0 0 120 12" className={`h-3 w-24 ${className}`} aria-hidden fill="none">
      <path
        ref={ref}
        d="M1 6c7.5 0 7.5-4.5 15-4.5S23.5 10.5 31 10.5 38.5 1.5 46 1.5s7.5 9 15 9 7.5-9 15-9 7.5 9 15 9 7.5-9 15-9 7.5 4.5 13 4.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
      />
    </svg>
  );
}
