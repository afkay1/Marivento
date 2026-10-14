import { HOTEL } from "@/lib/data/hotel";
import { RATE_PLANS } from "@/lib/data/rooms";
import { fmtDate, money } from "@/lib/format";
import type { Booking } from "@/lib/booking/model";

/** Printable booking summary used on the confirmation and manage pages. */
export default function BookingDetails({ b }: { b: Booking }) {
  const p = b.price;
  return (
    <div className="card divide-y divide-line">
      <div className="grid gap-6 p-6 sm:grid-cols-3">
        <div><p className="text-sm text-mist">Check-in</p><p className="mt-1 font-semibold">{fmtDate(b.checkIn)}</p><p className="text-sm text-mist">from {HOTEL.checkIn}</p></div>
        <div><p className="text-sm text-mist">Check-out</p><p className="mt-1 font-semibold">{fmtDate(b.checkOut)}</p><p className="text-sm text-mist">by {HOTEL.checkOut}</p></div>
        <div><p className="text-sm text-mist">Guests</p><p className="mt-1 font-semibold">{b.adults} adult{b.adults > 1 ? "s" : ""}{b.children ? `, ${b.children} child${b.children > 1 ? "ren" : ""}` : ""}</p></div>
      </div>
      <div className="p-6">
        <p className="font-semibold">{b.roomName}</p>
        <p className="mt-1 text-sm text-mist">{RATE_PLANS[b.rate].name} rate · {RATE_PLANS[b.rate].summary}{b.breakfast ? " · Breakfast included" : ""}</p>
        <p className="mt-3 text-sm text-mist">Guest: {b.guest.firstName} {b.guest.lastName} · {b.guest.email}</p>
        {b.guest.requests && <p className="mt-1 text-sm text-mist">Requests: {b.guest.requests}</p>}
      </div>
      <dl className="space-y-2 p-6 text-[15px]">
        <div className="flex justify-between"><dt>Room, {p.nights} nights</dt><dd>{money(p.roomBeforeDiscounts)}</dd></div>
        {p.offerDiscount > 0 && <div className="flex justify-between text-olive"><dt>Stay Longer: 5th night free</dt><dd>−{money(p.offerDiscount)}</dd></div>}
        {p.rateDiscount > 0 && <div className="flex justify-between text-olive"><dt>Non-refundable saving</dt><dd>−{money(p.rateDiscount)}</dd></div>}
        {p.breakfast > 0 && <div className="flex justify-between"><dt>Breakfast</dt><dd>{money(p.breakfast)}</dd></div>}
        {p.extras.map((x) => <div key={x.id} className="flex justify-between"><dt>{x.name}{x.qty > 1 ? ` × ${x.qty}` : ""}</dt><dd>{money(x.total)}</dd></div>)}
        <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd>{money(p.total)}</dd></div>
        <div className="flex justify-between text-mist"><dt>{b.status === "pending_payment" ? "To pay now" : "Paid"}</dt><dd>{money(p.dueNow)}</dd></div>
        <div className="flex justify-between text-mist"><dt>Due at the hotel (incl. city tax {money(p.cityTax)})</dt><dd>{money(p.dueAtHotel)}</dd></div>
      </dl>
    </div>
  );
}
