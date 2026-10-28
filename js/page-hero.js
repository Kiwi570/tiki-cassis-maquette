// Ouverture des pages intérieures : titre qui monte, photo en plan cinéma.
import { gsap, calm, splitWords } from './core.js?v=20261028-2';
import { cinema } from './cinema.js?v=20261028-2';

export function pageHero() {
  if (calm) return;
  const title = document.querySelector('[data-hero-title]');
  const fades = document.querySelectorAll('[data-hero-fade]');
  const split = title ? splitWords(title) : null;
  const tl = gsap.timeline({ delay: 0.35 });
  const media = document.querySelector('.phero .hero__media');
  if (media) cinema(media, { timeline: tl, at: 0 });
  if (split) tl.from(split.words, { yPercent: 115, rotate: 3, duration: 1.2, ease: 'expo.out', stagger: 0.05 }, 0.25);
  if (fades.length) tl.from(fades, { y: 28, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.55);
  const ph = document.querySelector('.phero');
  if (ph) gsap.to(ph.querySelector('.phero__inner'), { yPercent: -16, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: ph, start: 'top top', end: 'bottom top', scrub: true } });
}
