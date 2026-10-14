import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Split from "@/components/Split";
import Reveal from "@/components/Reveal";
import ImageReveal from "@/components/ImageReveal";
import JsonLd from "@/components/JsonLd";
import CTA from "@/components/CTA";
import TextReveal from "@/components/TextReveal";
import { STORY } from "@/lib/data/hotel";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Our Story",
  description: "From a lemon merchant's villa in 1782 to a 24-room family hotel: the story of Marivento on the Amalfi Coast.",
  alternates: { canonical: "/our-story" },
};

export default function StoryPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Our Story", path: "/our-story" }])} />
      <PageHero image={STORY.images.hero} eyebrow="Our story" title="A family home since 1782." text={STORY.intro} />
      <section className="sec-chalk">
        <div className="wrap py-20 md:py-28">
          <TextReveal text="Two centuries, one cliff, the same view." className="display h2 max-w-3xl" />
          <Reveal as="ol" className="mt-14 grid gap-8 md:grid-cols-4">
            {STORY.chapters.map((c) => (
              <li data-reveal key={c.year} className="border-t-2 border-terra pt-6">
                <p className="display h2 text-terra">{c.year}</p>
                <h2 className="mt-3 text-lg font-semibold">{c.title}</h2>
                <p className="mt-2 text-mist">{c.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <Split theme="sec-shell" image={STORY.images.library} second={STORY.images.detail} eyebrow="The restoration" title="Every fresco and tile kept." text="When we restored the villa, we kept the original majolica floors, cleaned the 18th-century frescoes by hand and rebuilt the lemon terraces stone by stone." />
      <section className="sec-chalk">
        <div className="wrap grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="eyebrow text-terra">Made on the coast</p>
            <h2 className="display h2 mt-5">Local hands in every room.</h2>
            <p className="mt-6 text-mist">Ceramics come from a family workshop in Vietri sul Mare, linens are woven in Campania, and our lemons, tomatoes and herbs grow on the terraces below your window.</p>
          </div>
          <ImageReveal image={STORY.images.craft} className="aspect-[4/5] rounded-3xl" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </section>
      <CTA title="Become part of the story." />
    </>
  );
}
