// Lever et coucher du soleil à Cassis, calculés pour le jour même (méthode SunCalc / NOAA).
const RAD = Math.PI / 180;
const DAY = 86400000, J1970 = 2440588, J2000 = 2451545;
const E = RAD * 23.4397;
export const CASSIS = { lat: 43.2147, lon: 5.5376, tz: 'Europe/Paris' };

const toJulian = (d) => d.valueOf() / DAY - 0.5 + J1970;
const fromJulian = (j) => new Date((j + 0.5 - J1970) * DAY);

export function sunTimes(date, lat = CASSIS.lat, lon = CASSIS.lon) {
  const lw = RAD * -lon, phi = RAD * lat;
  const d = toJulian(date) - J2000;
  const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
  const ds = 0.0009 + lw / (2 * Math.PI) + n;
  const M = RAD * (357.5291 + 0.98560028 * ds);
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + RAD * 102.9372 + Math.PI;
  const dec = Math.asin(Math.sin(E) * Math.sin(L));
  const Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const h0 = RAD * -0.833;
  const w = Math.acos((Math.sin(h0) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
  const a = 0.0009 + (w + lw) / (2 * Math.PI) + n;
  const Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  return { rise: fromJulian(Jnoon - (Jset - Jnoon)), set: fromJulian(Jset) };
}

// Jour civil à Cassis (et non dans le fuseau du visiteur)
function cassisDay(now) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: CASSIS.tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, 12);
}

export function nextSunEvent(now = new Date()) {
  const noon = cassisDay(now);
  const today = sunTimes(new Date(noon));
  if (now < today.rise) return { kind: 'rise', when: today.rise, tomorrow: false };
  if (now < today.set) return { kind: 'set', when: today.set, tomorrow: false };
  return { kind: 'rise', when: sunTimes(new Date(noon + DAY)).rise, tomorrow: true };
}

export function cassisTime(date, lang = 'fr') {
  const t = new Intl.DateTimeFormat('fr-FR', { timeZone: CASSIS.tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  return lang === 'en' ? t : t.replace(':', '\u00a0h\u00a0');
}
