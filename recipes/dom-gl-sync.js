/*
 * dom-gl-sync.js: progressive WebGL enhancement for <img> elements.
 *
 * Job in a design: images that ripple slightly under hover and bend with scroll
 * speed, drawn by WebGL on one fixed canvas. The DOM <img> stays in place for
 * layout, alt text and screen readers; the canvas draws the picture on top.
 *
 * When NOT to use: a few static images (plain CSS is enough), pages with
 * dozens of large images on low-end devices, or any image whose content matters
 * only through the GPU path. Do not use it on content that must print or be
 * copied; the canvas is not selectable.
 *
 * Markup and CSS (the recipe does not inject styles):
 *   <img data-gl-image src="/img/hero.jpg" alt="Harbour at dawn" width="1200" height="800">
 *   img[data-gl-image].gl-ready { opacity: 0; }   // hide the DOM copy once WebGL draws it
 * The canvas sits at z-index:-1 behind the page. Section backgrounds must be
 * transparent, or they will cover it. If the page creates its own stacking
 * context, raise the canvas's z-index and keep it below text.
 *
 * Image origin: a WebGL texture needs CORS-cleared pixels. three's loader requests
 * images with crossOrigin="anonymous", so an image from another origin must be
 * served with an Access-Control-Allow-Origin header (or be same-origin). Otherwise
 * the image fails to load for WebGL, the recipe never marks it gl-ready, and the
 * DOM <img> stays visible as the fallback.
 *
 * Adapt: the shader's hover ripple (uHover) and bend strength (uVelocity) to
 * the project's motion tokens. The velocity scale (0.02) depends on the
 * scroll-velocity units in use.
 *
 * Accessibility and reduced motion: the function is progressive. It returns a
 * no-op when WebGL2 is missing, when no images match, or when reduced motion is
 * on. In those cases the DOM <img> elements stay fully visible. The canvas is
 * aria-hidden and pointer-events:none. The module tears down and rebuilds when
 * the visitor changes the motion setting.
 *
 * WebGPU: three/webgpu (WebGPURenderer, TSL) also falls back to WebGL2. This
 * recipe uses WebGLRenderer and ShaderMaterial to stay simple.
 *
 * Dependencies: three, ./damp.js, ./motion-preference.js
 * Install: npm i three
 */
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { clamp, createTicker, damp } from "./damp.js";
import { isReducedMotion, onMotionPreferenceChange } from "./motion-preference.js";

const DPR_CAP = 2;

// Plane is a unit quad; the mesh scale sets it to the DOM image size in pixels.
const VERT = /* glsl */ `
  uniform float uVelocity;      // -1..1, from scroll speed
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Bow the plane vertically; the bow peaks mid-width and grows with speed.
    p.y += sin(uv.x * 3.14159) * uVelocity * 0.04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHover;         // 0..1, eased toward the pointer state
  uniform float uTime;          // seconds
  uniform vec2 uImageSize;      // natural image size in px
  uniform vec2 uPlaneSize;      // on-screen size in px
  varying vec2 vUv;

  // object-fit: cover. Scales the UVs so the image fills the plane.
  vec2 coverUv(vec2 uv, vec2 plane, vec2 img) {
    float pa = plane.x / plane.y;
    float ia = img.x / img.y;
    vec2 s = pa > ia ? vec2(1.0, ia / pa) : vec2(pa / ia, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
    // Subtle wave on hover, so the image seems to ripple under the pointer.
    uv.x += sin(vUv.y * 6.2831 + uTime * 2.0) * 0.01 * uHover;
    // texture2D and gl_FragColor are remapped by three for ShaderMaterial.
    gl_FragColor = texture2D(uTexture, uv);
  }
`;

/**
 * Upgrades [data-gl-image] elements to WebGL. Async so callers can await it.
 * Setup itself is synchronous. Returns a cleanup function.
 */
export async function initGLImages({
  selector = "[data-gl-image]",
  canvasParent = document.body,
  getVelocity = () => 0,
} = {}) {
  const imgs = [...document.querySelectorAll(selector)];
  if (imgs.length === 0 || !WebGL.isWebGL2Available()) return () => {};

  let stop = null;
  const sync = () => {
    const off = isReducedMotion();
    if (off && stop) {
      stop();
      stop = null;
    } else if (!off && !stop) {
      stop = start(imgs, canvasParent, getVelocity);
    }
  };

  sync();
  const unsubscribe = onMotionPreferenceChange(sync);

  return () => {
    unsubscribe();
    stop?.();
    stop = null;
  };
}

function start(imgs, canvasParent, getVelocity) {
  let alive = true;
  const listeners = [];

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.cssText =
    "position:fixed;left:0;top:0;pointer-events:none;z-index:-1;";
  canvasParent.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  // Orthographic camera in CSS pixels: 1 world unit = 1 px, origin at centre.
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 10);
  camera.position.z = 1;

  // One quad is shared by every mesh; each mesh scales it to its image.
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const loader = new THREE.TextureLoader();

  const entries = imgs.map((el) => {
    const uniforms = {
      uTexture: { value: null },
      uHover: { value: 0 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uImageSize: { value: new THREE.Vector2(1, 1) },
      uPlaneSize: { value: new THREE.Vector2(1, 1) },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    scene.add(mesh);

    const entry = { el, mesh, material, uniforms, texture: null, ready: false, hoverTarget: 0, key: "" };

    // Only after the texture is loaded does the DOM copy hide. On error the
    // DOM image stays visible and the mesh never shows.
    loader.load(
      el.currentSrc || el.src,
      (tex) => {
        if (!alive) {
          tex.dispose();
          return;
        }
        entry.texture = tex;
        uniforms.uTexture.value = tex;
        uniforms.uImageSize.value.set(tex.image.width, tex.image.height);
        entry.ready = true;
        el.classList.add("gl-ready");
      },
      undefined,
      () => {}
    );

    const enter = () => (entry.hoverTarget = 1);
    const leave = () => (entry.hoverTarget = 0);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    listeners.push([el, "pointerenter", enter], [el, "pointerleave", leave]);

    return entry;
  });

  // Images near the viewport, as reported by the IntersectionObserver below.
  // Only these are measured; off-screen images cost nothing per frame.
  const near = new Set();
  let forceRender = true; // first frame, and after every resize

  // The loop stops itself (returns false) when no image is near the viewport and
  // no damped value is still easing. An IntersectionObserver callback or a resize
  // restarts it.
  const ticker = createTicker((dt, timeMs) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const v = clamp(getVelocity() * 0.02, -1, 1);
    let changed = forceRender;
    let moving = false;
    forceRender = false;

    // Images that just left the observed area: clear their meshes once.
    entries.forEach((e) => {
      if (e.mesh.visible && !near.has(e)) {
        e.mesh.visible = false;
        changed = true;
      }
    });

    const active = entries.filter((e) => e.ready && near.has(e));

    // Batch 1: read the rects of the active images only, before any write.
    const rects = active.map((e) => e.el.getBoundingClientRect());

    // Batch 2: write uniforms and transforms.
    active.forEach((e, i) => {
      const r = rects[i];
      const onScreen = r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
      // Entering or leaving the viewport is a change: an image that scrolls back
      // in is drawn on that frame, and one that leaves is cleared on the frame
      // after it leaves.
      if (onScreen !== e.mesh.visible) changed = true;
      e.mesh.visible = onScreen;
      if (!onScreen) return;

      // A moved or resized rect is a change.
      const key = r.left + "|" + r.top + "|" + r.width + "|" + r.height;
      if (key !== e.key) {
        e.key = key;
        changed = true;
      }

      const u = e.uniforms;
      u.uHover.value = damp(u.uHover.value, e.hoverTarget, 8, dt);
      u.uVelocity.value = damp(u.uVelocity.value, v, 6, dt);
      u.uTime.value = timeMs / 1000;
      u.uPlaneSize.value.set(r.width, r.height);
      // A value still easing, or a hover wobble (driven by uTime), needs a new frame.
      if (u.uHover.value > 1e-3 || Math.abs(u.uVelocity.value - v) > 1e-3) {
        changed = true;
        moving = true;
      }

      e.mesh.scale.set(r.width, r.height, 1);
      // DOM y grows down; world y grows up. Centre of the rect in world units:
      e.mesh.position.set(r.left + r.width / 2 - vw / 2, -(r.top + r.height / 2) + vh / 2, 0);
    });

    if (changed) renderer.render(scene, camera);
    // Stop when nothing is near the viewport and nothing is still moving.
    return near.size > 0 || moving ? undefined : false;
  });

  // Watch the images with a generous margin so they are ready before they scroll in.
  const byEl = new Map(entries.map((e) => [e.el, e]));
  const observer = new IntersectionObserver(
    (records) => {
      for (const rec of records) {
        const e = byEl.get(rec.target);
        if (!e) continue;
        if (rec.isIntersecting) near.add(e);
        else near.delete(e);
      }
      if (near.size > 0) ticker.start();
    },
    { rootMargin: "20% 0px" }
  );
  entries.forEach((e) => observer.observe(e.el));

  const onResize = () => {
    forceRender = true;
    ticker.start(); // layout moved: re-measure once (the loop stops again if nothing is near)
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
    renderer.setSize(w, h);
    // Frustum equals the viewport, so world units are CSS pixels.
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", onResize);
  onResize();
  ticker.start();

  return () => {
    alive = false;
    observer.disconnect();
    near.clear();
    ticker.stop();
    window.removeEventListener("resize", onResize);
    listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));

    entries.forEach((e) => {
      e.el.classList.remove("gl-ready");
      scene.remove(e.mesh);
      e.material.dispose();
      e.texture?.dispose();
    });
    geometry.dispose();
    renderer.dispose();
    renderer.forceContextLoss(); // release the GPU context now, not at GC
    renderer.domElement.remove();
  };
}
