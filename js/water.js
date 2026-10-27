// Effet « Reflet » : la photo d'ouverture naît de son reflet ondulant, puis l'eau se calme.
import { Renderer } from '../vendor/ogl/core/Renderer.js';
import { Program } from '../vendor/ogl/core/Program.js';
import { Mesh } from '../vendor/ogl/core/Mesh.js';
import { Texture } from '../vendor/ogl/core/Texture.js';
import { Triangle } from '../vendor/ogl/extras/Triangle.js';

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uTime;
uniform float uIntro;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uMouseStr;
varying vec2 vUv;

vec2 cover(vec2 uv, float zoom) {
  float ra = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 s = ra > ri ? vec2(1.0, ri / ra) : vec2(ra / ri, 1.0);
  return (uv - 0.5) * s / zoom + 0.5;
}

void main() {
  vec2 uv = vUv;
  float intro = clamp(uIntro, 0.0, 1.0);
  float calm = smoothstep(0.0, 1.0, intro);
  float amp = (1.0 - calm) * 0.045 + 0.0022 + uScroll * 0.012;
  float w = sin(uv.y * 58.0 + uTime * 1.9) * 0.6 + sin(uv.y * 21.0 - uTime * 1.2 + uv.x * 7.0) * 0.4;
  vec2 m = uv - uMouse;
  float md = length(m * vec2(uRes.x / uRes.y, 1.0));
  float ring = sin(md * 55.0 - uTime * 5.0) * exp(-md * 7.0) * uMouseStr;
  vec2 duv = uv + vec2(w * amp, w * amp * 0.35) + normalize(m + 1e-4) * ring * 0.008;
  float zoom = 1.04 + uScroll * 0.08;
  vec3 normalCol = texture2D(tMap, cover(duv, zoom)).rgb;
  vec3 refl = texture2D(tMap, cover(vec2(duv.x, 1.0 - duv.y), zoom)).rgb * vec3(0.72, 0.88, 1.0);
  vec3 col = mix(refl, normalCol, smoothstep(0.3, 0.95, intro));
  float c = pow(abs(sin(uv.x * 38.0 + sin(uv.y * 26.0 + uTime) * 1.5 + uTime * 0.7) * sin(uv.y * 44.0 - uTime * 1.1)), 9.0);
  col += c * 0.05 * smoothstep(0.5, 0.0, uv.y);
  float band = intro * 0.66;
  float d = abs(uv.y - 0.5);
  float mask = 1.0 - smoothstep(band - 0.05, band, d);
  gl_FragColor = vec4(mix(vec3(0.047, 0.078, 0.141), col, mask), 1.0);
}
`;

export function createWater(canvas, { src, onReady } = {}) {
  let renderer;
  try {
    renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio || 1, 1.5), alpha: false, antialias: false });
  } catch (e) {
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  const texture = new Texture(gl, { generateMipmaps: false });
  const program = new Program(gl, {
    vertex, fragment,
    uniforms: {
      tMap: { value: texture }, uRes: { value: [1, 1] }, uImg: { value: [4, 3] }, uTime: { value: 0 },
      uIntro: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: [0.5, 0.5] }, uMouseStr: { value: 0 }
    }
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  const state = { intro: 0, scroll: 0, mouse: [0.5, 0.5], mouseStr: 0, visible: true, raf: 0, ready: false };

  const box = canvas.parentElement;
  const resize = () => {
    const r = box.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height));
    program.uniforms.uRes.value = [r.width, r.height];
  };
  resize();
  window.addEventListener('resize', resize);

  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    texture.image = img;
    program.uniforms.uImg.value = [img.naturalWidth, img.naturalHeight];
    state.ready = true;
    canvas.classList.add('is-on');
    onReady && onReady();
  };
  img.src = src;

  box.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    state.mouse = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    state.mouseStr = Math.min(1, state.mouseStr + 0.08);
  });

  const io = new IntersectionObserver(([en]) => { state.visible = en.isIntersecting; if (state.visible && !state.raf) loop(); });
  io.observe(canvas);

  const t0 = performance.now();
  function loop() {
    if (!state.visible) { state.raf = 0; return; }
    state.raf = requestAnimationFrame(loop);
    const u = program.uniforms;
    u.uTime.value = (performance.now() - t0) / 1000;
    u.uIntro.value = state.intro;
    u.uScroll.value = state.scroll;
    u.uMouse.value = state.mouse;
    state.mouseStr *= 0.96;
    u.uMouseStr.value = state.mouseStr;
    if (state.ready) renderer.render({ scene: mesh });
  }
  loop();
  return state;
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { return false; }
}
