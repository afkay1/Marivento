import { NextResponse } from "next/server";
import { findBooking, isDbMode, setStatus } from "@/lib/booking/store";
import { cancellationFor } from "@/lib/booking/policy";
import { bad, clean } from "@/lib/booking/http";

export async function POST(req: Request) {
  if (!isDbMode()) return NextResponse.json({ ok: false, mode: "demo" }, { status: 404 });
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Invalid request.", 400);
  }
  const b = await findBooking(clean(body.ref, 20), clean(body.email, 160));
  if (!b) return bad("Booking not found.", 404);
  if (b.status === "cancelled") return bad("This booking is already cancelled.");
  const policy = cancellationFor(b);
  if (!policy.allowed) return bad(policy.message);
  await setStatus(b.ref, "cancelled");
  return NextResponse.json({ ok: true, message: policy.message });
}
