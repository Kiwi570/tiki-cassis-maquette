// Carte marine stylisée de Cassis à Marseille (projection simple des coordonnées réelles,
// côte simplifiée : carte indicative). Le sillage du TIKI se dessine selon une progression.

const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs = {}, parent) => {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
};

// Côte, d'ouest en est (x vers l'est, y vers le sud), viewBox 1000 x 560
const COAST = [
  [0, 186], [30, 198], [50, 197],
  [55, 199], [60, 160], [68, 158], [72, 199],
  [110, 214], [150, 228], [160, 215],
  [163, 214], [168, 172], [176, 171], [180, 212],
  [205, 220], [220, 212],
  [224, 210], [228, 166], [234, 167], [237, 208],
  [255, 214], [272, 222],
  [276, 222], [280, 202], [285, 222],
  [300, 228],
  [310, 228], [315, 206], [321, 207], [324, 229],
  [345, 233],
  [360, 232], [366, 213], [372, 214], [376, 232],
  [395, 228],
  [405, 226], [410, 176], [418, 177], [421, 224],
  [432, 220],
  [440, 218], [445, 191], [452, 192], [455, 214],
  [468, 205],
  [476, 200], [482, 150], [490, 151], [494, 195],
  [520, 188], [545, 170],
  [565, 152], [585, 142], [600, 146], [615, 160],
  [630, 186], [645, 215], [660, 240], [690, 270], [720, 302], [760, 345], [790, 360],
  [810, 368], [815, 351], [822, 352], [825, 375],
  [850, 392],
  [868, 402], [874, 386], [882, 388], [885, 410],
  [895, 430], [905, 446], [915, 440], [920, 410], [930, 380], [950, 366], [975, 360], [1000, 355]
];

// Repères : [nom, x, y, côté de l'étiquette]
const WEST = [
  ['Port-Miou', 486, 199, 1], ['Port-Pin', 448, 215, 2], ['En-Vau', 414, 225, 1],
  ['L’Oule', 369, 232, 2], ['Devenson', 318, 229, 1], ['Œil de Verre', 281, 222, 2],
  ['Sugiton', 231, 209, 1], ['Morgiou', 172, 213, 2], ['Sormiou', 64, 199, 1]
];
const EAST = [['Cap Canaille', 662, 243, 3], ['Figuerolles', 818, 374, 3], ['Mugel', 878, 408, 3], ['Île Verte', 936, 470, 4]];
const PORT = [590, 150];

// Sillage vers l'ouest (au large des calanques) et vers l'est
const WAKE_W = [[592, 160], [586, 190], [545, 206], [500, 212], [486, 209], [470, 226], [448, 229], [430, 236], [414, 236], [392, 242], [369, 245], [345, 246], [318, 243], [298, 240], [281, 236], [255, 230], [231, 223], [205, 233], [172, 228], [140, 238], [100, 228], [64, 214]];
const WAKE_E = [[596, 160], [612, 186], [640, 232], [668, 262], [705, 300], [748, 352], [790, 378], [818, 386], [850, 405], [878, 420], [902, 462], [928, 486], [950, 478]];
// Fraction du sillage ouest à laquelle chaque palier est atteint (En-Vau, Devenson, Morgiou, Sormiou)
const WEST_INDEX = { 3: 8, 5: 12, 8: 18, 9: 21 };

const smooth = (pts) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
};

export function createChart(host, { compact = false } = {}) {
  const svg = el('svg', { viewBox: compact ? '20 84 980 436' : '0 60 1000 470', role: 'img', 'aria-label': 'Carte des calanques entre Cassis et Marseille' });
  host.prepend(svg);
  const defs = el('defs', {}, svg);
  const pat = el('pattern', { id: `hatch-${compact ? 'c' : 'h'}`, width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
  el('line', { x1: 0, y1: 0, x2: 0, y2: 7, stroke: '#6C5434', 'stroke-opacity': '.28', 'stroke-width': 1 }, pat);

  el('rect', { class: 'chart__sea', x: 0, y: 0, width: 1000, height: 560 }, svg);
  const grid = el('g', { class: 'chart__grid' }, svg);
  for (let x = 0; x <= 1000; x += 100) el('line', { x1: x, y1: 0, x2: x, y2: 560 }, grid);
  for (let y = 60; y <= 560; y += 100) el('line', { x1: 0, y1: y, x2: 1000, y2: y }, grid);

  // Isobathes : copies décalées de la côte
  const coastLine = COAST.map(([x, y]) => [x, y]);
  [16, 34, 58].forEach((off) => el('path', { class: 'chart__contour', d: smooth(coastLine.filter((_, i) => i % 2 === 0).map(([x, y]) => [x, y + off])) }, svg));

  const landD = `M0 0 L${COAST.map((p) => p.join(' ')).join(' L')} L1000 0 Z`;
  el('path', { class: 'chart__land', d: landD }, svg);
  el('path', { d: landD, fill: `url(#hatch-${compact ? 'c' : 'h'})`, opacity: '.6' }, svg);
  el('ellipse', { class: 'chart__island', cx: 936, cy: 470, rx: 15, ry: 7 }, svg);

  el('text', { class: 'chart__label', x: 120, y: 110 }, svg).textContent = 'Parc national des Calanques';
  el('text', { class: 'chart__label', x: 905, y: 330, 'text-anchor': 'end', 'font-size': 17 }, svg).textContent = 'La Ciotat';
  el('text', { class: 'chart__label', x: 330, y: 440, opacity: '.55', 'font-size': 26 }, svg).textContent = 'Mer Méditerranée';

  // Sillages
  el('path', { class: 'chart__wake-ghost', d: smooth(WAKE_W) }, svg);
  el('path', { class: 'chart__wake-ghost', d: smooth(WAKE_E) }, svg);
  const wakeW = el('path', { class: 'chart__wake', d: smooth(WAKE_W) }, svg);
  const wakeE = el('path', { class: 'chart__east', d: smooth(WAKE_E) }, svg);
  const lenW = wakeW.getTotalLength(), lenE = wakeE.getTotalLength();
  wakeW.style.strokeDasharray = `${lenW} ${lenW}`;
  wakeW.style.strokeDashoffset = lenW;
  wakeE.style.opacity = 0;

  // Longueur cumulée jusqu'à chaque point du sillage ouest
  const cum = [0];
  for (let i = 1; i < WAKE_W.length; i++) {
    const tmp = el('path', { d: smooth(WAKE_W.slice(0, i + 1)) }, svg);
    cum.push(tmp.getTotalLength());
    tmp.remove();
  }

  // Repères
  const marks = [];
  const label = (name, x, y, side, east) => {
    const g = el('g', { class: `chart__mk${east ? ' is-east' : ''}` }, svg);
    el('circle', { cx: x, cy: y, r: compact ? 6 : 5 }, g);
    const ty = side === 1 ? y + 34 : side === 2 ? y + 56 : side === 3 ? y - 8 : y + 30;
    const tx = side === 3 ? x + 12 : x;
    const t = el('text', { x: tx, y: ty, 'text-anchor': side === 3 ? 'start' : 'middle' }, g);
    t.textContent = name;
    if (side !== 3) el('line', { x1: x, y1: y + 6, x2: x, y2: ty - 13, stroke: '#6C5434', 'stroke-opacity': '.4', 'stroke-width': 1 }, g);
    if (compact) t.setAttribute('font-size', '17');
    marks.push({ g, east });
    return g;
  };
  WEST.forEach(([n, x, y, s]) => label(n, x, y, s, false));
  EAST.forEach(([n, x, y, s]) => label(n, x, y, s, true));

  const port = el('g', { class: 'chart__port' }, svg);
  el('circle', { cx: PORT[0], cy: PORT[1], r: 8 }, port);
  el('text', { x: PORT[0] + 14, y: PORT[1] - 12 }, port).textContent = 'Cassis';

  // Bateau sur le sillage
  const boat = el('g', { class: 'chart__boat' }, svg);
  el('path', { d: 'M-9 -4 L7 -4 L11 0 L7 4 L-9 4 Z' }, boat);
  el('rect', { x: -5, y: -2.5, width: 7, height: 5, fill: '#F4F1EA' }, boat);

  // Rose des vents et échelle (1 km ≈ 55 unités dans cette projection)
  const comp = el('g', { class: 'chart__compass', transform: compact ? 'translate(950 150)' : 'translate(940 120)' }, svg);
  el('circle', { r: 22 }, comp);
  el('path', { d: 'M0 -26 L5 0 L0 26 L-5 0 Z' }, comp);
  el('text', { y: -30, 'text-anchor': 'middle' }, comp).textContent = 'N';
  if (!compact) {
    const sc = el('g', { class: 'chart__scale', transform: 'translate(760 120)' }, svg);
    el('line', { x1: 0, y1: 0, x2: 110, y2: 0 }, sc);
    el('line', { x1: 0, y1: -5, x2: 0, y2: 5 }, sc);
    el('line', { x1: 55, y1: -4, x2: 55, y2: 4 }, sc);
    el('line', { x1: 110, y1: -5, x2: 110, y2: 5 }, sc);
    el('text', { x: 0, y: -10 }, sc).textContent = '0';
    el('text', { x: 110, y: -10, 'text-anchor': 'middle' }, sc).textContent = '2 km';
  }

  const chronoTime = host.querySelector('.chrono__time');
  const chronoCount = host.querySelector('.chrono__count');

  let current = { west: 0, east: 0 };

  // west : longueur dessinée en fraction 0..1 ; east : 0..1
  function render({ west = 0, east = 0, label: lbl, count }) {
    current = { west, east };
    const L = west * lenW;
    wakeW.style.strokeDashoffset = lenW - L;
    wakeE.style.opacity = east > 0 ? 1 : 0;
    wakeE.style.strokeDasharray = `${lenE} ${lenE}`;
    wakeE.style.strokeDashoffset = lenE * (1 - east);
    // Allume les calanques dépassées
    WEST.forEach((_, i) => {
      const idx = WAKE_W.findIndex(([x]) => x <= WEST[i][1]);
      const reach = cum[Math.max(0, idx)] <= L + 1 && west > 0;
      marks[i].g.classList.toggle('is-on', reach);
    });
    EAST.forEach((_, i) => {
      const thr = [0.22, 0.55, 0.7, 0.92][i];
      marks[WEST.length + i].g.classList.toggle('is-on', east >= thr);
    });
    // Position du bateau
    let pt, ang = 180;
    if (east > 0) {
      const l = Math.max(0.5, east * lenE);
      pt = wakeE.getPointAtLength(l);
      const p2 = wakeE.getPointAtLength(Math.max(0, l - 4));
      ang = Math.atan2(pt.y - p2.y, pt.x - p2.x) * 180 / Math.PI;
    } else {
      const l = Math.max(0.5, L);
      pt = wakeW.getPointAtLength(l);
      const p2 = wakeW.getPointAtLength(Math.max(0, l - 4));
      ang = L < 4 ? 120 : Math.atan2(pt.y - p2.y, pt.x - p2.x) * 180 / Math.PI;
    }
    boat.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    if (chronoTime && lbl !== undefined) chronoTime.textContent = lbl;
    if (chronoCount && count !== undefined) chronoCount.textContent = count;
  }

  // Fraction du sillage ouest pour un nombre de calanques atteint
  const westFor = (n) => (n ? cum[WEST_INDEX[n]] / lenW : 0);
  render({ west: 0 });
  return { render, westFor, svg, get state() { return current; } };
}
