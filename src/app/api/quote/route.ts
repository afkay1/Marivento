import { NextResponse } from "next/server";
import { quoteAll, validateSearch } from "@/lib/booking/engine";
import { getBookedCounts } from "@/lib/booking/store";
import { bad, readSearch } from "@/lib/booking/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Invalid request.", 400);
  }
  const q = readSearch(body);
  if (!q) return bad("Please choose your dates.");
  const err = validateSearch(q);
  if (err) return bad(err);
  const booked = await getBookedCounts(q.checkIn, q.checkOut);
  return NextResponse.json({ ok: true, search: q, rooms: quoteAll(q, booked) });
}
