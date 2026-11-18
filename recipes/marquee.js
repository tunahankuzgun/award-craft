/*
 * marquee.js: JS-driven marquee with pause control and optional scroll boost.
 *
 * Job in a design: the strip from marquee.css, moving only when JS runs and motion
 * is allowed. It responds to scroll velocity and always offers a pause control.
 *
 * HTML usage (matches marquee.css). The region is focusable and labelled, and the
 * toggle ships hidden, so the no-JS version is a static, scrollable line. The
 * markup clone is a placeholder: JS removes it and creates as many copies as the
 * width needs.
 *   <section class="marquee" tabindex="0" role="region" aria-label="Selected clients">
 *     <div class="marquee__track">
 *       <ul class="marquee__group"><li>Alpha</li><li>Beta</li></ul>
 *     </div>
 *     <button class="marquee__toggle" type="button" data-marquee-toggle hidden>Pause marquee</button>
 *   </section>
 *
 *   <script type="module">
 *     import { initMarquee } from "./recipes/marquee.js";
 *     const destroy = initMarquee(document.querySelector(".marquee"), {
 *       speed: 60,                          // px per second
 *       getVelocity: () => scrollVelocity,  // optional, px per second
 *     });
 *   </script>
 *
 * What initMarquee does:
 *   - Motion allowed: sets data-animated, adds enough copies of the group that the
 *     track always covers the region plus one group (no empty gap, even with short
 *     content or a wide screen), shows the toggle, and moves the track with a
 *     ticker. The toggle pauses and resumes it.
 *   - Reduced motion (system or visitor): nothing moves. The track is reset, the
 *     copies are removed, the toggle stays hidden, and the region scrolls by hand.
 *   - Off screen: the ticker stops (IntersectionObserver) and restarts when the
 *     strip comes back into view. The user's own pause still applies.
 *   - Hover on the moving track pauses it, so text can be read. Focus pauses it
 *     only when a focusable item (for example a link) is inside the track.
 *     Focusing the region or the toggle does not pause it.
 *   - Hidden tab: the ticker pauses itself (see damp.js).
 *
 * Keyboard and scrolling: in the animated state the region has overflow hidden, so
 * it is not keyboard-scrollable. Keyboard users pause with the toggle. In the
 * static state (no JS, reduced motion) the region is focusable and scrolls.
 *
 * Pause pattern: the toggle's VISIBLE label carries the state ("Pause marquee"
 * while moving, "Play marquee" while paused). Because the label changes, the
 * toggle has no aria-pressed.
 *
 * Adapt: change speed, the boost cap (600 px/s), or the damp lambda (4 is calm).
 *
 * Accessibility: WCAG 2.2.2 is met by the visible pause control. Copies are
 * aria-hidden and inert, so nothing is repeated or focusable twice.
 *
 * DESIGN.md tokens: none directly; spacing and type come from marquee.css.
 */

import { createTicker, damp, clamp } from "./damp.js";
import { isReducedMotion, onMotionPreferenceChange } from "./motion-preference.js";

export function initMarquee(root, { speed = 60, getVelocity } = {}) {
  const track = root.querySelector(".marquee__track");
  const group = root.querySelector(".marquee__group");
  const toggle = root.querySelector("[data-marquee-toggle]");
  if (!track || !group) throw new Error("initMarquee: expected .marquee__track and .marquee__group");

  // The markup clone is a no-JS placeholder. JS owns all copies from here on.
  root.querySelector("[data-marquee-clone]")?.remove();

  const toggleLabel = toggle?.textContent ?? "";
  const copies = []; // extra groups created by JS, all aria-hidden and inert
  let width = 0; // one group's width in px
  let pos = 0; // distance travelled in px
  let boost = 0; // extra px/s from scroll velocity, eased by damp()
  let userPaused = false;
  let hovering = false;
  let focused = false;
  let onScreen = true;
  let reduced = isReducedMotion();
  let lastAnimating = null;

  root.setAttribute("data-js", "");

  const setCopies = (n) => {
    while (copies.length < n) {
      const node = group.cloneNode(true);
      node.setAttribute("data-marquee-clone", "");
      node.setAttribute("aria-hidden", "true");
      node.setAttribute("inert", "");
      track.append(node);
      copies.push(node);
    }
    while (copies.length > n) copies.pop().remove();
  };

  // Measure the group, then make the track cover the region plus one group.
  // Total groups = 1 + copies, and (1 + copies) * width >= region + width,
  // so copies = ceil(region / width).
  const layout = () => {
    width = group.getBoundingClientRect().width;
    const regionWidth = root.getBoundingClientRect().width;
    const needed = !reduced && width > 0 ? Math.ceil(regionWidth / width) : 0;
    setCopies(needed);
  };

  const ticker = createTicker((dt) => {
    if (width <= 0) return;
    // Scroll boost: a fast scroll adds up to 600 px/s, eased back down.
    const target = getVelocity ? clamp(Math.abs(getVelocity()) * 0.25, 0, 600) : 0;
    boost = damp(boost, target, 4, dt);
    pos += (speed + boost) * dt;
    track.style.transform = `translate3d(${-(pos % width)}px, 0, 0)`;
  });

  const refresh = () => {
    const animating = !reduced;
    if (animating !== lastAnimating) {
      lastAnimating = animating;
      layout();
    }
    const paused = !animating || userPaused || hovering || focused || !onScreen;
    root.toggleAttribute("data-animated", animating);
    root.toggleAttribute("data-paused", paused);
    if (toggle) {
      toggle.hidden = !animating; // initMarquee removes the hidden state when it can animate
      toggle.textContent = userPaused ? "Play marquee" : "Pause marquee";
    }
    if (!animating) track.style.transform = ""; // static line starts at the beginning
    if (paused) ticker.stop();
    else ticker.start();
  };

  // Pause triggers apply to content inside the track only. The toggle and the
  // region sit outside the track, so hovering or focusing them does not pause.
  const isContent = (el) => !!el && track.contains(el);

  const onToggle = () => {
    userPaused = !userPaused;
    refresh();
  };
  const onEnter = () => {
    hovering = true;
    refresh();
  };
  const onLeave = () => {
    hovering = false;
    refresh();
  };
  const onFocusIn = (event) => {
    focused = isContent(event.target);
    refresh();
  };
  const onFocusOut = (event) => {
    focused = isContent(event.relatedTarget);
    refresh();
  };

  track.addEventListener("pointerenter", onEnter);
  track.addEventListener("pointerleave", onLeave);
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  if (toggle) toggle.addEventListener("click", onToggle);

  // Stop the ticker while the strip is off screen; restart when it returns.
  const io =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver((entries) => {
          onScreen = entries[entries.length - 1].isIntersecting;
          refresh();
        })
      : null;
  io?.observe(root);

  const unsubscribe = onMotionPreferenceChange((r) => {
    reduced = r;
    refresh();
  });

  // Re-layout on resize (region or group) and once fonts settle, since text width depends on the font.
  const ro = new ResizeObserver(() => {
    if (!reduced) layout();
  });
  ro.observe(root);
  ro.observe(group);
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    if (!reduced) layout();
  });

  layout();
  refresh();

  return function destroy() {
    ticker.stop();
    io?.disconnect();
    ro.disconnect();
    unsubscribe();
    track.removeEventListener("pointerenter", onEnter);
    track.removeEventListener("pointerleave", onLeave);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    if (toggle) {
      toggle.removeEventListener("click", onToggle);
      toggle.hidden = true;
      toggle.textContent = toggleLabel;
    }
    setCopies(0);
    track.style.transform = "";
    root.removeAttribute("data-js");
    root.removeAttribute("data-animated");
    root.removeAttribute("data-paused");
  };
}
