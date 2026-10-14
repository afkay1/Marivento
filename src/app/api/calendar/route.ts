import { NextResponse } from "next/server";
import { addMonths, daysInMonth, isISODate, monthStart, addDays } from "@/lib/booking/dates";
import { calendarDays } from "@/lib/booking/engine";
import { getBookedCounts } from "@/lib/booking/store";
import { bad } from "@/lib/booking/http";

export const dynamic = "force-dynamic";

/** Nightly "from" prices and availability for a run of months. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const months = Math.min(3, Math.max(1, parseInt(url.searchParams.get("months") || "2", 10) || 2));
  if (!isISODate(from)) return bad("Invalid month.");
  const start = monthStart(from);
  const end = addMonths(start, months);
  const dates: string[] = [];
  for (let m = 0; m < months; m++) {
    const ms = addMonths(start, m);
    for (let i = 0; i < daysInMonth(ms); i++) dates.push(addDays(ms, i));
  }
  const booked = await getBookedCounts(start, end);
  return NextResponse.json({ ok: true, days: calendarDays(dates, booked) }, { headers: { "Cache-Control": "no-store" } });
}
