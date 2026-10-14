export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://marivento-hotel.vercel.app").replace(/\/$/, "");

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const money = (n: number) => eur.format(Math.round(n));

export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
}
