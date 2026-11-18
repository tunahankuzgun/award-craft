# DESIGN.md

*Copy this file to the project root and fill in every section. Delete the italic guidance when a section is done.*

## 1. Brief

*Who the visitor is, what they should do, what they should feel, why the site exists, what content and assets exist, and what limits apply.*

| Field | Answer |
|---|---|
| Visitor | |
| Action | |
| Feeling | |
| Purpose | |
| Content available | |
| Constraints | |

## 2. Purpose sentence

*One sentence: what should change for the visitor after they leave. If it needs three "and"s, split the site or pick one.*

>

## 3. Concept

*Two to four sentences: the mood, the material or texture, and the point of view. Then name the concept object or system, the one thing the whole site is built from.*

**Statement:**

**Concept object or system:**

## 4. Voice

*Three adjectives, each with a do and a don't. Then one sample headline and the words to avoid.*

| Adjective | Do | Don't |
|---|---|---|
| | | |

**Sample headline:**

**Words to avoid:**

## 5. Motif ledger

*Two or three motifs that carry the concept. Every section must appear in at least one row.*

| Motif | Represents | Appears in |
|---|---|---|
| | | |

## 6. Story beats

*One job per beat. Motion, 3D, and sound belong to specific beats, not to everything.*

| Beat | Job | Content | Motion/3D/sound | Pace |
|---|---|---|---|---|
| First impression | | | | |
| First interaction | | | | |
| Main reveal | | | | |
| Proof | | | | |
| Invitation | | | | |
| Exit (footer) | | | | |

**Signature moment** *(one, two at most)*

*What it is, why it fits the concept, what it costs in performance and build time, and how it works with reduced motion and on touch.*

- **What:**
- **Why it fits the concept:**
- **Cost (performance, build, content):**
- **Reduced-motion version:**
- **Mobile version:**

## 7. Elements and reasons

*One line per element. If an element can't name its reason, remove it.*

| Element | What it is | Reason it exists |
|---|---|---|
| Header and navigation | | |
| Hero | | |
| Typography | | |
| Color | | |
| Spacing | | |
| Loader | | |
| Motion | | |
| 3D | | |
| Illustration and visuals | | |
| Copy | | |
| Transitions and menu | | |
| Details (focus, selection, cursor, favicon, title, 404, meta image, sound toggle) | | |
| Reduced-motion toggle: `bindMotionToggle` from `recipes/motion-preference.js`, in the footer or a settings panel. Label: constant "Reduce motion", state shown with `aria-pressed` | | |

## 8. Tokens

*The token names match `recipes/tokens.css`, which every recipe uses. Keep the names. Change only the values, and write the values in the Value column.*

### Color

| Role | Token | Value | Used for |
|---|---|---|---|
| Ground | `--color-ground` | | Page background |
| Ink | `--color-ink` | | Primary text |
| Ink quiet | `--color-ink-quiet` | | Secondary text; check 4.5:1 on the ground |
| Signal | `--color-signal` | | Single accent, used sparingly |
| Line | `--color-line` | | Hairlines and borders |
| Focus | `--color-focus` | | Focus ring on dark ground; check 3:1 |
| Focus on light | `--color-focus-on-light` | | Focus ring inside `data-tone="light"` sections; check 3:1 |

### Type

| Role | Token | Family | Size | Tracking | Why |
|---|---|---|---|---|---|
| Display | `--step-5` to `--step-6`, `--track-display` | | | | |
| Body | `--step-0` | | | | |
| Label | `--step--1`, `--track-label` | | | | |

*Sizes use the fluid `--step-N` scale. Tracking uses `--track-display` for large display type and `--track-label` for small uppercase labels.*

### Space

Use `--space-1` through `--space-10`, from `recipes/tokens.css`. They are fluid.

- Chapter gap (desktop / mobile): `--space-__` / `--space-__`
- Pace notes:

### Motion

*Base tokens: `--ease-out-expo`, `--ease-out-quart`, `--ease-in-out-quint`, `--dur-micro`, `--dur-reveal`, `--dur-scene`, `--stagger`. Each named moment maps to these. If a moment needs a new value, add a token to `tokens.css` and write its name in the Token column.*

| Name | Token | Duration | Ease | Used for |
|---|---|---|---|---|
| intro-settle | `--dur-scene`, `--ease-out-expo` | | | |
| reveal-slow | `--dur-reveal`, `--ease-out-expo` | | | |
| micro | `--dur-micro`, `--ease-out-quart` | | | |
| stagger | `--stagger` | | | |

## 9. Stack

*The recommended stack, the reason for it, and whether the user confirmed it.*

- **Choice:**
- **Reason:**
- **Confirmed by user:** yes / no

## 10. Fallbacks

*What each feature does when the visitor needs it off or it can't run.*

| Feature | Reduced motion | No WebGL | Touch / mobile | Keyboard |
|---|---|---|---|---|
| Signature moment | | | | |
| Loader | | | | |
| Transitions | | | | |
| Menu | | | | |
| Sound | | | | |
| Reduced-motion toggle | Pressed state shows the setting | Not affected | Same button, at least 44px | Real button; Enter or Space toggles |

## 11. Anti-generic check

*Run `references/anti-generic.md`. Record each failed item and what changed.*

| Check | Result | Change made |
|---|---|---|
| Template test (one screenshot) | | |
| Generic defaults table | | |
| One-change rule applied | | |

## 12. Critique log

*One row per round. Scores are 1 to 10 self-assessment. See `references/critique.md`.*

| Round | Scores (Design / Usability / Creativity / Content) | Top fixes | Done |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
