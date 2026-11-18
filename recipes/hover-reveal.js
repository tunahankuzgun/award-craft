/*
 * hover-reveal.js: a floating preview image that follows the pointer over a
 * list of rows (project index, press list, team roster).
 *
 * Job in a design: a quiet second layer of information. Hovering a row shows
 * its image; the list itself stays a plain, readable set of links.
 *
 * When NOT to use: touch-first sites (the module turns itself off), lists
 * where the image is the only way to tell rows apart, or lists so short that
 * a preview adds nothing.
 *
 * Markup:
 *   <ul data-hover-list>
 *     <li><a href="/work/a" data-hover-image="/img/a.jpg">Project A</a></li>
 *   </ul>
 *
 * Adapt: size and radius of the preview in CSS on the .hover-reveal layer
 * (inline size is a fallback). Change `offset` and the fade timing to match
 * the DESIGN.md motion tokens.
 *
 * Accessibility and reduced motion: the rows stay normal links and do not
 * depend on the preview. The preview image is decorative (alt="" and
 * aria-hidden), and it is never display:none. Keyboard focus also shows the
 * preview, next to the focused row. With reduced motion the preview does not
 * follow the pointer. It appears in a fixed spot at the list's right edge.
 *
 * Dependencies: gsap, ./motion-preference.js
 * Install: npm i gsap
 */
import { gsap } from "gsap";
import { isReducedMotion } from "./motion-preference.js";

const FINE = "(hover: hover) and (pointer: fine)";
const EDGE = 8; // keep the preview this far from the viewport edge

/**
 * @param {HTMLElement} list  container of the rows
 * @param {{ selector?: string, offset?: number }} options
 * @returns {() => void} cleanup
 */
export function initHoverReveal(list, { selector = "[data-hover-image]", offset = 24 } = {}) {
  const rows = [...list.querySelectorAll(selector)];
  if (rows.length === 0 || !window.matchMedia(FINE).matches) return () => {};

  // Preload so the first hover shows the image without a blank frame.
  rows.forEach((row) => {
    new Image().src = row.dataset.hoverImage;
  });

  // One shared layer, positioned with transforms only (no layout cost).
  const layer = document.createElement("div");
  layer.className = "hover-reveal";
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText =
    "position:fixed;left:0;top:0;width:min(22vw,320px);aspect-ratio:4/3;" +
    "pointer-events:none;z-index:50;opacity:0;will-change:transform,opacity;";

  const img = document.createElement("img");
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
  layer.append(img);
  document.body.append(layer);

  // Fast setters: each call eases the layer toward a new coordinate.
  const qx = gsap.quickTo(layer, "x", { duration: 0.6, ease: "power3.out" });
  const qy = gsap.quickTo(layer, "y", { duration: 0.6, ease: "power3.out" });

  let activeRow = null;
  const listeners = [];
  const on = (el, type, fn) => {
    el.addEventListener(type, fn);
    listeners.push([el, type, fn]);
  };

  const fade = (to) => {
    if (isReducedMotion()) gsap.set(layer, { opacity: to });
    else gsap.to(layer, { opacity: to, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  };

  // Places the layer inside the viewport. `instant` skips the easing.
  const place = (x, y, instant = false) => {
    const cx = Math.min(Math.max(x, EDGE), window.innerWidth - layer.offsetWidth - EDGE);
    const cy = Math.min(Math.max(y, EDGE), window.innerHeight - layer.offsetHeight - EDGE);
    if (instant) gsap.set(layer, { x: cx, y: cy });
    else {
      qx(cx);
      qy(cy);
    }
  };

  const fixedSpot = () => {
    const r = list.getBoundingClientRect();
    gsap.set(layer, { x: r.right - layer.offsetWidth, y: r.top });
  };

  const show = (row) => {
    if (activeRow !== row) {
      img.src = row.dataset.hoverImage;
      activeRow = row;
    }
    fade(1);
  };

  const hide = () => {
    activeRow = null;
    fade(0);
  };

  rows.forEach((row) => {
    on(row, "pointerenter", (e) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      show(row);
      if (isReducedMotion()) fixedSpot();
      else place(e.clientX + offset, e.clientY + offset, true);
    });
    on(row, "pointerleave", hide);
    // Keyboard: show the preview beside the focused row, not under the pointer.
    // focusin bubbles, so it also fires when the focused element is an inner link.
    on(row, "focusin", () => {
      show(row);
      const r = row.getBoundingClientRect();
      if (isReducedMotion()) fixedSpot();
      else place(r.right + offset, r.top, true);
    });
    on(row, "focusout", hide);
  });

  // Follow the pointer while over a row (skipped in reduced motion).
  on(list, "pointermove", (e) => {
    if (!activeRow || isReducedMotion()) return;
    place(e.clientX + offset, e.clientY + offset);
  });

  return () => {
    listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
    gsap.killTweensOf(layer);
    layer.remove();
  };
}
