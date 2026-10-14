import { verifyBooking } from "@/lib/booking/token";
import { icsFor } from "@/lib/booking/services";

export async function GET(req: Request) {
  const b = verifyBooking(new URL(req.url).searchParams.get("token"));
  if (!b) return new Response("Not found", { status: 404 });
  return new Response(icsFor(b), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="marivento-${b.ref}.ics"` },
  });
}
