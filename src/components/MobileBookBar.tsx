"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROOMS } from "@/lib/data/rooms";
import { money } from "@/lib/format";

const HIDE = [/^\/book/, /^\/admin/, /^\/manage/];
const FROM = Math.min(...ROOMS.map((r) => r.prices.shoulder));

/** Booking bar pinned to the bottom of the screen on phones. */
export default function MobileBookBar() {
  const pathname = usePathname();
  if (HIDE.some((r) => r.test(pathname))) return null;
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-chalk/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="leading-tight">
          <p className="text-xs text-mist">Rooms from</p>
          <p className="font-semibold">{money(FROM)} <span className="text-sm font-normal text-mist">/ night</span></p>
        </div>
        <Link href="/book" className="btn btn-sea min-h-[46px] flex-1">Check availability</Link>
      </div>
    </div>
  );
}
