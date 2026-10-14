import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminView, { type OccRow } from "@/components/booking/AdminView";
import { getBookedCounts, isDbMode, listBookings, nextOpenDate } from "@/lib/booking/store";
import { verifyAdmin } from "@/lib/booking/token";
import { addDays } from "@/lib/booking/dates";
import { key, seasonOf } from "@/lib/booking/engine";
import { ROOMS } from "@/lib/data/rooms";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: { error?: string; blocked?: string } }) {
  const db = isDbMode();
  if (db && !process.env.ADMIN_PASSWORD) {
    return <Shell><p className="mt-6 text-mist">Set <code>ADMIN_PASSWORD</code> in your environment to open the admin area.</p></Shell>;
  }
  if (db && !verifyAdmin(cookies().get("mv_admin")?.value)) {
    return (
      <Shell>
        <form action="/api/admin/login" method="post" className="card mt-8 max-w-sm space-y-4 p-6">
          <div>
            <label htmlFor="pw" className="label">Admin password</label>
            <input id="pw" name="password" type="password" required autoComplete="current-password" className="field" />
          </div>
          {searchParams.error && <p role="alert" className="text-sm text-[#b4462a]">Incorrect password.</p>}
          <button type="submit" className="btn btn-sea w-full">Sign in</button>
        </form>
      </Shell>
    );
  }

  const start = nextOpenDate(addDays(new Date().toISOString().slice(0, 10), 0));
  const days: string[] = [];
  for (let d = start; days.length < 14; d = addDays(d, 1)) if (seasonOf(d)) days.push(d);
  const booked = await getBookedCounts(days[0], addDays(days[days.length - 1], 1));
  const occupancy: OccRow[] = ROOMS.map((r) => ({
    slug: r.slug,
    name: r.short,
    inventory: r.inventory,
    cells: days.map((d) => ({ date: d, taken: Math.min(r.inventory, booked.get(key(r.slug, d)) ?? 0) })),
  }));
  const bookings = await listBookings();

  return (
    <Shell>
      <AdminView demo={!db} bookings={bookings} occupancy={occupancy} days={days} blocked={Boolean(searchParams.blocked)} rooms={ROOMS.map((r) => ({ slug: r.slug, name: r.name }))} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sec-shell min-h-screen">
      <div className="wrap pb-24 pt-[calc(var(--header)+32px)]">
        <p className="eyebrow text-terra">Marivento</p>
        <h1 className="display h2 mt-3">Reservations dashboard</h1>
        {children}
      </div>
    </div>
  );
}
