/*
 * horizontal-pin.js: a pinned section whose panels scroll sideways as the page
 * scrolls down.
 *
 * Job in a design: a "chapter" moment where one story beat is a sequence of
 * panels. The page keeps scrolling vertically; the track moves horizontally.
 *
 * When NOT to use: pages with lots of text per panel, forms, or any content a
 * user must compare side by side. Also skip it when the panels are unrelated.
 * Keep at most one or two pinned sections per page.
 *
 * Default layout is STACKED. Without JS, under reduced motion, and on small
 * screens, every panel is visible in a normal vertical flow. The pinned layout
 * is applied only when this function activates it: JS adds `is-pinned` to the
 * section on wide screens with motion allowed, and removes it again on revert.
 * No CSS rule here depends on the prefers-reduced-motion media query, because
 * the visitor's override is only known to JS.
 *
 * CSS (copy into the project; the recipe does not inject styles):
 *   .h-section { overflow: visible; }            // stacked by default
 *   .h-panel   { min-height: 60vh; }
 *
 *   .h-section.is-pinned {
 *     height: 100svh;     // svh avoids mobile URL-bar jumps
 *     overflow: clip;     // not "hidden": hidden stays programmatically scrollable,
 *                         // so focusing a panel link scrolls the section itself
 *                         // and offsets the panels twice. clip cannot be scrolled.
 *   }
 *   .h-section.is-pinned .h-track { display: flex; height: 100%; }
 *   .h-section.is-pinned .h-panel { flex: 0 0 100vw; min-height: 100svh; }
 *
 * Markup rule: the pinned section must have NO horizontal padding. Padding on
 * the section shifts the track and pushes panel edges past the viewport. Put
 * padding on the panels (.h-panel) instead.
 *
 * Accessibility and reduced motion: stacked content is the baseline, so nothing
 * is hidden or unreachable. Keyboard focus into a pinned panel scrolls the page
 * to that panel's position on the pin (focusin handler), so every link stays
 * reachable by Tab.
 *
 * Dependencies: gsap (ScrollTrigger), ./motion-preference.js
 * Install: npm i gsap
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, onMotionPreferenceChange } from "./motion-preference.js";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP = "(min-width: 900px)";
const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * @param {HTMLElement} section  the pinned wrapper
 * @param {HTMLElement} track    the row of panels inside it
 * @returns {() => void} cleanup
 */
export function initHorizontalPin(section, track) {
  if (!section || !track) return () => {};

  // Scroll distance the track must travel. Never negative: a stacked or short
  // track has nothing to scroll, and a negative value would push it sideways.
  const maxX = () => Math.max(0, track.scrollWidth - section.clientWidth);

  // Runs when the desktop width matches. The visitor override is checked here,
  // because the media queries cannot see it. Returns the cleanup gsap runs on revert.
  const setup = () => {
    if (isReducedMotion()) return undefined;

    section.classList.add("is-pinned");

    const tween = gsap.to(track, {
      x: () => -maxX(),
      ease: "none", // scrub already smooths the motion
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + maxX(),
        invalidateOnRefresh: true,
      },
    });
    const st = tween.scrollTrigger;

    // Keyboard: focusing a panel scrolls the page to where that panel sits on the
    // pin, so the focused link is visible. Progress maps linearly onto the pin.
    const onFocus = (event) => {
      const panel = [...track.children].find((child) => child.contains(event.target));
      if (!panel) return;
      const distance = maxX();
      if (distance === 0) return;
      const offset = panel.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const progress = Math.min(1, Math.max(0, offset / distance));
      window.scrollTo({ top: st.start + progress * (st.end - st.start), behavior: "auto" });
    };
    section.addEventListener("focusin", onFocus);

    return () => {
      section.removeEventListener("focusin", onFocus);
      tween.kill();
      st.kill();
      gsap.set(track, { clearProps: "transform" });
      section.classList.remove("is-pinned");
    };
  };

  let mm = null;
  // One single-condition context. gsap runs a context when ANY condition matches,
  // so combining the desktop query with a motion query would run setup on mobile.
  const build = () => {
    mm?.revert();
    mm = gsap.matchMedia();
    mm.add(DESKTOP, setup);
  };

  build();

  // Visitor changed the motion setting (this also covers OS changes that the
  // motion module reports).
  const unsubscribe = onMotionPreferenceChange(build);

  // OS changed prefers-reduced-motion while the visitor setting is "system".
  const osQuery = window.matchMedia(REDUCE);
  const onOsChange = () => build();
  osQuery.addEventListener("change", onOsChange);

  return () => {
    unsubscribe();
    osQuery.removeEventListener("change", onOsChange);
    mm?.revert(); // runs the setup cleanup: kills the pin, removes is-pinned
    mm = null;
  };
}
