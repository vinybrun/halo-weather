export function formatClock(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));
}

export function formatWeekday(isoDate: string, todayIso?: string): string {
  const day = isoDate.slice(0, 10);
  if (todayIso && day === todayIso.slice(0, 10)) return "Today";
  if (todayIso) {
    const next = new Date(`${todayIso.slice(0, 10)}T12:00:00`);
    next.setDate(next.getDate() + 1);
    const stamp = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
    if (day === stamp) return "Tomorrow";
  }
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
    new Date(`${day}T12:00:00`),
  );
}

export function formatHourLabel(iso: string, nowIso: string, timeZone?: string): string {
  if (iso.slice(0, 13) === nowIso.slice(0, 13)) return "Now";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    timeZone,
  }).format(new Date(iso));
}

export function formatSun(iso: string, timeZone?: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));
}

export function placeSubtitle(place: {
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}): string {
  const bits = [place.admin1, place.country].filter(Boolean);
  if (bits.length) return bits.join(", ");
  return `${place.latitude.toFixed(2)}°, ${place.longitude.toFixed(2)}°`;
}
