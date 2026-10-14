"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { Img as ImgT } from "@/lib/types";
import Img from "./Img";
import TextReveal from "./TextReveal";

interface Props {
  image: ImgT;
  eyebrow: string;
  title: string;
  text?: string;
  children?: React.ReactNode;
  tall?: boolean;
}

/** Full-bleed photo hero: slow zoom, rising headline. */
export default function PageHero({ image, eyebrow, title, text, children, tall = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = el.querySelector("[data-media]");
    const items = el.querySelectorAll("[data-hero-item]");
    if (prefersReducedMotion()) {
      gsap.set([media, ...Array.from(items)], { opacity: 1, y: 0, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(media, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" });
      gsap.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.5 });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className={`relative flex items-end overflow-hidden bg-deep text-chalk ${tall ? "min-h-[100svh]" : "min-h-[72svh] md:min-h-[82svh]"}`}>
      <div data-media data-reveal className="absolute inset-0">
        <Img image={image} className="h-full w-full" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/25" />
      </div>
      <div className="wrap relative pb-14 pt-36 md:pb-20">
        <p data-hero-item data-reveal className="eyebrow text-chalk/85">{eyebrow}</p>
        <TextReveal as="h1" text={title} immediate delay={0.3} className="display h-hero mt-4 max-w-5xl" />
        {text && <p data-hero-item data-reveal className="lead mt-6 max-w-xl text-chalk/90">{text}</p>}
        {children && <div data-hero-item data-reveal className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
