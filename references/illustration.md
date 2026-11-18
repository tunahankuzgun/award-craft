# Illustration and Visuals

Every image, illustration, and graphic should say something about the concept. If a visual could be swapped for a stock photo without anyone noticing, it isn't doing its job.

## Choose the visual language from the concept

- Decide the style before drawing: flat or dimensional, outlined or filled, geometric or organic, detailed or reduced.
- Limit the style to one or two rules, such as "single weight outlines" or "shapes built from circles and one angle." Apply the rules everywhere.
- Set a color rule that matches the palette. Illustrations should use the same roles as the rest of the site.

## Make it specific

- Draw what the concept is about, not generic icons of the topic. For a site about patience, show a long road or a slow sequence, not a stopwatch.
- Add one or two details that only this site would have. These details give the page its character and make it hard to copy.
- Tie visuals to motifs. A recurring shape, texture, or line should appear in illustrations as well as the layout.

## Art direction for photography

When the site uses photos, direct them as a set:

- Use one crop ratio for a set, such as 4:5 for cards and 16:9 for banners, with one focal rule (for example, subjects sit on the lower third).
- Apply one grade or one duotone to every photo. Photos from different sessions should look like they belong together.
- Add the same grain to every photo. Grain unifies images from different cameras. See `recipes/grain.css`.
- Keep one lighting direction across the set. If one photo is lit from the left and another from the right, the set looks assembled.

## Per-item variation

When a site shows many items, such as projects, products, places, or people, give each item its own variation instead of one repeated asset.

- Generate the variation from the item's data, such as a seeded shape or color offset from its ID. The result is unique per item and stable between visits.
- Keep every variation inside the motif rules, so the set still reads as one system.

## Technique

- Use SVG for flat and line illustration. It's sharp at any size, easy to animate, and small in file size.
- Use canvas or WebGL for generative or large-scale visuals. Keep the same palette and motif rules.
- Animate SVG paths for line drawing, or animate groups for parallax and sequence. Keep path counts reasonable so animation stays smooth.
- For a line that travels along a path, `getPointAtLength` gives the position for a moving dot, without a canvas.

## Images on the page

Use `<picture>` with AVIF and WebP sources, and a fallback `<img>`. Export at the sizes they're shown at:

```html
<picture>
  <source type="image/avif" srcset="/img/hero-1600.avif 1600w, /img/hero-800.avif 800w" sizes="100vw">
  <source type="image/webp" srcset="/img/hero-1600.webp 1600w, /img/hero-800.webp 800w" sizes="100vw">
  <img src="/img/hero-1600.jpg" width="1600" height="1000" alt="" fetchpriority="high">
</picture>
```

- Set `fetchpriority="high"` on the hero image only. It's the image that decides the first screen.
- Use `loading="lazy"` for images below the fold.
- Give every image explicit `width` and `height` to avoid layout shift.
- Provide `alt` text for meaningful images, and an empty `alt` for decorative ones. The example above is decorative, so its `alt` is empty.

## Making visuals work with motion

- Design the illustration for its end state, then decide how it arrives. Don't animate something that reads poorly when still.
- Give moving parts a clear origin and direction. Random motion looks unfinished.
- Keep a still version for reduced motion. The static version should still show the full idea.

## Checks

- Can you say what the visual is about in one sentence, tied to the concept?
- Does it use the palette roles and the motif rules?
- Would the page lose meaning if you removed it? If not, reconsider it.
- Is the still version complete, and does the animated version add meaning rather than just movement?
- Do the photos share a crop, a grade, a grain, and a lighting direction?
- Does every image have width and height, and does only the hero use `fetchpriority="high"`?
