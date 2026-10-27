// « Ressac » : bruit de vagues synthétisé (aucun fichier son). Démarre seulement après un clic.
// Le rythme des vagues accélère légèrement quand on fait défiler la page vite.

let ctx = null, master = null, running = false, timer = 0, speed = 0;

function noiseBuffer(ac, seconds = 4) {
  const len = ac.sampleRate * seconds;
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02; // bruit brun
    data[i] = last * 3.2;
  }
  return buf;
}

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const buf = noiseBuffer(ctx);
  const mk = (type, freq, gain) => {
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = 0.7;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(0, Math.random() * 3);
    return { f, g };
  };
  const body = mk('lowpass', 420, 0.5);
  const foam = mk('bandpass', 2400, 0.04);

  const wave = () => {
    if (!running) return;
    const t = ctx.currentTime;
    const period = Math.max(3.2, 7 + Math.random() * 3 - speed * 3);
    const rise = period * 0.42;
    body.g.gain.cancelScheduledValues(t);
    body.g.gain.setValueAtTime(body.g.gain.value, t);
    body.g.gain.linearRampToValueAtTime(0.9, t + rise);
    body.g.gain.linearRampToValueAtTime(0.25, t + period);
    body.f.frequency.cancelScheduledValues(t);
    body.f.frequency.setValueAtTime(body.f.frequency.value, t);
    body.f.frequency.exponentialRampToValueAtTime(1300, t + rise);
    body.f.frequency.exponentialRampToValueAtTime(380, t + period);
    foam.g.gain.cancelScheduledValues(t);
    foam.g.gain.setValueAtTime(0.02, t);
    foam.g.gain.linearRampToValueAtTime(0.14, t + rise + 0.3);
    foam.g.gain.linearRampToValueAtTime(0.02, t + period);
    timer = setTimeout(wave, period * 1000);
  };
  build.wave = wave;
  return true;
}

export function setSpeed(v) { speed = Math.min(1, Math.abs(v) / 40); }

export function toggleSea() {
  if (!ctx && !build()) return false;
  running = !running;
  const t = ctx.currentTime;
  if (running) {
    ctx.resume();
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.55, t + 1.5);
    build.wave();
  } else {
    clearTimeout(timer);
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 0.8);
  }
  return running;
}
