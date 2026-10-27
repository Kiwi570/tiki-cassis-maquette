import { initCore, startReveals, gsap, ScrollTrigger, calm, isDesktop, splitWords, fine } from './core.js';
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

/* ---------- Vidéo d'ouverture (illustration générée par IA, signalée à l'écran) ---------- */
const hero = document.querySelector('.hero');
const heroVideo = hero.querySelector('[data-hero-video]');
const aiNote = hero.querySelector('[data-ai-note]');
const toggle = hero.querySelector('[data-video-toggle]');
const conn = navigator.connection || {};
const lightData = conn.saveData || /(^|-)2g/.test(conn.effectiveType || '');
const useVideo = !!heroVideo && !calm && !lightData && window.innerWidth / window.innerHeight >= 0.8;
let userPaused = false;
if (useVideo) {
  heroVideo.poster = heroVideo.dataset.poster;
  heroVideo.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
  heroVideo.preload = 'auto';
  heroVideo.load();
  heroVideo.style.opacity = '1';
  hero.classList.add('has-video');
  if (aiNote) aiNote.hidden = false;
  const play = () => { if (!userPaused) heroVideo.play().catch(() => {}); };
  play();
  new IntersectionObserver(([e]) => { if (e.isIntersecting) play(); else heroVideo.pause(); }).observe(hero);
  const label = () => { toggle.setAttribute('aria-label', userPaused ? d('playVideo') : d('pauseVideo')); toggle.setAttribute('aria-pressed', String(userPaused)); };
  toggle.addEventListener('click', () => { userPaused = !userPaused; if (userPaused) heroVideo.pause(); else heroVideo.play().catch(() => {}); label(); });
  onLang(label);
  label();
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
const finish = () => {
  root.classList.add('is-ready');
  if (intro) intro.remove();
  try { sessionStorage.setItem('tiki-intro', '1'); } catch (e) { /* stockage indisponible */ }
};

function layoutWord() {
  const W = window.innerWidth, H = window.innerHeight;
  const texts = intro.querySelectorAll('.intro__text');
  texts.forEach((t) => { t.setAttribute('font-size', '100'); t.setAttribute('x', W / 2); t.setAttribute('y', H / 2); });
  const len = texts[0].getComputedTextLength() || 220;
  const fs = Math.min((W * (W > 900 ? 0.62 : 0.84)) / len * 100, H * 0.62);
  texts.forEach((t) => { t.setAttribute('font-size', fs.toFixed(1)); t.setAttribute('y', (H / 2 + fs * 0.34).toFixed(1)); });
  // Point de plongée : le centre du premier « I »
  let ox = W / 2, oy = H / 2, ext = fs * 0.3;
  try { const r = texts[0].getExtentOfChar(1); ox = r.x + r.width / 2; oy = r.y + r.height * 0.55; ext = r.width; } catch (e) { /* mesure indisponible */ }
  const stem = Math.max(6, ext * 0.34);
  const reach = 2 * Math.max(ox, W - ox, oy, H - oy);
  return { ox, oy, scale: (reach / stem) * 1.25, fs };
}

if (calm) {
  finish();
} else {
  const title = hero.querySelector('[data-hero-title]');
  const split = splitWords(title);
  const fades = hero.querySelectorAll('[data-hero-fade]');
  const stage = intro.querySelector('.intro__stage');
  const line = intro.querySelector('.intro__line');
  const sun = intro.querySelector('.intro__sun');
  const words = intro.querySelectorAll('.intro__word');
  const holeText = intro.querySelector('mask .intro__text');
  const stroke = intro.querySelector('.intro__text--stroke');
  const night = intro.querySelector('.intro__night');
  const timeEl = intro.querySelector('.intro__time');
  const L = line.getTotalLength();
  const clock = { m: 6 * 60 + 58 };

  const run = () => {
    const g = layoutWord();
    const dash = g.fs * 14;
    gsap.set(words, { svgOrigin: `${g.ox} ${g.oy}`, scale: 1 });
    gsap.set(stroke, { strokeDasharray: `${dash} ${dash}`, strokeDashoffset: dash });
    gsap.set(line, { strokeDasharray: L, strokeDashoffset: seen ? 0 : L });
    const tl = gsap.timeline({ onComplete: finish });
    if (!seen) {
      tl.to(line, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
        .from(sun, { attr: { cy: 320 }, duration: 0.9, ease: 'power2.out' }, 0.15)
        .from(intro.querySelector('.intro__logo'), { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' }, 0.4)
        .to(clock, { m: 9 * 60, duration: 1, ease: 'power1.inOut', onUpdate: () => { const m = Math.round(clock.m); timeEl.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; } }, 0.15)
        .to(stage, { opacity: 0, y: -12, duration: 0.3, ease: 'power2.in' }, 1.12)
        .add('word', 1.25)
        .fromTo(holeText, { attr: { 'fill-opacity': 0 } }, { attr: { 'fill-opacity': 1 }, duration: 0.5, ease: 'power1.out' }, 'word')
        .fromTo(words, { scale: 0.9 }, { scale: 1, duration: 0.75, ease: 'power2.out' }, 'word')
        .fromTo(stroke, { opacity: 1, strokeDashoffset: dash }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 'word')
        .add('zoom', 'word+=0.7');
    } else {
      gsap.set(stage, { opacity: 0 });
      gsap.set(holeText, { attr: { 'fill-opacity': 1 } });
      gsap.set(stroke, { opacity: 1, strokeDashoffset: 0 });
      tl.add('zoom', 0.3);
    }
    tl.to(stroke, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 'zoom')
      .to(words, { scale: g.scale, duration: 1.05, ease: 'expo.in' }, 'zoom')
      .to(night, { opacity: 0, duration: 0.3, ease: 'none' }, 'zoom+=0.78')
      .add('reveal', 'zoom+=0.8');
    cinema(hero.querySelector('.hero__media'), { timeline: tl, at: tl.labels.reveal - 0.5 });
    if (split) tl.from(split.words, { yPercent: 115, rotate: 3, duration: 1.2, ease: 'expo.out', stagger: 0.05 }, 'reveal+=0.05');
    tl.from(fades, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 'reveal+=0.3');
  };
  const fontReady = document.fonts && document.fonts.load ? document.fonts.load('400 100px "Instrument Serif"') : Promise.resolve();
  Promise.race([fontReady, new Promise((r) => setTimeout(r, 700))]).then(run, run);

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

const clockFmt = (m) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
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
  const k = Math.min(4, Math.floor(p));
  if (k !== active && isDesktop() && !calm) {
    const from = steps[active], to = steps[k];
    gsap.to(from, { autoAlpha: 0, y: -24, duration: 0.45, ease: 'power2.in' });
    gsap.fromTo(to, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.15 });
    gsap.fromTo(to.querySelector('.step__media'), { clipPath: 'inset(0 0 100% 0 round 18px)' }, { clipPath: 'inset(0 0 0% 0 round 18px)', duration: 1, ease: 'expo.out', delay: 0.15 });
    from.classList.remove('is-active'); to.classList.add('is-active');
  }
  active = k;
}

if (calm) {
  setProgress(3.99);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setProgress(+e.target.dataset.step + 0.99); }), { rootMargin: '-40% 0px -40% 0px' });
  steps.forEach((s) => io.observe(s));
} else {
  setProgress(0);
  const state = { p: 0 };
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    steps.forEach((s, i) => gsap.set(s, { autoAlpha: i === active ? 1 : 0, y: 0 }));
    const st = ScrollTrigger.create({
      trigger: '.parcours', start: 'top top', end: '+=300%', pin: true, pinType: 'transform', anticipatePin: 1, scrub: true,
      onUpdate: (s) => setProgress(Math.min(4.99, s.progress * 5.2))
    });
    return () => { st.kill(); steps.forEach((s) => gsap.set(s, { clearProps: 'all' })); };
  });
  mm.add('(max-width: 900px)', () => {
    chartHost.style.position = 'sticky';
    chartHost.style.top = 'calc(68px + env(safe-area-inset-top, 0px))';
    chartHost.style.zIndex = '2';
    const sts = steps.map((s, i) => ScrollTrigger.create({
      trigger: s, start: 'top 75%', end: 'bottom 40%',
      onToggle: (self) => { if (self.isActive) gsap.to(state, { p: i + 0.99, duration: 1.4, ease: 'power2.inOut', onUpdate: () => setProgress(state.p) }); }
    }));
    return () => { sts.forEach((x) => x.kill()); chartHost.removeAttribute('style'); };
  });
}
onLang(() => setProgress(Math.max(0, active) + 0.99));

/* ---------- Nuit : feux d'artifice ---------- */
document.querySelectorAll('[data-fireworks]').forEach((c) => createFireworks(c, { calm }));

startReveals();
