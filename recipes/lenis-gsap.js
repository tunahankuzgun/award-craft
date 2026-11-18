/*
 * lenis-gsap.js: smooth scrolling with Lenis, driven by the GSAP ticker.
 *
 * Job in a design: gives the page a weighted, deliberate scroll feel and keeps
 * ScrollTrigger scrubs and pins in step with the smoothed position. Call once,
 * near the top of main.js, after initMotionPreference().
 *
 * When NOT to use: long reading pages, forms, pages with many nested scroll
 * areas, or pages that embed iframes that must scroll. Smoothing there reads as
 * lag, not luxury. Mark nested scroll areas (code blocks, modals, carousels)
 * with data-lenis-prevent so they keep native scrolling.
 *
 * Adapt: tune `lerp` (0.06 is heavy, 0.12 is light) and `wheelMultiplier`
 * against the project's motion tokens. Do not paste the defaults unchanged.
 *
 * Accessibility and reduced motion: when isReducedMotion() is true, Lenis is
 * never created and native scrolling is used. Anchor links, keyboard and screen
 * reader scrolling are unaffected. The module reacts when the visitor changes
 * the setting at runtime.
 *
 * Dependencies: gsap, lenis, ./motion-preference.js
 * Install: npm i gsap lenis
 */
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, onMotionPreferenceChange } from "./motion-preference.js";

gsap.registerPlugin(ScrollTrigger);

const DEFAULTS = {
  lerp: 0.1,          // smoothing factor; ignored if you set `duration` instead
  wheelMultiplier: 1,
  anchors: true,      // in-page #links scroll smoothly too
};

// Only one Lenis instance runs at a time; this holds it while it is alive.
let current = null;

function startLenis(options) {
  const instance = new Lenis(options);
  const onTick = (time) => instance.raf(time * 1000); // GSAP passes seconds

  // Lenis scrolls the page; tell ScrollTrigger every time it does.
  instance.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(onTick);
  // Keep the ticker from "catching up" with big time jumps, which would
  // make the smoothed scroll lurch after a background tab.
  gsap.ticker.lagSmoothing(0);

  current = { instance, onTick };
}

function stopLenis() {
  if (!current) return;
  gsap.ticker.remove(current.onTick);
  current.instance.destroy();
  gsap.ticker.lagSmoothing(500, 33); // GSAP's default values
  current = null;
}

/**
 * Starts smooth scrolling unless the visitor prefers reduced motion.
 * Call once. Returns { lenis, destroy }.
 */
export function initSmoothScroll(options = {}) {
  const opts = { ...DEFAULTS, ...options };

  const sync = () => {
    const wantSmooth = !isReducedMotion();
    if (wantSmooth === Boolean(current)) return;
    if (wantSmooth) startLenis(opts);
    else stopLenis();
    ScrollTrigger.refresh(); // page height and trigger positions may change
  };

  sync();
  const unsubscribe = onMotionPreferenceChange(sync);

  return {
    get lenis() {
      return current ? current.instance : null;
    },
    destroy() {
      unsubscribe();
      stopLenis();
      ScrollTrigger.refresh();
    },
  };
}

/** Current scroll velocity from Lenis, or 0 when native scrolling is in use. */
export function getScrollVelocity() {
  return current ? current.instance.velocity : 0;
}
