import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ImageReveal from "@/components/ImageReveal";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import CTA from "@/components/CTA";
import { ROOMS } from "@/lib/data/rooms";
import { money } from "@/lib/format";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Six sea-view room types at Marivento, from Classic Sea View Rooms to the Grotto Suite carved into the cliff and a two-bedroom villa with a private pool.",
  alternates: { canonical: "/rooms" },
};

export default function RoomsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Rooms & Suites", path: "/rooms" }])} />
      <PageHero image={ROOMS[4].hero} eyebrow="Rooms & suites" title="Every room faces the sea." text="Twenty-four rooms in six styles, each with whitewashed vaults, local craft and a view straight down the coast." />
      {ROOMS.map((r, i) => (
        <section key={r.slug} className={i % 2 ? "sec-shell" : "sec-chalk"} aria-labelledby={`room-${r.slug}`}>
          <div className="wrap grid items-center gap-10 py-20 md:grid-cols-12 md:py-24">
            <Link href={`/rooms/${r.slug}`} className={`group block md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
              <ImageReveal image={r.hero} className="aspect-[16/10] rounded-3xl" sizes="(min-width: 768px) 58vw, 100vw" zoom />
            </Link>
            <div className={`md:col-span-5 ${i % 2 ? "md:order-1" : "md:pl-6"}`}>
              <Reveal>
                <p data-reveal className="eyebrow text-terra">From {money(r.prices.shoulder)} per night</p>
                <h2 data-reveal id={`room-${r.slug}`} className="display h2 mt-4">{r.name}</h2>
                <p data-reveal className="mt-4 text-mist">{r.tagline}</p>
                <ul data-reveal className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
                  <li>{r.size} m²</li>
                  <li>{r.beds}</li>
                  <li>Sleeps {r.maxGuests}</li>
                  <li>{r.view}</li>
                </ul>
                <div data-reveal className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/book?room=${r.slug}`} className="btn btn-sea">Check dates</Link>
                  <Link href={`/rooms/${r.slug}`} className="btn btn-outline">View room</Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}
      <CTA title="Found your room? Let's find your dates." />
    </>
  );
}
