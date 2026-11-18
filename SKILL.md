---
name: award-craft
description: Use when designing or building a website that should feel award-level, distinctive, cinematic, or premium. Covers brand sites, portfolios, landing pages, interactive stories, hero sections, scroll animations, GSAP, Lenis, WebGL or Three.js scenes, page transitions, and any request to make a site feel immersive or high-end. A purpose-first process with distilled craft patterns and code recipes. Not a component library, and it does not copy existing sites.
---

# Award Craft

Build pages where every element has a reason, and the reasons add up to one experience. The output is a finished, working page in code, backed by a written design document. This skill teaches taste as well as discipline: how to choose one concept, carry it through every section, and know when to stop.

## Start here

1. **Get the brief in one round.** Ask one set of questions that covers the visitor, the action they should take, the feeling, the purpose, the content and assets available, and the constraints (deadline, budget, languages, accessibility needs). Do not ask in several rounds.
2. **Put the quality question in the same round.** If the user names sites they like, add one question to that round: which qualities they like (mood, pace, boldness, density, type, motion feel). It is part of the single set in step 1, not a second round. Write the answers down as words for the brief. Do not study, reproduce, or imitate that site's layout, code, assets, or signature effect. The patterns in this skill are the reference.
3. **Do not ask for the stack yet.** It is chosen at step 8, after the concept, because 3D, transitions, and page count decide it.

## The process

Work through these steps in order. Do not skip ahead to visuals. Write the output of each step into `DESIGN.md`, starting from `templates/DESIGN.md`.

### 1. Purpose

Write one sentence: what the site is for and what should change for the visitor after they leave. Example form: "After this page, a visitor should believe the studio builds calm, precise software and want to book a call."

If the sentence needs "and" three times, it is three sites. Split it or pick one.

### 2. Concept

Write a concept statement of two to four sentences. It names a mood, a material or texture, and a point of view. It is not a feature list.

Then name the **concept object or system**: the one thing the whole site is built from. A brand idea becomes a physical object, a material, or a rule of behavior. Every later decision is tested against it. See `references/patterns.md`.

Test: could a designer build the whole site from the statement and the object alone? If not, it is too vague.

### 3. Motifs

Pick two or three motifs that carry the concept across the site. A motif is a repeated shape, color, texture, line style, sound, type of motion, or way of revealing content.

Write them in a motif ledger:

| Motif | Represents | Appears in |
|---|---|---|
| Thin horizon line | Patience, distance | Hero, section dividers, loader, footer |

Every section reuses at least one motif. A section that reuses none is a candidate for cutting or rethinking.

### 4. Story beats and one signature moment

Map the visitor's journey as beats: first impression, first interaction, main reveal, proof, invitation, and exit. Each beat gets one job. Motion, 3D, and sound are assigned to beats, not sprinkled everywhere.

Pick one signature moment. Add a second only if the story clearly needs it, and never more than two. Write each one with:

- what it is, and why it fits the concept
- its cost in performance and build time
- its reduced-motion version
- its mobile version, which is a designed touch equivalent, not a removal

Costs and fallbacks for each technique are in `references/techniques.md`. Forms a signature moment can take are in `references/patterns.md`.

### 5. Elements, each with a reason

For every element on the page, write one line: what it is and why it exists. Cover each of these explicitly:

- **Hero**: what the first screen shows, and why it could only belong to this site. A hero that would fit any brand is not finished. First-screen options are in `references/patterns.md`.
- **Header and navigation**: what the visitor needs to find, and how it fits the concept. Menus and page changes: `references/transitions.md`.
- **Typography**: the typeface choice and scale, with a reason tied to the concept. See `references/typography.md`.
- **Color**: the palette and its roles, with a reason. See `references/color.md`.
- **Spacing**: gaps and empty areas, and what pace they set. See `references/spacing.md`.
- **Loader**: what the first seconds communicate. See `references/loaders.md`.
- **Motion**: each animation's job: direct attention, show a relationship, set pace, reward an action. See `references/motion.md`.
- **3D**: what it shows that flat layout can't, and what happens without it. See `references/3d.md`.
- **Illustration and visuals**: what each image says about the concept. See `references/illustration.md`.
- **Copy and voice**: headlines, body, and microcopy. See `references/copy.md`.
- **Details**: focus style, selection color, cursor states, favicon, page title, 404 page, meta and Open Graph image, and the sound toggle if there is sound. See `references/patterns.md`.

If an element can't name its reason, remove it. Decoration without a reason makes a page feel busy, not rich.

### 6. Whole-site coherence and anti-generic pass

Before building, check the whole:

- Does someone who sees only one section still know what the site is about?
- Do the motifs appear in every section?
- Does the pace change on purpose, with rest areas between intense moments?
- Could you swap the hero for another section and still feel the same site? If yes, the hero isn't specific enough.
- Does any element contradict the concept? Cut it or change it.

Then run the template check in `references/anti-generic.md`. Record the results in DESIGN.md section 11. Finish with a one-paragraph summary of the whole site. If the summary can't explain how the parts connect, go back to step 3.

### 7. Write DESIGN.md and the tokens

Fill in `DESIGN.md` in the project from `templates/DESIGN.md`. Turn its tokens into CSS custom properties, starting from `recipes/tokens.css`. Adapt the values to the concept. Do not keep the starter values.

When the work is for someone else, show the user the concept, the motif ledger, and the signature moment before the full build. Wait for their response before building.

### 8. Stack

Recommend one stack, say why, and confirm it with the user. Defaults:

- **Single-page experience**: plain Vite with vanilla JS or TypeScript, GSAP, and Lenis. Add three.js if the site has 3D.
- **Multi-page content site**: Astro, with `<ClientRouter />` for page transitions.
- **Existing framework**: use what the project already uses. With React, use React Three Fiber only if the project needs 3D.

Record the choice and the reason in DESIGN.md section 9.

### 9. Build

Build in this order: structure and content in real HTML, then layout and type, then color, then motion, then 3D, then loader and fine detail. Keep the page working and readable at every step. Motion and 3D are layers on top of content, not the content itself.

Use files in `recipes/` as starting points. Adapt their values from DESIGN.md. Never paste a recipe unchanged. Write each feature's fallback while you build it, not at the end. Record the fallbacks in DESIGN.md section 10.

### 10. Critique loop

Run the page locally, then capture it. From the project root, run:

```
npm i -D playwright
npx playwright install chromium        # add firefox webkit to check other engines
node <skill-dir>/scripts/screenshot.mjs <url> [outDir=./screenshots] [--wait=4500] [--browser=chromium|firefox|webkit]
```

`<skill-dir>` is this skill's folder. Run from the project root so Playwright resolves from the project, or copy the script into the project. Look at every image. Score the page, fix the top three problems, and repeat. Do at least two rounds, and log each one in DESIGN.md section 12. The method and rubric are in `references/critique.md`.

### 11. Verify

Work through `references/checklist.md` before calling the page done. Test in a real browser at desktop and phone sizes, with reduced motion turned on and WebGL turned off.

## What to deliver

When the build is done, hand over:

- The working site in code, runnable locally with the install and run steps written down.
- A filled-in `DESIGN.md` in the project, including the critique log.
- The screenshot set from the last critique round, or the paths where it is saved.
- A short list of the choices you made that the user did not specify, such as the stack, the signature moment, or a placeholder, so they can redirect you.
- Any checklist failure that remains, with the reason it stayed.

## Non-negotiable rules

These apply to every site built with this skill, unless the user explicitly overrides one after hearing the tradeoff.

- **Reduced motion.** Every sequence has a reduced-motion version that keeps the meaning and removes travel, spin, parallax, and loops. Read `prefers-reduced-motion`, and also offer a visitor-facing setting that can override it.
- **Keyboard and screen readers.** Every control works with the keyboard and has a visible focus state. Important text stays as real text in the page, even when 3D draws the visuals around it. No text lives only inside a canvas. No interaction works only with a cursor or only on hover. Every hover has a tap or keyboard equivalent.
- **Native scroll.** Native scrolling, keyboard scrolling, and the scrollbar keep working. Smooth scroll may change the feel, but it never blocks these. No scroll hijacking.
- **Non-WebGL fallback.** If a 3D scene can't run, the same content and story still reach the visitor, through images, video, or simpler motion. Show a clear message, not a blank screen.
- **No flashing.** No content flashes more than three times per second (WCAG 2.3.1).
- **Auto-moving content.** Any auto-moving content that lasts more than 5 seconds has a pause, stop, or hide control (WCAG 2.2.2).
- **Performance.** Keep the first load small. Defer heavy scenes. Pause off-screen animation and rendering. Cap pixel density. Compress models and textures. Target 60fps on a mid-range phone.
- **Contrast, size, and targets.** Body text meets WCAG AA contrast: 4.5:1 for normal text, 3:1 for large text. Body text is 16px or larger. Small labels and captions may be smaller when contrast is met and the reason is written down. Targets are at least 24 by 24 CSS px (WCAG 2.5.8). Aim for 44 by 44 (WCAG 2.5.5).
- **Focus.** Focus is not hidden behind sticky headers or overlays (WCAG 2.4.11). Aim for the enhanced focus appearance (WCAG 2.4.13, AAA).
- **Original work.** Write the code and make the assets. Licensed fonts and third-party 3D models need a license the user holds. Do not copy another site's markup, styles, scripts, or images.

## When to load the references

- Process and design document: `templates/DESIGN.md`, and `examples/worked-brief.md` for a filled-in example
- Concept, concept object, and patterns: `references/patterns.md`
- Choosing techniques, costs, and fallbacks: `references/techniques.md`
- Generic defaults to avoid: `references/anti-generic.md`
- Copy, voice, and microcopy: `references/copy.md`
- Page transitions and full-screen menus: `references/transitions.md`
- Screenshot critique, rubric, and logging: `references/critique.md`
- Typography and font loading: `references/typography.md`
- Palette and contrast: `references/color.md`
- Gaps, rhythm, and empty space: `references/spacing.md`
- Animation, scroll, and smooth scrolling: `references/motion.md`
- 3D scenes, WebGL, and interactive models: `references/3d.md`
- Custom visuals and SVG illustration: `references/illustration.md`
- Loaders and first impressions: `references/loaders.md`
- Final check before delivery: `references/checklist.md`
- Starter code: `recipes/README.md` lists the recipes. Each recipe is a starting point, not a drop-in file.
- Screenshot capture for critique: `node <skill-dir>/scripts/screenshot.mjs <url> [outDir=./screenshots] [--wait=4500] [--browser=chromium|firefox|webkit]` (setup in `references/critique.md`)

## Definition of done

- `DESIGN.md` exists in the project and is filled in, with every section and the critique log.
- The signature moment is built, with its reduced-motion version, its touch version, and its fallbacks.
- The anti-generic check has passed, and its results are recorded in DESIGN.md.
- At least two critique rounds are logged.
- `references/checklist.md` passes, with each failure explained.
- The page works with motion off, with WebGL off, by keyboard alone, and at 390px wide.
- When the work is for someone else, the user has seen the concept, motif ledger, and signature moment before the full build.
