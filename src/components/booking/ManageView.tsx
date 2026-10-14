"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookingDetails from "./BookingDetails";
import { loadLocal, updateLocalStatus, type LocalBooking } from "./local";
import { cancellationFor } from "@/lib/booking/policy";
import { HOTEL } from "@/lib/data/hotel";
import type { Booking } from "@/lib/booking/model";

export default function ManageView({ db }: { db: boolean }) {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [found, setFound] = useState<{ booking: Booking; token: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<LocalBooking[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => setRecent(loadLocal()), []);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    const r = ref.trim().toUpperCase();
    const m = email.trim().toLowerCase();
    if (!r || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) {
      setError("Enter your booking reference and the email you booked with.");
      return;
    }
    setBusy(true);
    try {
      if (db) {
        const res = await fetch("/api/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref: r, email: m }) });
        const j = (await res.json()) as { ok: boolean; booking?: Booking; token?: string; error?: string };
        if (j.ok && j.booking && j.token) setFound({ booking: j.booking, token: j.token });
        else setError(j.error || "We could not find that booking.");
      } else {
        const local = loadLocal().find((x) => x.booking.ref === r && x.booking.guest.email === m);
        if (local) setFound(local);
        else setError("We could not find that booking in this browser. In demo mode, bookings are saved only on the device you booked from.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!found) return;
    setBusy(true);
    try {
      if (db) {
        const res = await fetch("/api/manage/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref: found.booking.ref, email: found.booking.guest.email }) });
        const j = (await res.json()) as { ok: boolean; message?: string; error?: string };
        if (!j.ok) throw new Error(j.error || "Cancellation failed.");
        setNotice(j.message || "Your booking has been cancelled.");
      } else {
        updateLocalStatus(found.booking.ref, "cancelled");
        setNotice(`${cancellationFor(found.booking).message} (Demo: nothing was charged.)`);
      }
      setFound({ ...found, booking: { ...found.booking, status: "cancelled" } });
      setRecent(loadLocal());
      setConfirming(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const policy = found ? cancellationFor(found.booking) : null;

  return (
    <div className="wrap max-w-3xl pb-24 pt-[calc(var(--header)+40px)]">
      <p className="eyebrow text-terra">Your booking</p>
      <h1 className="display h1 mt-4">Manage your stay.</h1>

      {!found && (
        <>
          <form onSubmit={lookup} noValidate className="card mt-8 grid gap-5 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor="ref" className="label">Booking reference</label>
              <input id="ref" className="field uppercase" placeholder="MRV-XXXXXX" value={ref} onChange={(e) => setRef(e.target.value)} autoComplete="off" />
            </div>
            <div>
              <label htmlFor="memail" className="label">Email</label>
              <input id="memail" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <button type="submit" disabled={busy} className="btn btn-sea">{busy ? "Searching…" : "Find booking"}</button>
          </form>
          {error && <p role="alert" className="mt-4 rounded-2xl bg-terra/10 px-4 py-3 text-[#8a3f1c]">{error}</p>}
          {!db && recent.length > 0 && (
            <div className="mt-10">
              <h2 className="font-semibold">Bookings made on this device</h2>
              <ul className="mt-4 space-y-3">
                {recent.map((r) => (
                  <li key={r.booking.ref}>
                    <button type="button" onClick={() => setFound(r)} className="card flex w-full items-center justify-between gap-4 p-4 text-left hover:border-sea">
                      <span>
                        <span className="font-semibold">{r.booking.ref}</span>
                        <span className="block text-sm text-mist">{r.booking.roomName} · {r.booking.checkIn} → {r.booking.checkOut}</span>
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.booking.status === "cancelled" ? "bg-line" : "bg-olive/15 text-olive"}`}>{r.booking.status.replace("_", " ")}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-10 text-sm text-mist">Can&apos;t find it? Call {HOTEL.phone} or email {HOTEL.email}.</p>
        </>
      )}

      {found && policy && (
        <div className="mt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-2xl">{found.booking.ref}</p>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${found.booking.status === "cancelled" ? "bg-line" : "bg-olive/15 text-olive"}`}>{found.booking.status.replace("_", " ")}</span>
          </div>
          {notice && <p role="status" className="mb-6 rounded-2xl bg-olive/15 px-4 py-3">{notice}</p>}
          <BookingDetails b={found.booking} />
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`/api/ics?token=${encodeURIComponent(found.token)}`} className="btn btn-outline">Add to calendar</a>
            {found.booking.status !== "cancelled" && (policy.allowed ? (
              confirming ? (
                <div className="card w-full p-5">
                  <p className="font-semibold">Cancel this booking?</p>
                  <p className="mt-1 text-sm text-mist">{policy.message}</p>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={cancel} disabled={busy} className="btn btn-terra">Yes, cancel</button>
                    <button type="button" onClick={() => setConfirming(false)} className="btn btn-outline">Keep booking</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirming(true)} className="btn btn-outline">Cancel booking</button>
              )
            ) : (
              <p className="w-full text-sm text-mist">{policy.message}</p>
            ))}
            <button type="button" onClick={() => { setFound(null); setNotice(""); }} className="btn btn-outline">Find another booking</button>
          </div>
          <p className="mt-8 text-sm text-mist">Want to change dates? <Link href="/getting-here" className="underline">Contact us</Link> and we&apos;ll help.</p>
        </div>
      )}
    </div>
  );
}
