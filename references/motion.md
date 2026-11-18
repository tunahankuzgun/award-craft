# Motion

Motion is a way of communicating. Each animation needs a job. If it has no job, cut it.

## Jobs motion can do

- **Direct attention:** show the visitor where to look next.
- **Show a relationship:** make it clear which parts belong together, or how one state becomes another.
- **Set pace:** slow the visitor down for a moment, or speed them through a transition.
- **Reward an action:** confirm that a click, hover, or scroll did something.
- **Express character:** give the site a personality, such as calm, playful, or precise.

If an animation can't name one of these jobs, remove it.

## Timing and easing

- Micro-interactions (hover, press, focus): about 0.15 to 0.3 seconds.
- Reveals and entrances: about 0.8 to 1.2 seconds.
- Stagger between items in a group: about 0.05 to 0.12 seconds per item.
- Long, scroll-tied sequences: as long as the story needs, with clear pauses.
- Entering elements usually use ease-out. Leaving elements use ease-in. Elements that move across the screen usually use ease-in-out.
- Give each important moment its own easing curve. Name it in the code, such as `intro-settle` or `reveal-slow`, so the timing has a reason and can be changed as one unit.

### Easing and timing vocabulary

These are starting points. Tune them by eye, and on a real device.

| Token | CSS value | GSAP name | Starting duration | Used for |
|---|---|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | `expo.out` | 0.8 to 1.2s | Reveals, entrances, intro handoff |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | `power3.out` (close) | 0.15 to 0.3s for micro, 0.6 to 1s for others | Hover and focus, secondary entrances |
| `--ease-in-out-quint` | `cubic-bezier(0.83, 0, 0.17, 1)` | `power4.inOut` (close) | 0.8 to 1.2s | Moves across the screen, chapter changes |

- Don't use back or elastic eases on masked text. The overshoot is clipped by the mask and looks broken.
- Define these as tokens in `recipes/tokens.css`, and use the token name in code, not the raw curve.

## Frame-rate-independent smoothing

Per-frame lerps (`x += (target - x) * 0.1`) run at different speeds on 60Hz and 120Hz screens. Use a damping step based on elapsed time instead:

```js
// dt in seconds, clamped so a tab switch doesn't jump the value
const k = 1 - Math.exp(-lambda * dt);
x += (target - x) * k;
```

Starting values for `lambda`, which is the speed in 1/seconds:

- 3 to 6: cinematic, slow settle
- 8 to 12: snappy, responsive
- 15 and up: near-instant

See `recipes/damp.js` for the full helper.

## What to animate

- Animate `transform` and `opacity` where possible. They are the cheapest properties for the browser.
- Avoid animating layout properties like width, height, top, and left for anything that runs continuously.
- Use `will-change` sparingly, only on elements that are actively animating.

## GSAP and free plugins

Since GSAP 3.13 (April 2025), all plugins are free, including SplitText, ScrollSmoother, and MorphSVG. Import them the usual way:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

## Scroll-driven motion

- Tie motion to scroll position when the scroll is part of the story. This is called scrubbing. It makes the visitor feel in control.
- Use `IntersectionObserver` or GSAP ScrollTrigger to trigger reveals. Trigger once for simple reveals, and scrub only when the motion should follow the scroll.
- Map scroll progress to a timeline, then give each timeline segment a story beat.
- Smooth the input. Raw scroll values jump, and smoothing makes motion feel intentional. Use frame-rate-independent smoothing (see above) so the motion behaves the same at 60Hz and 120Hz.
- Let the page settle. When the user stops scrolling, snap or ease to the nearest meaningful point, but only if it doesn't fight the visitor.

### CSS scroll-driven animations

`animation-timeline: scroll()` and `view()` with `animation-range` run on the compositor without JavaScript. They have been Baseline newly available since October 2026 (Chrome and Edge 115, Safari 26, Firefox 159). Wrap them in a feature query, so that content stays visible without support:

```css
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal-up linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 35%;
  }
}
```

Declare `animation-timeline` after the `animation` shorthand. The shorthand resets `animation-timeline` to `auto`, so if it comes first the reveal silently stops working.

See `recipes/scroll-reveals.css` for the full set.

## Smooth scrolling

- Smooth scrolling changes how the page feels. Use it when it supports the concept, and make sure it doesn't break native behavior.
- Options: CSS `scroll-behavior: smooth` for simple cases, or a library such as Lenis for inertia-based scrolling.
- Keep native scroll for text-heavy pages, search, and accessibility tools. Don't hijack scroll on forms or long reading areas.
- Make sure keyboard scrolling, page-up and page-down, and the scrollbar still work.
- Don't block the visitor from scrolling back up to content they missed.

Lenis facts to build on (see `recipes/lenis-gsap.js` for a working setup):

- Package: `lenis`. `autoRaf` is `false` by default, so you drive it yourself, for example from the GSAP ticker.
- `respectReducedMotion` defaults to `true`. Smoothing turns off when the visitor prefers reduced motion. Keep it on.
- Set `anchors: true` so in-page anchor links scroll smoothly too.
- Add `data-lenis-prevent` to nested scroll areas, such as menus, code blocks, and long text panels.
- Safari caps smooth scrolling at 60fps. Test the feel there, not only on Chromium.
- Smooth scrolling does not work over iframes, such as embedded maps and video players.
- CSS scroll-snap is not supported by Lenis. Use the `lenis/snap` module for snap points.

## Reduced motion

Every sequence needs a reduced-motion version.

- Read `prefers-reduced-motion: reduce`. In GSAP, use `gsap.matchMedia()` so the full timeline is only built when motion is allowed:

```js
const mm = gsap.matchMedia();
mm.add({
  reduce: "(prefers-reduced-motion: reduce)",
  ok: "(prefers-reduced-motion: no-preference)",
}, (ctx) => {
  const { reduce } = ctx.conditions;
  if (reduce) return; // set final states here, with no travel
  // build the full timeline here
});
```

- Keep the meaning, drop the movement. A slide-in can become a fade. A camera fly-through can become a cut between stills. A parallax layer can stay still.
- Remove looping, flashing, and spinning animations completely.
- Offer a visitor-facing setting that can override the system default, with a clear label and a way to change it back. See `recipes/motion-preference.js`.

## Loops, marquees, and auto-moving content

- Content that moves or updates by itself for more than 5 seconds needs a way to pause, stop, or hide it (WCAG 2.2.2). Provide a visible pause control.
- `recipes/marquee.js` pauses when the visitor presses its pause control, while the pointer or focus is inside the strip, and while the strip is off-screen (it uses an `IntersectionObserver`). Its button shows the state in the visible label: "Pause marquee" while moving, "Play marquee" while paused. Because the label carries the state, the button has no `aria-pressed`. Loops built on `createTicker` from `recipes/damp.js` pause when the tab is hidden.
- The jitter in `recipes/grain.css` is finite: four 1-second cycles, then it rests on a static frame.
- No content may flash more than three times per second (WCAG 2.3.1).

## Motion and performance

- Pause off-screen animations with `IntersectionObserver`. `recipes/dom-gl-sync.js` does this for its images: it measures and draws only the images near the viewport, and its loop stops when none are near. Any other loop you add must do the same.
- Pause when the tab is hidden. `createTicker` in `recipes/damp.js` already does this through `document.hidden`. A loop written without it must check `document.visibilityState` itself.
- Keep the main thread free. Heavy work during an animation causes jank.
- Test on a mid-range phone. Smooth on a laptop doesn't mean smooth everywhere.

## Generic motion to avoid

Every element that fades up on scroll is the most common generic tell. The same motion on every heading, card, and image says nothing about the concept. Let each element's motion come from its job and its motif. See `references/anti-generic.md`.

## Motion checks

- Can you say the job of each animation in one sentence?
- Does the motion repeat a motif from the motif ledger?
- Does each animation use a named easing token, not a one-off curve?
- Does the pace change with the story, or is everything the same speed?
- Does the reduced-motion version still tell the story?
- Is there a moment of stillness after the big ones?
