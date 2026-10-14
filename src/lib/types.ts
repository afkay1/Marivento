export interface Img {
  src: string;
  alt: string;
}

export const img = (name: string, alt: string): Img => ({ src: `/images/${name}.webp`, alt });

export type Season = "shoulder" | "high";

export interface RoomType {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string[];
  size: number; // m²
  maxAdults: number;
  maxGuests: number;
  beds: string;
  view: string;
  inventory: number;
  prices: Record<Season, number>; // EUR per night, room only, before weekend uplift
  highlights: string[];
  amenities: string[];
  hero: Img;
  view_: Img;
  bath: Img;
  detail: Img;
}

export interface Extra {
  id: string;
  name: string;
  text: string;
  price: number;
  unit: "stay" | "person";
  image?: Img;
}

export type RatePlan = "flex" | "nr";
