import Link from "next/link";
import type { Img as ImgT } from "@/lib/types";
import ImageReveal from "./ImageReveal";
import TextReveal from "./TextReveal";
import Reveal from "./Reveal";
import WaveLine from "./WaveLine";

interface Props {
  image: ImgT;
  second?: ImgT;
  eyebrow: string;
  title: string;
  text: string | string[];
  link?: { href: string; label: string };
  reverse?: boolean;
  theme?: string;
  children?: React.ReactNode;
}

/** Image-led split with an optional overlapping second image. */
export default function Split({ image, second, eyebrow, title, text, link, reverse = false, theme = "sec-chalk", children }: Props) {
  const paras = Array.isArray(text) ? text : [text];
  return (
    <section className={theme}>
      <div className="wrap grid items-center gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-28">
        <div className={`relative md:col-span-7 ${reverse ? "md:order-2" : ""}`}>
          <ImageReveal image={image} className="aspect-[4/3] rounded-3xl" sizes="(min-width: 768px) 58vw, 100vw" />
          {second && (
            <ImageReveal
              image={second}
              className={`absolute -bottom-10 hidden aspect-square w-[38%] rounded-3xl border-[6px] border-[var(--bg)] md:block ${reverse ? "-left-8" : "-right-8"}`}
              sizes="22vw"
            />
          )}
        </div>
        <div className={`md:col-span-5 ${reverse ? "md:order-1" : "md:pl-6"}`}>
          <p className="eyebrow text-terra">{eyebrow}</p>
          <WaveLine className="mt-3" />
          <TextReveal text={title} className="display h2 mt-5" />
          <Reveal className="mt-6 space-y-4 text-mist">
            {paras.map((p, i) => (
              <p data-reveal key={i}>{p}</p>
            ))}
            {children && <div data-reveal>{children}</div>}
            {link && (
              <div data-reveal className="pt-2">
                <Link href={link.href} className="link-arrow">{link.label} <span aria-hidden>→</span></Link>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
