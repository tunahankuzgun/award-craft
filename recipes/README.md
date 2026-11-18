# Recipes index

Recipes are starting points. Each file has a header that says what it does, its job in a design, when not to use it, how to adapt it, and how it behaves under reduced motion. Read the header before you use a file.

The default state of every recipe is the readable one: content is visible and usable without JS, without WebGL, with reduced motion, and by keyboard. Motion is layered on top by JS.

## Index

| File | What it does | Job in a design | Depends on |
| --- | --- | --- | --- |
| `tokens.css` | Canonical CSS custom properties: colour, motion, type, space (see Token names below). Reads the `html[data-motion]` hook to shorten durations when motion is reduced. | The single place where the design's decisions live. Other CSS recipes read from it. | none (reads the hook that `motion-preference.js` sets) |
| `motion-preference.js` | Reads and stores the visitor's motion setting (system, reduce, full). Sets `<html data-motion>`, and exposes `isReducedMotion()`, `setMotionPreference()`, `onMotionPreferenceChange()` and `bindMotionToggle()`. | The gate every animated recipe checks first. Honours the visitor's choice over the OS setting. | none |
| `damp.js` | Frame-rate independent easing (`damp`), `clamp`, and a pausable `createTicker` built on requestAnimationFrame. The ticker pauses when the tab is hidden and stops when its callback returns `false`. | Smooth followers and scroll-linked values that do not depend on frame rate. | none |
| `scroll-reveals.css` | Elements settle into place as they enter the viewport, using CSS scroll-driven timing with a fallback. Off under reduced motion. | Quiet, consistent entrances for body sections, cards and figures. | `motion-preference.js` (the `html[data-motion]` hook only; no tokens) |
| `grain.css` | A subtle noise texture overlay on flat colour. Static under reduced motion. | Makes flat colour feel printed. Use it sparingly on a few surfaces. | `motion-preference.js` (the hook only; no tokens) |
| `marquee.css` | A horizontally scrollable line. Without JS it is a static, scrollable line with no pause button. It animates only after `initMarquee()` runs, and the pause button is shown only then. | A quiet "more here" signal between sections. | `tokens.css` |
| `marquee.js` | `initMarquee()`: starts the animation, shows the pause button, adds a scroll-velocity boost, and respects reduced motion. The recipe repeats the group, so short content never shows a gap. Hover on the strip pauses it. Focus pauses it only when the strip contains focusable items. In the animated state the visible pause button is the control; under reduced motion, or when paused, the region scrolls by hand. It pauses when the strip is off screen and resumes when it returns. | Makes the ticker respond to scrolling without demanding attention. | `marquee.css`, `damp.js`, `motion-preference.js` |
| `view-transitions.css` | Animation values for the View Transitions API, including a shared element for lists to detail views. Reduced motion gets no movement. | Shared image or title motion between a list and its detail page. | `tokens.css` |
| `view-transitions.js` | `navigateWithTransition(updateDom)`: runs a DOM update inside a view transition when supported, and moves focus to the new heading. | Route, filter and tab changes that feel continuous. | `view-transitions.css`, `motion-preference.js` |
| `loader.js` | `runLoader()`: an intro that shows real progress (fonts, hero image, video), holds a minimum time, and offers a skip button. Also `imageReady()` and `videoReady()`. The intro ships hidden; see the loader contract below. | The first moment of the site. It waits for what the page truly needs and never traps the visitor. | `motion-preference.js` |
| `lenis-gsap.js` | `initSmoothScroll()`: Lenis smooth scrolling driven by the GSAP ticker, wired to ScrollTrigger. Not created under reduced motion. `getScrollVelocity()`. | The weighted scroll feel for the whole page. | `gsap`, `lenis`, `motion-preference.js` |
| `split-reveal.js` | `initLineReveals()`: headline lines rise out of a mask as they enter view. With reduced motion it does nothing: the text stays exactly as authored. | The signature text entrance for hero and section headings. | `gsap`, `motion-preference.js` |
| `horizontal-pin.js` | `initHorizontalPin(section, track)`: stacked vertical panels by default. JS pins the section and scrolls the panels sideways only on wide screens with full motion. Focus-aware. | A "chapter" moment in the story, made of a sequence of panels. | `gsap`, `motion-preference.js` |
| `hover-reveal.js` | `initHoverReveal(list)`: a floating preview image that follows the pointer over list rows. Shows on keyboard focus too. | A quiet second layer of information on index and roster pages. | `gsap`, `motion-preference.js` |
| `pointer-effects.js` | `initMagnetic()`: buttons lean toward the pointer, and reset at once if reduced motion turns on mid-hover. `initCursorFollower()`: a decorative dot that trails the pointer. Fine pointers only. | Tactile calls to action and a signature cursor on gallery pages. | `gsap`, `damp.js`, `motion-preference.js` |
| `dom-gl-sync.js` | `initGLImages()`: WebGL ripple and scroll-bend on `<img data-gl-image>`. Progressive: the DOM image stays if WebGL2 or motion is unavailable. Measures and draws only images near the viewport, and the loop stops when none are. | A hero or feature image with material depth. | `three`, `damp.js`, `motion-preference.js` |

## Token names

Use these canonical names in CSS and in DESIGN.md. Do not invent aliases.

- Colour: `--color-ground`, `--color-ink`, `--color-ink-quiet`, `--color-signal`, `--color-line`, `--color-focus`, `--color-focus-on-light`
- Motion: `--ease-out-expo`, `--ease-out-quart`, `--ease-in-out-quint`, `--dur-micro`, `--dur-reveal`, `--dur-scene`, `--stagger`
- Type: `--step--1` to `--step-6`, `--track-display`, `--track-label`
- Space: `--space-1` to `--space-10`

`tokens.css` sets all of these. Under reduced motion it sets the duration tokens to 1ms and the stagger token to 0ms. This applies to the CSS recipes, which read those tokens.

The JS recipes do not read tokens. They take timing as parameters (`duration`, `stagger`, `ease`, `lambda`), so pass values that match the DESIGN.md motion tokens. Each JS recipe has its own reduced-motion path; it does not depend on the token change.

Several recipes rely on the `hidden` attribute to hide elements (the loader intro, and the marquee clone and toggle). `tokens.css` sets `[hidden] { display: none !important; }`, so a class with a `display` value cannot make a hidden element visible. Keep that rule loaded.

## Loader contract

- The intro element ships in the markup with the `hidden` attribute, so a visitor without JS never sees it. `runLoader()` removes `hidden` when it starts, and sets `el.hidden = true` when it finishes. `el.dataset.loaderState` goes from `"loading"` to `"done"`.
- Options: `el`, `tasks`, `minMs` (default 600), `maxMs` (default 3000), `onProgress(fraction, label)`, `onExit(el)`, `statusEl`, `storageKey` (default `"intro-seen"`), and `target` (default `main`, which gets `aria-busy` while loading). `tasks` can hold promises or functions. Prefer functions: a function that rejects is caught by the loader. A promise that is already rejected when you pass it may be reported as an unhandled rejection before the loader attaches its handler.
- Status text: `statusEl` is the live region to write into. Put a `<p aria-live="polite">` in the initial markup and pass it. If `statusEl` is not passed, the loader uses a `[data-loader-status]` element inside `el`. If that is missing too, it creates a `<p data-loader-status aria-live="polite">` inside `el` before the first message. A region in the initial markup is still best, because screen readers announce changes to regions that already exist.
- Skip: a `[data-loader-skip]` button inside `el` ends the wait at once. This includes the minimum hold and the exit animation: a skip during either one ends it immediately. When the intro hides, focus moves to `target` if focus was inside the intro, so keyboard users do not lose their place.
- Done means: all tasks have settled, or `maxMs` has elapsed, or the skip button was pressed. A failed task counts as settled and is listed in `errors`. The hold is `minMs`, but it is capped at `maxMs`. Under reduced motion, or on a return visit (the `storageKey` flag is set), `minMs` is 0.
- Exit: `onExit(el)` is awaited after the loader is done, and only if the intro was not skipped and reduced motion is off. The loader stops waiting for it after 1.2 s, or at once if the visitor presses skip during it. Then it sets `el.hidden = true` and moves focus to `target` if focus was inside the intro. `onExit` is where the intro animates out.
- Time limit: `maxMs` caps the wait for the tasks, not the whole intro. `onExit` can add at most 1.2 s after that, so the intro can run for up to `maxMs + 1.2 s`. Do not design around "the visitor is never held longer than `maxMs`".
- Result: `{ reduced, short, skipped, timedOut, errors, elapsedMs }`.

This section follows `loader.js` as it is now. The file header lists the same contract.

## Install

```sh
npm i gsap lenis three
```

Install only what the chosen recipes use. The CSS recipes need no packages. `gsap` covers ScrollTrigger and SplitText. `lenis` is needed only for `lenis-gsap.js`. `three` is needed only for `dom-gl-sync.js`.

## Rules for using recipes

1. Adapt values from the project's DESIGN.md tokens. Never paste a recipe unchanged. The defaults (durations, lerp, offsets, strength) are starting points, not the design.
2. Pick recipes from the story beats, not the other way round. Ask what each section is for, then choose the recipe that serves that moment. Do not add a recipe because it is available.
3. Every recipe has a reduced-motion path. Keep it. Do not remove a reduced-motion branch to simplify code.
4. Call `initMotionPreference()` first, before any other recipe reads the setting.
5. Content must work without JS, without WebGL, with reduced motion, and by keyboard. If a recipe removes content, it is wrong.
6. Pinned and split layouts have markup rules. A pinned section has no horizontal padding (put padding on its panels). Pinned sections use `overflow: clip`, not `hidden`.
7. Use the screenshot script in the critique loop (see below). Capture the page at desktop and mobile widths, and with reduced motion on, and check the result against the design brief before calling it done.

## Screenshot script (critique loop)

`scripts/screenshot.mjs` captures a page in a real browser so you can review it.

```sh
npm i -D playwright
npx playwright install chromium        # add firefox webkit to check other engines
node <skill-dir>/scripts/screenshot.mjs <url> [outDir=./screenshots] [--wait=4500] [--browser=chromium|firefox|webkit]
```

Run it from the project root, because Playwright is resolved from the current working directory. Alternatively, copy the script into the project and run it from there.

## Wiring example (main.js)

Order matters. The motion setting comes first. The intro holds the layout still while fonts and the hero load. Smooth scroll starts after the intro, from a settled layout. Line reveals wait for fonts internally.

Intro markup (the intro ships hidden, and the status region is part of the initial markup):

```html
<div id="intro" class="intro" hidden>
  <p id="intro-status" aria-live="polite"></p>
  <button type="button" data-loader-skip>Skip intro</button>
</div>
```

Script:

```js
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { initMotionPreference, isReducedMotion } from "./recipes/motion-preference.js";
import { runLoader, imageReady } from "./recipes/loader.js";
import { initSmoothScroll } from "./recipes/lenis-gsap.js";
import { initLineReveals } from "./recipes/split-reveal.js";
import { initHorizontalPin } from "./recipes/horizontal-pin.js";
import { initHoverReveal } from "./recipes/hover-reveal.js";
import { initMagnetic, initCursorFollower } from "./recipes/pointer-effects.js";
import { initMarquee } from "./recipes/marquee.js";

// Intro exit: fade out, or nothing at all under reduced motion.
const exitIntro = (el) =>
  new Promise((resolve) => {
    if (isReducedMotion()) return resolve();
    gsap.to(el, { autoAlpha: 0, duration: 0.6, ease: "expo.in", onComplete: resolve });
  });

async function main() {
  // 1. Sets <html data-motion> before any CSS or JS reads the setting.
  initMotionPreference();

  // 2. Intro: waits for real work, then animates out and sets hidden.
  const hero = document.querySelector("#hero-img");
  await runLoader({
    el: document.querySelector("#intro"),
    statusEl: document.querySelector("#intro-status"),
    tasks: [document.fonts.ready, ...(hero ? [() => imageReady(hero)] : [])],
    onExit: exitIntro,
  });

  // 3. Smooth scroll starts from a settled layout (no-op under reduced motion).
  initSmoothScroll({ lerp: 0.1 });

  // 4. Motion that depends on the content being in place. Each one leaves the
  //    readable default layout alone when it does not activate.
  initLineReveals("[data-reveal-lines]");
  initHorizontalPin(document.querySelector("#chapters"), document.querySelector("#chapters .h-track"));
  const list = document.querySelector("[data-hover-list]");
  if (list) initHoverReveal(list);
  initMagnetic("[data-magnetic]", { strength: 0.25 });
  initCursorFollower();
  const marquee = document.querySelector(".marquee");
  if (marquee) initMarquee(marquee, { speed: 60 });

  // 5. The page height is now final: refresh the triggers once.
  ScrollTrigger.refresh();
}

main();
```

Notes on the example:

- `initGLImages` is not in the example because it needs `<img data-gl-image>` markup. Call it after step 5 with its selector.
- `initSmoothScroll` returns `{ lenis, destroy }`. Keep the return value if other code needs to stop or read the scroll.
- `initSmoothScroll` sets `gsap.ticker.lagSmoothing(0)` while Lenis runs and restores GSAP's defaults when it stops. The example does not set it again.
- `initHorizontalPin` leaves the section stacked unless JS can pin it (wide screen, full motion). Its CSS is in its header. `#chapters` is a placeholder id for your pinned section.
