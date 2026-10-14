import { NextResponse } from "next/server";
import { findBooking, isDbMode } from "@/lib/booking/store";
import { signBooking } from "@/lib/booking/token";
import { bad, clean, isEmail } from "@/lib/booking/http";

export async function POST(req: Request) {
  if (!isDbMode()) return NextResponse.json({ ok: false, mode: "demo" }, { status: 404 });
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Invalid request.", 400);
  }
  const ref = clean(body.ref, 20).toUpperCase();
  const email = clean(body.email, 160).toLowerCase();
  if (!ref || !isEmail(email)) return bad("Enter your booking reference and email.");
  const b = await findBooking(ref, email);
  if (!b) return bad("We could not find a booking with those details.", 404);
  return NextResponse.json({ ok: true, booking: b, token: signBooking(b) });
}
