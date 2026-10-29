// Socle commun : défilement fluide, horloge de bord et ciel, curseur, transitions,
// révélations, langue et mode calme (selon le réglage « réduire les animations » de l'appareil).
import { apply, setLang, getLang, d, onLang } from './i18n.js';
import { Lenis } from '../vendor/lenis/lenis.js';
import { EVENEMENTS } from './data.js';
import { eventStatus, isSummerEvening } from './pricing.js';

export const gsap = window.gsap;
export const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;
const root = document.documentElement;
export const calm = root.classList.contains('calm') || !gsap || !ScrollTrigger;
export const fine = window.matchMedia('(pointer: fine)').matches;
export const isDesktop = () => window.innerWidth > 900;
export let lenis = null;
const splits = [];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger, ...(SplitText ? [SplitText] : []));

/* ---------- Ciel et horloge de bord ---------- */
const SKY = [
  [6.5, '#22294A', '#6B5878', '#E9A27C'],
  [8.5, '#A9D4E2', '#F2EBDD', '#F5CFA6'],
  [10, '#8CCBE0', '#DCEFF0', '#F4E9D6'],
  [12, '#5DB7DD', '#B5E1EC', '#EEF5F1'],
  [14, '#55AFD8', '#A9DBE9', '#F1F1E6'],
  [16, '#6DB2D4', '#CFE2E0', '#F3E3C4'],
  [18, '#8D9BC4', '#F0CFA0', '#F2AE6C'],
  [19.3, '#5D5788', '#E39A6C', '#F2B064'],
  [20.4, '#272B52', '#6A4E78', '#BF5634'],
  [21.3, '#0E1529', '#172340', '#2A2F52'],
  [23.5, '#0A1120', '#0F1A2E', '#16243C']
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
function skyAt(h) {
  let i = 0;
  while (i < SKY.length - 2 && h > SKY[i + 1][0]) i++;
  const a = SKY[i], b = SKY[i + 1];
  const t = clamp((h - a[0]) / (b[0] - a[0]), 0, 1);
  return [1, 2, 3].map((k) => mix(a[k], b[k], t));
}

let marks = [];
let lastClock = '';
const clockEl = document.querySelector('.clock');
const hdr = document.querySelector('[data-hdr]');
const heroEl = document.querySelector('.hero, .phero');

function measure() {
  const secs = [...document.querySelectorAll('[data-time]')];
  marks = secs.map((sec) => {
    const box = sec.parentElement && sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
    const r = box.getBoundingClientRect();
    const top = r.top + window.scrollY;
    return { top, bottom: top + r.height, t0: +sec.dataset.time, t1: sec.dataset.timeEnd ? +sec.dataset.timeEnd : null, sec };
  });
  marks.forEach((m, i) => { if (m.t1 === null) m.t1 = marks[i + 1] ? marks[i + 1].t0 : m.t0 + 0.6; });
}

// L'horloge s'efface quand elle passerait sur du texte à lire (bureau uniquement, où elle est en bas à gauche)
const wide = window.matchMedia('(min-width: 901px)');
const TEXTY = 'p, li, h1, h2, h3, h4, blockquote, figcaption, summary, label, input, textarea, select, button, a, dt, dd, td, th, span, small, address, time';
let overlapAt = 0, overlapping = false, overlapTimer = 0;
function clockOverText() {
  if (!clockEl || !wide.matches) return false;
  const now = performance.now();
  clearTimeout(overlapTimer);
  if (now - overlapAt < 140) {
    overlapTimer = setTimeout(updateSky, 160);
    return overlapping;
  }
  overlapAt = now;
  const r = clockEl.getBoundingClientRect();
  const y0 = r.top + r.height / 2 - (clockEl.classList.contains('is-away') ? 14 : 0);
  const pts = [[r.left + 6, y0], [r.left + r.width / 2, y0], [r.right - 6, y0], [r.left + r.width / 2, r.top + 4], [r.left + r.width / 2, r.bottom - 4]];
  overlapping = pts.some(([x, y]) => {
    const el = document.elementsFromPoint(x, y).find((e) => !clockEl.contains(e));
    const t = el && el.closest(TEXTY);
    return !!(t && !t.closest('.hdr, .menu') && (t.textContent.trim() || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)));
  });
  return overlapping;
}

function updateSky() {
  if (!marks.length) return;
  const ref = window.scrollY + window.innerHeight * 0.32;
  let m = marks[0];
  for (const k of marks) if (ref >= k.top) m = k;
  const f = clamp((ref - m.top) / Math.max(1, m.bottom - m.top), 0, 1);
  const h = m.t0 + (m.t1 - m.t0) * f;
  const [top, mid, bot] = skyAt(h);
  const s = root.style;
  s.setProperty('--sky-top', top); s.setProperty('--sky-mid', mid); s.setProperty('--sky-bot', bot);
  const p = clamp((h - 7) / 13.6, 0, 1);
  s.setProperty('--sun-x', `${(0.08 + 0.84 * p) * window.innerWidth}px`);
  s.setProperty('--sun-y', `${(0.84 - Math.sin(Math.PI * p) * 0.62) * window.innerHeight}px`);
  s.setProperty('--sun-o', (smooth(6.8, 8, h) * (1 - smooth(19.8, 20.6, h)) * 0.85).toFixed(3));
  s.setProperty('--sun-c', mix('#FFF3D2', '#FFA85A', Math.abs(p - 0.5) * 2 > 0.6 ? (Math.abs(p - 0.5) * 2 - 0.6) / 0.4 : 0));
  const night = smooth(20.2, 21.4, h);
  s.setProperty('--night', night.toFixed(3));
  // horloge
  const hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
  const label = getLang() === 'en' ? (m.sec.dataset.labelEn || m.sec.dataset.label) : m.sec.dataset.label;
  const txt = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  if (clockEl && txt + label !== lastClock) {
    lastClock = txt + label;
    clockEl.querySelector('.clock__time').textContent = txt;
    clockEl.querySelector('.clock__label').textContent = label || '';
    const cp = clamp((h - 6) / 16, 0, 1);
    const sun = clockEl.querySelector('.clock__sun');
    sun.setAttribute('cx', (23 - 20 * Math.cos(Math.PI * cp)).toFixed(2));
    sun.setAttribute('cy', (23 - 20 * Math.sin(Math.PI * cp)).toFixed(2));
    clockEl.classList.toggle('is-dark', h > 20.2);
  }
  const dark = h > 20.2;
  if (clockEl) clockEl.classList.toggle('is-away', (!!heroEl && window.scrollY < window.innerHeight * 0.55) || clockOverText());
  root.style.setProperty('--cursor', dark ? '#F4F1EA' : '#13233A');
  if (hdr) hdr.classList.toggle('is-dark', dark);
}

function drawStars() {
  const c = document.querySelector('.sky__stars');
  if (!c) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = window.innerWidth * dpr; c.height = window.innerHeight * dpr;
  const ctx = c.getContext('2d');
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const n = Math.round((window.innerWidth * window.innerHeight) / 5200);
  for (let i = 0; i < n; i++) {
    const r = rnd() < 0.08 ? 1.6 : 0.8;
    ctx.globalAlpha = 0.35 + rnd() * 0.65;
    ctx.fillStyle = rnd() < 0.15 ? '#F6D79B' : '#FFFFFF';
    ctx.beginPath(); ctx.arc(rnd() * c.width, rnd() * c.height * 0.85, r * dpr, 0, Math.PI * 2); ctx.fill();
  }
}

/* ---------- En-tête, menu ---------- */
function initHeader() {
  if (!hdr) return;
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('is-solid', y > 60);
    const menuOpen = document.querySelector('.menu.is-open');
    hdr.classList.toggle('is-hidden', !menuOpen && y > 400 && y > lastY + 2);
    if (y < lastY - 2) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const burger = hdr.querySelector('.burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const set = (open) => {
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      hdr.classList.toggle('is-menu', open);
      if (open) hdr.classList.remove('is-hidden');
      if (open && !calm) gsap.fromTo(menu.querySelectorAll('nav a, .menu__contact'), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.18 });
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => set(!menu.classList.contains('is-open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }
}

/* ---------- Curseur hublot et boutons magnétiques ---------- */
function initCursor() {
  if (!fine || calm) return;
  const cur = document.querySelector('.cursor');
  if (!cur) return;
  root.classList.add('has-cursor');
  const ring = cur.querySelector('.cursor__ring'), dot = cur.querySelector('.cursor__dot'), lab = cur.querySelector('.cursor__label');
  const xr = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), yr = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  const xl = gsap.quickTo(lab, 'x', { duration: 0.45, ease: 'power3' }), yl = gsap.quickTo(lab, 'y', { duration: 0.45, ease: 'power3' });
  const rot = gsap.quickTo(ring, 'rotation', { duration: 0.6, ease: 'power2' });
  let px = 0, first = true;
  window.addEventListener('pointermove', (e) => {
    if (first) { first = false; gsap.set([ring, lab], { x: e.clientX, y: e.clientY }); cur.classList.add('is-on'); }
    gsap.set(dot, { x: e.clientX, y: e.clientY });
    xr(e.clientX); yr(e.clientY); xl(e.clientX); yl(e.clientY);
    rot(clamp((e.clientX - px) * 2, -35, 35));
    px = e.clientX;
  }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('a, button, label, summary, [data-cursor], input[type="range"]');
    cur.classList.toggle('is-hover', !!t);
    lab.textContent = t && t.dataset.cursor ? t.dataset.cursor : '';
  });
  document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
  document.documentElement.addEventListener('pointerenter', () => { if (!first) cur.classList.add('is-on'); });
}

function initMagnetic() {
  if (!fine || calm) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.28);
      y((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* ---------- Transitions de page (vague) ---------- */
const VEIL = {
  below: 'M0 100 L100 100 L100 100 Q50 100 0 100 Z',
  rising: 'M0 100 L100 100 L100 45 Q50 5 0 45 Z',
  full: 'M0 100 L100 100 L100 0 Q50 0 0 0 Z',
  fullTop: 'M0 0 L100 0 L100 100 Q50 100 0 100 Z',
  leaving: 'M0 0 L100 0 L100 35 Q50 70 0 35 Z',
  gone: 'M0 0 L100 0 L100 0 Q50 0 0 0 Z'
};
function veilIn(skip) {
  const veil = document.querySelector('.veil');
  if (!veil || calm || skip) { if (veil) veil.style.visibility = 'hidden'; root.classList.remove('veil-pending'); return; }
  const path = veil.querySelector('path');
  path.setAttribute('d', VEIL.fullTop);
  veil.style.visibility = 'visible';
  root.classList.remove('veil-pending');
  gsap.timeline({ onComplete: () => { veil.style.visibility = 'hidden'; } })
    .to(path, { attr: { d: VEIL.leaving }, duration: 0.45, ease: 'power2.in', delay: 0.05 })
    .to(path, { attr: { d: VEIL.gone }, duration: 0.4, ease: 'power2.out' });
}
function initLinks() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (a.dataset.prefill) { try { localStorage.setItem('tiki-prefill', JSON.stringify({ type: a.dataset.prefill })); } catch (err) { /* stockage indisponible */ } }
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target && lenis) { e.preventDefault(); lenis.scrollTo(target, { duration: 1.4 }); }
      return;
    }
    if (!/\.html(#.*)?$/.test(href) || /^[a-z]+:/i.test(href)) return;
    const samePage = href.split('#')[0] === location.pathname.split('/').pop() || (href.startsWith('index.html') && /\/$|index\.html$/.test(location.pathname));
    if (samePage && href.includes('#')) {
      const target = document.querySelector('#' + href.split('#')[1]);
      if (target) { e.preventDefault(); lenis ? lenis.scrollTo(target, { duration: 1.4 }) : target.scrollIntoView(); return; }
    }
    if (samePage && !href.includes('#')) {
      e.preventDefault();
      lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
      return;
    }
    if (calm) return;
    e.preventDefault();
    const veil = document.querySelector('.veil');
    const path = veil.querySelector('path');
    path.setAttribute('d', VEIL.below);
    veil.style.visibility = 'visible';
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .to(path, { attr: { d: VEIL.rising }, duration: 0.35, ease: 'power2.in' })
      .to(path, { attr: { d: VEIL.full }, duration: 0.3, ease: 'power2.out' });
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) { const v = document.querySelector('.veil'); if (v) v.style.visibility = 'hidden'; } });
}

/* ---------- Outils : langue, son, calme, copie ---------- */
function revertSplits() { while (splits.length) { const s = splits.pop(); try { s.revert(); } catch (e) { /* déjà rétabli */ } } }
function initTools() {
  document.querySelectorAll('[data-lang-toggle]').forEach((b) => b.addEventListener('click', () => {
    revertSplits();
    setLang(getLang() === 'en' ? 'fr' : 'en');
    lastClock = '';
    updateSky();
    if (ScrollTrigger) ScrollTrigger.refresh();
  }));
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const text = b.dataset.copy;
    const done = (ok) => {
      const old = b.innerHTML;
      b.classList.toggle('is-done', ok);
      b.textContent = ok ? d('copied') : d('copyFail');
      setTimeout(() => { b.innerHTML = old; b.classList.remove('is-done'); }, 1800);
    };
    try { await navigator.clipboard.writeText(text); done(true); } catch (err) {
      const v = b.closest('.contact-card') && b.closest('.contact-card').querySelector('.contact-card__v');
      if (v) { const r = document.createRange(); r.selectNodeContents(v); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      done(false);
    }
  });
}

/* ---------- Révélations au défilement ---------- */
export function splitWords(el) {
  if (!SplitText || calm) return null;
  const s = SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'w' });
  splits.push(s);
  return s;
}
function initReveals() {
  if (calm) return;
  document.querySelectorAll('[data-split]').forEach((el) => {
    const s = splitWords(el);
    if (!s) return;
    gsap.from(s.words, { yPercent: 115, rotate: 4, duration: 1.15, ease: 'expo.out', stagger: 0.045, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 46, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  gsap.utils.toArray('[data-clip]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.from(el, { clipPath: 'inset(22% 12% 22% 12% round 26px)', duration: 1.4, ease: 'expo.out' });
    if (img && !img.hasAttribute('data-parallax')) tl.from(img, { scale: 1.3, duration: 1.6, ease: 'expo.out' }, 0);
  });
  gsap.utils.toArray('[data-parallax]').forEach((img) => {
    const box = img.closest('[data-parallax-box], [data-clip], .media, .portrait') || img.parentElement;
    gsap.fromTo(img, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.12, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const to = +el.dataset.count, from = el.dataset.from ? +el.dataset.from : 0;
    const o = { v: from };
    el.textContent = from;
    gsap.to(o, { v: to, duration: from > to ? 2.2 : 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v); } });
  });
  // Effet « bordé » : la photo se découvre lame de bois par lame de bois
  gsap.utils.toArray('[data-planks]').forEach((box) => {
    const n = 7;
    const slats = [];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'planks__slat';
      s.style.top = `${(i * 100) / n}%`;
      s.style.height = `${100 / n + 0.4}%`;
      s.setAttribute('aria-hidden', 'true');
      box.appendChild(s);
      slats.push(s);
    }
    gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 80%', once: true }, onComplete: () => slats.forEach((s) => s.remove()) })
      .to(slats, { xPercent: (i) => (i % 2 ? 104 : -104), duration: 1.1, ease: 'power3.inOut', stagger: { each: 0.07, from: 'end' } })
      .from(box.querySelector('img'), { scale: 1.18, duration: 1.6, ease: 'expo.out' }, 0.2);
  });
  // Citation qui s'écrit ligne à ligne
  document.querySelectorAll('[data-ink-lines]').forEach((el) => {
    if (!SplitText) return;
    const s = SplitText.create(el, { type: 'lines', linesClass: 'line' });
    splits.push(s);
    gsap.from(s.lines, { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power2.inOut', stagger: 0.28, scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
  });
  document.querySelectorAll('[data-draw]').forEach((p) => {
    const L = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: p, start: 'top 90%', once: true } });
  });
  // Cartes qui s'inclinent
  if (fine) document.querySelectorAll('[data-tilt]').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' }), ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      ry((x - 0.5) * 12); rx((0.5 - y) * 10);
      card.style.setProperty('--mx', `${x * 100}%`); card.style.setProperty('--my', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
  gsap.utils.toArray('.cards .card').forEach((c, i) => {
    gsap.from(c, { y: 80, opacity: 0, rotationX: -14, duration: 1.2, ease: 'expo.out', delay: (i % 4) * 0.08, scrollTrigger: { trigger: c, start: 'top 92%', once: true } });
  });
}

/* ---------- Mots qui roulent comme une houle ---------- */
export function initRotator() {
  const el = document.querySelector('[data-rotator]');
  if (!el) return;
  const words = () => (getLang() === 'en' ? el.dataset.rotatorEn : el.dataset.rotator).split('|');
  let i = 0;
  const show = (w, animate) => {
    el.innerHTML = w.split(' ').map((word) => `<span class="wd">${[...word].map((c) => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
    el.setAttribute('aria-label', words().join(', '));
    if (animate && !calm) gsap.from(el.querySelectorAll('.ch'), { yPercent: 90, opacity: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.03 });
  };
  // Réserve la hauteur de la plus longue formule pour que la page ne saute pas
  const reserve = () => {
    el.style.minHeight = '';
    const cur = el.innerHTML;
    let max = 0;
    words().forEach((w) => { show(w, false); max = Math.max(max, el.getBoundingClientRect().height); });
    el.innerHTML = cur;
    el.style.minHeight = `${Math.ceil(max)}px`;
  };
  show(words()[0], false);
  reserve();
  window.addEventListener('resize', reserve);
  onLang(() => { i = 0; show(words()[0], false); reserve(); });
  if (calm) return;
  setInterval(() => {
    const chars = el.querySelectorAll('.ch');
    i = (i + 1) % words().length;
    gsap.to(chars, { yPercent: -90, opacity: 0, duration: 0.45, ease: 'power2.in', stagger: 0.02, onComplete: () => show(words()[i], true) });
  }, 2600);
}

/* ---------- Strates du Cap Canaille (heure dorée) ---------- */
export function initStrata() {
  document.querySelectorAll('[data-strata]').forEach((svg) => {
    const NS = 'http://www.w3.org/2000/svg';
    const id = 'cliff' + Math.random().toString(36).slice(2, 7);
    const sil = 'M0 700 L60 560 L150 470 L260 400 L380 330 L500 270 L610 215 L720 170 L830 140 L930 128 L1010 142 L1070 190 L1110 270 L1140 380 L1170 520 L1200 700 Z';
    svg.innerHTML = `<defs><clipPath id="${id}"><path d="${sil}"/></clipPath></defs>`;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('clip-path', `url(#${id})`);
    svg.appendChild(g);
    const bands = [];
    const n = 12;
    for (let k = 0; k < n; k++) {
      const y0 = 110 + k * 50;
      let dd = `M0 ${y0}`;
      for (let x = 0; x <= 1200; x += 60) dd += ` L${x} ${y0 + Math.sin(x / 90 + k * 1.7) * 9 + (k % 3) * 3}`;
      dd += ' L1200 720 L0 720 Z';
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', dd);
      p.setAttribute('fill', '#E6D8BF');
      g.appendChild(p);
      bands.push(p);
    }
    const outline = document.createElementNS(NS, 'path');
    outline.setAttribute('d', sil);
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke', 'rgba(43,22,14,.35)');
    outline.setAttribute('stroke-width', '2');
    svg.appendChild(outline);
    const target = (k) => mix('#E39A55', '#8E2F1C', k / (n - 1));
    if (calm) { bands.forEach((b, k) => b.setAttribute('fill', target(k))); return; }
    const sec = svg.closest('section');
    bands.forEach((b, k) => {
      gsap.to(b, { attr: { fill: target(k) }, ease: 'none', scrollTrigger: { trigger: sec, start: `top ${85 - k * 4}%`, end: `top ${35 - k * 3}%`, scrub: true } });
    });
    gsap.fromTo(svg, { yPercent: 12 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- Événements datés et saison des soirées ---------- */
export function renderEvents() {
  const lang = getLang();
  const today = new Date();
  const months = lang === 'en' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  document.querySelectorAll('[data-events]').forEach((ul) => {
    const rows = [];
    EVENEMENTS.forEach((ev) => {
      const st = eventStatus(ev, today);
      if (st.past) rows.push({ ev, y: today.getFullYear(), past: true });
      rows.push({ ev, y: st.nextYear, past: false });
    });
    rows.sort((a, b) => (a.past === b.past ? a.y - b.y || a.ev.mois - b.ev.mois : a.past ? 1 : -1));
    ul.innerHTML = rows.map((r) => `<li class="event"><span class="event__date num">${r.ev.jour}<small>${months[r.ev.mois - 1]}</small></span><span><span class="event__t">${d('evtLabel')(r.ev, r.y)}</span><br><span class="event__s">${r.past ? d('edition')(r.y) : d('toConfirm')}</span></span><span class="badge ${r.past ? 'badge--past' : 'badge--next'}">${r.past ? d('past') : d('upcoming')}</span></li>`).join('');
  });
  document.querySelectorAll('[data-season-status]').forEach((s) => {
    const live = isSummerEvening(today);
    const y = today.getMonth() + 1 > 9 ? today.getFullYear() + 1 : today.getFullYear();
    s.classList.toggle('is-live', live);
    s.querySelector('span').textContent = live ? d('inSeason') : d('offSeason')(y);
  });
}

/* ---------- Hublot : la vidéo du drone ---------- */
export function initHublot() {
  const h = document.querySelector('[data-hublot]');
  if (!h) return;
  const ring = h.querySelector('.hublot__ring');
  [...Array(12)].forEach((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r = document.createElement('span');
    r.className = 'hublot__rivet';
    r.style.left = `${50 + Math.cos(a) * 45.5}%`;
    r.style.top = `${50 + Math.sin(a) * 45.5}%`;
    h.appendChild(r);
  });
  const video = h.querySelector('video');
  if (calm) return;
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) video.play().catch(() => {}); else video.pause(); }, { threshold: 0.2 });
  io.observe(h);
  gsap.fromTo(h, { scale: 0.78, rotate: -8 }, { scale: 1.04, rotate: 0, ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'center center', scrub: true } });
  gsap.to(ring, { rotate: 25, ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- Galerie horizontale ---------- */
export function initTrack() {
  const track = document.querySelector('[data-track]');
  if (!track || calm) return;
  const imgs = track.querySelectorAll('.shot__img img');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const dist = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: track.closest('section'), start: 'top top', end: () => `+=${dist()}`, pin: true, pinType: 'transform', anticipatePin: 1, scrub: 0.6, invalidateOnRefresh: true } });
    gsap.set(imgs, { scale: 1.12 });
    const skew = gsap.quickTo(imgs, 'skewX', { duration: 0.6, ease: 'power3' });
    const tick = () => { if (lenis) skew(clamp(lenis.velocity * 0.12, -4, 4)); };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); gsap.set(imgs, { clearProps: 'transform' }); };
  });
}

/* ---------- Verrou de défilement (ouverture) ---------- */
export function lockScroll(on) {
  root.classList.toggle('is-locked', on);
  if (lenis) on ? lenis.stop() : lenis.start();
}

/* ---------- Démarrage ---------- */
export function initCore({ veil = true, keepIntro = false } = {}) {
  apply(getLang());
  if (!calm) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: false });
    lenis.on('scroll', () => ScrollTrigger.update());
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  drawStars();
  initHeader();
  initCursor();
  initMagnetic();
  initLinks();
  initTools();
  renderEvents();
  onLang(() => renderEvents());
  measure();
  updateSky();
  let ticking = false;
  let settle = 0;
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; updateSky(); }); }
    // une fois les révélations terminées, on revérifie ce qui passe sous l'horloge
    clearTimeout(settle);
    settle = setTimeout(() => { overlapAt = 0; updateSky(); }, 1100);
  }, { passive: true });
  window.addEventListener('resize', () => { drawStars(); measure(); updateSky(); });
  if (ScrollTrigger) ScrollTrigger.addEventListener('refresh', () => { measure(); updateSky(); });
  if (veil) veilIn(false);
  if (!keepIntro) root.classList.add('is-ready');
  return { lenis };
}

export function startReveals() {
  initReveals();
  initStrata();
  initHublot();
  initTrack();
  initRotator();
  if (ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh());
}
