import { HOTEL, FAQS } from "./data/hotel";
import { ROOMS } from "./data/rooms";
import { SITE_URL } from "./format";

export function hotelLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${SITE_URL}/#hotel`,
    name: HOTEL.legalName,
    description: HOTEL.tagline,
    url: SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    telephone: HOTEL.phone,
    email: HOTEL.email,
    priceRange: "€€€€",
    checkinTime: HOTEL.checkIn,
    checkoutTime: HOTEL.checkOut,
    numberOfRooms: HOTEL.rooms,
    petsAllowed: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: HOTEL.address.street,
      addressLocality: HOTEL.address.locality,
      addressRegion: HOTEL.address.region,
      postalCode: HOTEL.address.postalCode,
      addressCountry: HOTEL.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: HOTEL.geo.lat, longitude: HOTEL.geo.lng },
    aggregateRating: { "@type": "AggregateRating", ratingValue: HOTEL.rating.value, reviewCount: HOTEL.rating.count, bestRating: 5 },
    amenityFeature: ["Infinity pool", "Spa", "Restaurant", "Bar", "Free Wi-Fi", "Boat transfers"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    makesOffer: ROOMS.map((r) => ({
      "@type": "Offer",
      name: r.name,
      url: `${SITE_URL}/rooms/${r.slug}`,
      priceSpecification: { "@type": "UnitPriceSpecification", price: r.prices.shoulder, priceCurrency: "EUR", unitText: "night" },
      itemOffered: {
        "@type": "HotelRoom",
        name: r.name,
        bed: r.beds,
        occupancy: { "@type": "QuantitativeValue", maxValue: r.maxGuests },
        floorSize: { "@type": "QuantitativeValue", value: r.size, unitCode: "MTK" },
      },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
