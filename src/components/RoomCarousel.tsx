"use client";

import { useRef } from "react";
import Link from "next/link";
import { ROOMS } from "@/lib/data/rooms";
import { money } from "@/lib/format";
import Img from "./Img";

/** Horizontally scrolling room cards: drag, swipe, or use the arrow buttons. */
export default function RoomCarousel({ exclude }: { exclude?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const rooms = ROOMS.filter((r) => r.slug !== exclude);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * (track.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2 px-[var(--pad)]">
        <button onClick={() => scroll(-1)} aria-label="Previous rooms" className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white hover:border-sea">←</button>
        <button onClick={() => scroll(1)} aria-label="Next rooms" className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white hover:border-sea">→</button>
      </div>
      <div
        ref={track}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--pad)] pb-4 active:cursor-grabbing"
        onWheel={(e) => {
          // Trackpad sideways swipes scroll the carousel; vertical wheel keeps scrolling the page.
          if (track.current && Math.abs(e.deltaX) > Math.abs(e.deltaY)) track.current.scrollLeft += e.deltaX;
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !track.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          track.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
        onPointerLeave={() => (drag.current = null)}
        onClickCapture={(e) => {
          if (drag.current?.moved) e.preventDefault();
        }}
      >
        {rooms.map((r) => (
          <Link key={r.slug} href={`/rooms/${r.slug}`} draggable={false} className="group w-[82vw] shrink-0 snap-start sm:w-[46vw] lg:w-[32vw] xl:w-[28vw]">
            <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Img image={r.hero} className="h-full w-full" sizes="(min-width: 1024px) 32vw, 82vw" />
              <span className="absolute left-4 top-4 rounded-full bg-chalk/90 px-3 py-1 text-sm font-semibold">From {money(r.prices.shoulder)}</span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="display h3">{r.name}</h3>
                <p className="mt-1 text-sm text-mist">{r.size} m² · {r.beds} · Sleeps {r.maxGuests}</p>
              </div>
              <span aria-hidden className="mt-2 text-terra transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
