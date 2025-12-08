# Orpheus Documentation

> Navigation hub for all Orpheus documentation

---

## Quick Start

| I want to...                    | Read this                                           |
| ------------------------------- | --------------------------------------------------- |
| **Understand the architecture** | [Architecture Overview](./architecture/overview.md) |
| **Study the codebase**          | [Study Plan](./development/study-plan.md)           |
| **Learn about archetypes**      | [Archetype Map](./concepts/archetypes.md)           |
| **Contribute**                  | [Contributing Guide](./development/contributing.md) |
| **See development history**     | [Milestones](./development/milestones/)             |

---

## Documentation Structure

```
docs/
├── README.md                    ← You are here
│
├── architecture/
│   └── overview.md              # How the system works (message flow,
│                                # file relationships, code snippets)
│
├── concepts/
│   └── archetypes.md            # The 31 thinker patterns that shape
│                                # Orpheus's mind (influence architecture)
│
└── development/
    ├── study-plan.md            # 4-day guide to understanding the code
    ├── contributing.md          # How to contribute
    └── milestones/
        └── 2025-11-30.md        # Development stopping point
```

---

## Key Numbers

| Metric                         | Value                                            |
| ------------------------------ | ------------------------------------------------ |
| **Archetypes**                 | 31 thinker patterns (influence, not quotation)   |
| **Response Tones**             | 5 (casual, analytic, oracular, intimate, shadow) |
| **Engine Files**               | 22 JavaScript modules                            |
| **Lines of Code**              | ~12,000+ in /server/orpheus                      |
| **LLM**                        | Claude (claude-sonnet-4-20250514)                |
| **NEW: Dialectical Cognition** | Collision-based emergent insights                |

---

## Document Purposes

### Architecture

- **[overview.md](./architecture/overview.md)** — The complete technical reference. Message flow diagrams, file relationships, code snippets, API configuration.

### Concepts

- **[archetypes.md](./concepts/archetypes.md)** — Visual tree of all 31 archetypes, what each addresses, how they influence responses (conceptually, not through quotation).

### Development

- **[study-plan.md](./development/study-plan.md)** — 4-day reading order to understand the codebase. Includes landmarks for personality.js.
- **[contributing.md](./development/contributing.md)** — Guidelines for contributing to Orpheus.
- **[milestones/](./development/milestones/)** — Historical snapshots of development progress.
  - [2025-11-30](./development/milestones/2025-11-30.md) — First complete version (23 archetypes, 5 modes)
  - [2025-12-05](./development/milestones/2025-12-05.md) — v4.1: Influence architecture, emergent awareness, eulogy lens
  - [2025-12-07](./development/milestones/2025-12-07.md) — **v5: Dialectical Cognition Engine** — archetypes become collision tools

---

## Source of Truth

When documents conflict:

1. **Code** — Always wins
2. **architecture/overview.md** — Technical reference
3. **Other docs** — Conceptual/educational

---

## Stretch Goals (README)

- Add origin story: _"Built by a 45-year-old career changer during a 3-day intensive, synthesizing 25+ years of martial arts discipline, realist art training, and philosophical study."_
- Write public piece (LinkedIn/blog): "I built an AI that can disagree with you" or similar
- Consider offering something the repo doesn't: hosted version, custom archetypes, consultation on personality architecture

---

_Last updated: December 2025_
