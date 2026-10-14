import { img } from "../types";

export const HOTEL = {
  name: "Marivento",
  legalName: "Marivento Cliff Hotel",
  tagline: "A villa on the cliffs of the Amalfi Coast",
  address: { street: "Via del Vento 18", locality: "Praiano", region: "Campania", postalCode: "84010", country: "Italy", countryCode: "IT" },
  phone: "+39 089 555 0182",
  phoneHref: "tel:+390895550182",
  whatsapp: "+39 333 555 0182",
  whatsappHref: "https://wa.me/393335550182",
  email: "stay@marivento.example",
  checkIn: "15:00",
  checkOut: "11:00",
  season: "1 April – 31 October",
  rooms: 24,
  geo: { lat: 40.6129, lng: 14.5276 },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Praiano+Amalfi+Coast",
  rating: { value: 4.9, count: 412 },
};

export const NAV = [
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/dining", label: "Dining" },
  { href: "/spa", label: "Spa" },
  { href: "/experiences", label: "Experiences" },
  { href: "/offers", label: "Offers" },
  { href: "/our-story", label: "Our Story" },
];

export const FOOTER_LINKS = [
  { href: "/getting-here", label: "Getting here & contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/manage", label: "Manage your booking" },
  { href: "/policies", label: "Policies" },
];

export const REVIEWS = [
  { quote: "The kind of place you plan the rest of your life around. Waking up to that view from the Panorama Suite felt unreal.", name: "Charlotte & James", from: "London", stay: "Panorama Suite, June" },
  { quote: "Every person on the team remembered our names on day one. The boat to the hidden cove was the highlight of our honeymoon.", name: "Sofia R.", from: "Madrid", stay: "Grotto Suite, September" },
  { quote: "Small, quiet and impossibly beautiful. Dinner at Lume on the terrace is worth the trip alone.", name: "Daniel K.", from: "Toronto", stay: "Terrace Room, May" },
];

export const AWARDS = ["Coastal Stays Readers' Favourite 2026", "Small Luxury Stays Collection", "Plastic-free since 2022"];

export const DINING = {
  restaurant: {
    name: "Lume",
    text: "Our terrace restaurant cooks with what grows on the cliff and what the boats bring in each morning. Lemons, tomatoes and herbs come from the hotel garden twenty steps from the kitchen.",
    hours: "Breakfast 7:30 – 10:30 · Lunch 12:30 – 15:00 · Dinner 19:00 – 22:30",
  },
  bar: { name: "Bar Scoglio", text: "A small bar carved into the rock, made for golden hour. Spritzes, local wines and fresh juices as the sun drops behind the cliffs.", hours: "Daily 16:00 – 00:00" },
  garden: { name: "The kitchen garden", text: "Terraces of lemons, tomatoes, basil and wild fennel. Guests are welcome to join the morning harvest with our chef." },
  menu: [
    { course: "To start", items: ["Lemon-cured anchovies, fennel, garden leaves", "Burrata, roasted cherry tomatoes, basil oil", "Raw red prawns, Amalfi lemon, sea salt"] },
    { course: "Pasta", items: ["Lemon and ricotta ravioli, brown butter, sage", "Spaghetti alle vongole, parsley, chilli", "Scialatielli with catch of the day"] },
    { course: "From the sea", items: ["Whole sea bream baked in salt", "Grilled octopus, potato, olives, capers", "Catch of the day, acqua pazza"] },
    { course: "To finish", items: ["Delizia al limone", "Almond and lemon torta caprese", "Garden fruit granita"] },
  ],
  images: {
    hero: img("dining-hero", "Lume terrace restaurant at dusk under a vine pergola with festoon lights"),
    dish: img("dining-dish", "Lemon and ricotta ravioli with brown butter and sage"),
    seafood: img("dining-seafood", "Grilled sea bream and spaghetti alle vongole on a terrace table"),
    bar: img("dining-bar", "Cliffside cocktail bar at sunset with rattan stools"),
    garden: img("dining-garden", "Terraced kitchen garden with lemons and tomatoes above the sea"),
  },
};

export const SPA = {
  name: "Sale Spa",
  text: "Sale means salt. Our spa is carved into the limestone beneath the hotel, with a still pool that opens onto the sea. Rituals use sea salt, Amalfi lemons and local olive oil.",
  hours: "Daily 9:00 – 20:00 · Pool open to hotel guests 7:00 – 21:00",
  treatments: [
    { name: "Sea Salt & Lemon Ritual", duration: "90 min", price: 190, text: "Salt scrub, warm lemon oil massage and a cool sea-mineral wrap." },
    { name: "Cliffside Massage", duration: "60 min", price: 140, text: "Slow, deep massage in a treatment room facing the sea." },
    { name: "Sunrise Yoga", duration: "60 min", price: 35, text: "Small-group practice on the cliff deck as the sun comes up." },
    { name: "Couples' Grotto Ritual", duration: "120 min", price: 420, text: "Private use of the rock pool, side-by-side massage and herbal tea." },
  ],
  images: {
    hero: img("spa-hero", "Spa pool carved into limestone with an arched opening to the sea"),
    treatment: img("spa-treatment", "Spa treatment room with a massage bed facing a small sea-view window"),
    ritual: img("spa-ritual", "Sea salt, lemon and olive oil ritual ingredients on a travertine tray"),
    yoga: img("spa-yoga", "Yoga mats on a cliff-top deck at sunrise"),
    relax: img("spa-relax", "Relaxation lounge with linen daybeds facing the sea"),
  },
};

export const EXPERIENCES = [
  { slug: "boat", name: "Private boat day", duration: "Full or half day", price: "From €650 per boat", text: "Cruise the coast on our wooden gozzo, swim in grottoes only reachable by sea and lunch in a fishing village.", image: img("exp-boat", "Wooden gozzo boat cruising past limestone cliffs") },
  { slug: "cooking", name: "Cooking with Nonna's recipes", duration: "3 hours", price: "€140 per person", text: "Make pasta by hand with our chef using family recipes, then eat what you cooked on the terrace.", image: img("exp-cooking", "Rustic kitchen table with fresh pasta, lemons and tomatoes") },
  { slug: "hike", name: "Path of the Gods walk", duration: "4 hours", price: "€90 per person", text: "A guided walk along the famous high footpath, with transfers and a picnic of local produce.", image: img("exp-hike", "Stone footpath high above the coast lined with yellow broom") },
  { slug: "lemons", name: "Lemon grove tour", duration: "2 hours", price: "€60 per person", text: "Walk the terraced groves under wooden pergolas and learn how Amalfi's famous lemons are grown.", image: img("exp-lemons", "Lemon grove under a wooden pergola with a basket of lemons") },
  { slug: "tasting", name: "Lemon & coffee tasting", duration: "1 hour", price: "€35 per person", text: "Fresh lemonade, granita and espresso with local pastries, served in the shade of the grove.", image: img("exp-tasting", "Lemonade, granita, juice and espresso on a table under a lemon pergola") },
  { slug: "cove", name: "Hidden cove swim", duration: "Half day", price: "Included for suite guests", text: "A short boat ride to a quiet cove with crystal water, towels and a picnic waiting.", image: img("exp-swim", "Secluded turquoise cove with a stone platform and ladder") },
];

export const OFFERS = [
  { slug: "stay-longer", name: "Stay Longer", text: "Stay five nights or more and enjoy your fifth night on us, plus a lemon grove tour.", terms: "Valid April – October. Applied automatically at checkout for stays of 5+ nights.", image: img("offer-longstay", "Linen hammock under a vine pergola facing the sea") },
  { slug: "cliffside-romance", name: "Cliffside Romance", text: "A sunset boat trip, a candlelit dinner at Lume and a celebration setup in your room.", terms: "Add the celebration package and sunset boat trip when you book.", image: img("offer-romance", "Romantic candlelit table on a terrace at dusk") },
  { slug: "wellness-escape", name: "Wellness Escape", text: "Three nights with daily sunrise yoga, one Sea Salt & Lemon Ritual per guest and a healthy breakfast.", terms: "Minimum three nights. Add spa extras when you book.", image: img("offer-wellness", "Wellness breakfast and a white robe on a quiet terrace") },
];

export const FAQS = [
  { q: "What time are check-in and check-out?", a: "Check-in is from 15:00 and check-out is by 11:00. Early check-in and late check-out can be added when you book, subject to availability." },
  { q: "When is the hotel open?", a: "Marivento is open from 1 April to 31 October each year. Bookings for next season are already open." },
  { q: "How do I get to the hotel?", a: "The nearest airport is Naples (about 90 minutes by car). We arrange private car transfers, or a boat transfer that lands at our private jetty, where a lift takes you up to reception." },
  { q: "Is parking available?", a: "Yes. Valet parking is available for €40 per day. Roads on the coast are narrow, so many guests prefer our transfers." },
  { q: "What is your cancellation policy?", a: "Flexible rates can be cancelled free of charge up to 7 days before arrival. After that, the first night is charged. Non-refundable rates are 12% cheaper and cannot be changed or refunded." },
  { q: "Is breakfast included?", a: "Breakfast can be added to any rate for €32 per adult per night (children €16). It is served on the Lume terrace from 7:30 to 10:30." },
  { q: "Do you welcome children?", a: "Children of all ages are welcome. The Cliff Junior Suite, Panorama Suite and Villa have space for extra beds, and cots are free." },
  { q: "Are pets allowed?", a: "Small dogs are welcome in the Terrace Room and the Villa for €30 per night. Please let us know when you book." },
  { q: "Is the hotel accessible?", a: "A lift connects the jetty, reception and the main terraces. The Classic Sea View Room on level 2 has step-free access and a walk-in shower. Some areas are reached by stairs, so please contact us to plan your stay." },
  { q: "What is the city tax?", a: "The local municipality charges €5 per adult per night for the first 7 nights. It is shown before you pay and settled at the hotel." },
];

export const STORY = {
  intro: "Marivento began as the summer house of the Esposito family in 1782. Three generations later, it is a 24-room hotel that still feels like a family home on the cliff.",
  chapters: [
    { year: "1782", title: "A villa above the sea", text: "A lemon merchant builds a pale ochre villa on the cliff, with terraces cut into the rock for his groves." },
    { year: "1954", title: "Open doors", text: "Nonna Rosa begins welcoming travellers who arrive by boat, cooking for them from the garden." },
    { year: "2019", title: "A careful restoration", text: "Her grandchildren spend four years restoring the frescoes, majolica floors and the grotto beneath the house." },
    { year: "Today", title: "Twenty-four rooms", text: "A small hotel with a terrace restaurant, a spa in the rock and a boat waiting at the jetty." },
  ],
  images: {
    hero: img("story-hero", "Ochre façade of the historic villa with green shutters and bougainvillea"),
    library: img("story-library", "Library lounge with frescoed ceiling, bookshelves and a sea-view window"),
    craft: img("story-craft", "Local ceramics workshop with hand-painted majolica plates"),
    detail: img("story-detail", "Old guest book, brass key and reading glasses on a wooden desk"),
  },
};

export const HOME_IMAGES = {
  hero: img("home-hero", "Marivento's whitewashed terraces stepping down the cliff to an infinity pool above the sea"),
  intro: img("home-intro", "Arched stone terrace with linen chairs framing the sea"),
  pool: img("home-pool", "Infinity pool on a cliff terrace at golden hour"),
  breakfast: img("home-breakfast", "Breakfast with pastries, figs and orange juice on a sea-view terrace"),
  tiles: img("home-detail-tiles", "Hand-painted majolica tiles with lemon patterns"),
  boat: img("home-boat", "Wooden boat moored in a turquoise cove below the cliffs"),
  sunset: img("home-sunset", "Sunset over the sea from the hotel's top terrace with lanterns"),
  night: img("home-night", "The hotel glowing on the cliff at blue hour, seen from the sea"),
  arrival: img("contact-arrival", "Private stone jetty with a wooden boat below the hotel"),
  reception: img("contact-reception", "Reception lounge with an arched doorway to the sea"),
};
