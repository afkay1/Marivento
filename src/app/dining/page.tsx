import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Split from "@/components/Split";
import SectionIntro from "@/components/SectionIntro";
import Reveal from "@/components/Reveal";
import ImageReveal from "@/components/ImageReveal";
import JsonLd from "@/components/JsonLd";
import CTA from "@/components/CTA";
import { DINING } from "@/lib/data/hotel";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dining",
  description: "Lume, Marivento's terrace restaurant, cooks with lemons and herbs from the hotel garden and the morning's catch. Plus Bar Scoglio, our cliffside bar.",
  alternates: { canonical: "/dining" },
};

export default function DiningPage() {
  const d = DINING;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Dining", path: "/dining" }])} />
      <PageHero image={d.images.hero} eyebrow="Dining" title="Dinner on the terrace, as the coast lights up." text={`${d.restaurant.name}, our terrace restaurant, and ${d.bar.name}, a small bar carved into the rock.`} />
      <Split image={d.images.seafood} second={d.images.dish} eyebrow={d.restaurant.name} title="Cooking from the garden and the sea." text={[d.restaurant.text, d.restaurant.hours]} />
      <section className="sec-shell">
        <div className="wrap py-20 md:py-28">
          <SectionIntro eyebrow="A taste of the menu" title="Changing daily with the catch." align="center" />
          <Reveal as="div" className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2">
            {d.menu.map((c) => (
              <div data-reveal key={c.course} className="card p-8">
                <h3 className="eyebrow text-terra">{c.course}</h3>
                <ul className="mt-4 space-y-3">{c.items.map((i) => <li key={i} className="font-display text-xl">{i}</li>)}</ul>
              </div>
            ))}
          </Reveal>
          <p className="mt-8 text-center text-sm text-mist">Vegetarian, vegan and gluten-free dishes are always available.</p>
        </div>
      </section>
      <Split reverse image={d.images.bar} eyebrow={d.bar.name} title="Golden hour, every evening." text={[d.bar.text, d.bar.hours]} />
      <section className="sec-shell">
        <div className="wrap grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <ImageReveal image={d.images.garden} className="aspect-square rounded-3xl" sizes="(min-width: 768px) 50vw, 100vw" />
          <div>
            <p className="eyebrow text-terra">{d.garden.name}</p>
            <h2 className="display h2 mt-5">Twenty steps from garden to plate.</h2>
            <p className="mt-6 text-mist">{d.garden.text}</p>
          </div>
        </div>
      </section>
      <CTA title="Your table on the terrace is ready." />
    </>
  );
}
