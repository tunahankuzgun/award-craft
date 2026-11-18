# Copy and Voice

Copy is part of the concept. Content is 10% of the Awwwards score, but it carries the story. Motion cannot rescue weak copy.

## Voice from the concept

Write three adjectives that come from the concept. For each one, give one thing to do and one thing not to do.

| Adjective | Do | Don't |
|---|---|---|
| Calm | Use short sentences and plain verbs. "We build slowly." | Urgent claims. "Act now!" |
| Precise | Use numbers, dates, and named things. "Forty pages in two weeks." | Vague claims. "Best in class." |
| Warm | Address the visitor as "you" once per section. | Over-friendly filler. "We're so excited!" |

Record the three adjectives in DESIGN.md section 4.

## Headlines

- Keep them specific, concrete, short, and about one idea. Aim for under eight words on a main headline.
- Write five options for each main headline, then pick one. Say why it fits the concept.
- Test: could a competitor use this sentence unchanged? If yes, rewrite it.

## Body

- Use short paragraphs of two or three sentences.
- Make real claims, with a detail or a source behind them. No filler.
- One idea per paragraph.
- Stop when the point is made.

## Microcopy

- **Buttons.** Start with a verb and name the result. "Book a call," not "Submit."
- **Loader stages.** Name what is happening in plain terms. Keep progress honest. If the stages are poetic, keep the percentage plain.
- **Menu.** Use plain labels for navigation, even when the page voice is poetic.
- **Errors.** Say what happened and what to do next. Don't blame the visitor.
- **404 page.** One line in the voice, one link back, and the concept visible.
- **Cursor labels.** One or two words, such as "View," "Drag," or "Next."
- **Sound toggle.** Use a constant visible label, "Sound," with `aria-pressed` for the state. Show the state visually too, for example with an icon or a filled dot, so it does not depend on color. Do not change the label to "Sound: off" or "Sound: on". Either pattern is valid: a constant label with `aria-pressed`, or a label that changes with no `aria-pressed` (as the marquee does). Pick one per control, and never both on the same control.

## Copy as part of the motif system

- Repeat a word or phrase from the motif ledger, at most once per section, so the copy carries the concept.
- Let copy and motion share a beat. A headline should reveal on the same beat as the image it describes.

## Length budgets per story beat

| Beat | Budget |
|---|---|
| First impression | One headline under eight words, and one line under twenty words. |
| First interaction | One label and one hint. |
| Main reveal | One headline and up to sixty words. |
| Proof | Three to five items, each under twenty-five words. |
| Invitation | One headline and one action. |
| Exit (footer) | One line, the contact route, and one link. |

## Placeholders

- No lorem ipsum. Write real draft copy in the voice.
- Mark gaps clearly, as `[TODO: client copy]`.
- Never invent client names, testimonials, numbers, or awards. Use a marked placeholder for proof until the user supplies it.

## Alt text is writing

- Describe what the image does in the story, not only what it shows.
- Decorative images get an empty `alt`.

## Words to avoid

See the buzzword list in `references/anti-generic.md`.
