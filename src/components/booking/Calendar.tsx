"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addDays, addMonths, daysInMonth, eachNight, monthStart, nightsBetween, parse, todayISO } from "@/lib/booking/dates";
import type { CalendarDay } from "@/lib/booking/engine";
import { money } from "@/lib/format";

interface Props {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const monthLabel = (iso: string) => parse(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const longLabel = (iso: string) => parse(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Two-month range picker showing nightly "from" prices, sold-out nights and the closed season. */
export default function Calendar({ checkIn, checkOut, onChange }: Props) {
  const today = todayISO();
  const [start, setStart] = useState(() => monthStart(checkIn || today));
  const [days, setDays] = useState<Record<string, CalendarDay>>({});
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<string>(checkIn || today);
  const grid = useRef<HTMLDivElement>(null);
  const keyNav = useRef(false);
  const picking = Boolean(checkIn && !checkOut);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/calendar?from=${start}&months=2`)
      .then((r) => r.json())
      .then((j: { days?: CalendarDay[] }) => {
        if (!alive || !j.days) return;
        setDays((prev) => {
          const next = { ...prev };
          for (const d of j.days!) next[d.date] = d;
          return next;
        });
      })
      .catch(() => undefined)
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [start]);

  const canArrive = useCallback((d: string) => d >= today && days[d]?.open && !days[d]?.soldOut, [days, today]);
  const canDepart = useCallback(
    (d: string) => {
      if (!checkIn || d <= checkIn || nightsBetween(checkIn, d) > 21) return false;
      return eachNight(checkIn, d).every((n) => days[n]?.open && !days[n]?.soldOut);
    },
    [checkIn, days]
  );

  const select = (d: string) => {
    if (picking && canDepart(d)) {
      onChange(checkIn, d);
      return;
    }
    if (canArrive(d)) onChange(d, "");
  };

  const months = [start, addMonths(start, 1)];
  const rangeEnd = checkOut || (picking && hover && hover > checkIn ? hover : "");

  const onKey = (e: React.KeyboardEvent, d: string) => {
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    keyNav.current = true;
    if (delta) {
      e.preventDefault();
      const next = addDays(d, delta);
      if (next < monthStart(today)) return;
      setFocus(next);
      if (next >= addMonths(start, 2)) setStart(addMonths(start, 1));
      if (next < start) setStart(addMonths(start, -1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(d);
    }
  };

  useEffect(() => {
    if (!keyNav.current) return;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${focus}"]`)?.focus({ preventScroll: true });
  }, [focus]);

  const status = useMemo(() => {
    if (!checkIn) return "Select your arrival date";
    if (!checkOut) return `Arrival ${longLabel(checkIn)}. Now select your departure date.`;
    return `${nightsBetween(checkIn, checkOut)} nights, ${longLabel(checkIn)} to ${longLabel(checkOut)}`;
  }, [checkIn, checkOut]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStart(addMonths(start, -1))}
          disabled={start <= monthStart(today)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white disabled:opacity-30"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="text-sm text-mist" aria-live="polite">{loading ? "Loading prices…" : status}</p>
        <button type="button" onClick={() => setStart(addMonths(start, 1))} className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white" aria-label="Next month">
          →
        </button>
      </div>
      <div ref={grid} className="grid gap-8 md:grid-cols-2" onMouseLeave={() => setHover(null)}>
        {months.map((m, mi) => {
          const offset = (parse(m).getUTCDay() + 6) % 7;
          const cells: (string | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth(m) }, (_, i) => addDays(m, i))];
          return (
            <div key={m} className={mi === 1 ? "hidden md:block" : ""}>
              <h3 className="mb-3 text-center font-display text-xl">{monthLabel(m)}</h3>
              <div role="grid" aria-label={monthLabel(m)} className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((w) => (
                  <div key={w} role="columnheader" className="pb-1 text-xs font-semibold text-mist">{w}</div>
                ))}
                {cells.map((d, i) => {
                  if (!d) return <div key={`e${i}`} aria-hidden />;
                  const info = days[d];
                  const past = d < today;
                  const closed = info && !info.open;
                  const sold = info?.soldOut;
                  const isStart = d === checkIn;
                  const isEnd = d === rangeEnd;
                  const inRange = checkIn && rangeEnd && d > checkIn && d < rangeEnd;
                  const selectable = picking ? canDepart(d) || canArrive(d) : canArrive(d);
                  const label = `${longLabel(d)}${past ? ", past" : closed ? ", hotel closed" : sold ? ", sold out" : info?.fromPrice ? `, from ${money(info.fromPrice)}` : ""}`;
                  return (
                    <button
                      key={d}
                      type="button"
                      role="gridcell"
                      data-date={d}
                      tabIndex={d === focus ? 0 : -1}
                      aria-label={label}
                      aria-selected={isStart || isEnd}
                      aria-disabled={!selectable}
                      onClick={() => selectable && select(d)}
                      onKeyDown={(e) => onKey(e, d)}
                      onMouseEnter={() => setHover(d)}
                      onFocus={() => setFocus(d)}
                      className={`flex h-14 flex-col items-center justify-center rounded-xl text-[15px] transition-colors ${
                        isStart || isEnd
                          ? "bg-sea text-chalk"
                          : inRange
                            ? "bg-sea/10"
                            : selectable
                              ? "hover:bg-sand"
                              : "cursor-not-allowed text-ink/30"
                      }`}
                    >
                      <span className={sold && !past ? "line-through" : ""}>{parse(d).getUTCDate()}</span>
                      <span className={`text-[10px] leading-none ${isStart || isEnd ? "text-chalk/80" : "text-terra"}`}>
                        {!past && info?.open && !sold && info.fromPrice ? `€${info.fromPrice}` : !past && closed ? "" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-mist">
        <span><span className="text-terra">€</span> lowest nightly price</span>
        <span><span className="line-through">12</span> sold out</span>
        <span>Faded dates: closed (November – March) or unavailable</span>
      </div>
    </div>
  );
}
