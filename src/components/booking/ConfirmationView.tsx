"use client";

import { useEffect } from "react";
import Link from "next/link";
import BookingDetails from "./BookingDetails";
import { saveLocal } from "./local";
import { HOTEL } from "@/lib/data/hotel";
import type { Booking } from "@/lib/booking/model";

export default function ConfirmationView({ booking, token, demo }: { booking: Booking; token: string; demo: boolean }) {
  useEffect(() => {
    saveLocal({ booking, token });
  }, [booking, token]);
  const pending = booking.status === "pending_payment";
  return (
    <div className="wrap max-w-3xl pb-24 pt-[calc(var(--header)+40px)]">
      <p className="eyebrow text-terra">{pending ? "Payment not completed" : "Booking confirmed"}</p>
      <h1 className="display h1 mt-4">{pending ? "Almost there." : `Grazie, ${booking.guest.firstName}.`}</h1>
      <p className="lead mt-4 text-mist">
        {pending
          ? "We have held your details, but the payment was not completed. You can try again from the booking page."
          : `Your stay at ${HOTEL.name} is confirmed. ${demo ? "This is a demo booking, so no email was sent and nothing was charged." : `A confirmation has been sent to ${booking.guest.email}.`}`}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-sea p-6 text-chalk">
        <div>
          <p className="text-sm text-chalk/70">Booking reference</p>
          <p className="font-display text-3xl tracking-wide">{booking.ref}</p>
        </div>
        <div className="no-print ml-auto flex flex-wrap gap-3">
          <a href={`/api/ics?token=${encodeURIComponent(token)}`} className="btn btn-light min-h-[44px]">Add to calendar</a>
          <button type="button" onClick={() => window.print()} className="btn btn-ghost-light min-h-[44px]">Print</button>
        </div>
      </div>
      <div className="mt-8">
        <BookingDetails b={booking} />
      </div>
      <div className="no-print mt-10 grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">Before you arrive</h2>
          <p className="mt-2 text-sm text-mist">Our concierge will email you a week before arrival to arrange transfers, dinners and experiences. You can also ask now in the chat.</p>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">Need to change something?</h2>
          <p className="mt-2 text-sm text-mist">Use your reference and email on the manage page, or call {HOTEL.phone}.</p>
          <Link href="/manage" className="link-arrow mt-4">Manage booking →</Link>
        </div>
      </div>
    </div>
  );
}
