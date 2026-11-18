# Color

Color sets the emotional temperature of the site. It should come from the concept, and each color needs a role.

## Building a palette from the concept

1. Pick the base: the background tone that sets the world. Dark, light, or a tinted neutral.
2. Pick one dominant accent that carries the main motif. Keep it to one, or two at most.
3. Pick one support color for secondary emphasis, and one for states (hover, selected, error).
4. Define a neutral range for text, lines, and surfaces, with at least three steps of each.

Start the base from a tinted neutral, not pure black or white. A ground with a small hue shift, such as a blue-black or a warm paper, usually feels more finished.

Write each color with its role, not just its value:

| Role | Token | Value | Used for |
|---|---|---|---|
| Ground | `--color-ground` | `oklch(0.22 0.03 255)` | Page background |
| Signal | `--color-signal` | `oklch(0.84 0.16 80)` | Primary action, key motif |
| Ink quiet | `--color-ink-quiet` | `oklch(0.74 0.02 240)` | Captions, metadata |

Every palette needs these six roles: Ground, Ink, Ink quiet, Signal, Line, and Focus. Write them as tokens in `recipes/tokens.css`, using the canonical names there: `--color-ground`, `--color-ink`, `--color-ink-quiet`, `--color-signal`, `--color-line`, `--color-focus`, and `--color-focus-on-light` for light sections. One change to a token then updates every section.

## Writing colors in OKLCH

OKLCH keeps lightness steady across hues, which makes palettes easier to tune. Adjust lightness for contrast and chroma for intensity.

Use `oklch()` directly. It has been widely supported since 2023, so an sRGB fallback is optional and rarely needed:

```css
:root {
  --color-ground: oklch(0.22 0.03 255);
  --color-ink: oklch(0.93 0.015 85);
  --color-signal: oklch(0.84 0.16 80);
}
```

Derive state variants with relative color syntax. It has been newly available since September 2024, so keep a fallback declaration above it:

```css
.button:hover {
  background: var(--color-signal);
  background: oklch(from var(--color-signal) calc(l + 0.05) c h);
}
```

For tints and mixes, `color-mix()` is also usable: `color-mix(in oklch, var(--color-signal) 80%, var(--color-ink))`.

Focus uses `--color-focus` on the dark ground. A light section (`data-tone="light"`) switches the ring to `--color-focus-on-light`. The rule is in `recipes/tokens.css`.

## Contrast and states

- Body text needs 4.5:1. Large text needs 3:1.
- Non-text contrast needs 3:1 (WCAG 1.4.11). This covers UI component borders, icons, and focus indicators against the colors next to them.
- Define hover, focus, active, and disabled states for every control. Focus must be visible on every background, including the dark ones.
- Don't rely on color alone to show state. Pair it with shape, text, or underline.
- Support `prefers-contrast: more`. Raise the contrast of quiet text and borders, and drop faint decorative lines that carry no meaning. This media query is widely available.
- `prefers-reduced-transparency` has limited support. Use it as an enhancement only. Text must stay readable without it.

## Texture, grain, and post-processing

- Grain, noise, chromatic aberration, frost, displacement, and matcaps are good ways to add texture. Keep them inside the palette: they may tint existing colors, but they should not add new ones. See `recipes/grain.css`.
- Grain behind text lowers contrast. Keep text on a clean layer, or reduce the grain behind it.
- Test texture on a mid-range phone. Full-screen post-processing can cost frame time.

## Color as a motif

- A color that repeats across sections, such as an accent used for a thin line in every section, helps the site feel whole.
- Color can change over the course of the story. If it does, the change should follow a story beat, not a random timer.
- If the site has multiple scenes or sections with different grounds, make the transitions between them intentional: a shared gradient, a wipe in the accent color, or a shared texture.

## Avoid

- Pure black or pure white as the only extremes. Slightly tinted neutrals usually feel more finished.
- Gradients added only for decoration. A gradient should show light, depth, or a transition.
- A new accent per section. That breaks the whole-site feeling.
- Color choices copied from another site. Build the palette from this site's concept.
- Status shown only by color. A colored tick that carries a status also needs a text label.
