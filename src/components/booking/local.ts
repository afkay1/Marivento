import type { Booking } from "@/lib/booking/model";

/** Demo mode keeps each visitor's own bookings in their browser. */
const KEY = "marivento-bookings";

export interface LocalBooking {
  booking: Booking;
  token: string;
}

export function loadLocal(): LocalBooking[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as LocalBooking[];
  } catch {
    return [];
  }
}

export function saveLocal(entry: LocalBooking) {
  try {
    const all = loadLocal().filter((b) => b.booking.ref !== entry.booking.ref);
    all.unshift(entry);
    localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20)));
  } catch {
    /* storage unavailable */
  }
}

export function updateLocalStatus(ref: string, status: Booking["status"]) {
  try {
    const all = loadLocal().map((b) => (b.booking.ref === ref ? { ...b, booking: { ...b.booking, status } } : b));
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}
