import { initCore, startReveals, gsap, ScrollTrigger, calm, isDesktop, splitWords, fine, lockScroll } from './core.js';
import { nextSunEvent, cassisTime } from './sun.js';
import { cinema } from './cinema.js';
import { createChart } from './chart.js';
import { createFireworks } from './fireworks.js';
import { getLang, d, onLang } from './i18n.js';
import { PALIERS } from './data.js';

const root = document.documentElement;
let seen = false;
try { seen = sessionStorage.getItem('tiki-intro') === '1'; } catch (e) { /* stockage indisponible */ }

initCore({ veil: false, keepIntro: true });

/* ---------- Vidéo d'ouverture (illustration générée par IA, créditée dans les mentions légales) ---------- */
const hero = document.querySelector('.hero');
const heroVideo = hero.querySelector('[data-hero-video]');
const conn = navigator.connection || {};
const lightData = conn.saveData || /(^|-)2g/.test(conn.effectiveType || '');
const useVideo = !!heroVideo && !calm && !lightData && window.innerWidth / window.innerHeight >= 0.8;
if (useVideo) {
  heroVideo.poster = heroVideo.dataset.poster;
  heroVideo.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
  heroVideo.preload = 'auto';
  heroVideo.load();
  heroVideo.style.opacity = '1';
  hero.classList.add('has-video');
  const play = () => heroVideo.play().catch(() => {});
  play();
  new IntersectionObserver(([e]) => { if (e.isIntersecting) play(); else heroVideo.pause(); }).observe(hero);
}

/* ---------- Heure réelle du coucher (ou du lever) du soleil à Cassis ---------- */
const sunText = hero.querySelector('[data-sun-text]');
function renderSun() {
  if (!sunText) return;
  const lang = getLang();
  const ev = nextSunEvent(new Date());
  const t = cassisTime(ev.when, lang).replace(/^0/, '');
  sunText.textContent = d('sun')(ev.kind, ev.tomorrow, t);
}
renderSun();
onLang(renderSun);
setInterval(renderSun, 60000);

/* ---------- Ouverture : lever du jour, le mot TIKI, plongée dans la vidéo ---------- */
const intro = document.querySelector('.intro');
const navEntry = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
const backForward = !!navEntry && navEntry.type === 'back_forward';
let finished = false;
const finish = () => {
  if (finished) return;
  finished = true;
  root.classList.add('is-ready');
  lockScroll(false);
  try { history.scrollRestoration = 'auto'; } catch (e) { /* indisponible */ }
  if (intro) intro.remove();
  try { sessionStorage.setItem('tiki-intro', '1'); } catch (e) { /* stockage indisponible */ }
};

// Fût du « I » mesuré dans la police : épaisseur et centre réel de l'encre (hors espacement des lettres)
function stemMetrics() {
  const fallback = { ratio: 0.08, center: null };
  try {
    const c = document.createElement('canvas');
    c.width = 400; c.height = 480;
    const x = c.getContext('2d');
    x.font = '400 400px "Instrument Serif"';
    x.fillText('I', 120, 420);
    const row = x.getImageData(0, 280, 400, 1).data;
    let run = 0, best = 0, end = 0;
    for (let i = 3, px = 0; i < row.length; i += 4, px += 1) {
      if (row[i] > 120) { run += 1; if (run > best) { best = run; end = px; } } else run = 0;
    }
    if (best <= 4) return fallback;
    return { ratio: best / 400, center: (end - best / 2 + 0.5 - 120) / 400 };
  } catch (e) { return fallback; }
}

function layoutWord() {
  const W = window.innerWidth, H = window.innerHeight;
  const texts = intro.querySelectorAll('.intro__text');
  texts.forEach((t) => { t.setAttribute('font-size', '100'); t.setAttribute('x', W / 2); t.setAttribute('y', H / 2); });
  const len = texts[0].getComputedTextLength() || 220;
  const fs = Math.min((W * (W > 900 ? 0.62 : 0.84)) / len * 100, H * 0.62);
  const baseline = H / 2 + fs * 0.34;
  texts.forEach((t) => { t.setAttribute('font-size', fs.toFixed(1)); t.setAttribute('y', baseline.toFixed(1)); });
  const stem = stemMetrics();
  let ox = W / 2;
  try {
    const r = texts[0].getExtentOfChar(1);
    ox = stem.center !== null ? r.x + stem.center * fs : r.x + r.width / 2;
  } catch (e) { /* mesure indisponible */ }
  const oy = baseline - fs * 0.33;
  const halfStem = (stem.ratio * fs) / 2;
  const scale = (Math.max(ox, W - ox) / halfStem) * 1.6;
  return { ox, oy, scale, fs };
}

if (calm || backForward) {
  finish();
  if (!calm) cinema(hero.querySelector('.hero__media'));
} else {
  try { history.scrollRestoration = 'manual'; } catch (e) { /* indisponible */ }
  window.scrollTo(0, 0);
  lockScroll(true);
  const title = hero.querySelector('[data-hero-title]');
  const split = splitWords(title);
  const fades = hero.querySelectorAll('[data-hero-fade]');
  const stage = intro.querySelector('.intro__stage');
  const line = intro.querySelector('.intro__line');
  const sun = intro.querySelector('.intro__sun');
  const logo = intro.querySelector('.intro__logo');
  const words = intro.querySelectorAll('.intro__word');
  const holeText = intro.querySelector('mask .intro__text');
  const stroke = intro.querySelector('.intro__text--stroke');
  const night = intro.querySelector('.intro__night');
  const timeEl = intro.querySelector('.intro__time');
  const clock = { m: 6 * 60 + 58 };

  const run = () => {
    const g = layoutWord();
    const dash = g.fs * 14;
    gsap.set(words, { svgOrigin: `${g.ox} ${g.oy}`, scale: 1 });
    gsap.set(stroke, { strokeDasharray: `${dash} ${dash}`, strokeDashoffset: dash });
    const tl = gsap.timeline();
    if (!seen) {
      tl.to(line, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' })
        .to(sun, { attr: { cy: 250 }, duration: 0.85, ease: 'power2.out' }, 0.12)
        .fromTo(logo, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.35)
        .to(clock, { m: 9 * 60, duration: 0.9, ease: 'power1.inOut', onUpdate: () => { const m = Math.round(clock.m); timeEl.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; } }, 0.12)
        .to(stage, { opacity: 0, y: -12, duration: 0.26, ease: 'power2.in' }, 0.98)
        .add('word', 1.22)
        .fromTo(holeText, { attr: { 'fill-opacity': 0 } }, { attr: { 'fill-opacity': 1 }, duration: 0.45, ease: 'power1.out' }, 'word')
        .fromTo(words, { scale: 0.92 }, { scale: 1, duration: 0.7, ease: 'power2.out' }, 'word')
        .fromTo(stroke, { opacity: 1, strokeDashoffset: dash }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 'word')
        .add('zoom', 'word+=0.62');
    } else {
      gsap.set(holeText, { attr: { 'fill-opacity': 1 } });
      gsap.set(stroke, { opacity: 1, strokeDashoffset: 0 });
      tl.add('zoom', 0.32);
    }
    tl.to(stroke, { opacity: 0, duration: 0.22, ease: 'power1.in' }, 'zoom')
      .to(words, { scale: g.scale, duration: 1.05, ease: 'expo.in' }, 'zoom')
      .to(night, { opacity: 0, duration: 0.06, ease: 'none' }, 'zoom+=1.0')
      .add('reveal', 'zoom+=1.0')
      .call(finish, null, 'reveal+=0.08');
    cinema(hero.querySelector('.hero__media'), { timeline: tl, at: tl.labels.reveal - 0.45 });
    if (split) tl.from(split.words, { yPercent: 115, rotate: 3, duration: 1.2, ease: 'expo.out', stagger: 0.05 }, 'reveal+=0.02');
    tl.from(fades, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 'reveal+=0.25');
  };
  const fontReady = document.fonts && document.fonts.load ? document.fonts.load('400 100px "Instrument Serif"') : Promise.resolve();
  Promise.race([fontReady, new Promise((r) => setTimeout(r, 700))]).then(run, run);
  setTimeout(finish, 6000);
}

if (!calm) {
  // Profondeur : la vidéo et le titre glissent en sens opposé sous la souris
  const inner = hero.querySelector('.hero__inner');
  if (fine) {
    const layers = [heroVideo, hero.querySelector('.hero__frame img')].filter(Boolean);
    gsap.set(layers, { scale: 1.06 });
    const lx = gsap.quickTo(layers, 'x', { duration: 1.4, ease: 'power3' }), ly = gsap.quickTo(layers, 'y', { duration: 1.4, ease: 'power3' });
    const tx = gsap.quickTo(inner, 'x', { duration: 1.6, ease: 'power3' }), ty = gsap.quickTo(inner, 'y', { duration: 1.6, ease: 'power3' });
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      lx(nx * -26); ly(ny * -16); tx(nx * 12); ty(ny * 8);
    });
    hero.addEventListener('pointerleave', () => { lx(0); ly(0); tx(0); ty(0); });
  }

  gsap.to(inner, { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  // La vague du bas avance avec le défilement
  ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onUpdate: (st) => hero.style.setProperty('--tide', `${(st.progress * 540).toFixed(1)}px`) });
}

/* ---------- Le dicton : les mots s'allument au fil de la lecture ---------- */
const dicton = document.querySelector('.dicton');
if (dicton && !calm) {
  const quote = dicton.querySelector('[data-words]');
  const sq = window.SplitText ? window.SplitText.create(quote, { type: 'words', wordsClass: 'wq' }) : null;
  if (sq) gsap.fromTo(sq.words, { opacity: 0.13, y: 12 }, { opacity: 1, y: 0, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: quote, start: 'top 82%', end: 'bottom 45%', scrub: true } });
  gsap.fromTo(dicton.querySelector('.dicton__giant'), { xPercent: 6 }, { xPercent: -38, ease: 'none', scrollTrigger: { trigger: dicton, start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- Le parcours : sillage sur la carte ---------- */
const chartHost = document.querySelector('[data-chart="home"]');
const chart = createChart(chartHost);
const steps = [...document.querySelectorAll('[data-steps] .step')];
const P = [{ n: 0, min: 0 }, ...PALIERS.map((p) => ({ n: p.n, min: p.minutes }))];
let active = 0;

const clockFmt = (m) => `${Math.floor(m / 60)}\u00a0h\u00a0${String(m % 60).padStart(2, '0')}`;
function westCount() { return chart.svg.querySelectorAll('.chart__mk.is-on:not(.is-east)').length; }

// p de 0 à 5 : de 0 à 4 les paliers ouest, de 4 à 5 l'autre cap
function setProgress(p) {
  const lang = getLang();
  if (p < 4) {
    const k = Math.floor(p), f = Math.min(1, (p - k) / 0.6);
    const a = P[k], b = P[k + 1];
    const west = chart.westFor(a.n) + (chart.westFor(b.n) - chart.westFor(a.n)) * f;
    const mins = Math.round(a.min + (b.min - a.min) * f);
    chart.render({ west, east: 0, label: clockFmt(mins) });
    chart.render({ west, east: 0, count: d('calanques')(westCount()) });
  } else {
    const f = Math.min(1, (p - 4) / 0.7);
    chart.render({ west: 1, east: f, label: f > 0.05 ? '6 h' : '3 h', count: f > 0.05 ? (lang === 'en' ? 'the other way' : 'l’autre cap') : d('calanques')(9) });
  }
  active = Math.min(4, Math.floor(p));
  showStep(active);
}

// Une seule étape visible à la fois, même en défilement rapide ou en marche arrière
const media = steps.map((s) => s.querySelector('.step__media'));
let shown = 0;
function showStep(k, instant = false) {
  if (!isDesktop() || calm) { shown = k; return; }
  if (k === shown && !instant) return;
  const prev = shown;
  shown = k;
  gsap.killTweensOf(steps);
  gsap.killTweensOf(media);
  steps.forEach((s, i) => s.classList.toggle('is-active', i === k));
  if (instant || prev < 0) {
    steps.forEach((s, i) => gsap.set(s, { autoAlpha: i === k ? 1 : 0, y: 0 }));
    gsap.set(media, { clipPath: 'inset(0% 0% 0% 0% round 18px)' });
    return;
  }
  const dir = k > prev ? 1 : -1;
  steps.forEach((s, i) => { if (i !== k && i !== prev) gsap.set(s, { autoAlpha: 0, y: 0 }); });
  gsap.to(steps[prev], { autoAlpha: 0, y: -24 * dir, duration: 0.32, ease: 'power2.in' });
  gsap.fromTo(steps[k], { autoAlpha: 0, y: 34 * dir }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'expo.out', delay: 0.08 });
  gsap.fromTo(media[k], { clipPath: dir > 0 ? 'inset(0% 0% 100% 0% round 18px)' : 'inset(100% 0% 0% 0% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 0.9, ease: 'expo.out', delay: 0.08 });
}

if (calm) {
  setProgress(3.99);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setProgress(+e.target.dataset.step + 0.99); }), { rootMargin: '-40% 0px -40% 0px' });
  steps.forEach((s) => io.observe(s));
} else {
  setProgress(0);
  const state = { p: 0 };
  let mobileTween = null;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    shown = -1;
    showStep(active, true);
    const st = ScrollTrigger.create({
      trigger: '.parcours', start: 'top top', end: '+=300%', pin: true, pinType: 'transform', anticipatePin: 1, scrub: true,
      onUpdate: (s) => setProgress(Math.min(4.99, s.progress * 5.2))
    });
    return () => {
      st.kill();
      gsap.killTweensOf(steps); gsap.killTweensOf(media);
      gsap.set(steps, { clearProps: 'opacity,visibility,transform' });
      gsap.set(media, { clearProps: 'clipPath' });
    };
  });
  mm.add('(max-width: 900px)', () => {
    chartHost.style.position = 'sticky';
    chartHost.style.top = 'calc(68px + env(safe-area-inset-top, 0px))';
    chartHost.style.zIndex = '2';
    const sts = steps.map((s, i) => ScrollTrigger.create({
      trigger: s, start: 'top 75%', end: 'bottom 40%',
      onToggle: (self) => { if (self.isActive) { if (mobileTween) mobileTween.kill(); mobileTween = gsap.to(state, { p: i + 0.99, duration: 1.4, ease: 'power2.inOut', onUpdate: () => setProgress(state.p) }); } }
    }));
    return () => { if (mobileTween) mobileTween.kill(); sts.forEach((x) => x.kill()); chartHost.removeAttribute('style'); };
  });
}
onLang(() => setProgress(Math.max(0, active) + 0.99));

/* ---------- Nuit : feux d'artifice ---------- */
document.querySelectorAll('[data-fireworks]').forEach((c) => createFireworks(c, { calm }));

startReveals();
