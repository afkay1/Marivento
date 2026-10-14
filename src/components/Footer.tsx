import Link from "next/link";
import { HOTEL, NAV, FOOTER_LINKS, AWARDS } from "@/lib/data/hotel";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-deep text-chalk">
      <div className="wrap grid gap-12 pb-28 pt-20 md:grid-cols-12 md:pb-20">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-xs text-chalk/70">{HOTEL.tagline}. Open {HOTEL.season}.</p>
          <Link href="/book" className="btn btn-terra mt-8">Book direct · best rate</Link>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-5">
          <div>
            <p className="eyebrow text-chalk/50">Stay</p>
            <ul className="mt-5 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href} className="text-chalk/85 hover:text-white">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-chalk/50">Plan</p>
            <ul className="mt-5 space-y-2.5">
              <li><Link href="/book" className="text-chalk/85 hover:text-white">Check availability</Link></li>
              {FOOTER_LINKS.map((n) => (
                <li key={n.href}><Link href={n.href} className="text-chalk/85 hover:text-white">{n.label}</Link></li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="md:col-span-3">
          <p className="eyebrow text-chalk/50">Contact</p>
          <address className="mt-5 space-y-2.5 not-italic text-chalk/85">
            <p>{HOTEL.address.street}<br />{HOTEL.address.postalCode} {HOTEL.address.locality}, {HOTEL.address.country}</p>
            <p><a href={HOTEL.phoneHref} className="hover:text-white">{HOTEL.phone}</a></p>
            <p><a href={`mailto:${HOTEL.email}`} className="hover:text-white">{HOTEL.email}</a></p>
            <p><a href={HOTEL.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></p>
          </address>
        </div>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-chalk/55 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Marivento. A fictional hotel, designed and built by MYFRIX as a concept project.</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">{AWARDS.map((a) => <li key={a}>{a}</li>)}</ul>
      </div>
    </footer>
  );
}
