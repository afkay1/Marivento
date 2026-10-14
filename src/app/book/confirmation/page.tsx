import type { Metadata } from "next";
import Link from "next/link";
import ConfirmationView from "@/components/booking/ConfirmationView";
import { verifyBooking, signBooking } from "@/lib/booking/token";
import { isSessionPaid, isStripeMode, sendConfirmation } from "@/lib/booking/services";
import { isDbMode, setStatus } from "@/lib/booking/store";

export const metadata: Metadata = { title: "Booking confirmation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ searchParams }: { searchParams: { token?: string; session_id?: string } }) {
  let booking = verifyBooking(searchParams.token);
  if (!booking) {
    return (
      <div className="wrap max-w-2xl pb-24 pt-[calc(var(--header)+60px)]">
        <h1 className="display h2">We couldn&apos;t open this booking.</h1>
        <p className="mt-4 text-mist">The link may be incomplete. Find your booking with your reference and email instead.</p>
        <Link href="/manage" className="btn btn-sea mt-8">Manage booking</Link>
      </div>
    );
  }
  let token = searchParams.token as string;
  if (booking.status === "pending_payment" && searchParams.session_id && (await isSessionPaid(searchParams.session_id, booking.ref))) {
    booking = { ...booking, status: "confirmed" };
    token = signBooking(booking);
    if (isDbMode()) await setStatus(booking.ref, "confirmed");
    await sendConfirmation(booking, token);
  }
  return <ConfirmationView booking={booking} token={token} demo={!isStripeMode() && !process.env.RESEND_API_KEY} />;
}
