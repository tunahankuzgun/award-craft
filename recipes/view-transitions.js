/*
 * view-transitions.js: same-document page changes with focus and announcement.
 *
 * Job in a design: a client-side route change (or filter, tab, or detail view)
 * that animates with the View Transitions API, while keeping keyboard and screen
 * reader users oriented.
 *
 * Usage:
 *   import { navigateWithTransition } from "./recipes/view-transitions.js";
 *   navigateWithTransition(() => swapContent(newHtml), {
 *     title: "Projects | Studio",
 *     focusTarget: "#projects-heading", // selector or element; default main h1, then main
 *   });
 *
 * Adapt: updateDom replaces the content. It may be async. The returned promise
 * resolves once the DOM update and focus move are done; the animation can still run.
 * If updateDom throws, the returned promise rejects with that error.
 *
 * Accessibility: no animation under reduced motion, and the same update still runs.
 * Focus moves to the new page heading (tabindex="-1", preventScroll, so the
 * caller decides the scroll position). The new title is announced through a
 * polite live region that is created once, when this module loads.
 *
 * DESIGN.md tokens: animation values come from view-transitions.css.
 */

import { isReducedMotion } from "./motion-preference.js";

let announcer = null;

// Created at load, not on first use: live regions added at the moment of the
// announcement are often not read out.
function createAnnouncer() {
  if (announcer) return;
  announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  // Visually hidden, but still exposed to assistive technology.
  Object.assign(announcer.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  });
  document.body.append(announcer);
}

if (document.body) createAnnouncer();
else document.addEventListener("DOMContentLoaded", createAnnouncer, { once: true });

function announce(message) {
  createAnnouncer();
  if (!announcer.isConnected) document.body.append(announcer);
  announcer.textContent = "";
  // Clear first, then set on the next frame, so a repeated title is announced again.
  requestAnimationFrame(() => {
    announcer.textContent = message;
  });
}

function moveFocus(target) {
  const el =
    (typeof target === "string" ? document.querySelector(target) : target) ??
    document.querySelector("main h1") ??
    document.querySelector("main");
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function navigateWithTransition(updateDom, { focusTarget, title } = {}) {
  const run = async () => {
    await updateDom(); // errors from updateDom reach the caller
    if (title) {
      document.title = title;
      announce(title);
    }
    moveFocus(focusTarget);
  };

  if (typeof document.startViewTransition !== "function" || isReducedMotion()) {
    return run();
  }

  const transition = document.startViewTransition(run);
  // ready and finished reject when a transition is skipped; that is not an error here.
  transition.ready.catch(() => {});
  transition.finished.catch(() => {});
  // updateCallbackDone settles after run(); the animation continues in the background.
  return transition.updateCallbackDone;
}
