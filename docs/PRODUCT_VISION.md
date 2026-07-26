# Caleb Kuhlmann Studio — Product Vision and Shared Context

Updated: 2026-07-26

## Mission

Build an **inviting, self-preserved, creativity-focused stack of tools and
services** that helps Caleb run his audio, production, and teaching business
with less administrative friction while giving artists, clients, students,
parents, collaborators, and listeners a pleasant, trustworthy way to
experience what he offers.

This mission is the default lens for future work:

- **Inviting** — humane language, clear paths, accessible interfaces, thoughtful
  hospitality, and a distinctive experience rather than impersonal funnels.
- **Self-preserved** — owned and portable source, content, and data; verified
  backups; open exports; replaceable vendors; documented recovery; and graceful
  degradation when an integration is unavailable.
- **Creativity-focused** — technology protects attention, musical judgment,
  collaboration, and follow-through instead of adding noise, gamification,
  surveillance, or generic business theater.
- **Efficient** — automate repeated administrative work only after the real
  workflow is understood, and keep Caleb in control of consequential actions.
- **Pleasant for others** — every public, client, student, and parent experience
  should be clear, respectful, useful, and appropriately private.

## North star

`calebkuhlmann.studio` is the umbrella for Caleb Kuhlmann's work as an audio
engineer, music producer, and private instructor. The long-term goal is a
connected business system that strengthens:

- **marketing** — clear positioning, discoverability, trust, proof of work, and
  useful editorial content;
- **sales and enrollment** — qualified inquiries, consultations, lesson
  selection, policies, and a professional path from interest to engagement;
- **delivery** — better project and lesson preparation, continuity, decisions,
  assignments, and outcomes;
- **operations** — reliable records, reusable systems, scheduling,
  communication, backups, and follow-through;
- **growth** — a body of public work and a refined internal teaching method
  that may eventually support new services or software products.

This is one business ecosystem, not one monolithic application. Its surfaces
should feel related while remaining separately deployable, maintainable, and
secure.

## Product map

| Surface | Primary job | Audience | Current implementation |
| --- | --- | --- | --- |
| Public studio website | Establish authority, show work, explain services and lessons, publish writing, and create inquiries | Artists, clients, prospective students, parents, collaborators, search engines | Eleventy, Nunjucks/Markdown, Decap CMS, GitHub Pages |
| Public lessons experience | Explain who the instruction is for, what is taught, how lessons work, options, studio expectations, and the consultation path | Prospective students and parents | A dedicated public section/page within the Eleventy site |
| Private Lesson Manager | Run the teaching practice: intake context, assessments, lesson continuity, plans, milestones, portfolio work, and college requirements | Caleb as instructor | Next.js, TypeScript, Tailwind, SQLite, Drizzle, Zod; localhost/private Mac service |
| Future protected lesson experience | Selectively share assignments, resources, progress, or scheduling without exposing instructor notes or unrelated records | Enrolled students and appropriate guardians | Not yet designed or authorized |
| Future business operations | Connect inquiries, scheduling, communications, payments, content, and project workflow where the benefit justifies the privacy and maintenance cost | Caleb, clients, students, guardians | Roadmap only |

### Simple operating model

**The website attracts and qualifies. The private software prepares and
delivers. Shared systems help Caleb follow through.**

## Current product truth

### Public website

The production site is `https://calebkuhlmann.studio`. It presents Caleb as a
Nashville-based producer and audio engineer, with the current central message:

> Music production, mixing, and audio engineering in service of the song.

The website should answer:

- Who is Caleb and what is his point of view?
- What work has he done?
- What services does he provide?
- Who are lessons for, what can students learn, and how do lessons work?
- What should a prospective client or student do next?
- What writing or resources demonstrate his taste, knowledge, and authority?

Its strengths are speed, simplicity, SEO, stable URLs, low maintenance,
semantic content, and a distinctive editorial identity. It should not become a
database-heavy authenticated application.

### Lessons offer

The public offer currently serves three main groups:

1. high-school and college-prep students;
2. artists and developing producers;
3. mixing students.

Instruction is one-on-one, hands-on, project-based, and intentionally
structured. Students should operate the DAW for most of the lesson. Caleb's job
is to demonstrate, guide, ask useful questions, develop listening and judgment,
and help the student build a process they can eventually carry independently.

Current public formats include 60-minute lessons, 90-minute lessons, a
four-lesson package, and a twelve-week college-prep curriculum. Rates and
policies are business data and should be checked before reuse rather than
copied blindly into new surfaces.

### Lesson Manager

Lesson Manager is more than a notes database; its product direction is a
private **instructor operating system** built around the actual rhythm of a
lesson:

- see the student, current project, recent lesson, active plan, previous
  assignment, and next priority;
- prepare the objective and appropriate curriculum milestone;
- record observable work, bottlenecks, strengths, prompting, transfer, and
  artifacts;
- end with a clear assignment, next priority, and updated progress;
- preserve continuity when the next lesson begins.

The current application supports student profiles, separated contacts,
questionnaires, capability assessments and score history, lesson creation and
editing, four-lesson and twelve-week plans, editable milestone progress,
teaching-focus summaries, student switching, print/share actions, portfolio
projects, college requirements, exports, and verified SQLite backups.

The production origin runs on one trusted Mac and stays bound to localhost.
Repository history records a Cloudflare Tunnel route at
`manage.calebkuhlmann.studio`; Cloudflare Access is the intended identity
boundary. The application has no app-native authentication and no student
portal. The installed Cloudflare policy is external state and must be audited
rather than assumed. The app's own `AGENTS.md`, documentation, migrations, and
`lesson-materials/` source remain authoritative for implementation and
curriculum details.

Deployments are now guarded: a push to the private repository's `main` branch
is validated and built by a repository-scoped self-hosted runner, packaged as
an immutable release, preceded by a verified SQLite backup, restarted through
the local service, and accepted only after health verification. Production
data remains outside the repository and release artifacts.

## Architecture principles

### One ecosystem, separate products

The public site and private application solve different problems and should
continue using different stacks:

- **Eleventy** is appropriate for public, crawlable, low-maintenance content.
- **Next.js plus a database** is appropriate for dynamic private workflows and
  persistent records.
- A shared brand does not require a shared repository, framework, database, or
  release cadence.

Avoid turning `chk-site` into the lesson application or copying public site
pages into Lesson Manager. Do not rely on possession of the private hostname as
authorization. Keep the complete instructor hostname, including its health
endpoint, behind Cloudflare Access and maintain explicit backup and
incident-recovery procedures.

### Domain strategy

Use `calebkuhlmann.studio` as the durable public authority. Services may use
clear subdomains:

- `calebkuhlmann.studio` — public website;
- `manage.calebkuhlmann.studio` — the private instructor workspace, whose
  origin remains local and whose entire hostname must stay access-protected;
- a separate future student-facing hostname — only if a student experience is
  designed, with narrower data and permissions than the instructor workspace.

The current repository does not contain or prove the external Cloudflare policy
state. Verify it separately before treating remote access as secure.

### Shared contracts

Share concepts intentionally:

- brand voice and visual principles;
- service names and public descriptions;
- lesson audience/category vocabulary;
- curriculum/template identifiers where a real integration needs them;
- selected design tokens and assets through an explicit, versioned process;
- stable public links back to relevant website pages.

Do not share:

- student or guardian data;
- private instructor notes;
- SQLite files, backups, or exports;
- runtime configuration and secrets;
- deployment pipelines;
- assumptions that a public visitor and an enrolled student are the same
  identity.

If data moves between surfaces later, define a small, validated contract. Prefer
one-way, consent-aware handoffs over a shared database.

## Design system direction

The two current products are visually related without being identical.

### Shared family traits

- near-black ink on white or warm off-white paper;
- clear rules, borders, and structured spacing;
- editorial/print influence rather than generic SaaS styling;
- RGB red/green/blue offsets used as a signature accent;
- strong keyboard focus, readable type, and useful mobile behavior;
- restrained animation that respects clarity and reduced-motion needs.

### Public expression

- Jacquard-family display typography and Times-style body typography;
- generous whitespace and a relatively narrow editorial measure;
- oversized, music-first statements and selected work as proof;
- RGB glitch treatments as an occasional expressive moment;
- direct calls to listen, view credits, inquire, or learn about lessons.

### Operational expression

- a calm warm canvas, white working surfaces, dark navigation, and clear
  hierarchy;
- familiar system sans-serif text for fast entry and scanning, with limited
  serif moments for continuity with the brand;
- restrained RGB details in the mark and active navigation;
- compact cards, tables, forms, status messages, and visible next actions;
- minimal motion, no gamification, no fake analytics, and no ornamental
  complexity that slows teaching.

The goal is **family resemblance, not visual cloning**. Public pages may create
emotion; the private tool must support concentration.

## Brand and content principles

- Keep the song, artist, intention, performance, listening, and judgment ahead
  of technology for its own sake.
- Be specific and grounded. Do not invent credits, outcomes, testimonials,
  partnerships, or expertise.
- Communicate professional boundaries honestly, including when a specialist is
  more appropriate.
- Treat teaching as personalized but not unstructured.
- Use Caleb's name and domain consistently so search engines and people
  understand the site as the authoritative source.
- Give each public page a clear search and conversion purpose, with accurate
  titles, descriptions, canonical URLs, headings, structured data, image text,
  and internal links.
- Editorial writing can cover music, production, art, and related ideas when it
  strengthens Caleb's genuine voice and authority.

## Privacy and trust principles

- The public site contains marketing and editorial content, never private
  student records.
- Student, guardian, emergency, administrative, and instructional information
  must stay appropriately separated.
- Collect only what supports instruction or a defined business operation.
- Public sharing of student work, images, recordings, or testimonials requires
  explicit written permission.
- A future portal must reveal only the records appropriate to that person and
  role; it must never be a public view into Lesson Manager.
- Every future email, SMS, calendar, payment, cloud, analytics, or AI
  integration needs an explicit purpose, consent model, data map, failure
  behavior, and security review.

## Roadmap

The maintained implementation roadmap now lives in
[`PLATFORM_ROADMAP.md`](PLATFORM_ROADMAP.md). Its priority order is:

1. verify and harden current access, backup, recovery, dependency, inquiry, and
   documentation foundations;
2. improve Caleb's daily teaching and business rhythm with scheduling,
   attendance/packages, quick capture, complete editing, and clearer inquiry
   handling;
3. add narrowly scoped calendar, payment, and communication services only
   after their source-of-truth and privacy rules are defined;
4. build separate published student/client experiences rather than exposing
   private operational records;
5. explore creative public tools and possible productization after repeated
   real-world use proves the workflow.

The refined teaching workflow could eventually inform software for other audio
instructors or creative educators. Do not optimize prematurely for a
multi-tenant commercial product. First make the system exceptional for Caleb's
own practice, preserve clean boundaries, and learn from sustained real use.

## Project lineage and source of truth

- `chk-site/main` is the current public website source.
- The `site-overhaul` branch/worktree is historical design work already merged
  into `main`; it is not a second current website.
- `lesson-manager/main` is the current private instructor application.
- `lesson-manager/lesson-materials/` is the authoritative curriculum source.
- `lesson-manager/src/lib/templates/` contains versioned structured curriculum
  definitions derived from those materials.
- ChatGPT projects **CHK Website** and **Private Music Production Lessons**
  supplied product discussions, copy development, architecture decisions,
  design feedback, documentation review, and curriculum planning. Relevant
  durable decisions have been summarized here; individual chat suggestions are
  not automatically authoritative.

When sources conflict:

1. privacy, safety, and explicit current user direction win;
2. the deployed/current repository and its local contributor guide define
   implementation truth;
3. authoritative curriculum materials define instructional wording and intent;
4. this document defines cross-project direction;
5. older branches and chats are historical context, not current requirements.

## Decision checklist for future work

Before starting a cross-project feature, answer:

1. Which user and business job does it serve?
2. Is it public marketing, private operations, or a deliberately protected
   shared experience?
3. Which repository and system own the source of truth?
4. What data crosses a boundary, why, and with whose consent?
5. Can the products share a concept or token instead of sharing a database or
   runtime?
6. Does the design need expressive brand presence or quiet operational speed?
7. What happens when the integration is unavailable or wrong?
8. How is the feature tested, backed up, recovered, and maintained?
