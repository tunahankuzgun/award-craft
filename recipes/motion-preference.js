/*
 * motion-preference.js: one answer to "should this page move?"
 *
 * Job in a design: every animated recipe asks isReducedMotion() or reads
 * html[data-motion]. This module combines the system setting with the visitor's
 * own choice (system | reduce | full), writes the result to
 * <html data-motion="reduce|full">, and notifies listeners when it changes.
 *
 * Adapt: call initMotionPreference() once at startup. For zero flash, a tiny
 * inline script in <head> can set data-motion before first paint.
 * Mount bindMotionToggle() on a button in the footer or a settings panel.
 *
 * Accessibility: the toggle is a real button with aria-pressed. Pressed means
 * "motion reduced". The name is constant, so screen readers announce a state
 * rather than a label that changes. Storage errors (private mode) are ignored.
 *
 * DESIGN.md tokens: none directly. CSS recipes read data-motion via tokens.css.
 */

export const MOTION_KEY = "motion-preference"; // localStorage key: "system" | "reduce" | "full"

const QUERY = "(prefers-reduced-motion: reduce)";
const VALUES = new Set(["system", "reduce", "full"]);
const listeners = new Set();
let systemListening = false;

function readStored() {
  try {
    const value = localStorage.getItem(MOTION_KEY);
    return VALUES.has(value) ? value : "system";
  } catch {
    return "system"; // storage blocked: follow the system setting
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(MOTION_KEY, value);
  } catch {
    /* storage blocked: the choice lasts for this page view only */
  }
}

function systemPrefersReduce() {
  return typeof matchMedia === "function" && matchMedia(QUERY).matches;
}

export function isReducedMotion() {
  const stored = readStored();
  if (stored === "reduce") return true;
  if (stored === "full") return false;
  return systemPrefersReduce();
}

function apply() {
  const reduced = isReducedMotion();
  document.documentElement.dataset.motion = reduced ? "reduce" : "full";
  return reduced;
}

function notify() {
  const reduced = apply();
  for (const cb of listeners) cb(reduced);
}

export function initMotionPreference() {
  apply();
  if (systemListening || typeof matchMedia !== "function") return;
  const mql = matchMedia(QUERY);
  // Older Safari only supports addListener.
  if (mql.addEventListener) mql.addEventListener("change", notify);
  else mql.addListener(notify);
  systemListening = true;
}

export function setMotionPreference(value) {
  if (!VALUES.has(value)) throw new RangeError(`Unknown motion preference: ${value}`);
  writeStored(value);
  notify();
}

export function onMotionPreferenceChange(cb) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function bindMotionToggle(button) {
  if (!button.hasAttribute("aria-label") && !button.textContent.trim()) {
    button.setAttribute("aria-label", "Reduce motion");
  }

  const sync = (reduced = isReducedMotion()) => {
    button.setAttribute("aria-pressed", String(reduced));
  };
  const onClick = () => {
    // Toggle from the effective state, so "system" users get an explicit choice.
    setMotionPreference(isReducedMotion() ? "full" : "reduce");
  };

  button.addEventListener("click", onClick);
  const unsubscribe = onMotionPreferenceChange(sync);
  sync();

  return () => {
    button.removeEventListener("click", onClick);
    unsubscribe();
  };
}
