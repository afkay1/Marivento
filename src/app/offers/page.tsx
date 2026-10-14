import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ImageReveal from "@/components/ImageReveal";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import CTA from "@/components/CTA";
import { OFFERS, HOME_IMAGES } from "@/lib/data/hotel";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Offers",
  description: "Direct-booking offers at Marivento: a free fifth night, a cliffside romance package and a wellness escape.",
  alternates: { canonical: "/offers" },
};

export default function OffersPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Offers", path: "/offers" }])} />
      <PageHero image={HOME_IMAGES.night} eyebrow="Offers" title="Only when you book with us." text="These offers are exclusive to our own website, on top of our best-rate guarantee." />
      <section className="sec-chalk">
        <div className="wrap space-y-20 py-20 md:py-28">
          {OFFERS.map((o, i) => (
            <article key={o.slug} id={o.slug} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-12">
              <div className={`md:col-span-5 ${i % 2 ? "md:order-2 md:col-start-8" : ""}`}>
                <ImageReveal image={o.image} className="aspect-[4/5] rounded-3xl" sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
              <Reveal className={`md:col-span-6 ${i % 2 ? "md:order-1" : "md:col-start-7"}`}>
                <h2 data-reveal className="display h1">{o.name}</h2>
                <p data-reveal className="lead mt-5 text-mist">{o.text}</p>
                <p data-reveal className="mt-4 text-sm text-mist">{o.terms}</p>
                <div data-reveal className="mt-8">
                  <Link href="/book" className="btn btn-terra">Check dates</Link>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
