# award-craft

An agent skill for designing and building original, accessible, award-level websites: cinematic brand sites, portfolios, landing pages, and interactive stories. It gives the agent a purpose-first process, distilled craft patterns, code recipes, and a screenshot critique loop. It does not copy existing sites.

Not affiliated with Awwwards. The skill uses Awwwards' public scoring weights as a self-assessment rubric.

## What's inside

| Path | Contents |
| --- | --- |
| `SKILL.md` | The entry point: the step-by-step process, non-negotiable accessibility and performance rules, and the definition of done. |
| `references/` | Fourteen topic guides: patterns, techniques, color, typography, spacing, motion, 3D, transitions, loaders, illustration, copy, critique, and a final checklist. |
| `recipes/` | Starter JavaScript and CSS files, such as smooth scroll, line reveals, page loaders, marquees, and WebGL image effects. Each is a starting point, with its reduced-motion path kept in place. |
| `templates/` | `DESIGN.md`, the design document the agent fills in for each project. |
| `examples/` | A filled-in example brief. |
| `scripts/` | `screenshot.mjs`, which captures a page at several scroll stops and widths for review. |

## Install

This repository is the skill folder itself. Its folder name, `award-craft`, is the skill's ID, so keep that name when you install it.

Clone it or copy it into one of these locations:

- `~/.agents/skills/award-craft/` for OpenCode and other tools that read that folder.
- `~/.claude/skills/award-craft/` for Claude Code.

For example:

```sh
git clone https://github.com/<owner>/award-craft ~/.agents/skills/award-craft
```

Replace `<owner>` with the real GitHub owner once the repository is published. Once it is published, skills.sh can install it with `npx skills add <owner>/award-craft`.

## Use

- In OpenCode, mention the skill in a prompt: `@award-craft build a portfolio site for ...`.
- In Claude Code, run `/award-craft` or describe the task. The agent may also load the skill on its own when the task matches.

The agent starts with one round of brief questions about the visitor, the goal, the content, and the constraints. It chooses the stack after the concept is agreed, not before.

## Dependencies

The skill bundles no third-party code. When the agent builds a site, it installs only what the chosen stack needs, in that project. For example:

```sh
npm i gsap lenis three
```

For the screenshot critique loop, run these from the project root:

```sh
npm i -D playwright
npx playwright install chromium        # add firefox webkit to check other engines
```

Node 18 or later is required.

## License

MIT. See [LICENSE](LICENSE).
