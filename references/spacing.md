# Spacing and Rhythm

Space is not what's left over. It sets pace, emphasis, and how much the visitor has to process at once. Every gap should have a reason.

## Base unit

- Pick a base unit, usually 4px or 8px, and build spacing from multiples of it. Name the steps (for example `space-1` to `space-10`) so the scale is easy to change.
- Use one spacing scale across the site. Ad-hoc values make the layout feel accidental.
- Define the scale as tokens in `recipes/tokens.css`. The file includes a starting set.

## Rhythm across sections

- Vary the density on purpose. A dense section followed by a sparse one gives the visitor a place to rest and makes the dense part land harder.
- Map the rhythm to the story beats. A slow, open section for the first impression, a tighter one for proof, a wide one for the invitation.
- Keep vertical rhythm consistent within a section, with predictable gaps between headings, paragraphs, and media.

## Empty space as an element

- Empty space can carry meaning: calm, scale, distance, or focus. Name the reason. "This 60vh gap lets the visitor feel how far they've travelled" is a reason. "It looks nice" is not.
- Leave room around the main focus, so one thing at a time gets attention.
- Don't fill every gap with a decorative element. If you do, the page loses its ability to breathe.

## Full-viewport chapters

- Use `svh` for full-height chapters on mobile, so the layout doesn't jump when browser toolbars show and hide. Use `dvh` when a chapter should follow the toolbar. Avoid `vh` for full-height sections on phones.

```css
.chapter {
  min-height: 100svh;
  display: grid;
  align-content: center;
}
```

- Each chapter should have one job. If a chapter holds two jobs, split it.

## Layout structure

- Use a grid for alignment, but break it on purpose at key moments. A single element that crosses the grid line can mark a turning point.
- Full-bleed sections give scale. Contained sections give reading comfort. Mix them with a reason.
- Keep the content width consistent across text sections, so reading feels stable.

An editorial grid with one intentional break. The image starts inside the title's columns and runs to the edge:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--space-4);
}
.grid__title { grid-column: 1 / span 8; }
.grid__image { grid-column: 7 / -1; } /* crosses into the title's columns on purpose */
```

Named lines work too, for a full-width band with a narrow reading column in the middle: `grid-template-columns: [full-start] 1fr [content-start] minmax(0, 62ch) [content-end] 1fr [full-end];`

## Responsive spacing

- Use `clamp()` for padding and gaps so spacing scales smoothly between phone and desktop.
- On phones, reduce vertical space but keep the rhythm. Don't just stack everything with the same gap.
- Touch targets: at least 24px square (WCAG 2.5.8, AA), with 44px square as the aim (WCAG 2.5.5, AAA). Leave enough space between targets that one tap can't hit two.

## Checks

- Squint at the page. Do the dense and open areas form a pattern that matches the story?
- Remove one gap at a time. If the page feels worse, the gap was doing work. If it feels the same, the gap was noise.
- Look at the first screen on a phone. Is there a clear focal point and room to breathe?
- Does the first screen still show its focal point when the browser toolbar is open?
