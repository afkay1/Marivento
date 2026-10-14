import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdmin } from "@/lib/booking/token";
import { addBlock, isDbMode } from "@/lib/booking/store";
import { isISODate } from "@/lib/booking/dates";
import { getRoom } from "@/lib/data/rooms";
import { bad } from "@/lib/booking/http";

export async function POST(req: Request) {
  if (!isDbMode()) return bad("Blocking dates needs a connected database.", 400);
  if (!verifyAdmin(cookies().get("mv_admin")?.value)) return bad("Not signed in.", 401);
  const form = await req.formData();
  const room = String(form.get("room") || "");
  const from = String(form.get("from") || "");
  const to = String(form.get("to") || "");
  if (!getRoom(room) || !isISODate(from) || !isISODate(to) || to <= from) return bad("Check the room and dates.");
  await addBlock(room, from, to);
  return NextResponse.redirect(new URL("/admin?blocked=1", req.url), 303);
}
