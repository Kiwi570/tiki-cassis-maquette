import { initCore, startReveals, gsap, ScrollTrigger, calm, isDesktop, splitWords } from './core.js';
import { cinema } from './cinema.js';
import { createChart } from './chart.js';
import { createFireworks } from './fireworks.js';
import { getLang, d, onLang } from './i18n.js';
import { PALIERS } from './data.js';

const root = document.documentElement;
let seen = false;
try { seen = sessionStorage.getItem('tiki-intro') === '1'; } catch (e) { /* stockage indisponible */ }

initCore({ veil: false, keepIntro: true });

/* ---------- Ouverture : lever de soleil puis plan cinéma ---------- */
const hero = document.querySelector('.hero');

const intro = document.querySelector('.intro');
const finish = () => {
  root.classList.add('is-ready');
  if (intro) intro.remove();
  try { sessionStorage.setItem('tiki-intro', '1'); } catch (e) { /* stockage indisponible */ }
};

if (calm) {
  finish();
} else {
  const title = hero.querySelector('[data-hero-title]');
  const split = splitWords(title);
  const fades = hero.querySelectorAll('[data-hero-fade]');
  const line = intro.querySelector('.intro__line');
  const sun = intro.querySelector('.intro__sun');
  const L = line.getTotalLength();
  const clock = { m: 6 * 60 + 58 };
  const timeEl = intro.querySelector('.intro__time');
  gsap.set(line, { strokeDasharray: L, strokeDashoffset: seen ? 0 : L });
  const tl = gsap.timeline({ onComplete: finish });
  if (!seen) {
    tl.to(line, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' })
      .from(sun, { attr: { cy: 320 }, duration: 1, ease: 'power2.out' }, 0.2)
      .from(intro.querySelector('.intro__logo'), { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, 0.5)
      .to(clock, { m: 9 * 60, duration: 1.2, ease: 'power1.inOut', onUpdate: () => { const m = Math.round(clock.m); timeEl.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; } }, 0.2);
  } else {
    timeEl.textContent = '09:00';
  }
  tl.to(intro.querySelector('.intro__stage'), { opacity: 0, y: -10, duration: 0.35, ease: 'power2.in' }, seen ? 0.15 : 1.4)
    .to(intro.querySelector('.intro__half--top'), { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '<0.1')
    .to(intro.querySelector('.intro__half--bot'), { yPercent: 100, duration: 0.95, ease: 'expo.inOut' }, '<')
    .add('reveal', '<0.2');
  cinema(hero.querySelector('.hero__media'), { timeline: tl, at: tl.labels.reveal - 0.9 });
  if (split) tl.from(split.words, { yPercent: 115, rotate: 3, duration: 1.2, ease: 'expo.out', stagger: 0.05 }, 'reveal+=0.15');
  tl.from(fades, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 'reveal+=0.45');

  gsap.to(hero.querySelector('.hero__inner'), { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

/* ---------- Vidéo d'ouverture (illustration générée par IA, signalée à l'écran) ---------- */
const heroVideo = hero.querySelector('[data-hero-video]');
const aiNote = hero.querySelector('[data-ai-note]');
const conn = navigator.connection || {};
const lightData = conn.saveData || /(^|-)2g/.test(conn.effectiveType || '');
if (heroVideo && !calm && !lightData && window.innerWidth / window.innerHeight >= 0.8) {
  heroVideo.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
  heroVideo.preload = 'auto';
  heroVideo.load();
  heroVideo.addEventListener('playing', () => {
    gsap.to(heroVideo, { opacity: 1, duration: 1.4, ease: 'power2.out' });
    hero.classList.add('has-video');
    if (aiNote) { aiNote.hidden = false; gsap.from(aiNote, { opacity: 0, y: -8, duration: 0.8, ease: 'power2.out' }); }
  }, { once: true });
  const play = () => heroVideo.play().catch(() => {});
  if (document.readyState === 'complete') play(); else window.addEventListener('load', play, { once: true });
  new IntersectionObserver(([e]) => { if (e.isIntersecting) play(); else heroVideo.pause(); }).observe(hero);
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
