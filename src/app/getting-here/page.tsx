import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Split from "@/components/Split";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { HOTEL, HOME_IMAGES } from "@/lib/data/hotel";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Getting Here & Contact",
  description: "How to reach Marivento in Praiano on the Amalfi Coast by boat, car or ferry, and how to contact the hotel.",
  alternates: { canonical: "/getting-here" },
};

const ROUTES = [
  { title: "By boat (our favourite)", text: "Private boat from Naples, Sorrento or Positano to our jetty. A lift takes you and your luggage up to reception. Add the boat transfer when you book." },
  { title: "By car", text: "Naples airport is about 90 minutes away. We arrange private cars, or you can drive and use our valet parking (€40 per day)." },
  { title: "By ferry", text: "Public ferries run from Naples and Salerno to Positano and Amalfi from April to October. We collect you from either port." },
];

export default function GettingHerePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Getting Here & Contact", path: "/getting-here" }])} />
      <PageHero image={HOME_IMAGES.arrival} eyebrow="Getting here" title="Arrive by sea." text="The most beautiful way to arrive is by boat, straight to our private jetty." />
      <section className="sec-chalk">
        <div className="wrap py-20 md:py-28">
          <Reveal as="ul" className="grid gap-6 md:grid-cols-3">
            {ROUTES.map((r) => (
              <li data-reveal key={r.title} className="card p-7">
                <h2 className="display h3">{r.title}</h2>
                <p className="mt-3 text-mist">{r.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <Split
        theme="sec-shell"
        image={HOME_IMAGES.reception}
        eyebrow="Contact"
        title="We're here to help."
        text={`Reception is open 24 hours during the season (${HOTEL.season}).`}
      >
        <address className="space-y-2 not-italic text-ink">
          <p>{HOTEL.legalName}<br />{HOTEL.address.street}, {HOTEL.address.postalCode} {HOTEL.address.locality}, {HOTEL.address.country}</p>
          <p><a href={HOTEL.phoneHref} className="link-arrow">{HOTEL.phone}</a></p>
          <p><a href={`mailto:${HOTEL.email}`} className="link-arrow">{HOTEL.email}</a></p>
          <p><a href={HOTEL.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-arrow">Message us on WhatsApp</a></p>
          <p><a href={HOTEL.mapUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">Open in Google Maps</a></p>
        </address>
      </Split>
    </>
  );
}
