import { HOTEL } from "../data/hotel";
import { money, fmtDate, SITE_URL } from "../format";
import type { Booking } from "./model";

/* ---------------- Stripe (test mode) via REST, no SDK needed ---------------- */

export const isStripeMode = () => Boolean(process.env.STRIPE_SECRET_KEY);

export async function createCheckout(b: Booking, token: string): Promise<string> {
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("customer_email", b.guest.email);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "eur");
  params.set("line_items[0][price_data][unit_amount]", String(Math.round(b.price.dueNow * 100)));
  params.set("line_items[0][price_data][product_data][name]", `${b.roomName}, ${fmtDate(b.checkIn)} – ${fmtDate(b.checkOut)}`);
  params.set(
    "line_items[0][price_data][product_data][description]",
    b.rate === "nr" ? "Non-refundable rate, paid in full" : "Flexible rate, first-night deposit"
  );
  params.set("metadata[ref]", b.ref);
  params.set("success_url", `${SITE_URL}/book/confirmation?token=${encodeURIComponent(token)}&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${SITE_URL}/book?checkIn=${b.checkIn}&checkOut=${b.checkOut}&adults=${b.adults}&children=${b.children}`);
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const json = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !json.url) throw new Error(json.error?.message || "Stripe checkout failed");
  return json.url;
}

export async function isSessionPaid(sessionId: string, ref: string): Promise<boolean> {
  if (!isStripeMode() || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return false;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return false;
  const s = (await res.json()) as { payment_status?: string; metadata?: { ref?: string } };
  return s.payment_status === "paid" && s.metadata?.ref === ref;
}

/* ---------------- Email (Resend) ---------------- */

export async function sendConfirmation(b: Booking, token: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const link = `${SITE_URL}/book/confirmation?token=${encodeURIComponent(token)}`;
  const text = [
    `Dear ${b.guest.firstName},`,
    "",
    `Your stay at ${HOTEL.name} is confirmed.`,
    "",
    `Booking reference: ${b.ref}`,
    `${b.roomName}, ${b.price.nights} night${b.price.nights > 1 ? "s" : ""}`,
    `Arrival: ${fmtDate(b.checkIn)} (from ${HOTEL.checkIn})`,
    `Departure: ${fmtDate(b.checkOut)} (by ${HOTEL.checkOut})`,
    `Total: ${money(b.price.total)} · Paid now: ${money(b.price.dueNow)} · Due at the hotel: ${money(b.price.dueAtHotel)} (incl. city tax)`,
    "",
    `View or manage your booking: ${link}`,
    "",
    `${HOTEL.name} · ${HOTEL.address.street}, ${HOTEL.address.locality} · ${HOTEL.phone}`,
  ].join("\n");
  const send = (to: string, subject: string) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || `${HOTEL.name} <onboarding@resend.dev>`, to: [to], subject, text }),
    }).catch(() => undefined);
  await send(b.guest.email, `Your ${HOTEL.name} booking ${b.ref}`);
  if (process.env.HOTEL_INBOX) await send(process.env.HOTEL_INBOX, `New booking ${b.ref}: ${b.roomName}, ${b.checkIn}`);
}

/* ---------------- Calendar file ---------------- */

export function icsFor(b: Booking) {
  const d = (iso: string) => iso.replace(/-/g, "");
  const esc = (s: string) => s.replace(/[,;\\]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Marivento//Booking//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@marivento`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${d(b.checkIn)}`,
    `DTEND;VALUE=DATE:${d(b.checkOut)}`,
    `SUMMARY:${esc(`Stay at ${HOTEL.name} (${b.ref})`)}`,
    `LOCATION:${esc(`${HOTEL.address.street}, ${HOTEL.address.locality}, ${HOTEL.address.country}`)}`,
    `DESCRIPTION:${esc(`${b.roomName}. Check-in from ${HOTEL.checkIn}, check-out by ${HOTEL.checkOut}. ${HOTEL.phone}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
