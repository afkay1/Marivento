import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Booking } from "./model";

const secret = () => process.env.BOOKING_SECRET || "marivento-demo-secret-change-me";
const b64 = (buf: Buffer) => buf.toString("base64url");

/** Signed, tamper-proof booking token, so confirmation links work even without a database. */
export function signBooking(b: Booking): string {
  const body = b64(Buffer.from(JSON.stringify(b)));
  const sig = b64(createHmac("sha256", secret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyBooking(token: string | undefined | null): Booking | null {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = createHmac("sha256", secret()).update(body).digest();
  let given: Buffer;
  try {
    given = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Booking;
  } catch {
    return null;
  }
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newRef() {
  const bytes = randomBytes(6);
  return "MRV-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** Short-lived signed session for the admin area. */
export function signAdmin(expiresAt: number) {
  const body = `admin.${expiresAt}`;
  return `${body}.${b64(createHmac("sha256", secret() + (process.env.ADMIN_PASSWORD || "")).update(body).digest())}`;
}
export function verifyAdmin(v: string | undefined) {
  if (!v) return false;
  const parts = v.split(".");
  if (parts.length !== 3) return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return signAdmin(exp) === v;
}
