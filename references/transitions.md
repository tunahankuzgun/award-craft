# Transitions and Menus

## Decide the model first

- **One long page with scenes.** The story is one document. Transitions are scroll motion and pinned scenes. This is usually the simplest choice for a single story.
- **Multiple pages.** Each page is its own document, and transitions happen between documents.

Choose the model before building. Changing it later is expensive.

## Options and support

| Option | Use when | Support and notes |
|---|---|---|
| Same-document View Transitions (`document.startViewTransition()`) | Route changes inside a single-page app, or in-page state changes | Baseline since October 2025 (Chrome 111, Safari 18, Firefox 144). |
| Cross-document `@view-transition { navigation: auto; }` | Multi-page sites without a framework | Chrome and Edge 126, Safari 18.2. Not Firefox. Progressive enhancement only: the site must work without it. |
| Astro `<ClientRouter />` | Multi-page content sites | Replaces `<ViewTransitions />`. Use `transition:name`, `transition:animate`, and `transition:persist`. Re-initialize scripts on `astro:page-load`. Respects reduced motion. |
| Taxi.js 2 | Multi-page sites that need custom control | Current. Supports View Transitions through `enableViewTransitions`. |
| Persistent WebGL canvas with shader transitions | 3D sites where one canvas stays across routes | Keep one renderer. Costly, so test on a mid-range phone. |
| Next.js App Router | Next.js projects | No stable built-in page transition component. Check the current docs before choosing an approach. |
| Barba.js 2.x | Not recommended | No longer maintained. Do not recommend it for new projects. |

Starter code: `recipes/view-transitions.js` and `recipes/view-transitions.css`.

## Rules for every transition

- Say something about the concept. Link each transition to a motif in DESIGN.md.
- Keep it short: about 0.4 to 1 second.
- Make it interruptible. If the visitor clicks again mid-transition, handle the click. Do not freeze.
- Never block input for long.
- Give each element that morphs a unique `view-transition-name`. Duplicate names break the transition.
- After navigation, move focus to the new page's `<main>` or main heading. Update `document.title`. If the page changed without a full reload, announce the change with a live region.
- Restore scroll correctly: go to the top on a new navigation, and to the saved position on back and forward.
- Reduced motion: use a crossfade or an instant change. Gate it with `prefers-reduced-motion`.

## Full-screen menus

- The toggle has `aria-expanded` and `aria-controls`.
- On open, focus moves into the menu, to the first link or the close button.
- Esc closes the menu.
- The page behind the menu is `inert` while the menu is open.
- On close, focus returns to the toggle.
- Opening the menu is a designed moment. Give it one motif, such as a line that draws, a shape that expands, or a type change. Reduced motion gets a fade or an instant change.
- Menu links are real links with real text.
- Targets are at least 24 by 24 CSS px (WCAG 2.5.8). Aim for 44 by 44.

## Checks

- Back and forward work on every route.
- A refresh on any route loads that route.
- The reduced-motion path has been tested.
- Focus lands in the right place after each navigation and after the menu closes.
- The site works in Firefox, where cross-document View Transitions are not available.
