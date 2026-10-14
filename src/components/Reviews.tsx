import { HOTEL, REVIEWS } from "@/lib/data/hotel";
import Reveal from "./Reveal";
import WaveLine from "./WaveLine";

export default function Reviews() {
  return (
    <section className="sec-sand">
      <div className="wrap py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-terra">Guest reviews</p>
            <WaveLine className="mt-3" />
            <p className="display h2 mt-5">
              {HOTEL.rating.value} <span className="text-mist">/ 5</span>
            </p>
            <p className="mt-2 text-mist">From {HOTEL.rating.count} verified stays</p>
          </div>
          <p className="max-w-sm rounded-2xl border border-line bg-chalk p-5 text-[15px]">
            <strong className="block text-sea">Best rate, guaranteed</strong>
            Book direct and you will never find Marivento cheaper elsewhere. If you do, we match it and add breakfast.
          </p>
        </div>
        <Reveal as="ul" className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li data-reveal key={r.name} className="card flex flex-col justify-between p-7">
              <p className="text-terra" aria-label="5 out of 5 stars">★★★★★</p>
              <blockquote className="mt-4 font-display text-xl leading-snug">“{r.quote}”</blockquote>
              <p className="mt-6 text-sm text-mist">
                <strong className="text-ink">{r.name}</strong>, {r.from} · {r.stay}
              </p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
