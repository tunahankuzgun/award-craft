/*
 * pointer-effects.js: two fine-pointer effects.
 *
 *  initMagnetic(selector)   a button or link leans toward the pointer and
 *                           springs back when the pointer leaves.
 *  initCursorFollower()     a decorative dot trails the pointer and grows over
 *                           [data-cursor="view"] elements.
 *
 * Job in a design: a physical, tactile feel on primary calls to action, and
 * a signature cursor on portfolio or gallery pages.
 *
 * When NOT to use: touch-first sites (both effects turn themselves off), body
 * copy, or long lists of links. Do not stack magnetic effects on many items.
 *
 * Why the native cursor stays visible: hiding it (cursor: none) hurts people
 * who rely on it to find their pointer, makes text selection and text inputs
 * harder to use, and removes the affordance that something is clickable. The
 * follower is an extra layer on top of the real cursor. If a design truly hides
 * the native cursor, restore it on text inputs, textareas, and [contenteditable].
 *
 * Accessibility and reduced motion: the magnetic effect is skipped, and the
 * cursor follower is not created at all, when reduced motion is on. The
 * follower and its label are aria-hidden and pointer-events:none. Magnetic
 * elements keep their focus ring: do not set outline:none, and the move
 * applies transform only, so the ring moves with the element.
 *
 * Dependencies: gsap, ./damp.js, ./motion-preference.js
 * Install: npm i gsap
 */
import { gsap } from "gsap";
import { createTicker, damp } from "./damp.js";
import { isReducedMotion, onMotionPreferenceChange } from "./motion-preference.js";

const FINE = "(hover: hover) and (pointer: fine)";

/**
 * @param {string} selector elements to attract
 * @param {{ strength?: number }} options  0.3 is a gentle pull
 * @returns {() => void} cleanup
 */
export function initMagnetic(selector = "[data-magnetic]", { strength = 0.3 } = {}) {
  const els = [...document.querySelectorAll(selector)];
  if (els.length === 0 || !window.matchMedia(FINE).matches) return () => {};

  const handlers = els.map((el) => {
    // quickTo: one fast setter per axis, eased with power3.out.
    const qx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const qy = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      // Reduced motion can switch on mid-hover: put the element back at rest.
      if (isReducedMotion()) return resetAtRest(el);
      // Centre of the element at rest: current transform removed from its rect.
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - gsap.getProperty(el, "x");
      const cy = r.top + r.height / 2 - gsap.getProperty(el, "y");
      qx((e.clientX - cx) * strength);
      qy((e.clientY - cy) * strength);
    };
    const onLeave = () => {
      qx(0);
      qy(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return { el, onMove, onLeave };
  });

  // Visitor turned reduced motion on: reset any element that is still displaced.
  const unsubscribe = onMotionPreferenceChange((reduced) => {
    if (reduced) handlers.forEach(({ el }) => resetAtRest(el));
  });

  return () => {
    unsubscribe();
    handlers.forEach(({ el, onMove, onLeave }) => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el, "x,y");
      gsap.set(el, { clearProps: "transform" });
    });
  };
}

// Stops any in-flight move and sets the transform back to rest (0,0).
function resetAtRest(el) {
  gsap.killTweensOf(el, "x,y");
  gsap.set(el, { x: 0, y: 0 });
}

/**
 * Decorative follower dot. Returns a cleanup. It is created only when fine
 * pointers are present and reduced motion is off, and it is removed if the
 * visitor turns reduced motion on at runtime.
 */
export function initCursorFollower({ lambda = 12 } = {}) {
  if (!window.matchMedia(FINE).matches) return () => {};

  let unmount = null;
  const sync = () => {
    const off = isReducedMotion();
    if (off && unmount) {
      unmount();
      unmount = null;
    } else if (!off && !unmount) {
      unmount = mount(lambda);
    }
  };

  sync();
  const unsubscribe = onMotionPreferenceChange(sync);

  return () => {
    unsubscribe();
    unmount?.();
    unmount = null;
  };
}

function mount(lambda) {
  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.style.cssText = "position:fixed;left:0;top:0;pointer-events:none;z-index:9999;";
  root.innerHTML =
    '<span class="cursor-dot" style="position:absolute;left:-6px;top:-6px;width:12px;height:12px;' +
    'border-radius:50%;background:currentColor;transform:scale(1);"></span>' +
    '<span class="cursor-label" style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);' +
    'white-space:nowrap;font:600 12px/1 system-ui,sans-serif;opacity:0;"></span>';
  document.body.append(root);

  const dot = root.querySelector(".cursor-dot");
  const label = root.querySelector(".cursor-label");

  // Current position, target position, and dot scale. The ticker damps them.
  const pos = { x: -100, y: -100, tx: -100, ty: -100, s: 1, ts: 1 };

  const ticker = createTicker((dt) => {
    pos.x = damp(pos.x, pos.tx, lambda, dt);
    pos.y = damp(pos.y, pos.ty, lambda, dt);
    pos.s = damp(pos.s, pos.ts, lambda, dt);
    root.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    dot.style.transform = `scale(${pos.s})`; // dot is already centred by left/top -6px
    label.style.opacity = pos.ts > 1 ? "1" : "0";

    const settled =
      Math.abs(pos.x - pos.tx) < 0.1 && Math.abs(pos.y - pos.ty) < 0.1 &&
      Math.abs(pos.s - pos.ts) < 0.01;
    return !settled; // returning false stops the ticker until the next move
  });

  const onMove = (e) => {
    pos.tx = e.clientX;
    pos.ty = e.clientY;
    if (!ticker.running) ticker.start();
  };

  // pointerover fires on every element entered, so it also resets the size
  // when the pointer leaves a [data-cursor="view"] element.
  const onOver = (e) => {
    const view = e.target.closest?.('[data-cursor="view"]');
    pos.ts = view ? 6 : 1;
    label.textContent = view ? view.dataset.cursorLabel || "" : "";
    if (!ticker.running) ticker.start();
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver);
  ticker.start();

  return () => {
    ticker.stop();
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver);
    root.remove();
  };
}
