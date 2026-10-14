import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { FAQS } from "@/lib/data/hotel";
import { breadcrumbLd, faqLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about check-in, transfers, parking, cancellation, breakfast, children, pets, accessibility and city tax at Marivento.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "FAQ", path: "/faq" }])} />
      <JsonLd data={faqLd()} />
      <section className="sec-chalk pt-[calc(var(--header)+48px)]">
        <div className="wrap max-w-4xl pb-24">
          <p className="eyebrow text-terra">Questions</p>
          <h1 className="display h1 mt-4">Good to know.</h1>
          <div className="mt-12 divide-y divide-line border-y border-line">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                  {f.q}
                  <span aria-hidden className="text-2xl text-terra transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-mist">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-mist">
            Still curious? Ask our concierge in the chat, or see <Link href="/getting-here" className="link-arrow">contact details</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
