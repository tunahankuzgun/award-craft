# Final Checklist

Use this before calling a site done. Mark each item as passed, failed with a reason, or not applicable with a reason.

## Purpose and concept

- [ ] The purpose sentence is written, and the site's content matches it.
- [ ] The concept statement is written, and every section traces back to it.
- [ ] Someone who sees only one section can still tell what the site is about.
- [ ] `DESIGN.md` is written, using `templates/DESIGN.md`, and matches the built site.
- [ ] The signature moment is built, with its reduced-motion and mobile versions.

## Motifs and coherence

- [ ] The motif ledger lists two or three motifs, with where each appears.
- [ ] Every section reuses at least one motif.
- [ ] The pace changes with the story, with rest areas between intense moments.
- [ ] Nothing contradicts the concept.
- [ ] Each element has a written reason. Elements without a reason were removed.
- [ ] The anti-generic pass in `references/anti-generic.md` is done. Each failed item was fixed or explained.

## Copy

- [ ] All copy is real and written for this site. No lorem ipsum, no placeholder claims. See `references/copy.md`.
- [ ] Headings and labels fit the voice in `DESIGN.md`.

## Critique

- [ ] At least two critique rounds are logged, using `references/critique.md`.
- [ ] Screenshots were taken with `node <skill-dir>/scripts/screenshot.mjs <url> [--browser=webkit|firefox]`, run from the project root, at desktop and phone sizes, and the fixes from each round are recorded.

## Typography and color

- [ ] Two type families, plus at most one monospace family for labels. Licenses cover the use.
- [ ] Body text is 16px or larger. Smaller labels are documented with the reason, and they meet contrast.
- [ ] Body text meets 4.5:1 contrast. Large text meets 3:1. UI borders, icons, and focus indicators meet 3:1.
- [ ] Focus states are visible on every background.
- [ ] Font loading doesn't cause a visible layout jump.
- [ ] Palette, type, spacing, and motion values live as tokens in `recipes/tokens.css` or an equivalent single source.

## Motion and scroll

- [ ] Every animation has a stated job and uses a named easing token.
- [ ] Animations use `transform` and `opacity` where possible.
- [ ] Off-screen and hidden-tab loops are paused. `marquee.js` and `dom-gl-sync.js` pause their off-screen content with an `IntersectionObserver`, and `createTicker` pauses in hidden tabs. A loop added without these needs its own `IntersectionObserver` or visibility check.
- [ ] Smooth scrolling, if used, leaves keyboard and native scrolling working. Nested scroll areas use `data-lenis-prevent`.
- [ ] Looping or auto-moving content that lasts more than 5 seconds has a pause, stop, or hide control (WCAG 2.2.2).
- [ ] The reduced-motion version keeps the meaning and removes travel, spin, parallax, and loops.
- [ ] No content flashes more than three times per second.
- [ ] Scroll-driven CSS is wrapped in `@supports`, and content is visible without it.

## Transitions and navigation

- [ ] Route or view transitions move focus to the new page heading and update the document title.
- [ ] Cross-document view transitions have a fallback, because they are not supported in Firefox.
- [ ] Header and navigation work by keyboard, with visible focus and no hover-only menus.
- [ ] Focus is not hidden behind a sticky header or banner (WCAG 2.4.11).

## 3D and visuals

- [ ] Each 3D scene has a stated reason in the story. If the beat works flat, the scene was reconsidered.
- [ ] The page works with WebGL turned off, with the same content and story beats.
- [ ] WebGL2 is checked before a scene starts. No WebGL1 fallback is planned.
- [ ] Frame rate is acceptable on a mid-range phone, with the budget written down.
- [ ] Pixel density is capped at 2. Off-screen WebGL images are not drawn (`dom-gl-sync.js`), and any other canvas pauses itself when it is off-screen.
- [ ] One renderer per page. Geometries, materials, and textures are disposed when removed.
- [ ] Models and textures are compressed (Draco or Meshopt, KTX2).
- [ ] Illustrations use the palette roles and motif rules. Photos share crop, grade, grain, and lighting.
- [ ] Text is real DOM text, not only drawn in WebGL.
- [ ] Every cursor-only or hover-only interaction has a touch and keyboard equivalent.

## Loader

- [ ] The loader shows the concept in the first second and hands off to the first scene.
- [ ] It waits only for first real content, within a minimum and a maximum duration. Reduced motion has no minimum hold.
- [ ] The intro element ships `hidden`. `runLoader` reveals it and hides it again at the end. The status live region is in the initial markup.
- [ ] It shows real progress where possible.
- [ ] A failed or slow load doesn't trap the visitor.
- [ ] Return visits get a shorter version.
- [ ] The loader announces its state to screen readers.

## Accessibility

- [ ] Every control works with the keyboard and has a visible focus state.
- [ ] Important text is real text in the page, not only inside a canvas.
- [ ] Meaningful images have `alt` text. Decorative images have empty `alt`.
- [ ] Reduced motion is respected from the system setting, and a visitor-facing setting is offered.
- [ ] The page still works at 200% text size without breaking the layout.
- [ ] Touch targets are at least 24px square, with 44px as the aim where the layout allows.

## Performance and delivery

- [ ] The first screen loads quickly, with heavy scenes deferred.
- [ ] Models and textures are compressed.
- [ ] Images use `<picture>` with AVIF or WebP and a fallback. The hero image has `fetchpriority="high"`. Images below the fold use `loading="lazy"`. Images have width and height.
- [ ] Fonts are WOFF2, preloaded for the first screen, and subset where the license allows.
- [ ] The page has been tested at desktop and phone sizes in Chromium, Safari (WebKit), and Firefox. Features with uneven support (cross-document view transitions, `text-wrap: pretty`) were checked in each. Run these from the project root, after `npx playwright install webkit firefox`, with `<url>` set to the running local build and `<skill-dir>` set to the skill root:
  - Chromium (default, no flag): `node <skill-dir>/scripts/screenshot.mjs <url>`
  - Safari (WebKit): `node <skill-dir>/scripts/screenshot.mjs <url> --browser=webkit`
  - Firefox: `node <skill-dir>/scripts/screenshot.mjs <url> --browser=firefox`
  - The WebGL-off variant is Chromium-only. It is skipped when `--browser` is `firefox` or `webkit`, so capture it in a Chromium run: `node <skill-dir>/scripts/screenshot.mjs <url>`.
- [ ] Console errors are checked and resolved.

## Metadata and details

- [ ] Page title, favicon, meta description, and an Open Graph image are set.
- [ ] A 404 page exists and follows the concept.
- [ ] The text selection color comes from the palette.

## Originality and licensing

- [ ] All code and assets are original, or licensed to the site owner.
- [ ] The build used the concept and this skill's patterns. No reference site was used as a source for code, layout, or assets.
- [ ] No markup, styles, scripts, or images were copied from another site.
- [ ] Fonts and models have licenses that cover the site's use.
