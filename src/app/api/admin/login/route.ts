import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { signAdmin } from "@/lib/booking/token";

export async function POST(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  const form = await req.formData().catch(() => null);
  const given = String(form?.get("password") ?? "");
  const ok = Boolean(pw) && given.length === pw!.length && timingSafeEqual(Buffer.from(given), Buffer.from(pw!));
  const res = NextResponse.redirect(new URL(ok ? "/admin" : "/admin?error=1", req.url), 303);
  if (ok) {
    const exp = Date.now() + 8 * 3600 * 1000;
    res.cookies.set("mv_admin", signAdmin(exp), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 8 * 3600 });
  }
  return res;
}
