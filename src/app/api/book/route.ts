import { NextResponse } from "next/server";
import { priceSelection } from "@/lib/booking/engine";
import { getBookedCounts, saveBooking } from "@/lib/booking/store";
import { newRef, signBooking } from "@/lib/booking/token";
import { createCheckout, isStripeMode, sendConfirmation } from "@/lib/booking/services";
import { bad, clean, isEmail, isPhone, readSearch } from "@/lib/booking/http";
import type { Booking } from "@/lib/booking/model";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Invalid request.", 400);
  }
  if (clean(body.company)) return bad("Invalid request.", 400); // honeypot
  const q = readSearch(body);
  if (!q) return bad("Please choose your dates.");

  const g = (body.guest ?? {}) as Record<string, unknown>;
  const guest = {
    firstName: clean(g.firstName, 60),
    lastName: clean(g.lastName, 60),
    email: clean(g.email, 160).toLowerCase(),
    phone: clean(g.phone, 30),
    country: clean(g.country, 60),
    arrival: clean(g.arrival, 40),
    requests: clean(g.requests, 1000),
  };
  if (!guest.firstName || !guest.lastName) return bad("Please enter your name.");
  if (!isEmail(guest.email)) return bad("Please enter a valid email address.");
  if (!isPhone(guest.phone)) return bad("Please enter a valid phone number.");
  if (body.acceptTerms !== true) return bad("Please accept the booking terms.");

  const extrasIn = (body.extras ?? {}) as Record<string, unknown>;
  const extras: Record<string, number> = {};
  for (const [k, v] of Object.entries(extrasIn)) if (typeof v === "number") extras[k] = v;

  const booked = await getBookedCounts(q.checkIn, q.checkOut);
  const result = priceSelection(
    { ...q, roomSlug: clean(body.roomSlug, 60), rate: body.rate === "nr" ? "nr" : "flex", breakfast: body.breakfast === true, extras },
    booked
  );
  if ("error" in result) return bad(result.error);

  const stripe = isStripeMode();
  const booking: Booking = {
    ref: newRef(),
    createdAt: new Date().toISOString(),
    checkIn: q.checkIn,
    checkOut: q.checkOut,
    adults: q.adults,
    children: q.children,
    roomSlug: result.quote.slug,
    roomName: result.quote.name,
    rate: body.rate === "nr" ? "nr" : "flex",
    breakfast: body.breakfast === true,
    guest,
    price: result.price,
    status: stripe ? "pending_payment" : "confirmed",
    payment: stripe ? "stripe" : "demo",
  };

  try {
    await saveBooking(booking);
  } catch {
    return bad("We could not save your booking. Please try again.", 500);
  }
  const token = signBooking(booking);

  if (stripe) {
    try {
      const url = await createCheckout(booking, token);
      return NextResponse.json({ ok: true, ref: booking.ref, checkoutUrl: url });
    } catch (e) {
      return bad(e instanceof Error ? e.message : "Payment could not be started.", 502);
    }
  }
  await sendConfirmation(booking, token);
  return NextResponse.json({ ok: true, ref: booking.ref, token });
}
