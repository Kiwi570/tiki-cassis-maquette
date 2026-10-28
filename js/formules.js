import { initCore, startReveals, gsap, calm } from './core.js?v=20261028';
import { pageHero } from './page-hero.js?v=20261028';
import { createChart } from './chart.js';
import { createFireworks } from './fireworks.js?v=20261028';
import { getLang, d, onLang } from './i18n.js?v=20261028';
import { quote, route, season, fmtEUR, eventStatus, isSummerEvening } from './pricing.js?v=20261028';
import { TARIFS, EVENEMENTS } from './data.js?v=20261028';

initCore();
pageHero();

/* ---------- Grille des tarifs ---------- */
function renderBars() {
  const lang = getLang();
  const max = TARIFS.haute[8];
  document.querySelectorAll('[data-bars]').forEach((box) => {
    const t = TARIFS[box.dataset.bars];
    box.innerHTML = Object.entries(t).map(([h, p]) => `<div class="bar"><span>${h} h</span><span class="bar__track"><span class="bar__fill" style="--w:${((p / max) * 100).toFixed(1)}%"></span></span><b>${fmtEUR(p, lang)}</b></div>`).join('');
  });
}
renderBars();
onLang(renderBars);
if (!calm) {
  document.querySelectorAll('[data-bars]').forEach((box) => {
    gsap.from(box.querySelectorAll('.bar__fill'), { scaleX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: box, start: 'top 85%', once: true } });
  });
}

/* ---------- Composeur ---------- */
const form = document.getElementById('composer');
const $ = (s) => form.querySelector(s);
const dateIn = $('#c-date'), evtSel = $('#c-evt'), range = $('#c-duree'), pers = $('#c-pers'), bbq = $('#c-bbq');
const outDuree = $('#o-duree'), totalEl = $('[data-total]'), linesEl = $('[data-lines]'), progEl = $('[data-prog]'), warnEl = $('[data-warn]');
const chart = createChart($('[data-chart="composer"]'), { compact: true });
const iso = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
const parse = (s) => { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd); };

const today = new Date();
const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
dateIn.value = iso(start);
dateIn.min = iso(today);

function fillEvents() {
  const lang = getLang();
  evtSel.innerHTML = EVENEMENTS.map((ev) => {
    const st = eventStatus(ev, today);
    return `<option value="${iso(st.next)}">${d('evtLabel')(ev, st.nextYear)}</option>`;
  }).join('');
}
fillEvents();

const shown = { west: 0, east: 0 };
let totalTween = null;
const totalObj = { v: 0 };

function read() {
  const moment = form.moment.value;
  const formule = form.formule.value;
  const date = moment === 'evenement' ? parse(evtSel.value) : (dateIn.value ? parse(dateIn.value) : start);
  let heures = +range.value;
  if (moment === 'soiree' && formule === 'partagee') heures = 2;
  if (moment === 'evenement') heures = null;
  const personnes = Math.min(12, Math.max(1, +pers.value || 1));
  return { moment, formule, date, heures, personnes, barbecue: bbq.checked };
}

function seasonText(s) {
  const reason = s.reason === 'holiday' ? `${d('holiday')} (${getLang() === 'en' ? s.label.en : s.label.fr})` : d(s.reason);
  return `${s.key === 'haute' ? d('high') : d('low')} · ${reason}`;
}

function update(animate = true) {
  const lang = getLang();
  const c = read();
  // champs visibles
  form.querySelector('[data-when="soiree"]').hidden = c.moment !== 'soiree';
  form.querySelector('[data-when="duree"]').hidden = c.moment === 'evenement' || (c.moment === 'soiree' && c.formule === 'partagee');
  dateIn.hidden = c.moment === 'evenement';
  evtSel.hidden = c.moment !== 'evenement';
  const [mn, mx] = c.moment === 'soiree' ? [2, 3] : [1, 8];
  const ticks = form.querySelector('[data-ticks]');
  if (+range.min !== mn || +range.max !== mx || !ticks.children.length) {
    range.min = mn; range.max = mx;
    range.value = Math.min(mx, Math.max(mn, +range.value));
    ticks.innerHTML = Array.from({ length: mx - mn + 1 }, (_, i) => `<span>${mn + i} h</span>`).join('');
  }
  const h = c.moment === 'soiree' && c.formule === 'partagee' ? 2 : +range.value;
  c.heures = c.moment === 'evenement' ? null : h;
  range.style.setProperty('--fill', `${((h - mn) / Math.max(1, mx - mn)) * 100}%`);
  outDuree.textContent = `${h} h`;

  const q = quote(c);
  form.querySelectorAll('[data-season], [data-season-2]').forEach((s) => {
    s.classList.toggle('is-high', q.season.key === 'haute');
    s.querySelector('span').textContent = seasonText(q.season);
  });

  // prix
  if (q.total === null) {
    if (totalTween) totalTween.kill();
    totalEl.classList.add('is-text');
    totalEl.textContent = d('onRequest');
  } else {
    totalEl.classList.remove('is-text');
    if (totalTween) totalTween.kill();
    if (animate && !calm) {
      totalTween = gsap.to(totalObj, { v: q.total, duration: 0.8, ease: 'power3.out', onUpdate: () => { totalEl.textContent = fmtEUR(Math.round(totalObj.v), lang); } });
    } else { totalObj.v = q.total; totalEl.textContent = fmtEUR(q.total, lang); }
  }
  const lines = [];
  if (c.moment === 'jour') lines.push([`${d('boatPrice')} · ${h} h · ${q.season.key === 'haute' ? d('high') : d('low')}`, fmtEUR(q.base, lang)]);
  if (c.moment === 'soiree' && c.formule === 'privee') lines.push([`${d('boatPrice')} · ${h} h`, fmtEUR(q.base, lang)]);
  if (c.moment === 'soiree' && c.formule === 'partagee') lines.push([d('perPerson')(c.personnes, fmtEUR(TARIFS.soireePartagee.parPersonne, lang)), fmtEUR(q.base, lang)]);
  if (c.moment === 'evenement') lines.push([d('evtLabel')(EVENEMENTS.find((e) => iso(eventStatus(e, today).next) === evtSel.value) || EVENEMENTS[0], c.date.getFullYear()), d('onRequest')]);
  if (c.barbecue) lines.push([d('bbq'), `+ ${fmtEUR(TARIFS.barbecue, lang)}`]);
  linesEl.innerHTML = lines.map(([a, b]) => `<div><span>${a}</span><span class="num">${b}</span></div>`).join('');

  // avertissements
  const warns = [];
  if (c.moment === 'soiree' && !isSummerEvening(c.date)) warns.push(d('eveningOff'));
  if (c.moment === 'soiree' && c.formule === 'partagee' && c.personnes < 8) warns.push(d('minShared'));
  if (q.season.confirm) warns.push(d('bridgeNote'));
  warnEl.hidden = !warns.length;
  warnEl.innerHTML = warns.join('<br>');

  // programme et carte
  const f = (m) => { const hh = Math.floor(m / 60), r = m % 60; return hh ? `${hh} h${r ? ' ' + String(r).padStart(2, '0') : ''}` : `${r} min`; };
  let prog = '', n = 3, east = 0;
  if (c.moment === 'jour') {
    const r = route(h * 60);
    prog = d('progDay')(r, f);
    if (h === 2) prog += ' ' + d('prog2day');
    if (h >= 6) { prog += d('progIle'); east = 1; }
    n = r.palier ? r.palier.n : 0;
  } else if (c.moment === 'soiree') {
    prog = c.formule === 'partagee' ? d('progShared') : (h === 3 ? d('progEve3') : d('progEve2'));
    n = c.formule === 'privee' && h === 3 ? 5 : 3;
  } else {
    prog = d('progEvt');
  }
  progEl.textContent = prog;
  const target = { west: chart.westFor(n), east };
  const label = c.heures ? `${c.heures} h` : '—';
  const count = d('calanques')(n);
  if (animate && !calm) gsap.to(shown, { ...target, duration: 1.1, ease: 'power2.inOut', overwrite: true, onUpdate: () => chart.render({ ...shown, label, count }) });
  else { Object.assign(shown, target); chart.render({ ...shown, label, count }); }
}

form.addEventListener('input', () => update());
form.addEventListener('change', () => update());
form.querySelectorAll('[data-step-btn]').forEach((b) => b.addEventListener('click', () => {
  pers.value = Math.min(12, Math.max(1, (+pers.value || 1) + +b.dataset.stepBtn));
  update();
}));
pers.addEventListener('blur', () => { pers.value = Math.min(12, Math.max(1, +pers.value || 1)); update(); });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const c = read();
  const type = c.moment === 'soiree' ? (c.formule === 'partagee' ? 'partagee' : 'soiree') : c.moment;
  try { localStorage.setItem('tiki-prefill', JSON.stringify({ type, date: iso(c.date), duree: c.moment === 'soiree' && c.formule === 'partagee' ? 2 : +range.value, personnes: c.personnes, barbecue: c.barbecue })); } catch (err) { /* stockage indisponible */ }
  const a = document.createElement('a');
  a.href = 'contact.html#demande';
  document.body.appendChild(a);
  a.click();
});
onLang(() => { fillEvents(); update(false); });
update(false);

document.querySelectorAll('[data-fireworks]').forEach((cv) => createFireworks(cv, { calm }));
startReveals();
