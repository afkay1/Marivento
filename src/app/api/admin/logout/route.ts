import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.set("mv_admin", "", { path: "/", maxAge: 0 });
  return res;
}
