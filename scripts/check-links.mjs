// Fails if any internal link or image reference points to something that does not exist.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "src";
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(SRC).filter((f) => /\.(tsx?)$/.test(f));
const rooms = [...readFileSync(join(SRC, "lib/data/rooms.ts"), "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const routes = new Set(["/", "/rooms", "/dining", "/spa", "/experiences", "/offers", "/our-story", "/getting-here", "/faq", "/policies", "/book", "/book/confirmation", "/manage", "/admin"]);
rooms.forEach((s) => routes.add(`/rooms/${s}`));
const bad = [];
for (const r of routes) {
  const seg = r.split("/").filter(Boolean);
  const direct = join(SRC, "app", ...seg, "page.tsx");
  const dyn = seg.length === 2 && seg[0] === "rooms" ? join(SRC, "app", "rooms", "[slug]", "page.tsx") : null;
  if (!existsSync(direct) && !(dyn && existsSync(dyn))) bad.push(`route without page: ${r}`);
}
const ANCHORS = { "/policies": ["cancellation", "payment", "stay", "privacy", "terms"] };
let count = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/href[=:]\s*[{]?["'`](\/[^"'`?$]*)/g)) {
    count++;
    const [path, hash] = m[1].split("#");
    if (path.startsWith("/api/")) continue;
    const prefixOk = path.endsWith("/") && path.length > 1 && [...routes].some((r) => r.startsWith(path));
    if (!routes.has(path || "/") && !prefixOk) bad.push(`${f}: ${m[1]}`);
    if (hash && ANCHORS[path] && !ANCHORS[path].includes(hash)) bad.push(`${f}: missing anchor ${m[1]}`);
  }
  for (const m of src.matchAll(/img\(\s*[`"]([^"`$]+)[`"]/g)) if (!existsSync(join("public/images", `${m[1]}.webp`))) bad.push(`${f}: missing image ${m[1]}`);
}
// Room image sets are built from slugs
for (const s of ["classic", "terrace", "junior", "grotto", "panorama", "villa"]) {
  for (const k of ["hero", "view", "detail", s === "villa" ? null : "bath"].filter(Boolean)) if (!existsSync(`public/images/room-${s}-${k}.webp`)) bad.push(`missing room image room-${s}-${k}`);
}
if (!existsSync("public/images/room-villa-bedroom.webp")) bad.push("missing room-villa-bedroom");
if (bad.length) {
  console.error("Problems:\n" + bad.join("\n"));
  process.exit(1);
}
console.log(`${routes.size} routes, ${count} internal links checked, 0 dead. All images present.`);
