/*
 * loader.js: an honest intro loader that tracks real progress.
 *
 * Job in a design: the first moment of a site. It shows progress only when it is
 * real (fonts, hero image, video), holds long enough to be read, and never traps
 * the visitor.
 *
 * Contract:
 *   - The intro element ships in the markup with the `hidden` attribute, so
 *     without JS visitors never see it. runLoader() removes `hidden` when it starts.
 *   - When done, runLoader() awaits an optional onExit(el) for the caller's exit
 *     animation, then sets el.hidden = true and data-loader-state="done".
 *     onExit is skipped under reduced motion and on skip. It can add at most
 *     EXIT_MAX_MS (1.2 s) to the wait.
 *   - "Done" means: all tasks settled, OR maxMs elapsed, OR the skip button was
 *     pressed. maxMs caps the wait for tasks (and the minimum hold, which is
 *     also capped at maxMs). The total visitor wait can therefore be maxMs plus
 *     up to 1.2 s if onExit runs.
 *   - Skip works at every stage: during the tasks, during the minimum hold, and
 *     during onExit. It ends the wait at once and bypasses onExit.
 *   - Focus: if focus is inside the intro when it hides (for example on the Skip
 *     button), focus moves to `target` (default: main), so keyboard users are not
 *     left on a hidden element.
 *   - Under reduced motion, minMs is 0: there is no decorative hold. Completion
 *     still waits for the tasks or maxMs. This is the reading of "end as soon as
 *     the first content is ready" used here.
 *   - Return visits (sessionStorage flag set by a previous run) use minMs 0.
 *   - After "Ready" the status is final: late task progress is ignored.
 *   - A throwing onProgress is logged and ignored. It never stops the intro from
 *     hiding, and the final reset (hidden, state, aria-busy) always runs.
 *
 * Usage:
 *   <div id="intro" hidden>
 *     <p data-loader-status aria-live="polite"></p>
 *     <button type="button" data-loader-skip>Skip intro</button>
 *   </div>
 *
 *   const result = await runLoader({
 *     el: document.querySelector("#intro"),
 *     tasks: [document.fonts.ready, imageReady(heroImg), videoReady(heroVideo)],
 *     onProgress: (fraction, label) => (bar.style.transform = `scaleX(${fraction})`),
 *     onExit: (el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400 }).finished,
 *   });
 *   // result: { reduced, short, skipped, timedOut, errors, elapsedMs }
 *
 * Live region: a status element in the initial markup is best, because screen
 * readers announce changes to live regions that already exist. If none is found
 * (or passed as statusEl), runLoader creates one at the start, before any message
 * is written, and writes the first message on the next frame. That message is
 * skipped if a task has already reported progress.
 *
 * Adapt: minMs (how long the intro may be seen), maxMs (the most a slow network
 * can delay it), storageKey (return visits skip the hold).
 *
 * Accessibility: a skip button, a polite status region, aria-busy on the target
 * while loading, focus handed back on hide, and reduced motion in the result.
 *
 * DESIGN.md tokens: none directly; the intro animation is the caller's (onExit).
 */

import { isReducedMotion } from "./motion-preference.js";

const EXIT_MAX_MS = 1200; // onExit cannot add more than this to the wait

export function videoReady(video) {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 2) return resolve(video);
    const done = () => {
      video.removeEventListener("error", fail);
      resolve(video);
    };
    const fail = () => {
      video.removeEventListener("loadeddata", done);
      reject(new Error(`Video failed: ${video.currentSrc || video.src}`));
    };
    video.addEventListener("loadeddata", done, { once: true });
    video.addEventListener("error", fail, { once: true });
    // preload="none" never loads: set preload="auto" in markup.
  });
}

export async function imageReady(img) {
  if (typeof img.decode === "function") {
    try {
      await img.decode();
      return img;
    } catch {
      /* decode can fail for broken images or old engines: checked below */
    }
  }
  if (!img.complete) {
    await new Promise((resolve, reject) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", reject, { once: true });
    }).catch(() => {});
  }
  if (img.naturalWidth === 0) throw new Error(`Image did not load: ${img.currentSrc || img.src}`);
  return img;
}

function readShortFlag(storageKey) {
  try {
    return sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function writeShortFlag(storageKey) {
  try {
    sessionStorage.setItem(storageKey, "1");
  } catch {
    /* storage blocked: the full intro will show next time */
  }
}

function ensureStatus(el) {
  let status = el.querySelector("[data-loader-status]");
  if (!status) {
    status = document.createElement("p");
    status.setAttribute("data-loader-status", "");
    el.append(status);
  }
  if (!status.hasAttribute("aria-live")) status.setAttribute("aria-live", "polite");
  return status;
}

// Runs onExit, but returns early if skip is pressed or onExit takes too long.
async function runExit(onExit, el, skipP) {
  let timer;
  try {
    await Promise.race([
      Promise.resolve().then(() => onExit(el)),
      skipP,
      new Promise((resolve) => {
        timer = setTimeout(resolve, EXIT_MAX_MS);
      }),
    ]);
  } catch (err) {
    console.warn("[loader] onExit failed", err);
  } finally {
    clearTimeout(timer);
  }
}

function focusTargetOnHide(target) {
  try {
    const dest = target ?? document.body;
    if (!dest.hasAttribute("tabindex") && !dest.matches("a[href],button,input,select,textarea,[tabindex]")) {
      dest.setAttribute("tabindex", "-1");
    }
    dest.focus({ preventScroll: true });
  } catch (err) {
    console.warn("[loader] could not move focus", err);
  }
}

export function runLoader({
  el,
  tasks = [],
  minMs = 600,
  maxMs = 3000,
  onProgress,
  onExit,
  statusEl,
  storageKey = "intro-seen",
  target = document.querySelector("main"),
}) {
  const reduced = isReducedMotion();
  const short = readShortFlag(storageKey);
  const effectiveMin = reduced || short ? 0 : minMs;

  // Reveal first, so a live region inside the intro is in the accessibility tree.
  el.hidden = false;
  el.dataset.loaderState = "loading";
  const status = statusEl ?? ensureStatus(el);
  if (statusEl && !statusEl.hasAttribute("aria-live")) statusEl.setAttribute("aria-live", "polite");

  const total = tasks.length;
  let done = 0;
  let settled = false; // true once "Ready" is written: no further progress updates
  const errors = [];
  const start = performance.now();

  // A throwing caller callback is logged and ignored: it must not stop the intro.
  const notify = (fraction, label) => {
    try {
      onProgress?.(fraction, label);
    } catch (err) {
      console.warn("[loader] onProgress failed", err);
    }
  };
  const setStatus = (label) => {
    status.textContent = label;
    notify(total ? done / total : 1, label);
  };

  target?.setAttribute("aria-busy", "true");
  // The first message is written on the next frame, but only if no task has reported yet.
  requestAnimationFrame(() => {
    if (!settled && done === 0) {
      setStatus(total ? `Loading ${total} ${total === 1 ? "item" : "items"}` : "Loading");
    }
  });

  const wrapped = tasks.map((task, index) =>
    Promise.resolve()
      .then(() => (typeof task === "function" ? task() : task))
      .catch((err) => {
        // A failed task counts as done. It must never block the visitor.
        errors.push(err);
        console.warn(`[loader] task ${index} failed`, err);
      })
      .then(() => {
        if (settled) return;
        done += 1;
        setStatus(`Loaded ${done} of ${total}`);
      }),
  );

  // Skip is live from the first frame until the intro is hidden (see finally).
  const skipBtn = el.querySelector("[data-loader-skip]");
  let skipped = false;
  let resolveSkip;
  const skipP = new Promise((resolve) => {
    resolveSkip = resolve;
  });
  const onSkip = () => {
    skipped = true;
    resolveSkip("skip");
  };
  skipBtn?.addEventListener("click", onSkip);

  let cap;
  const capP = new Promise((resolve) => {
    cap = setTimeout(() => resolve("timeout"), maxMs);
  });
  const allP = Promise.all(wrapped).then(() => "tasks");

  return (async () => {
    let reason = "tasks";
    try {
      reason = await Promise.race([allP, capP, skipP]);
      clearTimeout(cap);

      if (!skipped && reason !== "skip") {
        // Minimum hold, but never beyond maxMs in total. Skip ends it at once.
        const limit = Math.min(effectiveMin, maxMs);
        const remaining = limit - (performance.now() - start);
        if (remaining > 0) {
          let holdTimer;
          await Promise.race([
            new Promise((r) => {
              holdTimer = setTimeout(r, remaining);
            }),
            skipP,
          ]);
          clearTimeout(holdTimer);
        }
      }

      settled = true;
      status.textContent = "Ready";
      notify(1, "Ready");

      if (onExit && !reduced && !skipped) await runExit(onExit, el, skipP);
    } finally {
      // Always runs: the visitor must never be left behind an intro that will not hide.
      clearTimeout(cap);
      skipBtn?.removeEventListener("click", onSkip);
      settled = true;
      if (el.contains(document.activeElement)) focusTargetOnHide(target);
      el.hidden = true;
      el.dataset.loaderState = "done";
      target?.setAttribute("aria-busy", "false");
      writeShortFlag(storageKey);
    }

    return {
      reduced,
      short,
      skipped,
      timedOut: reason === "timeout",
      errors,
      elapsedMs: performance.now() - start,
    };
  })();
}
