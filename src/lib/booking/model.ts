import type { RatePlan } from "../types";
import type { PriceBreakdown } from "./engine";

export interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  arrival: string;
  requests: string;
}

export type BookingStatus = "confirmed" | "pending_payment" | "cancelled";

export interface Booking {
  ref: string;
  createdAt: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomSlug: string;
  roomName: string;
  rate: RatePlan;
  breakfast: boolean;
  guest: Guest;
  price: PriceBreakdown;
  status: BookingStatus;
  payment: "demo" | "stripe";
}
