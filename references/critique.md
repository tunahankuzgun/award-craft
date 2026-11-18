# Screenshot Critique Loop

Judge the page by looking at it, not by reading the code. Visual problems hide in code, and code reviews miss what a visitor sees.

## The loop

1. Build a version that runs locally.
2. Capture screenshots. Run these from the project root, so Playwright resolves from the project:

   ```
   npm i -D playwright
   npx playwright install chromium        # add firefox webkit to check other engines
   node <skill-dir>/scripts/screenshot.mjs <url> [outDir=./screenshots] [--wait=4500] [--browser=chromium|firefox|webkit]
   ```

   `<skill-dir>` is this skill's folder. Or copy the script into the project and run the same command from there, with `./scripts/` in place of `<skill-dir>/scripts/`. Use `--browser=webkit` and `--browser=firefox` to check Safari-like and Firefox rendering.
3. The script writes captures at 1440x900 and 390x844, reduced-motion captures, and scroll-position captures. The WebGL-off variant is Chromium-only. Errors go into `report.json`: `consoleErrors`, `consoleWarnings`, and `pageErrors` for each variant under `variants`, and a top-level `warnings` array.
4. Open and look at every image. Do not skip the mobile captures or the WebGL-off captures.
5. Score the page against the rubric below.
6. Fix the top three problems. Keep each fix small and specific.
7. Repeat.

Do at least two rounds. Stop when no category scores below 7 and the last round's fixes were small, such as timing, spacing, or copy. If the last round still needed large changes, run another round.

## Rubric

Weights follow the Awwwards structure: Design 40%, Usability 30%, Creativity 20%, Content 10%. Score each category from 1 to 10. These are self-assessments. This skill is not affiliated with or endorsed by Awwwards.

Weighted total = 0.4 x Design + 0.3 x Usability + 0.2 x Creativity + 0.1 x Content.

Approximate figures, which may have changed: the Awwwards Honorable Mention starts around 6.5, and the Developer Award goes to Site of the Day winners that score above about 7 on developer criteria. Check the current Awwwards rules before quoting them.

### Design (40%)

- Is there one clear focal point on each screen?
- Does the type have a voice, with scale contrast that matches the concept?
- Does the spacing make a rhythm, with rest areas after intense moments?
- Is the palette disciplined: one ground, one accent, used sparingly?
- Does each section reuse a motif?
- Do the images and 3D look made for this site, not taken from a template?

### Usability (30%)

- Can a first-time visitor find the main action within five seconds?
- Does it work at 390px wide, with no horizontal scroll and readable text?
- Does it work with reduced motion on, and still tell the story?
- Does it work with WebGL off, with the same content?
- Does it work by keyboard alone, with a visible focus state on every control?
- Does scrolling behave natively, with keyboard paging and the scrollbar working?

### Creativity (20%)

- Is there a signature moment someone would describe to a friend?
- Is that moment tied to the concept, and not added as an effect?
- Would a stranger guess the template from one screen? If yes, run `references/anti-generic.md`.
- Does the site do one thing with confidence, rather than five things lightly?

### Content (10%)

- Is the copy specific? Could any company say it?
- Does the site still make sense with motion off?
- Is every placeholder marked, with no lorem ipsum and no invented proof?
- Do headings and labels say what the content is?

## Developer-quality pass

Run this after the design scores:

- **Semantics.** Landmarks, one `h1`, logical heading order, real links and real buttons.
- **Console and page errors.** In `report.json`, each variant under `variants` has `consoleErrors` (console errors), `consoleWarnings` (console warnings), and `pageErrors` (uncaught page exceptions). Resolve every entry in each. The top-level `warnings` array holds notices from the run, so read it too. The top-level `skipped` array lists variants that did not run, such as the WebGL-off capture on Firefox or WebKit, with the reason.
- **Performance.** Frame rate on a mid-range phone, first-load weight, and the pixel density cap.
- **Accessibility.** Contrast, focus, alt text, reduced motion, and 200% text size.
- **Responsive.** 390px and 1440px both work, and nothing overflows.

## Quick tests

- **One-screenshot test.** Look at one screen. Can you tell what the site is about and which concept it belongs to?
- **Squint test.** Blur the image. Is there one clear shape or mass that holds the eye?
- **Template test.** Is the layout a known template? Run the checks in `references/anti-generic.md`.
- **Mobile first-screen test.** At 390px, is the main action visible without scrolling?

## Logging

Record each round in DESIGN.md section 12. Example:

| Round | Scores (Design / Usability / Creativity / Content) | Top fixes | Done |
|---|---|---|---|
| 1 | 6 / 5 / 7 / 6 | Hero focal point cropped too tight; mobile nav tap targets too small; loader ran 4 s | 3 of 3 |

## Be honest

- Scores are self-assessments. Write the evidence next to each score: which screenshot, which element, and what is wrong.
- Describe what you see, not how the page should feel. "The headline is cut off at 390px" is evidence. "It feels off" is not.
- Do not raise a score to end the loop. If the evidence does not support the higher score, keep the lower one.
