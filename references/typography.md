# Typography

Type carries most of the tone of a site before any motion starts. Choose it from the concept, not from what looks popular.

## Choosing a typeface

- Start from the concept sentence. Ask: is this a warm, human, or precise world? A monumental or quiet one? A technical or handmade one? Write the answer as two or three adjectives, then choose faces that match those adjectives.
- Use two families by default: one for display and one for text. A single family in several weights often works best.
- A third family is acceptable for one job: a monospace face for labels, metadata, timestamps, and numbers. Keep it out of headings and body text.
- Check the license. Commercial faces need a license the site owner holds. Free options with good licenses are available from open font libraries such as Google Fonts and Fontshare.
- Test the face at the sizes you'll use: a headline at 120px, body text at 16px, and a small label at 12 to 14px. A face that looks striking large can fail as body text.

## Scale and hierarchy

- Pick a scale ratio, such as 1.25 or 1.333, and round sizes to it. Or set sizes directly with a fluid `clamp()` so headings scale between phone and desktop:

```css
h1 { font-size: clamp(2.75rem, 1.2rem + 6vw, 9rem); }
```

- Limit the levels. Most pages need four to six distinct sizes. More than that usually signals unclear hierarchy.
- Use weight, case, tracking, and color before adding size. A small, widely tracked label can carry more emphasis than a large heading.
- Scale contrast is a tool. A very large display line over small body text makes a page feel confident. Use big jumps on purpose and keep the middle levels few.
- Line length: 45 to 75 characters for body text. Line height: about 1.5 for body, 1.0 to 1.2 for large display type.

## Tracking starting values

| Role | Tracking | Notes |
|---|---|---|
| Display, large sizes | -0.02em to -0.05em | Tighten as size grows. Check for letters that collide. |
| Headings, mid sizes | -0.01em to 0 | Loosen if the heading is set in all caps. |
| Body | 0 | Don't track body text. |
| Small uppercase or mono labels | +0.04em to +0.1em | Short labels only. |

These are starting points. Adjust by eye at the sizes the site actually uses.

## Display type as a design element

Large type can be the main visual. When it is, decide:

- Does it fill the width, bleed off the edge, or sit in a corner? Each choice says something about confidence and space.
- Does it animate? If so, read the motion rules in `references/motion.md` and keep the text readable at the end state.
- Does it repeat across sections? If it does, it's a motif and belongs in the motif ledger.
- Keep display lines short. Oversized type with tight tracking works best with two to five words.

## Headings and text wrap

- Use `text-wrap: balance` on headings. It evens out line lengths in short, multi-line text. It is widely available, but it is limited to a few lines, so use it for headings, not paragraphs.
- Don't apply `text-wrap: balance` to text split by SplitText. Splitting into words or characters breaks the line wrapping it computed. See `recipes/split-reveal.js`.
- Use `text-wrap: pretty` as an enhancement to avoid one-word last lines in paragraphs. It is not supported in Firefox, so the page must read well without it.

## Loading fonts without layout jumps

- Preload the one or two fonts needed for the first screen:

```html
<link rel="preload" href="/fonts/display.woff2" as="font" type="font/woff2" crossorigin>
```

- Use `font-display: swap` or `optional`, depending on how much the page can tolerate a visible swap.
- Match fallback metrics with `size-adjust`, `ascent-override`, and `descent-override` so the swap doesn't shift the layout. The values depend on your font. Measure them for your font rather than copying these:

```css
@font-face {
  font-family: "Display Fallback";
  src: local("Arial");
  size-adjust: 97%;
  ascent-override: 90%;
  descent-override: 22%;
}
```

- `size-adjust` is supported in all major browsers. Verify `ascent-override` and `descent-override` support in Safari before relying on them, and test the swap on a real phone.
- Subset fonts to the characters you actually use, if the license allows it.
- Use WOFF2.
- Express families, sizes, and tracking as tokens in `recipes/tokens.css`, so a change happens in one place.

## Text in 3D or canvas

- Keep real DOM text. Do not draw headlines or body copy only as SDF or MSDF text in WebGL. Screen readers, text selection, and browser find can't reach text drawn in a canvas.
- If text is drawn in WebGL for effect, keep an accessible text layer too: visually hidden DOM text with matching content, or an ARIA-labelled element.
- Test that drawn text remains legible at the smallest size it appears and at the edge of the screen on phones.
- Make sure drawn text can be selected or copied if the content is important, such as contact details.

## Accessibility checks

- Body text is 16px or larger. Small labels and captions may be smaller, such as 12 to 14px, when they meet contrast and the reason is written in `DESIGN.md`.
- Body text meets 4.5:1 contrast. Large text (24px and up, or 18.66px bold) meets 3:1.
- Avoid all-caps body text. Use it only for short labels.
- Don't use text-only images for important content.
- Allow text resizing to 200% without breaking the layout.
- Keep the full sentence readable after a split reveal. Set `aria-label` on the container, or keep a visually hidden copy, so screen readers don't announce single words.
