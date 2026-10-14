import { neon } from "@neondatabase/serverless";
import { ROOMS } from "../data/rooms";
import { addDays, eachNight, todayISO } from "./dates";
import { demoTaken, key, seasonOf, type BookedCounts } from "./engine";
import type { Booking, BookingStatus } from "./model";

/**
 * Storage adapter. With DATABASE_URL set, bookings live in Postgres (see db/schema.sql).
 * Without it, the site runs in demo mode: realistic generated occupancy, and each visitor's
 * own bookings are kept in their browser.
 */
export const isDbMode = () => Boolean(process.env.DATABASE_URL);
const db = () => neon(process.env.DATABASE_URL as string);

type Row = Record<string, unknown>;

export async function getBookedCounts(from: string, to: string): Promise<BookedCounts> {
  const counts: BookedCounts = new Map();
  const dates = eachNight(from, to);
  if (!isDbMode()) {
    for (const r of ROOMS) for (const d of dates) counts.set(key(r.slug, d), demoTaken(r, d));
    return counts;
  }
  const sql = db();
  const rows = (await sql`select room_slug, check_in::text as check_in, check_out::text as check_out from bookings
    where status in ('confirmed','pending_payment') and check_in < ${to}::date and check_out > ${from}::date`) as Row[];
  for (const row of rows) {
    for (const d of eachNight(String(row.check_in), String(row.check_out))) {
      if (d < from || d >= to) continue;
      const k = key(String(row.room_slug), d);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  const blocks = (await sql`select room_slug, date::text as date, units from room_blocks where date >= ${from}::date and date < ${to}::date`) as Row[];
  for (const b of blocks) {
    const k = key(String(b.room_slug), String(b.date));
    counts.set(k, (counts.get(k) ?? 0) + Number(b.units));
  }
  return counts;
}

export async function saveBooking(b: Booking) {
  if (!isDbMode()) return;
  const sql = db();
  await sql`insert into bookings (ref, created_at, check_in, check_out, room_slug, status, email, data)
    values (${b.ref}, ${b.createdAt}, ${b.checkIn}::date, ${b.checkOut}::date, ${b.roomSlug}, ${b.status}, ${b.guest.email.toLowerCase()}, ${JSON.stringify(b)}::jsonb)`;
}

export async function setStatus(ref: string, status: BookingStatus) {
  if (!isDbMode()) return;
  const sql = db();
  await sql`update bookings set status = ${status}, data = jsonb_set(data, '{status}', to_jsonb(${status}::text)) where ref = ${ref}`;
}

export async function findBooking(ref: string, email: string): Promise<Booking | null> {
  if (!isDbMode()) return null;
  const sql = db();
  const rows = (await sql`select data from bookings where ref = ${ref.toUpperCase()} and email = ${email.toLowerCase()} limit 1`) as Row[];
  return rows[0] ? (rows[0].data as Booking) : null;
}

export async function listBookings(): Promise<Booking[]> {
  if (!isDbMode()) return sampleBookings();
  const sql = db();
  const rows = (await sql`select data from bookings order by check_in asc limit 500`) as Row[];
  return rows.map((r) => r.data as Booking);
}

export async function addBlock(roomSlug: string, from: string, to: string) {
  if (!isDbMode()) return;
  const sql = db();
  for (const d of eachNight(from, to)) {
    await sql`insert into room_blocks (room_slug, date, units) values (${roomSlug}, ${d}::date, 1)`;
  }
}

/* ---------- Demo sample bookings for the admin view ---------- */

const NAMES = [
  ["Emma", "Laurent", "FR"], ["Lucas", "Meyer", "DE"], ["Olivia", "Bennett", "GB"], ["Mateo", "García", "ES"], ["Aisha", "Rahman", "AE"],
  ["Noah", "Fischer", "CH"], ["Sophie", "Dubois", "BE"], ["Liam", "O'Connor", "IE"], ["Yuki", "Tanaka", "JP"], ["Isabella", "Rossi", "IT"],
  ["Ethan", "Clarke", "US"], ["Mia", "Jansen", "NL"], ["Omar", "Haddad", "SA"], ["Chloe", "Martin", "CA"], ["Leo", "Nilsson", "SE"],
  ["Ava", "Kowalski", "PL"], ["James", "Wright", "AU"], ["Nora", "Berg", "NO"], ["Hugo", "Silva", "PT"], ["Layla", "Khan", "GB"],
];

export function nextOpenDate(from = todayISO()) {
  let d = from;
  for (let i = 0; i < 400 && !seasonOf(d); i++) d = addDays(d, 1);
  return d;
}

export function sampleBookings(): Booking[] {
  const start = nextOpenDate();
  const out: Booking[] = [];
  NAMES.forEach(([first, last, country], i) => {
    const room = ROOMS[(i * 7) % ROOMS.length];
    let checkIn = addDays(start, (i * 3) % 24);
    if (!seasonOf(checkIn)) checkIn = nextOpenDate(checkIn);
    const nights = 2 + (i % 5);
    const checkOut = addDays(checkIn, nights);
    const nightly = room.prices[seasonOf(checkIn) ?? "shoulder"];
    const rate = i % 3 === 0 ? "nr" : "flex";
    const roomTotal = Math.round(nightly * nights * (rate === "nr" ? 0.88 : 1));
    const breakfast = i % 2 === 0;
    const bTotal = breakfast ? 64 * nights : 0;
    const total = roomTotal + bTotal;
    out.push({
      ref: `MRV-D${String(1000 + i * 37).slice(-4)}${"ABCDEFGHJK"[i % 10]}`,
      createdAt: addDays(todayISO(), -((i * 5) % 40)) + "T10:00:00.000Z",
      checkIn,
      checkOut,
      adults: 2,
      children: 0,
      roomSlug: room.slug,
      roomName: room.name,
      rate,
      breakfast,
      guest: { firstName: first, lastName: last, email: `${first.toLowerCase()}@example.com`, phone: "", country, arrival: "", requests: "" },
      price: {
        nights, room: roomTotal, roomBeforeDiscounts: nightly * nights, offerDiscount: 0, rateDiscount: nightly * nights - roomTotal,
        breakfast: bTotal, extras: [], extrasTotal: 0, total, cityTax: 10 * Math.min(nights, 7),
        dueNow: rate === "nr" ? total : Math.round(roomTotal / nights), dueAtHotel: 0,
      },
      status: i === 6 || i === 13 ? "cancelled" : "confirmed",
      payment: "demo",
    });
  });
  return out;
}
