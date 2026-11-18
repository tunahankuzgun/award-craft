/*
 * damp.js: frame-rate independent easing and a small rAF ticker.
 *
 * Job in a design: smooth followers (cursor, scroll-linked values, marquee speed)
 * that converge the same way at 60, 120, or 144 Hz. A plain lerp such as
 * a + (b - a) * 0.1 runs faster on high-refresh screens; damp() does not.
 *
 * Adapt: choose lambda by feel.
 *   3 to 6    cinematic, slow settle
 *   8 to 12   snappy UI
 *   15 and up near-instant
 * In GSAP projects, drive the same math from gsap.ticker instead of createTicker.
 *
 * Accessibility: damp() is pure math. createTicker() pauses while the tab is
 * hidden and stops when the callback returns false, so an idle page does no work.
 * Motion is still gated by motion-preference.js; check it before animating.
 *
 * DESIGN.md tokens: none. Keyframe timing comes from --dur-* and --ease-* in tokens.css.
 */

/** Exponential approach toward target. Same result at any frame rate. */
export function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/**
 * requestAnimationFrame loop. callback(dt seconds, timeMs) runs every frame.
 * dt comes only from rAF timestamps, so callback time does not shrink the next dt.
 * dt is clamped to 0.1 s so a stalled tab does not jump. Return false to stop.
 */
export function createTicker(callback) {
  let wanted = false; // start() was called and stop() was not
  let scheduled = false; // a rAF is pending
  let rafId = 0;
  let last = 0; // rAF timestamp of the previous frame

  function schedule() {
    if (!wanted || scheduled || document.hidden) return;
    scheduled = true;
    rafId = requestAnimationFrame(frame);
  }

  function frame(now) {
    scheduled = false;
    if (!wanted) return;
    const dt = clamp((now - last) / 1000, 0, 0.1);
    last = now; // set from the frame timestamp, before the callback runs
    const keepGoing = callback(dt, now);
    if (keepGoing === false) {
      stop();
      return;
    }
    schedule();
  }

  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      scheduled = false;
    } else {
      last = performance.now(); // resume without a large dt
      schedule();
    }
  }

  function start() {
    if (wanted) return;
    wanted = true;
    last = performance.now();
    document.addEventListener("visibilitychange", onVisibility);
    schedule();
  }

  function stop() {
    wanted = false;
    cancelAnimationFrame(rafId);
    scheduled = false;
    document.removeEventListener("visibilitychange", onVisibility);
  }

  return {
    start,
    stop,
    get running() {
      return wanted;
    },
  };
}
