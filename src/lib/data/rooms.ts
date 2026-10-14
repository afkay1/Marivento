import { img, type Extra, type RoomType } from "../types";

const r = (slug: string, alt: string) => ({
  hero: img(`room-${slug}-hero`, alt),
  view_: img(`room-${slug}-view`, `View from the ${alt}`),
  bath: img(slug === "villa" ? "room-villa-bedroom" : `room-${slug}-bath`, slug === "villa" ? "Villa master bedroom with sea view" : `Bathroom of the ${alt}`),
  detail: img(`room-${slug}-detail`, `Detail in the ${alt}`),
});

export const ROOMS: RoomType[] = [
  {
    slug: "classic-sea-view",
    name: "Classic Sea View Room",
    short: "Classic Sea View",
    tagline: "Whitewashed vaults, majolica floors and a balcony on the sea.",
    description: [
      "Our classic rooms are where Marivento began: vaulted ceilings, hand-painted majolica floors and French doors that open onto a small wrought-iron balcony above the water.",
      "Simple, bright and quiet, with everything you need and nothing you don't.",
    ],
    size: 24, maxAdults: 2, maxGuests: 2, beds: "Queen bed", view: "Sea view, Juliet balcony", inventory: 8,
    prices: { shoulder: 420, high: 590 },
    highlights: ["Juliet balcony", "Majolica tile floors", "Walk-in shower"],
    amenities: ["Air conditioning", "Rain shower", "Linen bathrobes", "Espresso machine", "Free Wi-Fi", "Safe"],
    ...r("classic", "Classic Sea View Room"),
  },
  {
    slug: "terrace-room",
    name: "Terrace Room",
    short: "Terrace Room",
    tagline: "A private terrace with loungers and a lemon tree.",
    description: [
      "Larger rooms that open fully onto a private terrace with two loungers, a mosaic table and a lemon tree in a terracotta pot.",
      "Inside, a freestanding stone bath sits under a window that looks straight out to sea.",
    ],
    size: 32, maxAdults: 2, maxGuests: 2, beds: "King bed", view: "Sea view, private terrace", inventory: 6,
    prices: { shoulder: 540, high: 760 },
    highlights: ["Private terrace", "Freestanding stone bath", "Pet friendly"],
    amenities: ["Air conditioning", "Bathtub and shower", "Terrace loungers", "Espresso machine", "Free Wi-Fi", "Minibar"],
    ...r("terrace", "Terrace Room"),
  },
  {
    slug: "cliff-junior-suite",
    name: "Cliff Junior Suite",
    short: "Junior Suite",
    tagline: "A deep window seat over the cliffs, and space to spread out.",
    description: [
      "A suite with a separate sitting area, a vaulted ceiling and a deep arched window seat that looks down the cliff to the beach far below.",
      "The travertine bathroom has a double vanity and a rain shower. A sofa bed makes room for a child.",
    ],
    size: 45, maxAdults: 2, maxGuests: 3, beds: "King bed + sofa bed", view: "Cliff and sea view", inventory: 4,
    prices: { shoulder: 680, high: 950 },
    highlights: ["Arched window seat", "Sitting area", "Fits a family of three"],
    amenities: ["Air conditioning", "Double vanity", "Rain shower", "Welcome tray", "Free Wi-Fi", "Minibar"],
    ...r("junior", "Cliff Junior Suite"),
  },
  {
    slug: "grotto-suite",
    name: "Grotto Suite",
    short: "Grotto Suite",
    tagline: "Carved into the rock, cool by day and candlelit by night.",
    description: [
      "Our most unusual rooms are carved into the natural limestone beneath the villa. Curved rock walls are lit by warm hidden light, and a round opening frames the sea.",
      "The bathroom has a stone soaking tub set into its own niche of rock.",
    ],
    size: 40, maxAdults: 2, maxGuests: 2, beds: "King bed", view: "Sea view through a round rock opening", inventory: 2,
    prices: { shoulder: 790, high: 1100 },
    highlights: ["Carved into the cliff", "Stone soaking tub", "Private rock terrace"],
    amenities: ["Natural cooling", "Soaking tub", "Rock terrace", "Espresso machine", "Free Wi-Fi", "Minibar"],
    ...r("grotto", "Grotto Suite"),
  },
  {
    slug: "panorama-suite",
    name: "Panorama Suite",
    short: "Panorama Suite",
    tagline: "The top of the cliff, with a private plunge pool.",
    description: [
      "On the highest floor, a wall of glass slides open to a large terrace with a private plunge pool and the whole coastline in view.",
      "A marble bathtub faces the sea, and oak beams and terracotta floors keep it warm and relaxed.",
    ],
    size: 60, maxAdults: 2, maxGuests: 3, beds: "King bed + sofa bed", view: "Panoramic sea and coast", inventory: 3,
    prices: { shoulder: 1050, high: 1490 },
    highlights: ["Private plunge pool", "Panoramic terrace", "Marble bathtub"],
    amenities: ["Air conditioning", "Plunge pool", "Marble bathtub", "Butler service", "Free Wi-Fi", "Minibar"],
    ...r("panorama", "Panorama Suite"),
  },
  {
    slug: "villa-marivento",
    name: "Villa Marivento",
    short: "Villa",
    tagline: "Two bedrooms, a fireplace and your own pool on the cliff.",
    description: [
      "A private two-bedroom villa within the hotel, with a beamed living room, a stone fireplace, a dining table for six and a terrace with a long pool.",
      "Dinner can be served on your terrace under the vine pergola.",
    ],
    size: 140, maxAdults: 4, maxGuests: 5, beds: "2 king bedrooms + sofa bed", view: "Sea and coast, private pool", inventory: 1,
    prices: { shoulder: 2300, high: 3400 },
    highlights: ["Two bedrooms", "Private pool", "In-villa dining"],
    amenities: ["Air conditioning", "Private pool", "Fireplace", "Full kitchenette", "Butler service", "Pet friendly"],
    ...r("villa", "Villa Marivento"),
  },
];

export const getRoom = (slug: string) => ROOMS.find((x) => x.slug === slug);

export const EXTRAS: Extra[] = [
  { id: "boat-transfer", name: "Boat transfer from Naples", text: "Private boat to our jetty, with luggage handled for you.", price: 420, unit: "stay" },
  { id: "sunset-boat", name: "Sunset boat trip", text: "Two hours on our wooden gozzo at golden hour, with drinks.", price: 380, unit: "stay" },
  { id: "spa-ritual", name: "Sea Salt & Lemon Ritual", text: "90-minute signature spa ritual.", price: 190, unit: "person" },
  { id: "early-checkin", name: "Early check-in (from 10:00)", text: "Start your holiday as soon as you arrive.", price: 90, unit: "stay" },
  { id: "late-checkout", name: "Late check-out (until 16:00)", text: "One more afternoon by the pool.", price: 120, unit: "stay" },
  { id: "celebration", name: "Celebration package", text: "Flowers, a cake and a sparkling toast in your room.", price: 180, unit: "stay" },
];

export const RATE_PLANS = {
  flex: {
    id: "flex" as const,
    name: "Flexible",
    summary: "Free cancellation up to 7 days before arrival",
    detail: "Pay the first night now to secure your room and the rest at the hotel. Cancel free of charge until 7 days before arrival.",
    discount: 0,
  },
  nr: {
    id: "nr" as const,
    name: "Non-refundable",
    summary: "Save 12% · pay in full now",
    detail: "Our best price, paid in full at booking. It cannot be changed, cancelled or refunded.",
    discount: 0.12,
  },
};

export const BREAKFAST = { adult: 32, child: 16 };
export const CITY_TAX = { perAdultNight: 5, maxNights: 7 };
