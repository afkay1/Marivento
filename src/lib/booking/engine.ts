import { ROOMS, RATE_PLANS, BREAKFAST, CITY_TAX, EXTRAS, getRoom } from "../data/rooms";
import type { RatePlan, RoomType, Season } from "../types";
import { addDays, eachNight, nightsBetween, parse, todayISO } from "./dates";

/* ---------------- Seasons and rules ---------------- */

/** Open 1 April – 31 October. April, May and October are shoulder season; June–September is high season. */
export function seasonOf(iso: string): Season | null {
  const m = parse(iso).getUTCMonth() + 1;
  if (m >= 6 && m <= 9) return "high";
  if (m === 4 || m === 5 || m === 10) return "shoulder";
  return null;
}
export const minStayFor = (arrival: string) => (seasonOf(arrival) === "high" ? 3 : 2);
export const MAX_NIGHTS = 21;
export const BOOKING_WINDOW_DAYS = 540;

/** Friday and Saturday nights cost 10% more. */
export function nightlyPrice(room: RoomType, iso: string): number | null {
  const s = seasonOf(iso);
  if (!s) return null;
  const dow = parse(iso).getUTCDay();
  const weekend = dow === 5 || dow === 6;
  return Math.round(room.prices[s] * (weekend ? 1.1 : 1));
}

/* ---------------- Availability ---------------- */

export type BookedCounts = Map<string, number>; // key `${slug}|${date}` → rooms taken
export const key = (slug: string, date: string) => `${slug}|${date}`;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/** Realistic, repeatable demo occupancy: busier in high season and at weekends. */
export function demoTaken(room: RoomType, iso: string): number {
  const s = seasonOf(iso);
  if (!s) return room.inventory;
  const dow = parse(iso).getUTCDay();
  const m = parse(iso).getUTCMonth() + 1;
  let base = s === "high" ? 0.62 : 0.34;
  if (m === 8) base += 0.15;
  if (dow === 5 || dow === 6) base += 0.12;
  const noise = (hash(room.slug + iso) - 0.5) * 0.7;
  const rate = Math.min(1, Math.max(0, base + noise));
  return Math.min(room.inventory, Math.round(room.inventory * rate));
}

export function available(room: RoomType, iso: string, booked: BookedCounts) {
  if (!seasonOf(iso)) return 0;
  return Math.max(0, room.inventory - (booked.get(key(room.slug, iso)) ?? 0));
}

/* ---------------- Search validation ---------------- */

export interface SearchInput {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export function validateSearch(q: SearchInput): string | null {
  const today = todayISO();
  const nights = nightsBetween(q.checkIn, q.checkOut);
  if (q.checkIn < today) return "Arrival date is in the past.";
  if (nights < 1) return "Departure must be after arrival.";
  if (nights > MAX_NIGHTS) return `Stays are limited to ${MAX_NIGHTS} nights online. Please contact us for longer stays.`;
  if (q.checkIn > addDays(today, BOOKING_WINDOW_DAYS)) return "We take bookings up to 18 months ahead.";
  if (!Number.isInteger(q.adults) || q.adults < 1 || q.adults > 4) return "Choose between 1 and 4 adults.";
  if (!Number.isInteger(q.children) || q.children < 0 || q.children > 3) return "Choose up to 3 children.";
  const nightsList = eachNight(q.checkIn, q.checkOut);
  if (nightsList.some((n) => !seasonOf(n))) return "The hotel is closed from 1 November to 31 March. Please choose dates between April and October.";
  const min = minStayFor(q.checkIn);
  if (nights < min) return `A minimum stay of ${min} nights applies for this arrival date.`;
  return null;
}

/* ---------------- Quotes ---------------- */

export interface Night {
  date: string;
  price: number;
}

export interface RoomQuote {
  slug: string;
  name: string;
  available: boolean;
  reason?: string;
  roomsLeft: number;
  nights: Night[];
  subtotal: number; // sum of nightly prices
  offerDiscount: number; // Stay Longer: 5th night free
  rates: Record<RatePlan, { total: number; perNight: number }>;
}

export function quoteRoom(room: RoomType, q: SearchInput, booked: BookedCounts): RoomQuote {
  const nightsList = eachNight(q.checkIn, q.checkOut);
  const nights: Night[] = nightsList.map((d) => ({ date: d, price: nightlyPrice(room, d) ?? 0 }));
  const subtotal = nights.reduce((s, n) => s + n.price, 0);
  const offerDiscount = nights.length >= 5 ? nights[4].price : 0;
  const base = subtotal - offerDiscount;
  const left = Math.min(...nightsList.map((d) => available(room, d, booked)));
  let reason: string | undefined;
  if (q.adults > room.maxAdults || q.adults + q.children > room.maxGuests) reason = `Sleeps up to ${room.maxGuests} (${room.maxAdults} adults).`;
  else if (left <= 0) reason = "Sold out for these dates.";
  const flex = Math.round(base);
  const nr = Math.round(base * (1 - RATE_PLANS.nr.discount));
  return {
    slug: room.slug,
    name: room.name,
    available: !reason,
    reason,
    roomsLeft: Math.max(0, left),
    nights,
    subtotal,
    offerDiscount,
    rates: {
      flex: { total: flex, perNight: Math.round(flex / nights.length) },
      nr: { total: nr, perNight: Math.round(nr / nights.length) },
    },
  };
}

export function quoteAll(q: SearchInput, booked: BookedCounts) {
  return ROOMS.map((r) => quoteRoom(r, q, booked));
}

/* ---------------- Final price ---------------- */

export interface Selection extends SearchInput {
  roomSlug: string;
  rate: RatePlan;
  breakfast: boolean;
  extras: Record<string, number>; // id → quantity
}

export interface PriceBreakdown {
  nights: number;
  room: number;
  roomBeforeDiscounts: number;
  offerDiscount: number;
  rateDiscount: number;
  breakfast: number;
  extras: { id: string; name: string; qty: number; unitPrice: number; total: number }[];
  extrasTotal: number;
  total: number; // everything payable to the hotel except the city tax
  cityTax: number;
  dueNow: number;
  dueAtHotel: number; // includes city tax
}

export function priceSelection(sel: Selection, booked: BookedCounts): { quote: RoomQuote; price: PriceBreakdown } | { error: string } {
  const err = validateSearch(sel);
  if (err) return { error: err };
  const room = getRoom(sel.roomSlug);
  if (!room) return { error: "Unknown room." };
  if (sel.rate !== "flex" && sel.rate !== "nr") return { error: "Unknown rate." };
  const quote = quoteRoom(room, sel, booked);
  if (!quote.available) return { error: quote.reason ?? "This room is not available." };
  const nights = quote.nights.length;
  const roomTotal = quote.rates[sel.rate].total;
  const breakfast = sel.breakfast ? (sel.adults * BREAKFAST.adult + sel.children * BREAKFAST.child) * nights : 0;
  const extras = Object.entries(sel.extras || {})
    .filter(([, qty]) => Number.isInteger(qty) && qty > 0)
    .map(([id, qty]) => {
      const e = EXTRAS.find((x) => x.id === id);
      if (!e) return null;
      const q = Math.min(qty, e.unit === "person" ? sel.adults + sel.children : 1);
      return { id, name: e.name, qty: q, unitPrice: e.price, total: e.price * q };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const extrasTotal = extras.reduce((s, e) => s + e.total, 0);
  const total = roomTotal + breakfast + extrasTotal;
  const cityTax = sel.adults * CITY_TAX.perAdultNight * Math.min(nights, CITY_TAX.maxNights);
  const dueNow = sel.rate === "nr" ? total : Math.round(roomTotal / nights);
  return {
    quote,
    price: {
      nights,
      room: roomTotal,
      roomBeforeDiscounts: quote.subtotal,
      offerDiscount: quote.offerDiscount,
      rateDiscount: quote.subtotal - quote.offerDiscount - roomTotal,
      breakfast,
      extras,
      extrasTotal,
      total,
      cityTax,
      dueNow,
      dueAtHotel: total - dueNow + cityTax,
    },
  };
}

/* ---------------- Calendar ---------------- */

export interface CalendarDay {
  date: string;
  open: boolean;
  soldOut: boolean;
  fromPrice: number | null;
  minStay: number;
}

export function calendarDays(dates: string[], booked: BookedCounts): CalendarDay[] {
  return dates.map((d) => {
    if (!seasonOf(d)) return { date: d, open: false, soldOut: false, fromPrice: null, minStay: 0 };
    const prices = ROOMS.filter((r) => available(r, d, booked) > 0).map((r) => nightlyPrice(r, d) ?? Infinity);
    return { date: d, open: true, soldOut: prices.length === 0, fromPrice: prices.length ? Math.min(...prices) : null, minStay: minStayFor(d) };
  });
}

/** Lowest shoulder-season price, used for "from" prices on marketing pages and structured data. */
export const fromPrice = (room: RoomType) => room.prices.shoulder;
