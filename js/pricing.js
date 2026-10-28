import { TARIFS, PALIERS } from './data.js?v=20261028-2';

const d0 = (y, m, d) => new Date(y, m - 1, d);
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

// Dimanche de Pâques (algorithme de Meeus/Jones/Butcher)
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return d0(y, month, day);
}

export function mayHolidays(y) {
  const e = easter(y);
  return [
    { date: d0(y, 5, 1), fr: '1er mai', en: '1 May' },
    { date: d0(y, 5, 8), fr: '8 mai', en: '8 May' },
    { date: addDays(e, 39), fr: 'Ascension', en: 'Ascension Day' },
    { date: addDays(e, 50), fr: 'lundi de Pentecôte', en: 'Whit Monday' }
  ].filter((h) => h.date.getMonth() === 4);
}

// Saison tarifaire : haute de juin à septembre, plus ponts, dimanches et jours fériés de mai
export function season(date) {
  const m = date.getMonth() + 1;
  if (m >= 6 && m <= 9) return { key: 'haute', reason: 'summer' };
  if (m === 5) {
    const hol = mayHolidays(date.getFullYear());
    const h = hol.find((x) => sameDay(x.date, date));
    if (h) return { key: 'haute', reason: 'holiday', label: h };
    if (date.getDay() === 0) return { key: 'haute', reason: 'sunday' };
    const pont = hol.find((x) => (x.date.getDay() === 2 && sameDay(addDays(x.date, -1), date)) || (x.date.getDay() === 4 && sameDay(addDays(x.date, 1), date)));
    if (pont) return { key: 'haute', reason: 'bridge', label: pont, confirm: true };
  }
  return { key: 'basse', reason: 'offpeak' };
}

export const isSummerEvening = (date) => { const m = date.getMonth() + 1; return m >= 6 && m <= 9; };

// Prix d'une sortie. moment: 'jour' | 'soiree' | 'evenement'; formule (soirée): 'privee' | 'partagee'
export function quote({ moment, date, heures, formule, personnes, barbecue }) {
  const s = season(date);
  let base = null, detail = '';
  if (moment === 'jour') {
    base = TARIFS[s.key][heures] ?? null;
    detail = s.key;
  } else if (moment === 'soiree') {
    if (formule === 'partagee') {
      base = TARIFS.soireePartagee.parPersonne * personnes;
      detail = 'partagee';
    } else {
      base = TARIFS.soireePrivee[heures] ?? null;
      detail = 'privee';
    }
  } else {
    base = null; // tarif des feux d'artifice non publié
    detail = 'evenement';
  }
  const extra = barbecue ? TARIFS.barbecue : 0;
  return { season: s, base, extra, total: base === null ? null : base + extra, detail };
}

// Combien de calanques pour un temps donné, et ce qu'il reste pour la baignade
export function route(minutes) {
  let reached = null;
  for (const p of PALIERS) if (p.minutes <= minutes) reached = p;
  if (!reached) return { palier: null, reste: minutes, noms: [] };
  const noms = PALIERS.filter((p) => p.minutes <= reached.minutes).flatMap((p) => p.ajout);
  return { palier: reached, reste: minutes - reached.minutes, noms };
}

export const fmtEUR = (n, lang = 'fr') => new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
export const fmtMinutes = (m, lang = 'fr') => {
  const h = Math.floor(m / 60), r = m % 60;
  if (lang === 'en') return h ? `${h} h${r ? ' ' + String(r).padStart(2, '0') : ''}` : `${r} min`;
  return h ? `${h} h${r ? ' ' + String(r).padStart(2, '0') : ''}` : `${r} min`;
};

// Prochaine occurrence d'un événement annuel et état de l'édition de l'année en cours
export function eventStatus(ev, today = new Date()) {
  const y = today.getFullYear();
  const thisYear = d0(y, ev.mois, ev.jour);
  const past = thisYear < d0(y, today.getMonth() + 1, today.getDate());
  return { thisYear, past, next: past ? d0(y + 1, ev.mois, ev.jour) : thisYear, nextYear: past ? y + 1 : y };
}
