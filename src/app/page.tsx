import Link from "next/link";
import PageHero from "@/components/PageHero";
import SearchBar from "@/components/SearchBar";
import SectionIntro from "@/components/SectionIntro";
import RoomCarousel from "@/components/RoomCarousel";
import Split from "@/components/Split";
import Parallax from "@/components/Parallax";
import ImageReveal from "@/components/ImageReveal";
import Reveal from "@/components/Reveal";
import Reviews from "@/components/Reviews";
import CTA from "@/components/CTA";
import TextReveal from "@/components/TextReveal";
import { HOME_IMAGES, DINING, SPA, EXPERIENCES, OFFERS, HOTEL } from "@/lib/data/hotel";

export default function Home() {
  return (
    <>
      <PageHero tall image={HOME_IMAGES.hero} eyebrow="Praiano · Amalfi Coast · Since 1782" title="Wake up above the sea." text="A 24-room villa hotel carved into the cliffs, with terraces of lemons, a pool on the edge of the sea and a boat at the jetty.">
        <div className="max-w-5xl">
          <SearchBar />
        </div>
      </PageHero>

      <section className="sec-chalk">
        <div className="wrap grid items-center gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-6">
            <p className="eyebrow text-terra">Benvenuti</p>
            <TextReveal text="A family villa that happens to be a hotel." className="display h1 mt-5" />
            <Reveal className="mt-8 max-w-lg space-y-5 text-mist">
              <p data-reveal className="lead">
                Twenty-four rooms, three terraces and one view. Marivento has been a home on this cliff for over two centuries, and we still run it like one.
              </p>
              <dl data-reveal className="grid grid-cols-3 gap-6 border-t border-line pt-6 text-ink">
                <div><dt className="text-sm text-mist">Rooms & suites</dt><dd className="display h3 mt-1">{HOTEL.rooms}</dd></div>
                <div><dt className="text-sm text-mist">Guest rating</dt><dd className="display h3 mt-1">{HOTEL.rating.value}</dd></div>
                <div><dt className="text-sm text-mist">Family home since</dt><dd className="display h3 mt-1">1782</dd></div>
              </dl>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <ImageReveal image={HOME_IMAGES.intro} className="aspect-[4/5] rounded-[2rem]" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="sec-shell py-24 md:py-32">
        <div className="wrap">
          <SectionIntro eyebrow="Rooms & suites" title="Six ways to wake up to the sea." text="From classic rooms with a Juliet balcony to a two-bedroom villa with its own pool." link={{ href: "/rooms", label: "Compare all rooms" }} />
        </div>
        <div className="mt-12">
          <RoomCarousel />
        </div>
      </section>

      <section aria-label="The pool">
        <Parallax image={HOME_IMAGES.pool} className="h-[85svh] min-h-[480px] bg-deep" amount={8}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="wrap absolute inset-x-0 bottom-0 pb-14 text-chalk md:pb-20">
            <p className="eyebrow">The pool terrace</p>
            <p className="display h1 mt-4 max-w-3xl">Swim on the edge of the Tyrrhenian.</p>
          </div>
        </Parallax>
      </section>

      <Split
        image={HOME_IMAGES.breakfast}
        second={DINING.images.dish}
        eyebrow={`Dining at ${DINING.restaurant.name}`}
        title="Lemons from the terrace, fish from the boats."
        text={DINING.restaurant.text}
        link={{ href: "/dining", label: "Explore dining" }}
      />

      <Split
        reverse
        theme="sec-shell"
        image={SPA.images.hero}
        second={SPA.images.ritual}
        eyebrow={SPA.name}
        title="A spa carved into the rock."
        text={SPA.text}
        link={{ href: "/spa", label: "Discover the spa" }}
      />

      <section className="sec-chalk">
        <div className="wrap py-24 md:py-32">
          <SectionIntro eyebrow="Experiences" title="The coast, the way locals know it." link={{ href: "/experiences", label: "All experiences" }} />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[EXPERIENCES[0], EXPERIENCES[2], EXPERIENCES[1]].map((e, i) => (
              <Link key={e.slug} href="/experiences" className={`group block ${i === 1 ? "md:mt-16" : ""}`}>
                <ImageReveal image={e.image} className="aspect-[4/5] rounded-3xl" sizes="(min-width: 768px) 33vw, 100vw" zoom />
                <h3 className="display h3 mt-5">{e.name}</h3>
                <p className="mt-2 text-mist">{e.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      <section className="sec-chalk">
        <div className="wrap py-24 md:py-32">
          <SectionIntro eyebrow="Offers" title="Reasons to stay a little longer." link={{ href: "/offers", label: "See all offers" }} />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {OFFERS.map((o) => (
              <Link key={o.slug} href="/offers" className="group card overflow-hidden">
                <ImageReveal image={o.image} className="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" zoom />
                <div className="p-6">
                  <h3 className="display h3">{o.name}</h3>
                  <p className="mt-2 text-mist">{o.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Split
        theme="sec-shell"
        image={HOME_IMAGES.night}
        second={HOME_IMAGES.tiles}
        eyebrow="Our story"
        title="Three generations on the same cliff."
        text="Built by a lemon merchant in 1782, opened to travellers by Nonna Rosa in 1954 and carefully restored by her grandchildren. Every majolica tile and fresco is original."
        link={{ href: "/our-story", label: "Read our story" }}
      />

      <CTA />
    </>
  );
}
