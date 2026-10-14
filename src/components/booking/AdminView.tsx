"use client";

import { useEffect, useMemo, useState } from "react";
import { loadLocal } from "./local";
import { fmtDate, money } from "@/lib/format";
import type { Booking } from "@/lib/booking/model";

export interface OccRow {
  slug: string;
  name: string;
  inventory: number;
  cells: { date: string; taken: number }[];
}

interface Props {
  demo: boolean;
  bookings: Booking[];
  occupancy: OccRow[];
  days: string[];
  blocked: boolean;
  rooms: { slug: string; name: string }[];
}

export default function AdminView({ demo, bookings, occupancy, days, blocked, rooms }: Props) {
  const [local, setLocal] = useState<Booking[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Booking["status"]>("all");
  useEffect(() => {
    if (demo) setLocal(loadLocal().map((l) => l.booking));
  }, [demo]);

  const all = useMemo(() => [...local, ...bookings.filter((b) => !local.some((l) => l.ref === b.ref))], [local, bookings]);
  const rows = all.filter(
    (b) =>
      (status === "all" || b.status === status) &&
      (!q || `${b.ref} ${b.guest.firstName} ${b.guest.lastName} ${b.guest.email} ${b.roomName}`.toLowerCase().includes(q.toLowerCase()))
  );

  const confirmed = all.filter((b) => b.status === "confirmed");
  const revenue = confirmed.reduce((s, b) => s + b.price.total, 0);
  const roomNights = confirmed.reduce((s, b) => s + b.price.nights, 0);
  const adr = roomNights ? confirmed.reduce((s, b) => s + b.price.room, 0) / roomNights : 0;
  const totalUnits = occupancy.reduce((s, r) => s + r.inventory, 0);
  const occ = days.length
    ? occupancy.reduce((s, r) => s + r.cells.reduce((a, c) => a + c.taken, 0), 0) / (totalUnits * days.length)
    : 0;

  return (
    <div className="mt-6 space-y-8">
      {demo && (
        <p className="rounded-2xl bg-olive/15 px-4 py-3 text-[15px]">
          <strong>Demo mode, read-only.</strong> Sample reservations plus any bookings you made in this browser (marked “This device”). Connect a database to manage real bookings.
        </p>
      )}
      {blocked && <p role="status" className="rounded-2xl bg-olive/15 px-4 py-3">Dates blocked.</p>}

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Confirmed bookings", String(confirmed.length)],
          ["Booked revenue", money(revenue)],
          ["Average daily rate", money(adr)],
          ["Occupancy, next 14 days", `${Math.round(occ * 100)}%`],
        ].map(([k, v]) => (
          <div key={k} className="card p-5">
            <dt className="text-sm text-mist">{k}</dt>
            <dd className="mt-1 text-3xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="card overflow-hidden" aria-labelledby="occ">
        <h2 id="occ" className="p-5 font-semibold">Occupancy, next 14 open days</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-center text-sm">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-2 text-left font-semibold">Room type</th>
                {days.map((d) => <th key={d} scope="col" className="px-1 py-2 font-normal text-mist">{fmtDate(d, { day: "numeric", month: "short" })}</th>)}
              </tr>
            </thead>
            <tbody>
              {occupancy.map((r) => (
                <tr key={r.slug} className="border-t border-line">
                  <th scope="row" className="px-4 py-2 text-left font-medium">{r.name} <span className="text-mist">({r.inventory})</span></th>
                  {r.cells.map((c) => {
                    const pct = c.taken / r.inventory;
                    return (
                      <td key={c.date} className="p-1">
                        <span
                          className="block rounded-md py-1.5"
                          style={{ background: `rgba(23,70,90,${0.08 + pct * 0.8})`, color: pct > 0.55 ? "#F7F3EC" : "#13232B" }}
                          title={`${c.taken} of ${r.inventory} booked`}
                        >
                          {c.taken}/{r.inventory}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card overflow-hidden" aria-labelledby="list">
        <div className="flex flex-wrap items-end justify-between gap-4 p-5">
          <h2 id="list" className="font-semibold">Reservations ({rows.length})</h2>
          <div className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="q">Search</label>
            <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, ref, room" className="field w-56 py-2" />
            <label className="sr-only" htmlFor="st">Status</label>
            <select id="st" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="field w-44 py-2">
              <option value="all">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_payment">Pending payment</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-shell text-mist">
              <tr>
                {["Ref", "Guest", "Room", "Stay", "Rate", "Total", "Status"].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.ref} className="border-t border-line">
                  <td className="px-4 py-3 font-mono">{b.ref}{local.some((l) => l.ref === b.ref) && <span className="ml-2 rounded bg-terra/15 px-1.5 py-0.5 font-sans text-xs text-[#8a3f1c]">This device</span>}</td>
                  <td className="px-4 py-3">{b.guest.firstName} {b.guest.lastName}<span className="block text-mist">{b.guest.country}</span></td>
                  <td className="px-4 py-3">{b.roomName}</td>
                  <td className="px-4 py-3">{fmtDate(b.checkIn, { day: "numeric", month: "short" })} → {fmtDate(b.checkOut, { day: "numeric", month: "short" })}<span className="block text-mist">{b.price.nights} nights</span></td>
                  <td className="px-4 py-3">{b.rate === "nr" ? "Non-refundable" : "Flexible"}</td>
                  <td className="px-4 py-3 font-semibold">{money(b.price.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${b.status === "confirmed" ? "bg-olive/15 text-olive" : b.status === "cancelled" ? "bg-line text-mist" : "bg-terra/15 text-[#8a3f1c]"}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {!demo && (
        <section className="card p-6" aria-labelledby="block">
          <h2 id="block" className="font-semibold">Block dates (maintenance or private use)</h2>
          <form action="/api/admin/block" method="post" className="mt-4 grid gap-4 sm:grid-cols-4 sm:items-end">
            <div>
              <label htmlFor="b-room" className="label">Room type</label>
              <select id="b-room" name="room" className="field">{rooms.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}</select>
            </div>
            <div><label htmlFor="b-from" className="label">From</label><input id="b-from" name="from" type="date" required className="field" /></div>
            <div><label htmlFor="b-to" className="label">Until (exclusive)</label><input id="b-to" name="to" type="date" required className="field" /></div>
            <button type="submit" className="btn btn-sea">Block one room</button>
          </form>
          <form action="/api/admin/logout" method="post" className="mt-6">
            <button type="submit" className="text-sm text-mist underline">Sign out</button>
          </form>
        </section>
      )}
    </div>
  );
}
