"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Calendar from "./Calendar";
import { ROOMS, EXTRAS, RATE_PLANS, BREAKFAST, getRoom } from "@/lib/data/rooms";
import { addDays, isISODate, nightsBetween, todayISO } from "@/lib/booking/dates";
import { minStayFor, priceSelection, seasonOf, type RoomQuote } from "@/lib/booking/engine";
import { fmtDate, money } from "@/lib/format";
import type { RatePlan } from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5;
const STEPS = ["Dates", "Room", "Extras", "Details", "Confirm"];
const COUNTRIES = ["Italy", "United Kingdom", "United States", "Germany", "France", "Spain", "Netherlands", "Switzerland", "Saudi Arabia", "United Arab Emirates", "Canada", "Australia", "Other"];

interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  arrival: string;
  requests: string;
}

function firstOpen() {
  let d = addDays(todayISO(), 1);
  for (let i = 0; i < 400 && !seasonOf(d); i++) d = addDays(d, 1);
  return d;
}

export default function BookingApp({ stripe }: { stripe: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const preferred = params.get("room");

  const [step, setStep] = useState<Step>(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState<RoomQuote[] | null>(null);
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomSlug, setRoomSlug] = useState<string>("");
  const [rate, setRate] = useState<RatePlan>("flex");
  const [breakfast, setBreakfast] = useState(true);
  const [extras, setExtras] = useState<Record<string, number>>({});
  const [guest, setGuest] = useState<Guest>({ firstName: "", lastName: "", email: "", phone: "", country: "", arrival: "", requests: "" });
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Read the search from the URL once.
  useEffect(() => {
    const ci = params.get("checkIn");
    const co = params.get("checkOut");
    const a = parseInt(params.get("adults") || "2", 10);
    const c = parseInt(params.get("children") || "0", 10);
    setAdults(Math.min(4, Math.max(1, a || 2)));
    setChildren(Math.min(3, Math.max(0, c || 0)));
    if (isISODate(ci) && isISODate(co) && co > ci && ci >= todayISO()) {
      setCheckIn(ci);
      setCheckOut(co);
      setStep(2);
    } else {
      const d = firstOpen();
      setCheckIn(d);
      setCheckOut(addDays(d, minStayFor(d)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const minStay = checkIn ? minStayFor(checkIn) : 2;
  const datesOk = Boolean(checkIn && checkOut && nights >= minStay);

  // Fetch room quotes whenever we enter step 2.
  useEffect(() => {
    if (step !== 2 || !checkIn || !checkOut) return;
    const q = new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: String(children) });
    if (preferred) q.set("room", preferred);
    router.replace(`/book?${q.toString()}`, { scroll: false });
    setLoading(true);
    setSearchError("");
    fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checkIn, checkOut, adults, children }) })
      .then((r) => r.json())
      .then((j: { ok: boolean; rooms?: RoomQuote[]; error?: string }) => {
        if (!j.ok) {
          setSearchError(j.error || "Please try different dates.");
          setRooms(null);
        } else setRooms(j.rooms || []);
      })
      .catch(() => setSearchError("We couldn't load prices. Please try again."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, checkIn, checkOut, adults, children]);

  useEffect(() => {
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [step]);

  const sortedRooms = useMemo(() => {
    if (!rooms) return [];
    return [...rooms].sort((a, b) => {
      if (a.slug === preferred) return -1;
      if (b.slug === preferred) return 1;
      return Number(b.available) - Number(a.available);
    });
  }, [rooms, preferred]);

  const room = getRoom(roomSlug);
  const priced = useMemo(() => {
    if (!roomSlug || !datesOk) return null;
    const r = priceSelection({ checkIn, checkOut, adults, children, roomSlug, rate, breakfast, extras }, new Map());
    return "error" in r ? null : r.price;
  }, [roomSlug, rate, breakfast, extras, checkIn, checkOut, adults, children, datesOk]);

  const validateGuest = () => {
    const e: Record<string, string> = {};
    if (!guest.firstName.trim()) e.firstName = "Please enter your first name.";
    if (!guest.lastName.trim()) e.lastName = "Please enter your last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) e.email = "Please enter a valid email address.";
    if (!/^[+()\d\s-]{7,20}$/.test(guest.phone.trim())) e.phone = "Please enter a valid phone number, including country code.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus();
      return false;
    }
    return true;
  };

  async function confirm() {
    if (!accept) {
      setErrors({ accept: "Please accept the booking terms." });
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, adults, children, roomSlug, rate, breakfast, extras, guest, acceptTerms: true }),
      });
      const j = (await res.json()) as { ok: boolean; token?: string; checkoutUrl?: string; error?: string };
      if (!j.ok) throw new Error(j.error || "Booking failed.");
      if (j.checkoutUrl) {
        window.location.href = j.checkoutUrl;
        return;
      }
      router.push(`/book/confirmation?token=${encodeURIComponent(j.token!)}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const setG = (k: keyof Guest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setGuest((g) => ({ ...g, [k]: e.target.value }));
  const inv = (k: string) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${k}-error` : undefined });
  const Err = ({ k }: { k: string }) => (errors[k] ? <p id={`${k}-error`} role="alert" className="mt-1.5 text-sm text-[#b4462a]">{errors[k]}</p> : null);

  const Stepper = ({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) => (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`} className="h-9 w-9 rounded-full border border-line disabled:opacity-30">−</button>
        <span className="w-5 text-center" aria-live="polite">{value}</span>
        <button type="button" onClick={() => set(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`} className="h-9 w-9 rounded-full border border-line disabled:opacity-30">+</button>
      </div>
    </div>
  );

  return (
    <div className="wrap pb-24 pt-[calc(var(--header)+32px)]">
      {/* Progress */}
      <nav aria-label="Booking progress" className="mx-auto max-w-4xl">
        <ol className="grid grid-cols-5 gap-2">
          {STEPS.map((s, i) => {
            const n = (i + 1) as Step;
            const done = n < step;
            return (
              <li key={s}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => setStep(n)}
                  aria-current={n === step ? "step" : undefined}
                  className="w-full text-left disabled:cursor-default"
                >
                  <span className={`block h-1.5 rounded-full transition-colors duration-500 ${n <= step ? "bg-sea" : "bg-line"}`} />
                  <span className={`mt-2 block text-xs font-semibold sm:text-sm ${n === step ? "text-sea" : "text-mist"}`}>
                    <span className="hidden sm:inline">{n}. </span>
                    {s}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* STEP 1: dates */}
          {step === 1 && (
            <section aria-labelledby="s1">
              <h1 id="s1" className="display h2">When would you like to stay?</h1>
              <p className="mt-2 text-mist">Open {"1 April – 31 October"}. Minimum stay {minStay} nights for your arrival date.</p>
              <div className="card mt-8 p-5 md:p-7">
                <Calendar checkIn={checkIn} checkOut={checkOut} onChange={(a, b) => { setCheckIn(a); setCheckOut(b); }} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Stepper label="Adults" value={adults} set={setAdults} min={1} max={4} />
                <Stepper label="Children (0–12)" value={children} set={setChildren} min={0} max={3} />
              </div>
              {checkIn && checkOut && nights < minStay && (
                <p role="alert" className="mt-4 rounded-2xl bg-terra/10 px-4 py-3 text-[15px] text-[#8a3f1c]">
                  A minimum stay of {minStay} nights applies for arrivals on {fmtDate(checkIn)}.
                </p>
              )}
              <button type="button" className="btn btn-sea mt-8 w-full sm:w-auto" disabled={!datesOk} onClick={() => setStep(2)}>
                See rooms and prices
              </button>
            </section>
          )}

          {/* STEP 2: rooms & rates */}
          {step === 2 && (
            <section aria-labelledby="s2">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 id="s2" className="display h2">Choose your room</h1>
                  <p className="mt-2 text-mist">
                    {fmtDate(checkIn)} – {fmtDate(checkOut)} · {nights} night{nights > 1 ? "s" : ""} · {adults} adult{adults > 1 ? "s" : ""}
                    {children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}
                  </p>
                </div>
                <button type="button" onClick={() => setStep(1)} className="link-arrow">Change dates</button>
              </div>
              {nights >= 5 && <p className="mt-6 rounded-2xl bg-olive/15 px-4 py-3 text-[15px]"><strong>Stay Longer applied:</strong> your fifth night is on us.</p>}
              {loading && <p className="mt-10 text-mist" aria-live="polite">Finding available rooms…</p>}
              {searchError && <p role="alert" className="mt-8 rounded-2xl bg-terra/10 px-4 py-3 text-[#8a3f1c]">{searchError}</p>}
              <ul className="mt-8 space-y-6">
                {!loading &&
                  sortedRooms.map((q) => {
                    const r = ROOMS.find((x) => x.slug === q.slug)!;
                    return (
                      <li key={q.slug} className={`card overflow-hidden ${q.available ? "" : "opacity-60"}`}>
                        <div className="grid md:grid-cols-[280px_1fr]">
                          <div className="relative aspect-[16/10] md:aspect-auto">
                            <Image src={r.hero.src} alt={r.hero.alt} fill sizes="(min-width: 768px) 280px, 100vw" className="object-cover" />
                          </div>
                          <div className="p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h2 className="display h3">{r.name}</h2>
                                <p className="mt-1 text-sm text-mist">{r.size} m² · {r.beds} · Sleeps {r.maxGuests} · {r.view}</p>
                              </div>
                              {q.available && q.roomsLeft <= 2 && <span className="rounded-full bg-terra/10 px-3 py-1 text-xs font-semibold text-[#8a3f1c]">Only {q.roomsLeft} left</span>}
                            </div>
                            {!q.available ? (
                              <p className="mt-5 text-[15px] text-mist">{q.reason}</p>
                            ) : (
                              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {(["flex", "nr"] as RatePlan[]).map((p) => (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => { setRoomSlug(q.slug); setRate(p); setStep(3); }}
                                    className="group rounded-2xl border border-line p-4 text-left transition-colors hover:border-sea hover:bg-sea/5"
                                  >
                                    <span className="block text-sm font-semibold">{RATE_PLANS[p].name}</span>
                                    <span className="mt-1 block text-xs text-mist">{RATE_PLANS[p].summary}</span>
                                    <span className="mt-3 block text-2xl font-semibold">{money(q.rates[p].total)}</span>
                                    <span className="block text-xs text-mist">{money(q.rates[p].perNight)} avg / night · total for {nights} nights, all fees incl.</span>
                                    <span className="mt-3 inline-block text-sm font-semibold text-sea group-hover:text-terra">Select →</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            <Link href={`/rooms/${r.slug}`} target="_blank" className="mt-4 inline-block text-sm text-mist underline">Room details</Link>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
              <p className="mt-6 text-sm text-mist">Prices include all hotel charges. City tax (€5 per adult per night, first 7 nights) is shown before you pay and settled at the hotel.</p>
            </section>
          )}

          {/* STEP 3: extras */}
          {step === 3 && room && (
            <section aria-labelledby="s3">
              <h1 id="s3" className="display h2">Make it yours</h1>
              <p className="mt-2 text-mist">Optional extras, arranged before you arrive.</p>
              <label className="card mt-8 flex cursor-pointer items-start gap-4 p-5">
                <input type="checkbox" checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} className="mt-1 h-5 w-5 accent-sea" />
                <span className="flex-1">
                  <span className="block font-semibold">Breakfast on the terrace</span>
                  <span className="block text-sm text-mist">{money(BREAKFAST.adult)} per adult, {money(BREAKFAST.child)} per child, per night</span>
                </span>
                <span className="font-semibold">{money((adults * BREAKFAST.adult + children * BREAKFAST.child) * nights)}</span>
              </label>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {EXTRAS.map((x) => {
                  const qty = extras[x.id] || 0;
                  const maxQ = x.unit === "person" ? adults + children : 1;
                  return (
                    <li key={x.id} className={`card p-5 transition-colors ${qty ? "border-sea" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{x.name}</p>
                          <p className="mt-1 text-sm text-mist">{x.text}</p>
                        </div>
                        <p className="shrink-0 font-semibold">{money(x.price)}<span className="block text-right text-xs font-normal text-mist">{x.unit === "person" ? "per person" : "per stay"}</span></p>
                      </div>
                      {maxQ === 1 ? (
                        <button type="button" aria-pressed={qty > 0} onClick={() => setExtras((e) => ({ ...e, [x.id]: qty ? 0 : 1 }))} className={`btn mt-4 min-h-[40px] w-full ${qty ? "btn-sea" : "btn-outline"}`}>
                          {qty ? "Added ✓" : "Add"}
                        </button>
                      ) : (
                        <div className="mt-4 flex items-center justify-between rounded-full border border-line px-2 py-1">
                          <button type="button" aria-label={`Remove one ${x.name}`} onClick={() => setExtras((e) => ({ ...e, [x.id]: Math.max(0, qty - 1) }))} className="h-8 w-8 rounded-full">−</button>
                          <span aria-live="polite">{qty} {qty === 1 ? "person" : "people"}</span>
                          <button type="button" aria-label={`Add one ${x.name}`} onClick={() => setExtras((e) => ({ ...e, [x.id]: Math.min(maxQ, qty + 1) }))} className="h-8 w-8 rounded-full">+</button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                <button type="button" className="btn btn-sea" onClick={() => setStep(4)}>Continue to your details</button>
              </div>
            </section>
          )}

          {/* STEP 4: guest details */}
          {step === 4 && (
            <section aria-labelledby="s4">
              <h1 id="s4" className="display h2">Your details</h1>
              <p className="mt-2 text-mist">No account needed. We only ask what we need for your stay.</p>
              <form
                noValidate
                className="mt-8 grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateGuest()) setStep(5);
                }}
              >
                <div>
                  <label htmlFor="firstName" className="label">First name</label>
                  <input id="firstName" autoComplete="given-name" className="field" value={guest.firstName} onChange={setG("firstName")} {...inv("firstName")} />
                  <Err k="firstName" />
                </div>
                <div>
                  <label htmlFor="lastName" className="label">Last name</label>
                  <input id="lastName" autoComplete="family-name" className="field" value={guest.lastName} onChange={setG("lastName")} {...inv("lastName")} />
                  <Err k="lastName" />
                </div>
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input id="email" type="email" autoComplete="email" inputMode="email" className="field" value={guest.email} onChange={setG("email")} {...inv("email")} />
                  <Err k="email" />
                </div>
                <div>
                  <label htmlFor="phone" className="label">Mobile phone</label>
                  <input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+44 7700 900123" className="field" value={guest.phone} onChange={setG("phone")} {...inv("phone")} />
                  <Err k="phone" />
                </div>
                <div>
                  <label htmlFor="country" className="label">Country <span className="font-normal text-mist">(optional)</span></label>
                  <select id="country" autoComplete="country-name" className="field" value={guest.country} onChange={setG("country")}>
                    <option value="">Select…</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="arrival" className="label">Estimated arrival time <span className="font-normal text-mist">(optional)</span></label>
                  <select id="arrival" className="field" value={guest.arrival} onChange={setG("arrival")}>
                    <option value="">I don't know yet</option>
                    {["Before 12:00", "12:00 – 15:00", "15:00 – 18:00", "18:00 – 21:00", "After 21:00"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="requests" className="label">Special requests <span className="font-normal text-mist">(optional)</span></label>
                  <textarea id="requests" rows={3} className="field resize-none" placeholder="Celebrations, dietary needs, a cot…" value={guest.requests} onChange={setG("requests")} />
                </div>
                <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(3)}>Back</button>
                  <button type="submit" className="btn btn-sea">Review booking</button>
                </div>
              </form>
            </section>
          )}

          {/* STEP 5: review & pay */}
          {step === 5 && room && priced && (
            <section aria-labelledby="s5">
              <h1 id="s5" className="display h2">Review and confirm</h1>
              <div className="card mt-8 divide-y divide-line">
                <div className="p-6">
                  <p className="font-semibold">{room.name} · {RATE_PLANS[rate].name} rate</p>
                  <p className="mt-1 text-mist">{fmtDate(checkIn)} – {fmtDate(checkOut)} · {nights} nights · {adults} adult{adults > 1 ? "s" : ""}{children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}</p>
                  <p className="mt-3 text-sm text-mist">{RATE_PLANS[rate].detail}</p>
                </div>
                <div className="p-6">
                  <p className="font-semibold">{guest.firstName} {guest.lastName}</p>
                  <p className="mt-1 text-mist">{guest.email} · {guest.phone}</p>
                  <button type="button" onClick={() => setStep(4)} className="mt-2 text-sm text-sea underline">Edit details</button>
                </div>
                <div className="grid gap-2 p-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-sea p-5 text-chalk">
                    <p className="text-sm text-chalk/75">{rate === "nr" ? "Pay now (full amount)" : "Pay now (first-night deposit)"}</p>
                    <p className="mt-1 text-3xl font-semibold">{money(priced.dueNow)}</p>
                  </div>
                  <div className="rounded-2xl bg-sand p-5">
                    <p className="text-sm text-mist">Due at the hotel (incl. city tax)</p>
                    <p className="mt-1 text-3xl font-semibold">{money(priced.dueAtHotel)}</p>
                  </div>
                </div>
              </div>
              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={accept} onChange={(e) => { setAccept(e.target.checked); setErrors({}); }} className="mt-1 h-5 w-5 accent-sea" {...inv("accept")} />
                <span className="text-[15px]">
                  I accept the <Link href="/policies#terms" target="_blank" className="underline">booking terms</Link>, <Link href="/policies#cancellation" target="_blank" className="underline">cancellation policy</Link> and <Link href="/policies#privacy" target="_blank" className="underline">privacy policy</Link>.
                </span>
              </label>
              <Err k="accept" />
              {submitError && <p role="alert" className="mt-4 rounded-2xl bg-terra/10 px-4 py-3 text-[#8a3f1c]">{submitError}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" className="btn btn-outline" onClick={() => setStep(4)}>Back</button>
                <button type="button" className="btn btn-terra" disabled={submitting} onClick={confirm}>
                  {submitting ? "Confirming…" : stripe ? `Pay ${money(priced.dueNow)} securely` : "Confirm demo booking"}
                </button>
              </div>
              <p className="mt-4 text-sm text-mist">
                {stripe
                  ? "You'll be taken to Stripe's secure checkout (test mode: use card 4242 4242 4242 4242)."
                  : "Demo mode: no payment is taken. Add Stripe keys to enable real (test) checkout."}
              </p>
            </section>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4" aria-label="Your stay">
          <div className="card sticky top-28 overflow-hidden">
            {room && step >= 3 ? (
              <div className="relative aspect-[16/9]">
                <Image src={room.hero.src} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
              </div>
            ) : null}
            <div className="p-6">
              <h2 className="font-display text-2xl">Your stay</h2>
              <dl className="mt-4 space-y-2 text-[15px]">
                <div className="flex justify-between gap-4"><dt className="text-mist">Dates</dt><dd className="text-right">{checkIn ? fmtDate(checkIn, { day: "numeric", month: "short" }) : "—"} – {checkOut ? fmtDate(checkOut, { day: "numeric", month: "short", year: "numeric" }) : "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-mist">Guests</dt><dd>{adults} adult{adults > 1 ? "s" : ""}{children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}</dd></div>
                {room && <div className="flex justify-between gap-4"><dt className="text-mist">Room</dt><dd className="text-right">{room.name}</dd></div>}
              </dl>
              {priced && (
                <>
                  <dl className="mt-5 space-y-2 border-t border-line pt-5 text-[15px]">
                    <div className="flex justify-between"><dt>Room, {priced.nights} nights</dt><dd>{money(priced.roomBeforeDiscounts)}</dd></div>
                    {priced.offerDiscount > 0 && <div className="flex justify-between text-olive"><dt>Stay Longer: 5th night free</dt><dd>−{money(priced.offerDiscount)}</dd></div>}
                    {priced.rateDiscount > 0 && <div className="flex justify-between text-olive"><dt>Non-refundable saving</dt><dd>−{money(priced.rateDiscount)}</dd></div>}
                    {priced.breakfast > 0 && <div className="flex justify-between"><dt>Breakfast</dt><dd>{money(priced.breakfast)}</dd></div>}
                    {priced.extras.map((x) => (
                      <div key={x.id} className="flex justify-between gap-4"><dt>{x.name}{x.qty > 1 ? ` × ${x.qty}` : ""}</dt><dd>{money(x.total)}</dd></div>
                    ))}
                  </dl>
                  <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-semibold">{money(priced.total)}</span>
                  </div>
                  <p className="mt-1 text-sm text-mist">All hotel charges included. City tax {money(priced.cityTax)} payable at the hotel.</p>
                </>
              )}
              <ul className="mt-6 space-y-1.5 border-t border-line pt-5 text-sm text-mist">
                <li>✓ Best rate guaranteed on our website</li>
                <li>✓ Free cancellation on Flexible rates</li>
                <li>✓ Secure booking, confirmation by email</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
