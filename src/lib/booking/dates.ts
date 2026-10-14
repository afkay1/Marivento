/** Date helpers working on ISO "YYYY-MM-DD" strings in UTC, so results never shift with time zones. */
export const toISO = (d: Date) => d.toISOString().slice(0, 10);
export const parse = (iso: string) => new Date(iso + "T00:00:00Z");
export const addDays = (iso: string, n: number) => {
  const d = parse(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
};
export const nightsBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);
export const eachNight = (checkIn: string, checkOut: string) => {
  const out: string[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) out.push(d);
  return out;
};
export const isISODate = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parse(s).getTime());
export const todayISO = () => toISO(new Date());
export const monthStart = (iso: string) => iso.slice(0, 8) + "01";
export const addMonths = (iso: string, n: number) => {
  const d = parse(monthStart(iso));
  d.setUTCMonth(d.getUTCMonth() + n);
  return toISO(d);
};
export const daysInMonth = (iso: string) => {
  const d = parse(monthStart(iso));
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
};
