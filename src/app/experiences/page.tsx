import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ImageReveal from "@/components/ImageReveal";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import CTA from "@/components/CTA";
import { EXPERIENCES } from "@/lib/data/hotel";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Private boat days, the Path of the Gods, cooking with family recipes and lemon grove tours, arranged by the Marivento team.",
  alternates: { canonical: "/experiences" },
};

export default function ExperiencesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Experiences", path: "/experiences" }])} />
      <PageHero image={EXPERIENCES[0].image} eyebrow="Experiences" title="The Amalfi Coast, from the water up." text="Our team arranges everything before you arrive. Just tell us what you love." />
      <section className="sec-chalk">
        <div className="wrap grid gap-x-8 gap-y-16 py-20 md:grid-cols-2 md:py-28">
          {EXPERIENCES.map((e, i) => (
            <article key={e.slug} id={e.slug} className={`scroll-mt-28 ${i % 2 ? "md:mt-20" : ""}`}>
              <ImageReveal image={e.image} className="aspect-[4/3] rounded-3xl" sizes="(min-width: 768px) 50vw, 100vw" />
              <Reveal className="mt-6">
                <p data-reveal className="eyebrow text-terra">{e.duration} · {e.price}</p>
                <h2 data-reveal className="display h2 mt-3">{e.name}</h2>
                <p data-reveal className="mt-3 max-w-lg text-mist">{e.text}</p>
              </Reveal>
            </article>
          ))}
        </div>
      </section>
      <CTA title="Plan your days. We'll handle the rest." />
    </>
  );
}
