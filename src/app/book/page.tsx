import type { Metadata } from "next";
import { Suspense } from "react";
import BookingApp from "@/components/booking/BookingApp";
import { isStripeMode } from "@/lib/booking/services";

export const metadata: Metadata = {
  title: "Book your stay",
  description: "Check live availability and book Marivento direct for the best rate, with free cancellation on flexible rates.",
  alternates: { canonical: "/book" },
};

export const dynamic = "force-dynamic";

export default function BookPage() {
  return (
    <div className="sec-shell min-h-screen">
      <Suspense fallback={<p className="wrap pt-40 text-mist">Loading booking…</p>}>
        <BookingApp stripe={isStripeMode()} />
      </Suspense>
    </div>
  );
}
