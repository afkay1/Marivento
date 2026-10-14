import { money } from "../format";
import { nightsBetween, todayISO } from "./dates";
import type { Booking } from "./model";

/** Cancellation terms shared by the server and the browser. */
export function cancellationFor(b: Pick<Booking, "rate" | "checkIn" | "status" | "price">, today = todayISO()) {
  if (b.status === "cancelled") return { allowed: false, free: false, message: "This booking is already cancelled." };
  const daysBefore = nightsBetween(today, b.checkIn);
  if (daysBefore < 0) return { allowed: false, free: false, message: "This stay has already started." };
  if (b.rate === "nr") return { allowed: false, free: false, message: "Non-refundable bookings cannot be cancelled online. Please contact us." };
  if (daysBefore >= 7) return { allowed: true, free: true, message: "Free cancellation: your deposit will be refunded in full." };
  return { allowed: true, free: false, message: `Within 7 days of arrival the first night (${money(b.price.dueNow)}) is non-refundable.` };
}
