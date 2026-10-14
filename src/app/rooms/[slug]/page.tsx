import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ImageReveal from "@/components/ImageReveal";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import RoomCarousel from "@/components/RoomCarousel";
import JsonLd from "@/components/JsonLd";
import { ROOMS, getRoom, RATE_PLANS } from "@/lib/data/rooms";
import { money, SITE_URL } from "@/lib/format";
import { breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getRoom(params.slug);
  if (!r) return {};
  return {
    title: r.name,
    description: `${r.tagline} ${r.size} m², ${r.beds}, sleeps ${r.maxGuests}. From ${money(r.prices.shoulder)} per night when you book direct.`,
    alternates: { canonical: `/rooms/${r.slug}` },
    openGraph: { images: [{ url: r.hero.src, alt: r.hero.alt }] },
  };
}

export default function RoomPage({ params }: { params: { slug: string } }) {
  const r = getRoom(params.slug);
  if (!r) notFound();
  const roomLd = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: r.name,
    description: r.description.join(" "),
    image: `${SITE_URL}${r.hero.src}`,
    bed: r.beds,
    occupancy: { "@type": "QuantitativeValue", maxValue: r.maxGuests },
    floorSize: { "@type": "QuantitativeValue", value: r.size, unitCode: "MTK" },
    amenityFeature: r.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    containedInPlace: { "@id": `${SITE_URL}/#hotel` },
  };
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Rooms & Suites", path: "/rooms" }, { name: r.name, path: `/rooms/${r.slug}` }])} />
      <JsonLd data={roomLd} />
      <PageHero image={r.hero} eyebrow={`${r.size} m² · ${r.beds} · Sleeps ${r.maxGuests}`} title={r.name} text={r.tagline} />

      <section className="sec-chalk">
        <div className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <nav aria-label="Breadcrumb" className="text-sm text-mist">
              <Link href="/rooms" className="hover:text-sea">Rooms & Suites</Link> <span aria-hidden>/</span> <span aria-current="page" className="text-ink">{r.name}</span>
            </nav>
            <TextReveal as="p" text={r.description[0]} className="display h3 mt-8 !leading-snug" />
            <Reveal className="mt-6 space-y-4 text-mist">
              {r.description.slice(1).map((p, i) => <p data-reveal key={i} className="lead">{p}</p>)}
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="eyebrow text-terra">Highlights</h2>
                <ul className="mt-4 space-y-2">{r.highlights.map((h) => <li key={h} className="flex gap-3"><span className="text-terra">✦</span>{h}</li>)}</ul>
              </div>
              <div>
                <h2 className="eyebrow text-terra">In the room</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2">{r.amenities.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
            </div>
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <div className="card sticky top-28 p-7 shadow-card">
              <p className="text-sm text-mist">Direct rates from</p>
              <p className="display h2 mt-1">{money(r.prices.shoulder)}<span className="font-sans text-base text-mist"> / night</span></p>
              <p className="mt-1 text-sm text-mist">High season from {money(r.prices.high)}. All hotel fees included.</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[15px]">
                <li><strong>{RATE_PLANS.flex.name}:</strong> {RATE_PLANS.flex.summary}</li>
                <li><strong>{RATE_PLANS.nr.name}:</strong> {RATE_PLANS.nr.summary}</li>
              </ul>
              <Link href={`/book?room=${r.slug}`} className="btn btn-terra mt-7 w-full">Check availability</Link>
              <p className="mt-3 text-center text-xs text-mist">Best rate guaranteed when you book direct</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="sec-shell" aria-label="Gallery">
        <div className="wrap grid gap-6 py-20 md:grid-cols-12 md:py-28">
          <ImageReveal image={r.view_} className="aspect-[3/2] rounded-3xl md:col-span-8" sizes="(min-width: 768px) 66vw, 100vw" />
          <ImageReveal image={r.bath} className="aspect-[4/5] rounded-3xl md:col-span-4" sizes="(min-width: 768px) 33vw, 100vw" />
          <ImageReveal image={r.detail} className="aspect-square rounded-3xl md:col-span-4" sizes="(min-width: 768px) 33vw, 100vw" />
          <div className="flex flex-col justify-center rounded-3xl bg-sea p-10 text-chalk md:col-span-8">
            <p className="display h2">Ready when you are.</p>
            <p className="mt-3 max-w-md text-chalk/80">See live prices for your dates, add breakfast or a boat transfer, and confirm in under two minutes.</p>
            <Link href={`/book?room=${r.slug}`} className="btn btn-light mt-8 self-start">Book this room</Link>
          </div>
        </div>
      </section>

      <section className="sec-chalk py-20 md:py-28">
        <div className="wrap">
          <h2 className="display h2">Other rooms & suites</h2>
        </div>
        <div className="mt-10">
          <RoomCarousel exclude={r.slug} />
        </div>
      </section>
    </>
  );
}
