/*
 * split-reveal.js: headline lines that rise out of a mask as they enter view.
 *
 * Job in a design: the signature text entrance for hero and section headings.
 * Each line slides up inside an overflow-clipped mask, one after another.
 *
 * When NOT to use: body copy, long paragraphs, or text that must be read
 * aloud in order by a screen reader while it animates. Keep it to short
 * display headings. Do not use back or elastic eases on masked text.
 *
 * Adapt: change duration, stagger and ease to match the DESIGN.md motion
 * tokens (typical: 0.8 to 1.2s duration, 0.05 to 0.12s stagger).
 * Usage: <h1 data-reveal-lines>Headline text</h1>
 *
 * Accessibility and reduced motion: the element keeps its text and is visible
 * without JS. SplitText uses aria="auto", so the parent gets the full label
 * and the split pieces are hidden from assistive tech. In reduced-motion mode
 * the module does nothing to the text: no split, no opacity change, no tween.
 * The content stays visible exactly as authored.
 * The module rebuilds when the visitor changes the motion setting.
 *
 * Dependencies: gsap (ScrollTrigger, SplitText), ./motion-preference.js
 * Install: npm i gsap
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { isReducedMotion, onMotionPreferenceChange } from "./motion-preference.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

const REDUCE = "(prefers-reduced-motion: reduce)";
const FULL = "(prefers-reduced-motion: no-preference)";

/**
 * Returns a cleanup function that reverts splits and kills triggers.
 */
export function initLineReveals(
  selector = "[data-reveal-lines]",
  { duration = 1, stagger = 0.08, ease = "expo.out", start = "top 85%" } = {}
) {
  const targets = [...document.querySelectorAll(selector)];
  if (targets.length === 0) return () => {};

  let mm = null;
  let disposed = false;
  let fontsReady = false;

  // Shared setup for both matchMedia contexts. Returns the cleanup that gsap
  // runs on revert. isReducedMotion() is the source of truth because it knows
  // about the visitor's override, which the media queries cannot see.
  const setup = () => {
    // Reduced motion: do nothing. The text is not split, styled or tweened, so it
    // stays exactly as authored and visible.
    if (isReducedMotion()) return undefined;

    const splits = [];

    targets.forEach((el) => {
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        aria: "auto",
        autoSplit: true, // re-splits on width change; animation is re-synced below
        onSplit(self) {
          // Returning the tween lets autoSplit revert and rebuild it.
          return gsap.from(self.lines, {
            yPercent: 105,
            duration,
            stagger,
            ease,
            scrollTrigger: { trigger: el, start, once: true },
          });
        },
      });
      splits.push(split);
    });

    return () => {
      splits.forEach((s) => s.revert());
    };
  };

  const build = () => {
    mm = gsap.matchMedia();
    // One context per system setting. gsap flips between them when the OS
    // setting changes. Both run setup(), which checks the visitor override.
    mm.add({ reduce: REDUCE }, setup);
    mm.add({ full: FULL }, setup);
  };

  // Font metrics change line breaks, so wait for the faces before splitting.
  document.fonts.ready.then(() => {
    fontsReady = true;
    if (!disposed) build();
  });

  // Visitor changed the setting: tear down and rebuild with the new state.
  const unsubscribe = onMotionPreferenceChange(() => {
    if (disposed || !fontsReady) return; // the first build waits for fonts
    mm?.revert();
    build();
  });

  return () => {
    disposed = true;
    unsubscribe();
    mm?.revert();
  };
}
