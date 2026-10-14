import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { HOTEL } from "@/lib/data/hotel";
import { RATE_PLANS, BREAKFAST, CITY_TAX } from "@/lib/data/rooms";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Policies",
  description: "Booking, cancellation, payment, privacy and house policies for Marivento.",
  alternates: { canonical: "/policies" },
};

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-28 border-t border-line py-10">
    <h2 className="display h3">{title}</h2>
    <div className="mt-4 space-y-3 text-mist">{children}</div>
  </section>
);

export default function PoliciesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Policies", path: "/policies" }])} />
      <section className="sec-chalk pt-[calc(var(--header)+48px)]">
        <div className="wrap max-w-3xl pb-24">
          <p className="eyebrow text-terra">Policies</p>
          <h1 className="display h1 mt-4">The small print, in plain words.</h1>
          <p className="mt-6 text-sm text-mist">Marivento is a fictional hotel created as a design concept. These policies show how a real hotel site would present them.</p>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-3 text-sm">
            {[["cancellation", "Cancellation"], ["payment", "Payment & prices"], ["stay", "Your stay"], ["privacy", "Privacy"], ["terms", "Booking terms"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="rounded-full border border-line px-4 py-1.5 hover:border-sea">{label}</a>
            ))}
          </nav>
          <div className="mt-10">
            <Section id="cancellation" title="Cancellation">
              <p><strong className="text-ink">{RATE_PLANS.flex.name} rate:</strong> {RATE_PLANS.flex.detail} Cancellations within 7 days of arrival, or no-shows, are charged the first night.</p>
              <p><strong className="text-ink">{RATE_PLANS.nr.name} rate:</strong> {RATE_PLANS.nr.detail}</p>
              <p>You can cancel eligible bookings online from the Manage booking page.</p>
            </Section>
            <Section id="payment" title="Payment & prices">
              <p>Every price we show is the total price for your room, including all mandatory hotel charges. There are no resort fees or hidden service charges.</p>
              <p>The local city tax of €{CITY_TAX.perAdultNight} per adult per night (first {CITY_TAX.maxNights} nights) is set by the municipality, shown before you pay and settled at the hotel.</p>
              <p>Breakfast is optional: €{BREAKFAST.adult} per adult and €{BREAKFAST.child} per child per night. We accept Visa, Mastercard and American Express.</p>
            </Section>
            <Section id="stay" title="Your stay">
              <p>Check-in from {HOTEL.checkIn}; check-out by {HOTEL.checkOut}. The hotel is open {HOTEL.season}. Smoking is not permitted indoors. Small dogs are welcome in selected rooms.</p>
            </Section>
            <Section id="privacy" title="Privacy">
              <p>We use your details only to manage your booking and stay, and to contact you about it. We never sell your data. Card payments are processed securely by our payment provider and we never see your full card number.</p>
              <p>You can ask us to access, correct or delete your data at any time by writing to {HOTEL.email}.</p>
            </Section>
            <Section id="terms" title="Booking terms">
              <p>Your booking is a contract between you and {HOTEL.legalName}. Rates are per room per night for the number of guests stated. Additional guests must be declared at booking.</p>
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}
