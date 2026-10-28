import { initCore, startReveals, gsap, calm, lenis } from './core.js?v=20261028-2';
import { pageHero } from './page-hero.js?v=20261028-2';
import { getLang, d, onLang } from './i18n.js?v=20261028-2';
import { quote, fmtEUR, isSummerEvening } from './pricing.js?v=20261028-2';
import { HEURES_DEPART, TARIFS } from './data.js?v=20261028-2';

initCore();
pageHero();

const form = document.getElementById('req-form');
const panes = [...form.querySelectorAll('[data-pane]')];
const prog = [...document.querySelectorAll('[data-progress] li')];
const btnPrev = form.querySelector('[data-prev]'), btnNext = form.querySelector('[data-next]'), btnSend = form.querySelector('[data-submit]');
const done = form.querySelector('[data-done]'), navBtns = form.querySelector('[data-navbtns]');
const f = (id) => document.getElementById(id);
const dateIn = f('r-date'), heure = f('r-heure'), duree = f('r-duree'), pers = f('r-pers'), bbq = f('r-bbq');
const totalEl = document.querySelector('.recap [data-total]'), recapEl = document.querySelector('[data-recap]');
const seasonEl = form.querySelector('[data-season]'), warnEl = form.querySelector('[data-warn]');
let step = 0;

const iso = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
const parse = (s) => { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd); };
const today = new Date();
dateIn.min = iso(today);
heure.innerHTML = HEURES_DEPART.map((h) => `<option>${h}</option>`).join('');
heure.value = '10:00';

const type = () => form.type.value;
function fillDuree() {
  const t = type(), keep = duree.value;
  const opts = t === 'jour' ? [1, 2, 3, 4, 5, 6, 7, 8] : t === 'soiree' ? [2, 3] : t === 'partagee' ? [2] : [];
  duree.innerHTML = opts.length ? opts.map((h) => `<option value="${h}">${h} h</option>`).join('') : `<option value="">${d('toDefine')}</option>`;
  if ([...duree.options].some((o) => o.value === keep)) duree.value = keep;
  else if (t === 'jour') duree.value = '3';
  duree.disabled = opts.length < 2;
}

// Pré-remplissage depuis le composeur ou un bouton du site
try {
  const pre = JSON.parse(localStorage.getItem('tiki-prefill') || 'null');
  if (pre) {
    const r = form.querySelector(`input[name="type"][value="${pre.type}"]`);
    if (r) r.checked = true;
    if (pre.date) dateIn.value = pre.date;
    if (pre.personnes) pers.value = pre.personnes;
    if (pre.barbecue) bbq.checked = true;
    fillDuree();
    if (pre.duree) duree.value = String(pre.duree);
    if (pre.type === 'soiree' || pre.type === 'partagee') heure.value = '18:30';
    if (pre.type === 'evenement') heure.value = '19:30';
    localStorage.removeItem('tiki-prefill');
  }
} catch (e) { /* stockage indisponible */ }
fillDuree();
if (!dateIn.value) {
  const sat = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
  dateIn.value = iso(sat);
}

function current() {
  const t = type();
  const date = dateIn.value ? parse(dateIn.value) : null;
  const moment = t === 'jour' ? 'jour' : t === 'evenement' ? 'evenement' : t === 'info' ? 'info' : 'soiree';
  return { t, moment, formule: t === 'partagee' ? 'partagee' : 'privee', date, heures: +duree.value || null, personnes: Math.max(1, +pers.value || 1), barbecue: bbq.checked };
}

function fmtDate(dt) {
  return dt ? dt.toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : d('toDefine');
}

function updateRecap() {
  const lang = getLang();
  const c = current();
  let q = null;
  if (c.date && c.moment !== 'info') q = quote({ ...c, moment: c.moment, heures: c.heures || 2 });
  if (q && q.total !== null) totalEl.textContent = fmtEUR(q.total, lang);
  else totalEl.textContent = c.moment === 'info' || !c.date ? '—' : d('onRequest');
  totalEl.classList.toggle('is-text', !(q && q.total !== null));
  const rows = [
    [d('rType'), d('type')[c.t]],
    [d('rDate'), fmtDate(c.date)],
    [d('rHeure'), c.moment === 'info' ? d('toDefine') : heure.value],
    [d('rDuree'), c.heures ? `${c.heures} h` : d('toDefine')],
    [d('rPers'), String(c.personnes)]
  ];
  if (q) rows.push([d('rSaison'), q.season.key === 'haute' ? d('high') : d('low')]);
  if (c.barbecue) rows.push([d('rBbq'), `${d('yes')} · ${fmtEUR(TARIFS.barbecue, lang)}`]);
  recapEl.innerHTML = rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('');
  if (seasonEl && q) {
    seasonEl.hidden = false;
    seasonEl.classList.toggle('is-high', q.season.key === 'haute');
    seasonEl.querySelector('span').textContent = `${q.season.key === 'haute' ? d('high') : d('low')} · ${d(q.season.reason === 'holiday' ? 'holiday' : q.season.reason)}`;
  } else if (seasonEl) seasonEl.hidden = true;
  const warns = [];
  if (c.personnes > 12) warns.push(d('over12'));
  if ((c.t === 'soiree' || c.t === 'partagee') && c.date && !isSummerEvening(c.date)) warns.push(d('eveningOff'));
  if (c.t === 'partagee' && c.personnes < 8) warns.push(d('minShared'));
  if (q && q.season.confirm) warns.push(d('bridgeNote'));
  warnEl.hidden = !warns.length;
  warnEl.innerHTML = warns.join('<br>');
  return { c, q };
}

function setErr(name, msg) {
  const e = form.querySelector(`[data-err="${name}"]`);
  if (e) e.textContent = msg || '';
  const input = { date: dateIn, pers, nom: f('r-nom'), email: f('r-mail'), tel: f('r-tel') }[name];
  if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
}

function validate(i) {
  let ok = true;
  if (i === 1) {
    const dt = dateIn.value ? parse(dateIn.value) : null;
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const bad = type() !== 'info' && (!dt || dt < t0);
    setErr('date', bad ? d('errDate') : ''); if (bad) ok = false;
    const pBad = !(+pers.value >= 1);
    setErr('pers', pBad ? d('errPers') : ''); if (pBad) ok = false;
  }
  if (i === 2) {
    const nom = f('r-nom').value.trim();
    setErr('nom', nom ? '' : d('errNom')); if (!nom) ok = false;
    const mail = f('r-mail').value.trim();
    const mOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail);
    setErr('email', mOk ? '' : d('errMail')); if (!mOk) ok = false;
  }
  if (!ok) { const first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); }
  return ok;
}

function go(i) {
  const from = panes[step], to = panes[i];
  const dir = i > step ? 1 : -1;
  step = i;
  prog.forEach((li, k) => { li.classList.toggle('is-current', k === i); li.classList.toggle('is-done', k < i); });
  btnPrev.hidden = i === 0;
  btnNext.hidden = i === panes.length - 1;
  btnSend.hidden = i !== panes.length - 1;
  if (calm) { from.hidden = true; to.hidden = false; to.querySelector('input, select, textarea')?.focus(); return; }
  gsap.to(from, { x: -40 * dir, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
    from.hidden = true; gsap.set(from, { clearProps: 'all' });
    to.hidden = false;
    gsap.fromTo(to, { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out', onComplete: () => to.querySelector('input:not([type="radio"]), select, textarea, input')?.focus({ preventScroll: true }) });
  } });
}

btnNext.addEventListener('click', () => { if (validate(step)) go(step + 1); });
btnPrev.addEventListener('click', () => go(step - 1));
form.addEventListener('change', (e) => { if (e.target.name === 'type') fillDuree(); updateRecap(); });
form.addEventListener('input', updateRecap);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate(2)) return;
  panes.forEach((p) => { p.hidden = true; });
  navBtns.hidden = true;
  prog.forEach((li) => { li.classList.remove('is-current'); li.classList.add('is-done'); });
  done.hidden = false;
  done.focus();
  if (!calm) gsap.from(done.children, { y: 24, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 });
});

form.querySelector('[data-restart]').addEventListener('click', () => {
  done.hidden = true; navBtns.hidden = false;
  panes.forEach((p, k) => { p.hidden = k !== 0; });
  step = 0;
  go(0);
});

form.querySelector('[data-copy-recap]').addEventListener('click', async (e) => {
  const b = e.currentTarget;
  const { c, q } = updateRecap();
  const lines = [...recapEl.querySelectorAll('dt')].map((dt) => `${dt.textContent} : ${dt.nextElementSibling.textContent}`);
  lines.push(`${getLang() === 'en' ? 'Indicative price' : 'Tarif indicatif'} : ${totalEl.textContent}`);
  lines.push(`${f('r-nom').value} · ${f('r-mail').value}${f('r-tel').value ? ' · ' + f('r-tel').value : ''}`);
  if (f('r-msg').value.trim()) lines.push(f('r-msg').value.trim());
  const text = lines.join('\n');
  const label = b.querySelector('span');
  const old = label.textContent;
  try { await navigator.clipboard.writeText(text); label.textContent = d('copied'); } catch (err) { label.textContent = d('copyFail'); }
  setTimeout(() => { label.textContent = old; }, 1800);
});

onLang(() => { fillDuree(); updateRecap(); });
updateRecap();
if (location.hash === '#demande') setTimeout(() => { const t = document.getElementById('demande'); if (lenis) lenis.scrollTo(t, { offset: -60, immediate: true }); else t.scrollIntoView(); }, 900);
startReveals();
