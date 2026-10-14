import Link from "next/link";
import TextReveal from "./TextReveal";
import Reveal from "./Reveal";
import WaveLine from "./WaveLine";

interface Props {
  eyebrow: string;
  title: string;
  text?: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
}

export default function SectionIntro({ eyebrow, title, text, link, align = "left", className = "" }: Props) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "grid gap-8 md:grid-cols-12 md:items-end"} ${className}`}>
      <div className={center ? "" : "md:col-span-7"}>
        <p className={`eyebrow text-terra ${center ? "" : ""}`}>{eyebrow}</p>
        <WaveLine className={`mt-3 ${center ? "mx-auto" : ""}`} />
        <TextReveal text={title} className="display h2 mt-5" />
      </div>
      {(text || link) && (
        <Reveal className={center ? "mt-6" : "flex flex-col items-start gap-6 md:col-span-4 md:col-start-9"}>
          {text && <p data-reveal className="text-mist">{text}</p>}
          {link && (
            <div data-reveal className={center ? "mt-6" : ""}>
              <Link href={link.href} className="link-arrow">
                {link.label} <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </Reveal>
      )}
    </div>
  );
}
