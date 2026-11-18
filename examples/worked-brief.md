# Worked brief: Kestle Night Ferry (fictional)

> This is an illustration of the quality bar, not a template to copy. Do not reuse its concept, motifs or copy.

Kestle Night Ferry is an invented client. The name, the river, the boats, the copy, and the photos do not describe any real business. The brief follows `templates/DESIGN.md` section by section, so you can see the level of detail expected before the build starts.

## 1. Brief

| Field | Answer |
|---|---|
| Visitor | Two groups: people who work late on the far shore and need a reliable last crossing, and visitors who want to ride the night boat once. |
| Action | Find tonight's crossings and reserve a seat. Secondary: read the fares and safety notes. |
| Feeling | Calm, trusting, a little lonely in a good way. The visitor believes the boat will go. |
| Purpose | Fill seats on the last crossings, and make a small night service visible to people who don't know it exists. |
| Content available | Six crossings a night with times, three fare tiers, four crew photos taken at dusk, two crew quotes supplied by the client, safety notes, and a phone number. Tonight's times come from a JSON file the crew edits each afternoon. |
| Constraints | Static site, no login, three weeks. Only photos the owner supplies. Open-licensed fonts only. Most visitors arrive on a phone, often at a slip with weak signal, so the phone version is the main version. |

## 2. Purpose sentence

> After this page, a visitor should trust that Kestle runs the last crossing on time, and reserve a seat for tonight.

## 3. Concept

**Statement:** Kestle runs three small boats across the Wend after the city goes to sleep. The site is the crossing log the crew keeps by hand: one line of dark water, one lantern on it, and each night's departures written down in plain type, one under another. Nothing is decorative. Every mark on the page is a boat going somewhere.

**Concept object or system:** The crossing log. One night is one horizontal waterline. Each departure is a tick on the line, with its time written beneath it in mono. The lantern is the one lit thing on the water, and it sits on the line wherever the visitor is in the night.

Test: a designer could build the whole site from this. The waterline, the ticks, the lantern, and the log rows are enough to make every section.

## 4. Voice

| Adjective | Do | Don't |
|---|---|---|
| Plain | Short sentences and plain verbs. "The last boat leaves at 23:40." | Decorative language. "Embark on an unforgettable night." |
| Nocturnal | Name times, lights, and water. Describe the dark as a condition, not a mood. | Night-as-romance clichés. "Magic under the stars." |
| Exact | Numbers, times, seat counts, and boat names. | Vague claims. "Best in class." |

**Sample headline:** The last boat leaves at 23:40. (Six words, under the eight-word budget in `references/copy.md`.)

**Words to avoid:** journey, seamless, unforgettable, experience, embark, elevate, "book your adventure", exclamation marks.

## 5. Motif ledger

| Motif | Represents | Appears in |
|---|---|---|
| Waterline: a 1px horizontal rule across the full width | The crossing, and the boundary between two shores | Hero, between every chapter, footer; vertical on phones |
| Lantern: a small amber dot that sits on the waterline | The one light on the water, and the visitor's place in the night | Live intro, signature moment, selected timetable row, footer |
| Tick: a short vertical mark on the waterline, with its time in mono beneath | Time passing, and each departure as a logged event | Timetable rows and the fares list |

Every section sits on the waterline. The lantern appears only where the visitor is, or where a boat is, so the amber always means one of those two things.

## 6. Story beats

| Beat | Job | Content | Motion/3D/sound | Pace |
|---|---|---|---|---|
| First impression | Set the water and the line | Headline "The last boat leaves at 23:40.", one line of copy, the lantern at the Slip end | Live intro: the waterline draws left to right in 0.9s and the lantern lights. No 3D. No sound. | Slow |
| First interaction | Scroll carries the lantern across | Tonight's first crossing and what the ride is like | Signature moment (below) | Slow |
| Main reveal | Show all six crossings clearly | Timetable rows: time, boat, seats left, status | Rows stagger 80ms apart. No 3D. | Quick |
| Proof | Show that the crew is real | Three copy items, each under 25 words: two crew quotes (`[TODO: client quote 1]`, `[TODO: client quote 2]`) and one fleet line, "Three boats: Wren, Heron and Tern. Seat counts: `[TODO: client]`." The four crew photos are illustration, with alt text. | Photos reveal once. Nothing moves after that. | Still |
| Invitation | Make booking easy | Date, crossing, seat count, name, contact | Micro motion on the selected row only | Rest |
| Exit (footer) | Leave the next crossing visible | One line: "Next crossing 23:40 from the Slip." One contact route: "Call `[TODO: client phone]`", as a `tel:` link. One link: "Reserve a seat." | Lantern rests at the Far Shore | Still |

**Signature moment**

- **What:** The Lantern Crossing. During the first interaction, the visitor scrolls, and the lantern moves along the waterline from the Slip on the left to the Far Shore on the right. It stops at each of the night's six departures, and the ticks appear with their times. Scroll is the only input.
- **Why it fits the concept:** The concept is one night's log. The lantern is the single lit thing, and the stops are the log's rows drawn as a line. Nothing else on the site travels this far.
- **Cost (performance, build, content):** One inline SVG path and a scroll-linked update using `getPointAtLength`, about 2 KB of script. No canvas and no 3D. Three font families, each subset to the characters used. Content: the six departures come from the same JSON file as the timetable.
- **Reduced-motion version:** The lantern rests at the Far Shore. The six stops show as a static list in the same order, with the same times. No travel.
- **Mobile version:** The waterline turns vertical, with the Slip at the top and the Far Shore at the bottom. The lantern moves down with scroll, and the times sit to the right of the ticks. Touch uses native scroll only, with no drag.

## 7. Elements and reasons

| Element | What it is | Reason it exists |
|---|---|---|
| Header and navigation | Four links: Timetable, Fares, Crew, Reserve. One line of mono text on the waterline. Hides on scroll down, returns on scroll up. | The visitor has four jobs. The mono line reads like a log label. |
| Hero | A left-aligned headline on the waterline, with the lantern at the Slip end. No button, no image. | The first screen shows one line of water and one light, so the concept is clear before any copy is read. A centred headline with a button is the default this replaces. |
| Typography | Fraunces for display, Instrument Sans for text, IBM Plex Mono for times and labels. | Warm, old-print forms suit a log kept by hand. Neutral text reads well. Mono marks the logged facts. |
| Color | Ground, Ink, Ink quiet, Signal, Line, and Focus. See section 8. | The night ground and one warm light. The only warm color on the page is the lantern. |
| Spacing | Full-viewport chapters using `svh`. Beats 1 and 6 are wide and open. Beat 3 is tight. | Rest before and after the proof makes the log land harder. |
| Loader | The live intro. The waterline draws and the lantern lights while fonts and the first photo load. The intro ships `hidden`, so no-JS visitors never see it, and `runLoader` reveals it. | The first second says "one light on the water" before any copy appears. The intro ends where the page begins. |
| Motion | The lantern (scroll-scrubbed), timetable rows (stagger), and photos (one reveal each). | Each has a job in beats 2, 3, and 4. There is no parallax, because the site is about steady travel. |
| 3D | None. | The concept is flat and linear. A line and a dot say the same thing as a 3D scene would, without the weight. |
| Illustration and visuals | Four crew photos taken at dusk, cropped 4:5, with one warm grade and shared grain. | They prove the boats are real and look like one night. No stock ferry photos. |
| Copy | Short, plain, exact lines in the three-word voice. Buttons start with verbs. | Every line states a time, a seat, or a rule. Missing client copy is marked `[TODO: client copy]`. |
| Transitions and menu | None between pages: single page, no route transitions. The waterline is the only divider between chapters, and it is drawn without animation. The menu is the four header links, with no hamburger. | A single page doesn't need route transitions. Four links fit on a phone, so a hidden menu would hide the four jobs. |
| Details | Focus: 2px outline in `--color-focus`, offset 3px. Selection: Signal on Ground. Cursor: system cursor, no custom cursor. Favicon: the lantern dot on Ground. Page title: "Kestle Night Ferry: last crossings". 404: "This crossing isn't in the log." with a link to Timetable. OG image: the hero, with its headline. Sound: none, because the site is read on phones in public places, and sound is the first thing a visitor would turn off. | Each detail is one decision, traced to a token or to the concept. |
| Reduced-motion toggle | A button built with `bindMotionToggle` from `recipes/motion-preference.js`, in the header and in the footer. Its label is the constant "Reduce motion", and `aria-pressed` shows whether reduced motion is on. The choice is kept in `localStorage`. | Reduced motion is the visitor's override of the system setting, so it is never only a system setting. |

## 8. Tokens

Start from `recipes/tokens.css`. Every value below becomes a custom property with the canonical name shown. The values are this project's adaptations of the starter values.

### Color

| Role | Token | Value | Used for |
|---|---|---|---|
| Ground | `--color-ground` | `oklch(0.22 0.03 255)` | Page background |
| Ink | `--color-ink` | `oklch(0.93 0.015 85)` | Headings and body text. 14.08:1 on Ground. |
| Ink quiet | `--color-ink-quiet` | `oklch(0.74 0.02 240)` | Times, labels, metadata. 7.53:1 on Ground. |
| Signal | `--color-signal` | `oklch(0.84 0.16 80)` | Lantern, primary button, selected row |
| Line | `--color-line` | `oklch(0.55 0.04 240)` | Waterline, inactive ticks. 3.59:1 on Ground. |
| Focus | `--color-focus` | `oklch(0.84 0.16 80)` | Focus ring on dark ground. 10.38:1 on Ground. |
| Focus on light | `--color-focus-on-light` | `oklch(0.42 0.17 265)` | Focus ring inside `data-tone="light"` sections. Unused on this site, which has no light sections; kept so the role exists if a light section is added. |

Contrast figures were computed from these oklch values with the WCAG relative-luminance formula. Every pair this site uses passes its minimum: 4.5:1 for text, 3:1 for Line and Focus. Focus on light is not used here, so it has no measured ratio. Rerun the same pairs in a contrast tool before launch. Line first measured 2.06:1, which failed, so it was lightened in round 3 (section 12). Every tick that carries a status also has a text label, so color is never the only signal.

### Type

| Role | Token | Family | Size | Tracking | Why |
|---|---|---|---|---|---|
| Display | `--step-5` to `--step-6`, `--track-display` | Fraunces (OFL), variable, with the optical size axis | clamp(3.5rem, 2rem + 7vw, 7.5rem) at the top step | -0.02em | Warm, old-print forms. The large optical size stays sharp. The starter value is -0.03em. This project uses -0.02em. |
| Body | `--step-0` | Instrument Sans (OFL) | clamp(1rem, 0.96rem + 0.2vw, 1.125rem), 1.5 line height | 0 | Neutral, and it reads well at small sizes. |
| Label | `--step--1`, `--track-label` | IBM Plex Mono (OFL) | clamp(0.8rem, 0.77rem + 0.15vw, 0.875rem), uppercase for labels only | +0.08em | Logged-facts feel. Monospace digits line up in the log. Labels run about 13px at most widths, below the 16px body rule. The exception is short, meets contrast, and is written here. |

### Space

Use `--space-1` through `--space-10`, from `recipes/tokens.css`. They are fluid. Used here: `--space-1` between a tick and its label, `--space-3` for row padding, `--space-6` inside a section.

- **Chapter gap (desktop / mobile):** `--space-10` raised to `clamp(6rem, 12vw, 12rem)` in this project. The starter `clamp(4rem, 1.5rem + 11vw, 11rem)` in `recipes/tokens.css` tops out at 11rem, so the project raises the token's maximum. At 390px the gap is 96px, the 6rem floor. At 1440px it is 172.8px. It reaches the 12rem (192px) cap at 1600px and wider.
- **Pace notes:** Beats 1 and 6 use the full chapter gap, so the visitor arrives and leaves slowly. Beat 3 uses `--space-3` row padding, so the log reads as dense on purpose.

### Motion

| Name | Token | Duration | Ease | Used for |
|---|---|---|---|---|
| intro-settle | `--dur-scene` | 0.9s (the starter value is 1400ms) | `--ease-out-expo` | Waterline draw and lantern light in the live intro |
| reveal-slow | `--dur-reveal` | 1.0s, once | `--ease-out-expo` | Crew photos |
| micro | `--dur-micro` | 0.2s | `--ease-out-quart` | Hover and focus on buttons and the selected row |
| lantern-travel | none (scroll-driven) | Scrubbed, damped at lambda 6 | Linear, with damping | Signature moment |
| stagger | `--stagger` | 80ms between rows, each row 1.0s (`--dur-reveal`) | `--ease-out-expo` | Timetable rows |

`lantern-travel` has no token, because it is driven by scroll position rather than time. Its damping constant lives in the code. Named moments map onto the canonical tokens. A project that needs a new timing adds a token in `recipes/tokens.css` rather than a one-off value in code.

## 9. Stack

- **Choice:** Plain Vite with vanilla TypeScript, GSAP 3.13 with ScrollTrigger, and no Lenis. No three.js. Three self-hosted WOFF2 font families. Static build, deployed to static hosting.
- **Reason:** The site is one page, which is the default for this stack. Vite gives a plain static build with no framework runtime. The timetable reads one JSON file with `fetch`, and the booking form posts to an endpoint the client already uses. GSAP runs the intro timeline and the lantern scrub, and `gsap.matchMedia()` handles reduced motion. Lenis is left out on purpose: the timetable and form are used by keyboard and on phones, and smooth scrolling adds risk for little gain here. Tradeoff: the site lacks the inertia feel that some sites use.
- **Confirmed by user:** yes

## 10. Fallbacks

| Feature | Reduced motion | No WebGL | Touch / mobile | Keyboard |
|---|---|---|---|---|
| Signature moment | The lantern rests at the Far Shore. The six stops show as a static list with the same times. No travel. | Not applicable. The moment is SVG and uses no WebGL. | The waterline turns vertical. The lantern moves with scroll. No drag. | Scroll-driven and decorative. The static stop list is ordinary text, reachable in tab order. |
| Loader | No minimum hold. The intro ends when its tasks finish or at `maxMs`, whichever comes first. It shows its final frame with no fade, and `onExit` is skipped. The setting is read through `recipes/motion-preference.js`. | Not applicable. The loader uses no WebGL. | Waits for fonts and the first photo only, the same as desktop. | A skip control (`data-loader-skip`) is visible from the first frame. It ends the intro at once at any point until the intro hides: while tasks load, during the minimum hold, and during the exit, which is cut short. If focus was inside the intro, it moves to `main` before the intro hides. |
| Transitions | Not applicable, since the site is one page. Chapter dividers are static. | Not applicable. | Same as desktop. | Focus stays where the visitor left it. No route changes. |
| Menu | The header hides without a slide. | Not applicable. | Four links in one row, with 44px tap targets. No hamburger. | All four links are in tab order. `scroll-padding-top` keeps a focused link from hiding behind the sticky header. |
| Reduced-motion toggle | Pressed state shows the setting. | Not affected. | Same button, at least 44px, in the header and the footer. | Real button; Enter or Space toggles. The focus ring is visible. |
| Sound | Not present. | Not present. | Not present. | Not present. |

## 11. Anti-generic check

| Check | Result | Change made |
|---|---|---|
| Template test (one screenshot) | Round 1 failed. The 390px hero looked like the default: a centred headline and a button. Round 2 passes. | The hero became a left-aligned headline on the waterline, with no button. |
| Generic defaults table | Round 1 failed on two rows. Every heading and row faded up on one 0.5s ease. The proof was three equal cards. Round 2 passes. | The fade-up was removed. Rows stagger, photos reveal once, and headings don't animate. The proof became four photos at uneven sizes along the waterline. |
| One-change rule applied | Round 1: the proof still felt generic after the card fix. One strong change was made, with no effect added. Round 2 passes. | The largest photo runs the full width across the waterline. The other three stay small. |

## 12. Critique log

Scores are 1 to 10 self-assessments. Weighted total = 0.4 x Design + 0.3 x Usability + 0.2 x Creativity + 0.1 x Content. Round 1 used screenshots at 390px and 1440px, plus a keyboard-only pass. Each later round repeated the same checks after its fixes.

Each round lists exactly three top fixes, as `SKILL.md` and `references/critique.md` require. Accessibility failures are fixed in the round they are found, not deferred. Changes from the anti-generic pass (section 11) are logged there, not counted in the top three.

| Round | Scores (Design / Usability / Creativity / Content) | Top fixes | Done |
|---|---|---|---|
| 1 | 6 / 5 / 7 / 6 (weighted 5.9) | 1. Lantern too small on a phone (390px capture). Raised its visible size to 12px and moved the tick labels beside it. 2. Booking buttons were 32px tall. Raised them to 44px. 3. The intro waited for all four photos. Now it waits for fonts and the first photo only. | Yes, fixes 1 to 3 |
| 2 | 8 / 7 / 8 / 7 (weighted 7.6) | 1. At 320px, stop labels collided with tick labels. Stacked the labels below 480px. 2. The reduced-motion capture showed no stop list. Added the static list with times. 3. Focus was hidden under the sticky header while tabbing. Added `scroll-padding-top`. | Yes, fixes 1 to 3 |
| 3 | 8 / 8 / 8 / 8 (weighted 8.0) | 1. The footer phone link was a plain text link about 16px tall. Made it a `tel:` link with a 44px minimum height and width. 2. The 390px capture showed the timetable's status cell wrapping "Sold out" onto two lines. Set the cell to no wrap and shortened the label to "Full". 3. Line (waterline and ticks) measured 2.06:1 on Ground, below the 3:1 non-text minimum. Changed it to `oklch(0.55 0.04 240)`, which computes to 3.59:1. | Yes, fixes 1 to 3 |

Checked in round 3 and passing: Ink quiet on Ground at 7.53:1, Ink on Ground at 14.08:1, and Signal (the focus ring) on Ground at 10.38:1. These were computed from the oklch values. The round 1 timetable contrast item is closed by the Ink quiet result.

Not deferred for accessibility: every accessibility failure found in rounds 1 to 3 is fixed. The print stylesheet for the timetable is deferred after launch. It is a print convenience, not an accessibility requirement.

Round 3 scores are all 8, and its fixes were small, so the loop stops there. Open risk: the Lantern Crossing has not been tested on a real low-end Android phone. That is a device test, not an accessibility failure, and it is logged for the final device pass.
