// Feux du 14 juillet : gerbes dessinées en canvas, au plus une gerbe toutes les 700 ms
// (moins de 3 éclats par seconde), sans flash plein écran. En mode calme : une image fixe.

const COLORS = ['#E8B25A', '#F6D79B', '#7FD3D9', '#F4F1EA', '#E9845E'];

export function createFireworks(canvas, { calm = false } = {}) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const parts = [];
  let raf = 0, visible = false, last = 0, nextBurst = 0;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (calm) drawStill();
  };

  function burst(x, y) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const n = 70 + Math.floor(Math.random() * 40);
    const speed = 1.6 + Math.random() * 1.6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.1;
      const s = speed * (0.55 + Math.random() * 0.6);
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: 0.008 + Math.random() * 0.008, color });
    }
  }

  function drawStill() {
    ctx.clearRect(0, 0, w, h);
    [[0.72, 0.22], [0.86, 0.36], [0.6, 0.4]].forEach(([fx, fy], k) => {
      const cx = w * fx, cy = h * fy, r = Math.min(w, h) * (0.12 - k * 0.02);
      ctx.strokeStyle = COLORS[k];
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r + r * 0.15);
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
  }

  function frame(t) {
    raf = visible ? requestAnimationFrame(frame) : 0;
    const dt = Math.min(2, (t - last) / 16.67 || 1);
    last = t;
    if (t > nextBurst) {
      burst(w * (0.45 + Math.random() * 0.5), h * (0.12 + Math.random() * 0.3));
      nextBurst = t + 700 + Math.random() * 900;
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.025 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, p.life) * 0.9;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 1.8, 1.8);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  resize();
  window.addEventListener('resize', resize);
  if (calm) return { stop() {} };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
  io.observe(canvas);
  return { stop() { visible = false; } };
}
