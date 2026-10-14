import { NextResponse } from "next/server";
import { isISODate } from "./dates";
import type { SearchInput } from "./engine";

export const bad = (error: string, status = 422) => NextResponse.json({ ok: false, error }, { status });

const int = (v: unknown, d = 0) => {
  const n = typeof v === "string" ? parseInt(v, 10) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : d;
};

export function readSearch(o: Record<string, unknown>): SearchInput | null {
  if (!isISODate(o.checkIn) || !isISODate(o.checkOut)) return null;
  return { checkIn: o.checkIn, checkOut: o.checkOut, adults: int(o.adults, 2), children: int(o.children, 0) };
}

export const clean = (v: unknown, max = 200) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f<>]/g, " ")
    .trim()
    .slice(0, max);
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone = (v: string) => /^[+()\d\s-]{7,20}$/.test(v);
