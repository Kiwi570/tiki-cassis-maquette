// « Plan cinéma » : la photo reste nette. Lent travelling arrière, un reflet de soleil
// balaie l'image une fois, puis une dérive très douce et un léger parallaxe au défilement.
import { gsap, calm } from './core.js';

export function cinema(media, { at = 0, timeline = null } = {}) {
  if (!media || calm || !gsap) return null;
  const frame = media.querySelector('.hero__frame');
  const img = frame && frame.querySelector('img');
  const glint = media.querySelector('.hero__glint');
  if (!img) return null;
  const shots = [img];
  const tl = timeline || gsap.timeline();
  tl.fromTo(shots, { scale: 1.22 }, { scale: 1.04, duration: 3.8, ease: 'power3.out' }, at);
  if (glint) {
    tl.fromTo(glint, { opacity: 0, backgroundPosition: '130% 0' }, { opacity: 1, backgroundPosition: '-30% 0', duration: 2.6, ease: 'power2.inOut' }, at + 0.6)
      .to(glint, { opacity: 0, duration: 0.6, ease: 'power1.out' }, at + 2.7);
  }
  tl.add(() => { gsap.to(shots, { scale: 1, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true }); }, at + 3.8);
  const section = media.closest('section');
  gsap.to(frame, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } });
  return tl;
}
