# Award-Level Patterns

## How this was made

These patterns were distilled from studying award-winning sites and studio case studies from 2023 to 2026. They are vocabulary for making choices, not templates to fill in. Never reproduce a specific site's layout, code, assets, or signature effect. When a user names a site they like, follow the process in `SKILL.md`: ask which qualities they like, and write those qualities as words for the brief.

## Concept object

Strong sites turn one brand idea into a single physical object or system, then build the whole site from it. The idea becomes a thing the visitor can see and feel:

- A brand mark becomes a 3D landscape the visitor moves through.
- A brand idea of "magnetic" becomes an object pulled toward the cursor.
- A cold brand becomes a unique block of ice for each project.

Each project or item gets its own variation of the object, not one repeated asset. Every later decision is tested against the object: does this belong to it?

- **Fits when:** the brand has a strong idea that can become a thing.
- **Doesn't fit:** the content is a dense reference or catalog where the visitor needs speed above all.

## First screen

The hero does one strong thing and almost nothing else. Options:

- One 3D or textured object, centered or cropped large.
- Full-bleed media with a shader or treatment on top.
- Oversized display type that works as the picture.
- A live-rendered intro that flows into the first scene.

Test: remove any element on the first screen. If nothing is lost, remove it for good. The first screen must still work as real text with motion off.

## Typography

- Oversized display type with tight negative tracking at large sizes, around -0.02em to -0.05em.
- Small uppercase or monospace labels with positive tracking, around +0.04em to +0.1em.
- Extreme scale contrast between display and text. A headline many times the size of body text is a feature, not an error.
- Pairings: a serif with a grotesk, or one family used across many weights and widths.
- These values are starting points. Check them in the screenshot critique.

- **Fits:** most concepts with a clear voice.
- **Doesn't fit:** content that needs long reading. Keep body text plain there.

## Layout and pace

- Full-viewport chapters or scenes, driven by scroll.
- Pinned or scrubbed sequences for one idea that needs time.
- An occasional horizontal section for a series of items.
- Editorial asymmetric grids with intentional breaks, where one element crosses the grid on purpose.
- The footer as a finale. It closes the story with a last motif and one clear next action. It is not a list of links dumped at the bottom.
- Rest areas. After each intense moment, give the visitor a quieter screen.

## Color and texture

- Very restrained palettes: a near-black or off-white ground plus one accent. Add a second neutral only when needed.
- Let texture do the work that extra colors would do: grain, a post-process such as chromatic aberration, frost, displacement, or matcap shading. Keep the texture consistent with the palette.
- Fix the color roles early: ground, ink, accent, muted, focus. The accent appears rarely, so it means something.

## Motion feel

- GSAP timelines with ScrollTrigger. Lenis for smooth scroll, where it supports the concept.
- Ease-out curves such as expo or quart dominate entrances.
- Masked line reveals for headlines.
- Momentum and damping: motion continues briefly after input stops. This makes the page feel heavy or light, depending on the concept.
- Durations are starting points, not rules: reveals about 0.8 to 1.2 seconds, stagger about 0.05 to 0.12 seconds, micro-interactions about 0.15 to 0.3 seconds.
- Name each moment's easing in code, so the timing has a reason and changes as one unit. See `references/motion.md`.

## Transitions

- Scene-to-scene transitions as a shader on a persistent canvas, or as DOM page transitions. See `references/transitions.md`.
- Menus as full-screen moments, not small dropdowns.
- A transition should say something about the concept. If it doesn't, cut it.

## Intros

- The intro is part of the experience. It renders live and flows into the first scene.
- Wait only for the first real content: fonts, and the first image or video frame. Do not wait for the whole site.
- Return visits get a shorter intro. See `references/loaders.md`.

## Details judges notice

- A focus style that matches the palette and is visible on every background.
- A selection color taken from the palette.
- Cursor states that change meaning: link, drag, loading, text. The state change is never the only signal.
- A favicon and page title that change per page.
- A designed 404 page in the same voice, with a way back.
- A sound toggle, off by default, that is easy to find.
- A footer that works as a finale.
- A meta and Open Graph image made from the same concept.

## Signature moments

Choose one, or two at most, from this list. Build it from the concept. Do not add one because it is popular.

- An object that responds physically to the cursor.
- A scroll that loops back on itself.
- Particles that re-form into a new shape for each choice.
- A unique procedural object for each project.
- A shader transition between scenes that looks like a material.
- A hover that reveals the interior of an image through a mask.
- Audio that drives visuals.
- A scene built from the brand's own geometry.
- Text that scrambles or glitches as part of the concept.
- A pointer-driven fluid used as a mask.

Every signature moment needs a reduced-motion version and a touch version. Costs and fallbacks are in `references/techniques.md`.

## Mobile

- Plan the touch version early, in DESIGN.md.
- A cursor-driven idea needs a designed touch equivalent: a drag, a tap to toggle, or a scroll-tied version. Do not just remove it.
- Reduce the number of scenes, not the story.
- Check the first screen at 390px wide before anything else.

## Performance craft

- Set budgets before building: frame rate on a mid-range phone, first-load weight, and draw calls.
- Fake expensive effects. Use matcaps instead of real reflections, billboarded bloom, a fake depth of field, and simulations at a fraction of screen resolution.
- Use one renderer. Pause off-screen rendering. Cap pixel density.

## Craft signals

- Few effects, each tied to the concept.
- Final polish is small: timing, easing, copy, and spacing. It is not more effects.
- The site still works if you remove any single effect.
