import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Split from "@/components/Split";
import SectionIntro from "@/components/SectionIntro";
import Reveal from "@/components/Reveal";
import ImageReveal from "@/components/ImageReveal";
import JsonLd from "@/components/JsonLd";
import CTA from "@/components/CTA";
import { SPA } from "@/lib/data/hotel";
import { money } from "@/lib/format";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sale Spa",
  description: "Marivento's spa is carved into the limestone beneath the hotel, with a rock pool opening onto the sea and rituals of sea salt, lemon and olive oil.",
  alternates: { canonical: "/spa" },
};

export default function SpaPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Spa", path: "/spa" }])} />
      <PageHero image={SPA.images.hero} eyebrow={SPA.name} title="Salt, stone and the sound of the sea." text={SPA.hours} />
      <Split image={SPA.images.relax} second={SPA.images.ritual} eyebrow="The spa" title="Built into the cliff beneath the villa." text={SPA.text} />
      <section className="sec-shell">
        <div className="wrap py-20 md:py-28">
          <SectionIntro eyebrow="Treatments" title="Rituals from the coast." text="Add treatments when you book, or reserve with our team once you arrive." />
          <Reveal as="ul" className="mt-12 grid gap-6 md:grid-cols-2">
            {SPA.treatments.map((t) => (
              <li data-reveal key={t.name} className="card flex items-start justify-between gap-6 p-7">
                <div>
                  <h3 className="display h3">{t.name}</h3>
                  <p className="mt-2 text-mist">{t.text}</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="block font-semibold">{money(t.price)}</span>
                  <span className="text-sm text-mist">{t.duration}</span>
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="sec-chalk">
        <div className="wrap grid gap-6 py-20 md:grid-cols-12 md:py-28">
          <ImageReveal image={SPA.images.yoga} className="aspect-[3/2] rounded-3xl md:col-span-7" sizes="(min-width: 768px) 58vw, 100vw" />
          <ImageReveal image={SPA.images.treatment} className="aspect-[3/2] rounded-3xl md:col-span-5 md:mt-20" sizes="(min-width: 768px) 42vw, 100vw" />
        </div>
      </section>
      <CTA title="Book a stay that leaves you lighter." />
    </>
  );
}
