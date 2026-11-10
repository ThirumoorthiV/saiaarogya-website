import type { DayOfWeek, OpdHoursRule } from "@/types";

const IST_DAYS: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Current day + minutes-since-midnight in India Standard Time. */
export function nowInIST(date = new Date()): { day: DayOfWeek; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday").slice(0, 3) as DayOfWeek;
  const day = IST_DAYS.includes(weekday) ? weekday : "Mon";
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (hhmm: string) => {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
};

/**
 * Whether the OPD is open right now. Returns null when no hours are
 * configured (timings not yet confirmed), so the UI can hide the badge.
 */
export function isOpenNow(rules: OpdHoursRule[], date = new Date()): boolean | null {
  if (!rules.length) return null;
  const { day, minutes } = nowInIST(date);
  return rules.some((r) => r.days.includes(day) && minutes >= toMinutes(r.open) && minutes < toMinutes(r.close));
}

/** "09:00" → "9:00 AM" */
export function formatTime(hhmm: string) {
  const m = toMinutes(hhmm);
  const h = Math.floor(m / 60);
  const min = String(m % 60).padStart(2, "0");
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${min} ${suffix}`;
}
