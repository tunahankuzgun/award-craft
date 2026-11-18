# Anti-Generic Check

> If a stranger could guess the template or the AI tool from one screenshot, it's generic.

Run this check in step 6 of the process, and again in each critique round. Each row describes a default that appears when no one has made a choice. Each row gives the alternative and the one case where the default is acceptable.

| Generic default | Why it reads as generic | Do instead | Allowed when |
|---|---|---|---|
| Purple-to-blue gradient on a dark background | The most common color choice in generated sites. It has no link to any brand. | Pick a palette from the concept: one ground, one accent. | The brand color is that gradient, chosen on purpose. |
| One sans-serif (Inter or system UI) for everything | No display voice. Headlines and body feel the same. | Pick a display face with a point of view, and a plain body face. Use scale contrast. | The concept is utility-first, and the user asked for system type. |
| Glassmorphism cards (blur, translucency, thin border) | Used on nearly every generated dashboard and landing page. | Use a surface from the palette: a solid color, a line, or a texture. | The concept is about glass or frost, and the effect appears in one place. |
| Centered hero (headline, subhead, two buttons), then three feature cards | The most repeated layout in generated sites. | Start with one object, one headline, and one action, placed off-center or at large scale. | The page is a short utility page with no story. |
| Equal-height sections with identical padding | No rhythm. Every section weighs the same. | Vary height and density on purpose: a tall chapter, a tight list, a quiet rest. | A uniform spacing system is a deliberate rhythm. |
| Rounded cards with soft shadows everywhere | A component-kit look with no material. | Use hard edges, a single line, or a texture that matches the concept. | The concept is soft or tactile, and the radius is part of a system. |
| Emoji or a generic icon set in every section | Decoration without a reason. No voice. | Use the motifs. Use a custom mark, or no icon. | An icon does a job, such as a navigation cue, and matches the set. |
| Gradient text on headlines | A default effect that reads as a template. | Put color on one word, or change weight or scale. | The gradient is the concept's material, used once. |
| Default bento grid | The other most repeated layout. Boxes with no story. | Build an editorial asymmetric grid with one deliberate break. | The content is a dashboard, where grids are the job. |
| The same fade-up on every element, one 0.5s ease | Motion with no job and no sense of pace. | Give each moment its own named easing and its own job. Vary the entrances. | A single gentle entrance on a short page. |
| Particles or blobs with no link to the concept | Effects with no reason. They slow the page. | Tie any particle or blob to a motif, or cut it. | The particles are the motif, and the concept says so. |
| Custom cursor with no job | It looks interactive and does nothing. | Give the cursor a state: link, drag, loading, or text. | The cursor changes state in each case. |
| Buzzword copy: elevate, unlock, seamless, revolutionize, empower, next-level, cutting-edge | Says nothing. Reads as an AI draft. | Write specific claims. See `references/copy.md`. | Never. |
| Lorem ipsum, or invented testimonials | Hides the real content problem. Fake proof damages trust. | Write real draft copy and mark gaps `[TODO: client copy]`. | Never. Do not invent a quote, a client name, or a number. |
| Stock 3D shapes (floating spheres, torus knots) | A shape from a library, not from the concept. | Build the concept object, or use a model the user has a license for. | The shape is the custom concept object. |
| Everything centered | No hierarchy and no tension. | Align to one edge, and use asymmetry with a clear reason. | A short ceremonial page where centering is the concept. |

## How to run the check

1. Take one screenshot of each section, at desktop and at 390px.
2. Mark each row that appears on the page.
3. For each mark, change the element, or record why the exception applies.
4. Write the results in DESIGN.md section 11.

## The one-change rule

When a section feels generic, change one strong thing that is tied to the concept: its scale, its crop, its type, or a motif. Do not add an effect to fix it. Adding effects usually makes a generic section busier, not better.

## Words to avoid

The buzzword row lists the common ones. Also avoid any phrase that could appear on a competitor's page without changing a word. If a sentence passes that test, rewrite it. See `references/copy.md`.
