import type { Metadata } from "next";
import ManageView from "@/components/booking/ManageView";
import { isDbMode } from "@/lib/booking/store";

export const metadata: Metadata = { title: "Manage your booking", description: "View or cancel your Marivento booking with your reference and email.", alternates: { canonical: "/manage" } };
export const dynamic = "force-dynamic";

export default function ManagePage() {
  return (
    <div className="sec-shell min-h-screen">
      <ManageView db={isDbMode()} />
    </div>
  );
}
