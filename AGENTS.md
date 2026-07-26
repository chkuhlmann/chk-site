# Caleb Kuhlmann Studio Development Guide

## Program purpose

This repository belongs to the broader **Caleb Kuhlmann Studio** product
program: the connected website, software, teaching systems, and internal
workflows that support Caleb's work as an audio engineer, music producer, and
private instructor.

Treat the website and Lesson Manager as one business ecosystem with a shared
brand and product direction. Do not treat them as one deployable application.

Read `docs/PRODUCT_VISION.md` before making broad product, architecture,
branding, navigation, lessons, or cross-project changes.

The enduring mission is to create an **inviting, self-preserved,
creativity-focused stack of tools and services** that helps Caleb run the
business efficiently while giving artists, clients, students, parents, and
listeners a pleasant, trustworthy way to experience his work and services.

“Self-preserved” means source, content, and business records remain owned,
portable, backed up, recoverable, and reasonably independent of any one vendor.
Prefer open formats, explicit exports, replaceable integrations, and graceful
fallbacks. New technology must reduce meaningful friction without making the
experience extractive, generic, fragile, or hostile to creative attention.

## Product surfaces

- **Public website (`chk-site`)** — the public authority, portfolio, marketing,
  editorial, lesson-discovery, and inquiry surface at
  `calebkuhlmann.studio`.
- **Private Lesson Manager (`lesson-manager`)** — the instructor operating
  system for student records, assessments, lesson continuity, learning plans,
  portfolio work, and college-prep requirements.
- **Future connected tools** — scheduling, communications, inquiry management,
  client workflows, content operations, and carefully scoped student-facing
  experiences. These are roadmap ideas, not permission to add integrations.

## Architectural boundary

Keep the public website and private application in separate repositories and
on stacks suited to their jobs:

- The website remains Eleventy, static, fast, crawlable, progressively
  enhanced, and deployed through GitHub Pages.
- Lesson Manager remains a private Next.js application with server-side data
  access and SQLite on a trusted computer unless its own security architecture
  is deliberately changed.
- Share language, design principles, and intentionally versioned assets or
  tokens. Do not share live databases, private records, runtime assumptions, or
  deployment pipelines.
- A common domain does not imply common access. Public pages may live at
  `calebkuhlmann.studio`; private tools should use a protected hostname such as
  `manage.calebkuhlmann.studio` only after authentication and access controls
  are designed.

## Brand and experience principles

- Editorial black-and-white presentation with strong typography, restrained
  borders, generous whitespace, and selective RGB-offset accents.
- The public site may be expressive and atmospheric; operational tools should
  be calm, dense enough for real work, fast to scan, and conservative with
  motion.
- Favor clarity, accessibility, semantic HTML, progressive enhancement,
  maintainability, and mobile usability.
- Keep messaging grounded, specific, and music-first. Avoid generic agency
  language, inflated claims, fake metrics, and generic dashboard decoration.
- Preserve the public positioning: music production, mixing, and audio
  engineering in service of the song.

## Privacy and data rules

- Never move student records, guardian information, lesson notes, exports,
  databases, backups, or private project files into this public repository.
- Public lesson copy and reusable curriculum concepts are not student data.
- Keep public lead generation separate from enrolled-student records unless a
  reviewed, consent-aware transfer flow is intentionally built.
- Do not add analytics, authentication, email, calendar, payments, hosting, or
  synchronization to Lesson Manager merely because the wider product vision
  mentions them. Each integration requires its own privacy and security
  decision.
- Refer to `lesson-manager/AGENTS.md` for authoritative application rules and
  to its `lesson-materials/` directory for curriculum authority.

## Repository conventions

- `src/`: Eleventy source.
- `src/_data/`: public site content and structured marketing data.
- `src/_includes/`: layouts, sections, and reusable templates.
- `src/assets/`: browser styles, scripts, and public media.
- `docs/PRODUCT_VISION.md`: durable cross-project product context and roadmap.
- `docs/PLATFORM_ROADMAP.md`: current stack, feature inventory, development
  history, prioritized implementation roadmap, and service decision guide.
- `_site/`: generated output; do not edit or commit it.

## Quality commands

Requires Node.js 22 and npm.

```bash
npm ci
npm run build
```

Use `npm start` for local development. Preserve the existing GitHub Pages
workflow, custom domain, CMS behavior, and real page URLs.

## Definition of done

- The change serves the correct product surface and respects the public/private
  boundary.
- The existing visual identity remains recognizable and accessible.
- Mobile and desktop behavior are verified in proportion to the change.
- The site remains useful without JavaScript where practical.
- Metadata, copy, and navigation accurately reflect Caleb's real services.
- No private operational or student data enters public source or output.
- The production build passes and generated output is not committed.
