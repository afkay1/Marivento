import { HOTEL, FAQS, DINING, SPA, EXPERIENCES } from "./data/hotel";
import { ROOMS } from "./data/rooms";
import { money } from "./format";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
export interface ConciergeReply {
  reply: string;
  action?: { label: string; href: string };
}

/** Everything the concierge is allowed to know. Also used as the system prompt in live mode. */
export function knowledge() {
  return [
    `Hotel: ${HOTEL.legalName}, ${HOTEL.tagline}. Address: ${HOTEL.address.street}, ${HOTEL.address.locality}, ${HOTEL.address.country}. Phone ${HOTEL.phone}, email ${HOTEL.email}.`,
    `Open season: ${HOTEL.season}. Check-in ${HOTEL.checkIn}, check-out ${HOTEL.checkOut}. ${HOTEL.rooms} rooms.`,
    "Rooms: " + ROOMS.map((r) => `${r.name} (${r.size} m², ${r.beds}, sleeps ${r.maxGuests}, from ${money(r.prices.shoulder)} per night)`).join("; ") + ".",
    `Restaurant ${DINING.restaurant.name}: ${DINING.restaurant.text} Hours: ${DINING.restaurant.hours}. Bar ${DINING.bar.name}: ${DINING.bar.hours}.`,
    `${SPA.name}: ${SPA.text} Hours: ${SPA.hours}. Treatments: ` + SPA.treatments.map((t) => `${t.name} ${t.duration} €${t.price}`).join(", ") + ".",
    "Experiences: " + EXPERIENCES.map((e) => `${e.name} (${e.price})`).join(", ") + ".",
    "FAQ: " + FAQS.map((f) => `Q: ${f.q} A: ${f.a}`).join(" "),
  ].join("\n");
}

export const SYSTEM_PROMPT = `You are the concierge of Marivento, a 24-room boutique hotel on the Amalfi Coast. Answer warmly and briefly (2–4 sentences) using only the hotel information below. If you do not know, say so and offer the phone number or email. Never invent prices, availability or policies. When a guest wants to book or check availability, invite them to use the booking page at /book.

${knowledge()}`;

const TOPICS: { words: string[]; reply: () => ConciergeReply }[] = [
  { words: ["check-in", "check in", "checkin", "check-out", "checkout", "check out", "arrive", "time"], reply: () => ({ reply: `Check-in is from ${HOTEL.checkIn} and check-out is by ${HOTEL.checkOut}. You can add early check-in or late check-out while booking, subject to availability.` }) },
  { words: ["airport", "naples", "transfer", "get there", "getting", "boat", "car", "taxi"], reply: () => ({ reply: "Naples airport is about 90 minutes by car. We can arrange a private car, or a boat transfer that lands at our own jetty, where a lift takes you up to reception.", action: { label: "Getting here", href: "/getting-here" } }) },
  { words: ["park", "parking"], reply: () => ({ reply: "Valet parking is available for €40 per day. Coast roads are narrow, so many guests prefer our transfers." }) },
  { words: ["breakfast"], reply: () => ({ reply: "Breakfast is served on the Lume terrace from 7:30 to 10:30. You can add it to any rate for €32 per adult per night (children €16)." }) },
  { words: ["restaurant", "dinner", "lunch", "eat", "food", "menu", "lume", "vegetarian", "vegan", "gluten"], reply: () => ({ reply: `${DINING.restaurant.name} is our terrace restaurant, cooking with produce from our own garden and the morning's catch. ${DINING.restaurant.hours}. Our chef happily adapts dishes for vegetarian, vegan and gluten-free guests.`, action: { label: "See dining", href: "/dining" } }) },
  { words: ["spa", "massage", "treatment", "yoga", "pool", "wellness"], reply: () => ({ reply: `${SPA.name} is carved into the rock beneath the hotel, with a pool that opens to the sea. The signature Sea Salt & Lemon Ritual is 90 minutes for €190.`, action: { label: "Explore the spa", href: "/spa" } }) },
  { words: ["cancel", "refund", "cancellation", "change"], reply: () => ({ reply: "Flexible rates can be cancelled free of charge up to 7 days before arrival; after that the first night is charged. Non-refundable rates are 12% cheaper but cannot be changed.", action: { label: "Manage a booking", href: "/manage" } }) },
  { words: ["child", "children", "kid", "family", "baby", "cot"], reply: () => ({ reply: "Children of all ages are welcome and cots are free. For families we suggest the Cliff Junior Suite, the Panorama Suite or the two-bedroom Villa.", action: { label: "View rooms", href: "/rooms" } }) },
  { words: ["dog", "pet", "cat"], reply: () => ({ reply: "Small dogs are welcome in the Terrace Room and the Villa for €30 per night. Just let us know when you book." }) },
  { words: ["access", "wheelchair", "lift", "elevator", "stairs", "mobility"], reply: () => ({ reply: "A lift connects the jetty, reception and the main terraces, and the Classic Sea View Room on level 2 has step-free access with a walk-in shower. Some areas are reached by stairs, so please contact us and we will plan your stay together." }) },
  { words: ["tax", "fee", "fees"], reply: () => ({ reply: "Prices include all hotel charges. The local city tax of €5 per adult per night (first 7 nights) is shown before you pay and settled at the hotel." }) },
  { words: ["open", "season", "closed", "winter", "november"], reply: () => ({ reply: `We are open ${HOTEL.season}. Next season is already open for booking.` }) },
  { words: ["experience", "activity", "activities", "tour", "hike", "cooking", "lemon", "excursion", "capri", "positano"], reply: () => ({ reply: "Guests love our private boat days, the Path of the Gods walk, cooking with Nonna's recipes and the lemon grove tour. Our team can arrange any of them before you arrive.", action: { label: "See experiences", href: "/experiences" } }) },
  { words: ["wifi", "wi-fi", "internet"], reply: () => ({ reply: "Free high-speed Wi-Fi is available throughout the hotel, including the terraces and the spa." }) },
  { words: ["suite", "room", "villa", "view", "biggest", "best"], reply: () => ({ reply: "We have six room types, from the Classic Sea View Room to the two-bedroom Villa with its own pool. For a special stay, the Panorama Suite has a private plunge pool and the Grotto Suite is carved into the cliff.", action: { label: "Compare rooms", href: "/rooms" } }) },
  { words: ["book", "availability", "available", "price", "cost", "rate", "reserve", "night"], reply: () => ({ reply: "You can see live prices and availability for your dates on our booking page. Booking direct always gets our best rate.", action: { label: "Check availability", href: "/book" } }) },
];

/** Scripted answers for demo mode (no API key needed). */
export function demoReply(message: string): ConciergeReply {
  const m = message.toLowerCase();
  if (/^(hi|hello|hey|ciao|buongiorno|good (morning|afternoon|evening))\b/.test(m.trim())) {
    return { reply: "Buongiorno! I'm the Marivento concierge. Ask me about rooms, dining, the spa, getting here or anything about your stay." };
  }
  let best: { score: number; r: ConciergeReply } | null = null;
  for (const t of TOPICS) {
    const score = t.words.filter((w) => m.includes(w)).length;
    if (score > 0 && (!best || score > best.score)) best = { score, r: t.reply() };
  }
  return best?.r ?? { reply: `I'm not sure about that one, but our team will be happy to help: call ${HOTEL.phone} or write to ${HOTEL.email}.` };
}
