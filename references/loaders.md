# Loaders and First Impressions

The loader is the first beat of the story. It's the first thing the visitor experiences, and it sets expectations for everything after. Treat it as a designed moment, not a spinner.

## What the first seconds should do

- Tell the visitor where they are. Use the concept, motifs, and palette.
- Show real progress when it's known. A percentage or a stage name is more honest than an indefinite spinner.
- Hand off smoothly to the first scene. The loader should end where the site begins, not cut off abruptly.
- Stay short. If the page is ready, don't hold the visitor for the loader's full animation. Make the loader's length depend on what's actually loading, with a sensible minimum and maximum.

## The live intro

Prefer an intro that runs as the first scene, not as a separate screen in front of it. The visitor sees the site begin while the rest loads.

- Wait only for the first real content: fonts ready (`document.fonts.ready`), the first image decoded (`img.decode()`), or the hero video at `readyState >= 2` (`loadeddata`). Don't wait for the whole site.
- Set a minimum duration of about 0.6 seconds, so the intro doesn't flicker when content is already cached. This is a starting point, and `recipes/loader.js` uses `minMs = 600` by default.
- Reduced motion has no minimum hold. The intro ends when its tasks finish, or at `maxMs`, whichever comes first, so no visitor waits through an animation they turned off.
- Set a maximum wait of about 3 seconds (`maxMs = 3000` in the recipe). It caps the wait for tasks. Once the tasks finish, or the cap passes, the minimum hold runs, and it is capped at `maxMs` too. An `onExit` animation can add at most 1.2 seconds after that.
- Return visits get a shorter version of the same beat. The recipe drops the minimum to zero for a return visit, tracked with `sessionStorage`. See below.

See `recipes/loader.js` for a working version with these waits.

## Markup and state contract

- The intro element ships with the `hidden` attribute. A visitor without JavaScript never sees an intro that can't run.
- The recipes rely on `hidden`. `recipes/tokens.css` sets `[hidden] { display: none !important; }`, so an author `display` rule cannot reveal the intro. If the intro needs a layout `display`, put it on an inner wrapper, not on the element that carries `hidden`.
- `runLoader` removes `hidden` when it starts. When the intro is done, it awaits an optional `onExit(el)` for an exit animation, then sets `hidden` again and `data-loader-state="done"`. The page is revealed at that moment.
- "Done" means every task has settled, or `maxMs` has passed, or the skip control was pressed. `onExit` can add at most 1.2 seconds after that, and it is skipped under reduced motion and on skip.
- Skip ends the intro at once at any point: while the tasks load, during the minimum hold, and during `onExit`, which is cut short. The skip listener stays attached until the intro hides, so a press at any of those points takes effect.
- Focus: if focus is inside the intro when it hides, `runLoader` moves it to `target` before hiding the intro. The default target is `main`, or `document.body` when there is no `main`. If the target can't take focus, `runLoader` adds `tabindex="-1"` to it. The focus call uses `preventScroll`, so the page does not jump.
- Once "Ready" is written, the status is final. Late progress updates are ignored.
- Reduced motion has no minimum hold (see the bullet above). Completion still waits for the tasks, or for `maxMs`, whichever comes first.
- Put the status live region in the initial markup: `<p data-loader-status aria-live="polite"></p>`. Screen readers announce changes to regions that already exist. If the region lives elsewhere, pass it as `statusEl`. If neither is present, `runLoader` creates one before the first message and writes that message on the next frame.
- Option names, exactly: `el`, `tasks`, `minMs`, `maxMs`, `onProgress`, `onExit`, `statusEl`, `storageKey`, `target`. The skip control is found with `[data-loader-skip]`. The result reports `reduced`, `short`, `skipped`, `timedOut`, `errors`, and `elapsedMs`.

## Ways to build a loader

- **Counter:** a number that counts up in the site's type, with a short closing motion. Good for sites where progress is part of the story.
- **Motif reveal:** the loader draws one of the site's motifs, such as a line or shape, and completes it as the site appears.
- **Text sequence:** a short line that appears and resolves, using the concept's voice.
- **Scene assembly:** pieces of the first scene arrive and settle into place.

Pick one based on the concept. Don't combine them unless the combination says something.

## Counters and scrambled text

- Use `font-variant-numeric: tabular-nums` on counters, so digits don't shift width as they change.
- For a scramble effect, put the final text in `aria-label` on the element, and mark the animated characters `aria-hidden="true"`. Screen readers then announce the final text once, not each random character.

## Technical notes

- Load the loader's assets first, and keep them small. A loader that takes time to load defeats its purpose.
- Track real progress using the asset loading events of the framework or loader you use. If progress can't be measured, show a clear stage message instead of a fake percentage.
- Show the loader even on fast connections, but keep it short enough that it doesn't feel like a delay.
- If the loader fails, move on. Never hold the visitor on a loader that can't finish. Show the content with a clear message if something important failed.

## Repeat visits

- On a return visit, shorten or skip the loader. Store that in `sessionStorage` or a similar mechanism, and give the visitor the option to see it again if the design relies on it.
- Keep the first-visit experience in the story. Repeat visits can start with a shorter version of the same beat.

## Accessibility

- The loader must announce its state to assistive technology. Use an `aria-live` region for stage messages, and set `aria-busy` on the region that's loading.
- Reduced-motion users get a static or minimal loader. Show the final frame and keep the progress information. Don't count or travel.
- Don't block keyboard access to the page while the loader plays, unless the content can't be used yet.
- Give the loader a skip control from the first frame (`data-loader-skip` in `recipes/loader.js`). It ends the intro at once at any point until the intro hides. See the skip and focus bullets in the contract section.

## Checks

- Does the loader show the concept in the first second?
- Does it end where the first scene begins?
- Does it wait only for first real content, within a minimum and a maximum?
- What happens on a slow connection and a failed load?
- Does a return visitor get a shorter version?
- Does it work with reduced motion and screen readers?
- Does the intro ship `hidden`, and does reduced motion skip the minimum hold?
