# Contributing to Pneuma

## Original Work

Pneuma was created and architected by **Pablo Cordero** in November 2025. The foundational architecture—including the personality engine, tone system, archetype injection, and the inversion of personality-over-intelligence—is his original design.

---

## Before Contributing

By contributing to this project, you acknowledge:

1. **Pablo Cordero** is the original creator and architect of Pneuma
2. Your contributions build upon his foundational work
3. Attribution to the original author must be preserved in any derivative works

---

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description

---

## Guidelines

### Respect the Architecture

- Understand the [architecture overview](../architecture/overview.md) before making changes
- The personality-over-intelligence pattern is intentional — don't invert it
- Maintain the separation between orchestration (fusion.js) and response generation

### Maintain Voice Consistency

- Read the existing archetypes before adding new ones
- New tones should complement, not conflict with, the existing five
- Test with real conversations to ensure natural flow

### Code Standards

- Keep functions focused on one responsibility
- Document non-obvious logic
- Preserve the existing logging patterns (`[Pneuma V2]`, `[LLM]`, etc.)

### Documentation

- Update relevant docs when changing functionality
- Keep [architecture/overview.md](../architecture/overview.md) as source of truth
- Don't duplicate information across multiple docs

---

## What to Avoid

- Don't remove or obscure attribution notices
- Don't add dependencies without justification
- Don't change the 5-tone system without discussion
- Don't add features that violate Pneuma's core character (sycophancy, false certainty)

---

## Questions

Open an issue for discussion before major architectural changes.

---

_Last updated: December 1, 2025_
