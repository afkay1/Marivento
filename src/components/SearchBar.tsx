"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, todayISO } from "@/lib/booking/dates";
import { seasonOf, minStayFor } from "@/lib/booking/engine";

/** First open arrival date from today (the hotel closes November–March). */
function firstOpen() {
  let d = addDays(todayISO(), 1);
  for (let i = 0; i < 400 && !seasonOf(d); i++) d = addDays(d, 1);
  return d;
}

/** Date-and-guests search that hands off to the booking engine. */
export default function SearchBar({ variant = "hero" }: { variant?: "hero" | "inline" }) {
  const router = useRouter();
  const uid = useId();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    const a = firstOpen();
    setCheckIn(a);
    setCheckOut(addDays(a, minStayFor(a)));
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: String(children) });
    router.push(`/book?${p.toString()}`);
  };

  const hero = variant === "hero";
  return (
    <form
      onSubmit={submit}
      className={`grid gap-3 rounded-3xl p-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-end ${hero ? "bg-chalk/95 text-ink shadow-card backdrop-blur-md" : "border border-line bg-white"}`}
      aria-label="Check availability"
    >
      <div className="px-2">
        <label htmlFor={`${uid}-in`} className="label text-xs uppercase tracking-[0.14em] text-mist">Arrival</label>
        <input id={`${uid}-in`} type="date" required className="field py-2.5" value={checkIn} min={todayISO()}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (e.target.value && (!checkOut || checkOut <= e.target.value)) setCheckOut(addDays(e.target.value, minStayFor(e.target.value)));
          }} />
      </div>
      <div className="px-2">
        <label htmlFor={`${uid}-out`} className="label text-xs uppercase tracking-[0.14em] text-mist">Departure</label>
        <input id={`${uid}-out`} type="date" required className="field py-2.5" value={checkOut} min={checkIn ? addDays(checkIn, 1) : undefined} onChange={(e) => setCheckOut(e.target.value)} />
      </div>
      <div className="px-2">
        <label htmlFor={`${uid}-ad`} className="label text-xs uppercase tracking-[0.14em] text-mist">Adults</label>
        <select id={`${uid}-ad`} className="field py-2.5" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="px-2">
        <label htmlFor={`${uid}-ch`} className="label text-xs uppercase tracking-[0.14em] text-mist">Children</label>
        <select id={`${uid}-ch`} className="field py-2.5" value={children} onChange={(e) => setChildren(Number(e.target.value))}>
          {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <button type="submit" className="btn btn-terra sm:col-span-2 lg:col-span-1">Check availability</button>
    </form>
  );
}
