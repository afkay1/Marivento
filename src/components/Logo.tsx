import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Marivento, home" className={`group inline-flex items-center gap-3 ${light ? "text-chalk" : "text-ink"}`}>
      <svg viewBox="0 0 40 24" className="h-5 w-9" aria-hidden fill="none">
        <circle cx="20" cy="8" r="5" fill="#C66A3D" />
        <path d="M2 18c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3 4-3 4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[26px] leading-none tracking-[-0.01em]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 72' }}>
        Marivento
      </span>
    </Link>
  );
}
