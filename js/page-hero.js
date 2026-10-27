// Ouverture des pages intérieures : titre qui monte, photo qui naît de son reflet.
import { gsap, ScrollTrigger, calm, splitWords } from './core.js';
import { createWater, hasWebGL } from './water.js';

export function pageHero() {
  const title = document.querySelector('[data-hero-title]');
  const fades = document.querySelectorAll('[data-hero-fade]');
  const canvas = document.querySelector('.hero__gl[data-gl-src]');
  let water = null;
  if (!calm && canvas && hasWebGL()) water = createWater(canvas, { src: canvas.dataset.glSrc });
  if (calm) { if (water) water.intro = 1; return; }
  const split = title ? splitWords(title) : null;
  const tl = gsap.timeline({ delay: 0.35 });
  if (water) tl.to(water, { intro: 1, duration: 1.9, ease: 'power2.out' }, 0);
  if (split) tl.from(split.words, { yPercent: 115, rotate: 3, duration: 1.2, ease: 'expo.out', stagger: 0.05 }, 0.25);
  if (fades.length) tl.from(fades, { y: 28, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.55);
  const ph = document.querySelector('.phero');
  if (ph) {
    ScrollTrigger.create({ trigger: ph, start: 'top top', end: 'bottom top', onUpdate: (s) => { if (water) water.scroll = s.progress; } });
    gsap.to(ph.querySelector('.phero__inner'), { yPercent: -16, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: ph, start: 'top top', end: 'bottom top', scrub: true } });
  }
}
