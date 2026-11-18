# Signature Technique Catalog

Pick techniques from the concept and the story beats. Never pick the concept from the techniques. A site uses a handful of these, not all of them.

Each technique uses the same block:

- **Job:** what it does for the visitor.
- **Fits concepts like:** the kinds of concept it supports.
- **Cost:** low, medium, or high, with the reason.
- **Reduced motion:** the version to build.
- **Touch/mobile:** what changes on touch screens.
- **Avoid when:** when not to use it.
- **Recipe:** the starter file, if one exists.

Costs are rough guides for planning. Measure on a mid-range phone.

## Masked line reveal

- **Job:** Reveal a headline one line at a time from behind a mask, so it reads as a deliberate sentence.
- **Fits concepts like:** calm, precise, editorial, slow.
- **Cost:** Low. The text is split once, after fonts load.
- **Reduced motion:** Leave the text as authored. It is not split, faded, or moved. The recipe does nothing under reduced motion.
- **Touch/mobile:** Same effect. Reduce the stagger on small screens.
- **Avoid when:** Body paragraphs. Splitting long text hurts reading and screen readers.
- **Recipe:** `recipes/split-reveal.js`

## Clip-path image reveal on scroll

- **Job:** Open an image from a narrow slit or corner into full frame as it enters, to mark a moment of arrival.
- **Fits concepts like:** editorial, architectural, slow, cinematic.
- **Cost:** Low to medium. Clip-path animation repaints, so keep few on screen at once.
- **Reduced motion:** Show the image in its final frame.
- **Touch/mobile:** Same. Trigger on section entry.
- **Avoid when:** Many images in a grid. The effect becomes noise.
- **Recipe:** `recipes/scroll-reveals.css`

## Scroll-driven CSS reveals

- **Job:** Tie a simple reveal to scroll position without JavaScript.
- **Fits concepts like:** almost any concept that needs light entrances.
- **Cost:** Low. Transform and opacity run well.
- **Reduced motion:** Remove the animation inside `prefers-reduced-motion`.
- **Touch/mobile:** Same.
- **Avoid when:** The reveal must sync to a JavaScript timeline. Wrap the effect in `@supports` and keep content visible by default.
- **Recipe:** `recipes/scroll-reveals.css`

## Smooth scroll

- **Job:** Give scroll weight and inertia, so the page feels like one continuous surface.
- **Fits concepts like:** slow, heavy, cinematic, tactile.
- **Cost:** Low to medium. It runs a per-frame loop, so drive it from the GSAP ticker.
- **Reduced motion:** The recipe never creates Lenis when the visitor prefers reduced motion, so native scrolling is used. Confirm that in testing.
- **Touch/mobile:** Native touch scrolling is often better. Test before adding smooth scroll on touch.
- **Avoid when:** Text-heavy pages, forms, or long reading areas. Never block keyboard paging or the scrollbar.
- **Recipe:** `recipes/lenis-gsap.js`

## Pinned horizontal section

- **Job:** Turn a series of panels into a sideways journey while the page scrolls down.
- **Fits concepts like:** portfolios, processes, timelines, one chapter made of steps.
- **Cost:** Medium. A pin plus a scrubbed transform. Test section heights on mobile.
- **Default layout:** Stacked. Without JS, under reduced motion, and below 900px, every panel sits in a normal vertical flow. Nothing is hidden.
- **Reduced motion:** Stacked. `initHorizontalPin()` does not pin when the visitor prefers reduced motion.
- **Touch/mobile:** Stacked below 900px. A wide touch screen does get the pin, so test the scroll on touch.
- **Avoid when:** Panels hold lots of text, forms, or content that must be compared side by side. Keep at most one or two pinned sections per page.
- **Recipe:** `recipes/horizontal-pin.js`. The pin is applied only on wide screens with motion allowed, when `initHorizontalPin()` adds `is-pinned`. Focusing a panel link scrolls the page to that panel's place on the pin, so every link stays reachable by Tab. Copy the CSS from the recipe header into the project. Keep the pinned section free of horizontal padding.

## Cursor-following hover image list

- **Job:** Show a preview image beside the cursor as the visitor moves through a list of titles.
- **Fits concepts like:** portfolios, indexes, credits, project lists.
- **Cost:** Low. Preload the images.
- **Reduced motion:** Show a static preview when the item gets keyboard focus.
- **Touch/mobile:** Only for `(hover: hover) and (pointer: fine)`. On touch, the title links straight to the item.
- **Avoid when:** The preview is the only way to reach the content. Keyboard focus must show the same preview.
- **Recipe:** `recipes/hover-reveal.js`

## Magnetic buttons and cursor follower

- **Job:** Give the cursor weight. Buttons pull slightly toward the pointer, and a follower shows the current state.
- **Fits concepts like:** playful, tactile, magnetic.
- **Cost:** Low.
- **Reduced motion:** No pull. Keep any state change that carries meaning.
- **Touch/mobile:** Skip on touch. Nothing is lost, because the effect has no touch job.
- **Avoid when:** The follower has no job. It must show a state (link, drag, text, loading), or it is cut.
- **Recipe:** `recipes/pointer-effects.js`

## Scroll-velocity skew

- **Job:** Lean wrappers with scroll speed, to show energy and direction.
- **Fits concepts like:** kinetic, energetic, playful.
- **Cost:** Low to medium. It updates every frame, so the value is damped.
- **Reduced motion:** No skew. Do not set the transform at all.
- **Touch/mobile:** Same, at a lower amplitude. `getScrollVelocity()` returns 0 when native scrolling is in use, so the skew only works where Lenis runs. Test it on a phone.
- **Avoid when:** Body text. Skew hurts reading. Apply it to wrappers, not to the text itself.
- **Recipe:** `recipes/lenis-gsap.js` (for `getScrollVelocity()`) and `recipes/damp.js` (for `damp()` and `clamp()`). Neither recipe implements skew. The snippet below is the whole pattern.

  ```js
  import { gsap } from "gsap";
  import { getScrollVelocity } from "./recipes/lenis-gsap.js";
  import { clamp, damp } from "./recipes/damp.js";
  import { isReducedMotion } from "./recipes/motion-preference.js";

  const setSkew = gsap.quickSetter(document.querySelector("[data-skew]"), "skewY", "deg");
  let skew = 0;
  if (!isReducedMotion()) gsap.ticker.add((_, delta) => {
    const target = clamp(getScrollVelocity() * 0.05, -8, 8); // about ±8deg; tune 0.05
    skew = damp(skew, target, 6, delta / 1000); // eases back to 0 when scrolling stops
    setSkew(skew);
  });
  ```

  The check runs once at startup. If the visitor can change the motion setting at runtime, call `onMotionPreferenceChange()` and rebuild.

## WebGL image planes synced to DOM, with distortion

- **Job:** Keep real HTML images and text in the page, and draw the images as textured planes in WebGL so they can warp, ripple, or distort on scroll or hover.
- **Fits concepts like:** liquid, glassy, material, photographic.
- **Cost:** High. One renderer, shared textures, and a capped pixel density.
- **Reduced motion:** Show the flat image, with no distortion.
- **Touch/mobile:** Keep the distortion at lower intensity and resolution. Test on a mid-range phone.
- **Off-screen:** Pause the render loop when the canvas leaves the viewport, and when the tab is hidden.
- **Avoid when:** The images are the only content, or there is no non-WebGL fallback.
- **Recipe:** `recipes/dom-gl-sync.js`

## Marquee

- **Job:** A continuous horizontal band of text or logos that sets a rhythm and a voice.
- **Fits concepts like:** confident, fast, poster-like. Works well as a divider.
- **Cost:** Low. The motion is a `transform` on the track only.
- **Without JS:** A static, horizontally scrollable line. The region takes keyboard focus and scrolls with arrow keys and the scrollbar. The duplicate copy and the pause button are hidden. Nothing moves.
- **With JS and motion allowed:** `initMarquee()` sets `data-animated`, shows the duplicate copy (`aria-hidden`, inert) and the pause/play button, whose visible label changes between "Pause marquee" and "Play marquee" (no `aria-pressed`), and drives the track with the ticker. The track moves, so the region is not keyboard-scrollable in this state; keyboard users use the pause button. Hover on the track pauses it. Focus pauses it only when the track contains focusable items. Repeat the group as needed so short content never shows a gap.
- **Reduced motion:** Stays static, scrollable, and keyboard-focusable. The copies are removed, the button stays hidden, and the ticker never runs.
- **Touch/mobile:** Same as above. Touch has no hover, so the pause button is the main control on touch.
- **Off-screen:** Pause the motion when the marquee leaves the viewport, with an IntersectionObserver that stops the ticker the way hover does. The tab-hidden pause is already built into `createTicker`.
- **Avoid when:** The marquee carries key information. It must decorate with a job, not be the only place the copy appears.
- **Recipe:** `recipes/marquee.css`, `recipes/marquee.js`

## Grain overlay

- **Job:** Add a physical texture over the page, so flat color feels printed or filmed.
- **Fits concepts like:** tactile, analog, editorial, cold or warm moods.
- **Cost:** Low if rasterized once. High if a full-screen SVG filter runs every frame.
- **Reduced motion:** Static grain. The optional jitter (`grain--animated`) is opt-in. It runs only when motion is allowed, and it stops after about 4 seconds, which keeps it under the 5-second limit for moving content in WCAG 2.2.2.
- **Touch/mobile:** Same.
- **Avoid when:** Text is small or low contrast. Grain reduces legibility.
- **Recipe:** `recipes/grain.css`

## Page transitions

- **Job:** Carry the visitor from one page to the next as one continuous motion, so the site feels like one place.
- **Fits concepts like:** multi-page sites, case studies, catalogs.
- **Cost:** Medium. The model choice matters. See `references/transitions.md`.
- **Reduced motion:** Crossfade or instant.
- **Touch/mobile:** Same. Keep it under one second.
- **Avoid when:** The site is a single page. Use scenes instead.
- **Recipe:** `recipes/view-transitions.css`, `recipes/view-transitions.js`, and `references/transitions.md`

## Loader with real progress

- **Job:** Show the concept in the first second, show honest progress while the first content loads, then hand off to the first scene.
- **Fits concepts like:** every site with an intro.
- **Cost:** Low to medium.
- **Options:** `el`, `tasks`, `minMs`, `maxMs`, `onProgress`, `onExit`, `statusEl`, `storageKey`, and `target`. A button with `[data-loader-skip]` inside `el` skips the wait. `maxMs` caps the wait for tasks and the minimum hold, so a slow network cannot hold the visitor longer. `onExit` can add at most 1.2 seconds, because the recipe caps it at 1200 ms.
- **Reduced motion:** No minimum hold (`minMs` is 0), so the loader ends when the tasks settle or at `maxMs`. `onExit` is skipped. The intro ships with `hidden` in the markup, so a visitor without JS never sees it. `runLoader` removes `hidden` when it starts and sets it again when it finishes: all tasks settled, `maxMs` reached, or the visitor skipped.
- **Skip:** Ends the wait at once, including during the minimum hold and the exit animation. When the intro hides with focus inside it (for example on the skip button), focus moves to `target`. If `target` is not focusable, the recipe adds `tabindex="-1"` to it.
- **Touch/mobile:** Same.
- **Avoid when:** The loader waits for the whole site, or it has no exit when a load fails.
- **Recipe:** `recipes/loader.js`

## Text scramble and counter

- **Job:** Change characters or numbers in a controlled way, to show a state change or a value.
- **Fits concepts like:** technical, glitch, data, precise.
- **Cost:** Low.
- **Reduced motion:** Show the final text.
- **Touch/mobile:** Same.
- **Avoid when:** Long text. It hurts reading. Use it on labels and short values.
- **Recipe:** None. Use GSAP's ScrambleTextPlugin, or a small custom loop.

Keep the final text available to screen readers, either as an `aria-label` or as visually hidden text. Use `font-variant-numeric: tabular-nums` on counters so the digits don't shift.

## Variable-font axis animation

- **Job:** Change weight, or another axis, as the visitor moves through a moment. This shifts the tone without moving the layout.
- **Fits concepts like:** typographic, editorial, expressive.
- **Cost:** Low to medium. It needs a variable font whose license covers the use.
- **Reduced motion:** Set the final value.
- **Touch/mobile:** Same.
- **Avoid when:** The axis changes the width of wrapping text. Animate weight, not width, because width changes reflow the lines.
- **Recipe:** None.

## Sound

- **Job:** Add a layer of feedback or atmosphere that matches the motifs.
- **Fits concepts like:** immersive, sensory, music, product.
- **Cost:** Low to medium. Audio adds weight, so compress it.
- **Reduced motion:** Sound is not a motion setting. Do not tie it to reduced motion. It gets its own control.
- **Touch/mobile:** Mobile browsers need a user gesture before audio can start.
- **Avoid when:** The site may be used in public or at work, and there is no obvious way to stop the sound.
- **Recipe:** None. Use Web Audio or Howler. Start audio only after a user gesture. Provide a visible mute toggle with `aria-pressed`, off by default.

## 3D scene

- **Job:** Show what flat layout can't: depth, a physical object, or a space to move through.
- **Fits concepts like:** objects, places, products, a concept object.
- **Cost:** High. Set budgets early, use one renderer, compress models, and pause off-screen rendering. See `references/3d.md`.
- **Reduced motion:** A still render, or a still frame of the scene.
- **Touch/mobile:** Replace hover-driven control with drag or tap. Test frame rate on a real phone.
- **Avoid when:** The scene doesn't carry a story beat. Don't add 3D to decorate a hero.
- **Recipe:** None. See `references/3d.md`.

## Implementation notes

- **SplitText.** Import from `gsap/SplitText`. All GSAP plugins are free as of GSAP 3.13. Use the `SplitText.create` form, for example:

  ```js
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, { yPercent: 100, duration: 1, ease: "expo.out", stagger: 0.08 });
    },
  });
  ```

  Do not put `text-wrap: balance` on split text. It interferes with line measurement.
- **Clip reveals.** Animate `clip-path: inset()`. It is paint-heavy, so keep few on screen at once.
- **Hover image.** Use only for `(hover: hover) and (pointer: fine)`. Preload the images. Set `pointer-events: none` on the preview.
- **Skew.** Clamp to about plus or minus 8 degrees, as in the snippet above. Apply it to wrappers.
- **Marquee.** The duplicate group is `aria-hidden="true"` and `inert`, so its copies are not read twice or focused. Hover on the track pauses the motion. Focus pauses it only when the track contains focusable items. Keyboard users use the pause/play button, which stays available (WCAG 2.2.2).
- **Grain.** Rasterize the noise once into a small tile. Never use a live full-screen SVG filter.
- **Scroll-driven CSS.** Wrap in `@supports`. Content is visible by default, and the animation applies only when supported.
- **Lenis.** Use the `lenis` package. The older `@studio-freight/lenis` package is deprecated.
