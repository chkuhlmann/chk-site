# Caleb Kuhlmann Studio — Platform Map and Roadmap

Updated: 2026-07-26

## Mission

Create an **inviting, self-preserved, creativity-focused stack of tools and
services** that:

- gives Caleb more time and attention for music, teaching, and relationships;
- makes recurring business work reliable without making it impersonal;
- lets artists, clients, students, parents, collaborators, and listeners enjoy
  clear, thoughtful, appropriately private experiences;
- keeps source, content, and business data owned, portable, backed up,
  recoverable, and reasonably independent of any single vendor.

The platform should feel like a well-run studio: distinctive but not
distracting, prepared but not rigid, technically capable but always in service
of the creative work.

## System at a glance

```text
Public discovery and trust
calebkuhlmann.studio
        |
        | qualified inquiry / consultation
        v
Private business and teaching operations
manage.calebkuhlmann.studio
        |
        | deliberately published, minimum-necessary records
        v
Future client / student experiences
separate identity, permissions, and data views
```

The arrows are business handoffs, not shared databases. The public site,
instructor tools, and future portals should remain separately deployable and
share only explicit contracts.

## Current technology stack

### Public website

| Layer | Current technology | What it does |
| --- | --- | --- |
| Site generator | Eleventy 3 | Produces a fast static website from templates, data, and Markdown |
| Templates/content | Nunjucks, Markdown, JSON data | Keeps layouts reusable and public content editable and portable |
| Front end | Semantic HTML, shared CSS, small vanilla JavaScript modules | Provides the editorial design, navigation, credits filtering, blog loading, forms, and progressive enhancement |
| Content editing | Decap CMS | Lets Caleb author blog content without editing Markdown by hand |
| CMS authentication | A separate TypeScript Cloudflare Worker (`decap-proxy`) | Handles the GitHub OAuth bridge used by Decap CMS |
| Inquiry handling | Formspree | Receives the public project-inquiry form without adding a website backend |
| Hosting | GitHub Pages | Serves the generated static site at `calebkuhlmann.studio` |
| Delivery | GitHub Actions | Installs exact dependencies, builds, verifies required output, and deploys pushes to `main` |
| Operations | Dependabot | Proposes weekly npm and GitHub Actions dependency updates |
| Search/discovery | Page metadata, canonical URLs, sitemap, robots rules, structured page hierarchy | Helps people and search engines find and understand Caleb's work |

### Private Lesson Manager

| Layer | Current technology | What it does |
| --- | --- | --- |
| Application | Next.js 16 App Router and React 19 | Provides server-rendered private workflows, routes, forms, and actions |
| Language/validation | Strict TypeScript and Zod | Keeps data shapes explicit and validates writes |
| Interface | Tailwind build tooling, shared CSS, Lucide icons | Creates a calm, responsive instructor workspace related to the public brand |
| Database | SQLite via `better-sqlite3` | Keeps the current single-instructor record system local and portable |
| Data access | Drizzle ORM, migrations, server-only repository layer | Preserves relationships and isolates database behavior from the UI |
| Testing | Vitest and Playwright | Covers validation, repositories, privacy invariants, persistence, routes, responsive behavior, and key workflows |
| Local service | Next.js standalone output and macOS `launchd` | Runs the production application continuously on Caleb's Mac |
| Private access | Cloudflare Tunnel to `manage.calebkuhlmann.studio` | Routes the private hostname to the localhost origin without opening an inbound port |
| Identity boundary | Cloudflare Access, intended for the complete hostname | Keeps the instructor application behind an allow policy; this external configuration must be audited |
| Deployment | Private GitHub repository, GitHub Actions, repository-scoped self-hosted Mac runner | Validates and deploys the exact pushed `main` commit |
| Release safety | Immutable releases, atomic active-release link, health check, migration-aware rollback | Keeps failed builds away from the running application and supports conservative recovery |
| Data safety | External live database, verified SQLite online backups, JSON/CSV exports | Keeps records outside releases and provides recovery and portability |

### Shared operating infrastructure

- Git and private/public GitHub repositories hold source and history.
- Node.js 22 and npm are the common build/runtime foundation.
- `calebkuhlmann.studio` provides the domain hierarchy.
- Cloudflare currently supports the CMS OAuth worker and private app routing.
- Brand language, design principles, and lesson category vocabulary are shared;
  live data and deployment pipelines are not.

## What each part does

### Homepage

**For Caleb:** communicates positioning quickly, presents selected work and
services, and turns attention into qualified project inquiries.

**For visitors:** answers who Caleb is, how he works, what he offers, and where
to hear or discuss the work without forcing them through a generic sales
funnel.

### Credits explorer

**For Caleb:** acts as durable professional proof and a maintainable record of
production, mixing, engineering, instrumentation, and mastering work.

**For artists and collaborators:** makes experience easier to browse and helps
them judge fit from real work rather than unsupported claims.

### Lessons page

**For Caleb:** explains the offer before a consultation, filters for fit, and
reduces repetitive questions about audiences, topics, options, the studio, and
policies.

**For students and parents:** creates a clear, reassuring introduction to
hands-on, project-based instruction and its professional boundaries.

### Contact and inquiry

**For Caleb:** gathers enough context to respond intelligently.

**For potential clients:** offers a small, direct first step without requiring
an account or purchase.

The current form is project-oriented. A distinct lesson-consultation path and
clear consent/retention language are future improvements.

### Blog and CMS

**For Caleb:** preserves an editorial voice, supports search authority, and
turns genuine experience into durable public material.

**For readers:** provides useful or enjoyable writing about music, production,
art, and adjacent ideas.

### Lesson Manager dashboard and students

**For Caleb:** surfaces active students, continuity gaps, active plans, recent
lessons, teaching focus, and next actions without fake analytics.

**For students:** indirectly improves preparation, continuity, and the
specificity of instruction. Students do not currently access the private app.

### Assessments and curriculum

**For Caleb:** provides category-specific questionnaires, capability evidence,
historical scores, four-lesson maps, a twelve-week college-prep curriculum, and
immutable student-specific milestone snapshots.

**For students:** creates a structured but personalized path based on observed
needs rather than a generic course sequence.

### Lesson records, summaries, and plans

**For Caleb:** connects the previous assignment and next priority, supports
lesson creation/editing, exposes a teaching-focus snapshot, allows milestone
customization, and creates privacy-filtered summaries for printing, copying,
sharing, or email drafting.

**For students and parents:** can provide clear, selective follow-up without
exposing private instructor notes or unrelated administrative information.

### Data continuity and deployment

**For Caleb:** supplies verified backups, exports, health checks, immutable
releases, guarded push deployment, and conservative rollback behavior.

**For everyone whose information is entrusted to Caleb:** reduces the risk that
a routine software update loses, leaks, or silently corrupts records.

## Development and conversation history

### 1. Public identity and domain foundation

The work began as an Eleventy portfolio for Caleb's engineering and production
career. Conversations established the custom `calebkuhlmann.studio` domain,
GitHub Pages deployment, HTTPS/DNS expectations, sitemap and robots behavior,
metadata, search authority, and the value of making Caleb's name the canonical
source across professional profiles.

### 2. Website quality and maintainability

The site moved from a more monolithic structure into reusable Eleventy data,
layouts, sections, assets, and real page URLs. Mobile navigation, image
delivery, accessibility, focus states, CMS behavior, and deployment checks were
repaired and refined.

### 3. Editorial redesign and conversion

The site-overhaul work established the current black-and-white editorial
identity, Jacquard display typography, Times body typography, restrained RGB
glitch accents, stronger spacing and hierarchy, a concise landing page,
featured work, services, credits, lesson content, and clearer project calls to
action. The overhaul branch was merged into `main`.

### 4. Teaching offer and curriculum system

Conversations developed the public lesson offer, audiences, pricing formats,
studio/parent expectations, intake documents, capability rubrics, four-lesson
maps, twelve-week college-prep curriculum, first-lesson assessment, lesson
notes, and progress summaries. The central teaching principle is personalized
but structured, with students operating the tools and developing transferable
listening and judgment.

### 5. Local Lesson Manager proof of concept

The lesson framework became a private Next.js application with SQLite,
versioned templates and migrations, student records, separated contacts,
questionnaires, assessments, lessons, plans, portfolio work, college
requirements, exports, backups, tests, and strict privacy boundaries.

### 6. Private production operations

Lesson Manager became a Mac-hosted local service. Its database and backups were
moved outside the repository/release tree, health checks were added, and
Cloudflare Tunnel connected the localhost origin to
`manage.calebkuhlmann.studio`. Cloudflare Access is the intended authentication
boundary.

### 7. Safe push-to-deploy

A private-repository workflow and repository-scoped self-hosted runner were
created. A push to `main` now validates, tests, builds, packages, backs up,
activates, restarts, and verifies a release. Failure and schema-migration cases
are handled conservatively; real data is excluded from release artifacts.

### 8. Shared visual language and workflow refinement

Lesson Manager adopted the website's neutral ink/paper foundation and sparse
RGB signature while remaining a calmer operational interface. Recent work
added lesson editing, editable milestones, student switching, teaching-focus
summaries, privacy-filtered share/print actions, better navigation, stronger
mobile behavior, and expanded automated coverage.

### 9. Unified program direction

The website and Lesson Manager are now understood as one Caleb Kuhlmann Studio
ecosystem: public discovery and trust, private operational delivery, and future
selective client/student experiences—connected by deliberate handoffs rather
than one monolithic app.

## Product and engineering principles

1. **Protect attention.** A feature should remove friction or improve creative
   understanding, not add notifications, dashboards, or ceremony.
2. **Own the important things.** Keep source, content, records, exports, and
   recovery paths under Caleb's control.
3. **Use vendors at the edges.** Payments, email delivery, calendars, and
   network identity are sensible managed services; core business knowledge
   should remain portable.
4. **Keep humans in consequential loops.** Sending, publishing, charging,
   deleting, and sharing require clear review and confirmation.
5. **Separate private truth from published views.** Portals receive narrow,
   intentional snapshots—not direct access to instructor or business records.
6. **Prefer boring reliability.** Static pages, relational records, explicit
   saves, additive migrations, verified backups, and graceful fallback beat
   clever coupling.
7. **Build after observing.** Model a repeated manual workflow before
   automating it.
8. **Measure what changes decisions.** Avoid vanity metrics and invasive
   surveillance.

## Prioritized roadmap

Timing is directional. Advance when the exit criteria are satisfied, not merely
because a date arrives.

### Phase 0 — Trust and operational baseline

**Goal:** make the current system easy to trust before expanding it.

1. Audit the live Cloudflare configuration:
   - confirm Access protects every route and the health endpoint;
   - confirm the allow policy, session duration, recovery identity, and tunnel
     service behavior;
   - document how to disable access quickly.
2. Complete a real recovery drill:
   - verify a production backup;
   - restore it to an isolated test location;
   - confirm expected records and migrations;
   - add one encrypted offsite copy of completed backup files;
   - document retention and periodic restore testing.
3. Reconcile documentation with deployed reality:
   - remove “future tunnel” language where the tunnel is already live;
   - document external configuration without checking in tokens or student
     data;
   - record exact production dependency versions rather than relying on
     `next: "latest"`.
4. Add dependency-update coverage to the private application with conservative
   review and the existing full test/build gates.
5. Improve public inquiry clarity:
   - expose lessons more clearly in navigation and relevant homepage paths;
   - separate project inquiries from lesson consultations;
   - add useful success/error states and basic retention/consent language;
   - verify Formspree spam and notification behavior.
6. Establish a tiny operational scorecard:
   - successful inquiries;
   - consultations booked;
   - projects/lesson packages accepted;
   - backup age and last tested restore;
   - app deployment/health failures.

**Exit criteria:** remote access is verified, an isolated restore succeeds,
critical versions are controlled, and a visitor can reach the correct inquiry
path without confusion.

### Phase 1 — Caleb's daily operating rhythm

**Goal:** reduce repeated teaching and administrative work without adding
external automation yet.

1. Add authoritative upcoming lesson date/time records, time-zone rules, a
   Today view, and upcoming reminders inside Lesson Manager.
2. Track packages, lesson credits, attendance, late cancellations, and package
   expiration separately from educational notes.
3. Add mobile quick capture backed by the server/database, with an inbox for
   later attachment to a student, project, or task.
4. Complete editing workflows for student profiles, contacts, portfolio items,
   and college requirements, with audit-friendly timestamps.
5. Build custom reusable curriculum templates by copying bundled templates
   into separately versioned editable definitions.
6. Add lightweight follow-up queues:
   - consultation awaiting reply;
   - student without a future lesson;
   - assignment/summary not yet sent;
   - project inquiry awaiting decision.
7. Establish professional domain inboxes such as
   `caleb@calebkuhlmann.studio` and `lessons@calebkuhlmann.studio`.

**Exit criteria:** Caleb can begin the day in one private workspace, see the
real next actions, capture information quickly, and finish a lesson without
maintaining parallel notes.

### Phase 2 — Deliberate edge integrations

**Goal:** connect mature workflows to replaceable services.

1. **Calendar**
   - begin with downloadable/add-to-calendar events or an explicit one-way
     export;
   - then consider Google Calendar API or a scheduling service;
   - define which system owns time, rescheduling, cancellation, and time zones
     before two-way sync.
2. **Scheduling**
   - evaluate Cal.com hosted service first for availability and booking links;
   - self-host only if control needs justify another database, deployment,
     monitoring, email, and update burden;
   - keep consultations distinct from confirmed enrolled-student scheduling.
3. **Payments**
   - start with Stripe Invoices for specific clients and reusable Payment Links
     for defined lesson packages or deposits;
   - never store card data in Caleb's applications;
   - reconcile payment status deliberately rather than making Stripe the
     teaching-record database.
4. **Transactional email**
   - preserve Caleb's ordinary professional inbox for human communication;
   - use a service such as Resend only for explicit application-generated
     messages;
   - keep recipient selection, guardian/student separation, delivery state,
     retry behavior, and idempotency visible.
5. **Privacy-first public analytics**
   - consider Cloudflare Web Analytics for page/performance trends;
   - do not add cross-site advertising trackers;
   - treat inquiry and booking outcomes as more important than page-view
     volume.
6. **Inquiry operations**
   - create a small private lead/consultation pipeline, either as a separate
     Studio Operations module or a narrowly separated module in a private app;
   - preserve the raw public form submission while recording only the business
     state Caleb actually needs.

**Exit criteria:** each integration has one source of truth, documented data
flow, manual fallback, export path, failure behavior, and measurable time
savings.

### Phase 3 — Selective experiences for others

**Goal:** let clients and students benefit directly without exposing internal
systems.

#### Student/guardian experience

- publish upcoming dates, assignments, approved resources, selected progress,
  and approved lesson summaries;
- distinguish student and guardian recipients and permissions;
- use a separate app/hostname and published snapshot model;
- exclude private notes, bottlenecks not intended for sharing, unrelated
  contacts, and other students' records.

#### Production/mixing client workspace

- project brief and scope;
- milestones and current status;
- reference tracks and approved files;
- revision requests and decisions;
- delivery checklist and final links;
- invoices/payment links;
- a clear record of what is waiting on Caleb versus the client.

These experiences will likely require app-level authentication, a hosted
relational database, transactional email, object storage with expiring links,
authorization tests, audit logs, data retention rules, and a support/recovery
plan. They should not be implemented as views into the current SQLite database.

**Exit criteria:** published data is minimum-necessary, permissions are tested,
revocation works, exports exist, and a compromise of a portal cannot reveal the
instructor workspace.

### Phase 4 — Creative public tools and durable knowledge

**Goal:** make the public ecosystem enjoyable and genuinely useful.

Candidates:

- deeper credits case studies with audio-safe embeds, role explanations, and
  process notes;
- a curated listening room organized around Caleb's contributions and creative
  interests;
- production/mixing articles, glossaries, checklists, and downloadable
  resources;
- interactive but accessible signal-flow, listening, or mix-decision tools;
- a public teaching-method overview without exposing proprietary student data;
- a studio availability/services guide that sets expectations before inquiry;
- a content workflow that turns completed projects and recurring teaching
  insights into drafts Caleb reviews and publishes.

Avoid adding spectacle merely to demonstrate technical ability. Public tools
should reveal taste, teach something, or help someone decide whether to work
with Caleb.

### Phase 5 — Productization, only after proof

If years of use show that the teaching system solves a repeatable problem for
other instructors, consider:

- a generalized instructor operating system;
- reusable curriculum and assessment tooling;
- a local-first or hosted deployment choice;
- multi-tenant identity, billing, support, compliance, and migration.

Do not distort Caleb's own workflow today to serve hypothetical customers.
Extract a product from proven practice later.

## New application/tool opportunities

| Idea | User | Core value | Recommended timing |
| --- | --- | --- | --- |
| Studio Operations desk | Caleb | Leads, consultations, projects, follow-ups, tasks, and real business status | Phase 2 after workflows are modeled |
| Student/guardian companion | Students/guardians | Approved assignments, dates, resources, and progress | Phase 3 |
| Client project workspace | Production/mixing clients | Briefs, revisions, decisions, delivery, and payment clarity | Phase 3 |
| Mobile capture inbox | Caleb | Capture teaching/project ideas without losing context | Phase 1 |
| Listening room | Listeners/prospective clients | Enjoy and understand Caleb's work | Phase 4 |
| Knowledge/resource library | Students, artists, readers | Reusable guidance and search authority | Phase 4 |
| Content operations tool | Caleb | Turn real work and notes into reviewable public drafts | Phase 4 |
| Instructor product | Other teachers | Reuse a proven teaching operating system | Phase 5 |

## Cross-surface copy and authority rule

The public site may summarize reviewed services, prices, packages, and policies
for marketing and inquiry context. It does not establish an operational
catalog, agreement acceptance, Student record, instructional assignment,
progress state, or Client authority. Those facts remain in the applicable
private system and reach a portal only through an explicit, versioned
publication boundary.

Before changing a price, package, cancellation statement, safeguarding claim,
or other policy language, identify the reviewed business/agreement source and
check the private presentation vocabulary for contradictions. Record
discrepancies instead of silently harmonizing copy. See
`docs/CROSS_SURFACE_AUTHORITY.md` and
`docs/PUBLIC_COPY_PARITY_AUDIT.md`.

## Service and technology decision guide

These are candidates, not blanket approvals.

| Need | Preferred first move | Consider later | Avoid |
| --- | --- | --- | --- |
| Private instructor access | Keep localhost origin plus audited Cloudflare Tunnel and Access | Device posture or stronger identity policy if risk grows | Public hostname without an Access policy |
| Public analytics | No analytics or Cloudflare Web Analytics | Self-hosted privacy analytics if custom events become essential | Advertising trackers and invasive profiles |
| Scheduling | Internal authoritative dates plus explicit calendar export | Cal.com or Google Calendar integration after ownership rules | Immediate two-way sync with unclear conflict handling |
| Payments | Stripe Invoices and Payment Links | Checkout/API and verified webhooks when automation earns its cost | Storing card data or building custom payment forms |
| Transactional email | Human-reviewed email drafts and professional domain inbox | Resend or another replaceable API provider | Silent automatic messaging or mixed guardian/student recipients |
| Offsite recovery | Verified SQLite backup, encrypted local backup, Time Machine, encrypted offsite copy | Managed object storage with lifecycle rules | Copying a live SQLite/WAL set through file-sync software |
| Public forms | Keep Formspree while it remains reliable | Serverless form endpoint plus bot protection if control needs grow | Collecting sensitive lesson records through a public form |
| Multi-user relational data | Keep SQLite for the single-instructor app | Managed PostgreSQL for portals/shared operations | Moving databases solely for fashion |
| Client/student files | Text references and existing professional delivery methods | Object storage with scoped, expiring links | Public buckets or storing media inside source control |
| Authentication | Cloudflare Access for Caleb-only internal tools | App-level magic links/passkeys and role authorization for portals | Treating a secret URL as authentication |
| AI assistance | Local/redacted drafting and organization with human review | Narrow, consent-aware workflows with retention controls | Sending private student/client records to a model by default |

## Recommended service references

Capabilities were reviewed against official documentation on 2026-07-26:

- [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/) and
  [private web applications with Access](https://developers.cloudflare.com/cloudflare-one/setup/secure-private-apps/private-web-app/)
- [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/about/)
- [Cal.com documentation](https://cal.com/docs/availability)
- [Google Calendar API](https://developers.google.com/workspace/calendar/api/guides/overview)
- [Stripe Payment Links](https://docs.stripe.com/payment-links) and
  [customer portal](https://docs.stripe.com/customer-management)
- [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
- [Backblaze Mac backup](https://www.backblaze.com/cloud-backup/personal/mac-online-backup)

Before adopting any paid or hosted service, recheck pricing, retention,
security, data-processing terms, exportability, and current capabilities.

## How to choose the next feature

Score proposed work against these questions:

1. How often does the problem happen?
2. How much creative or relational attention does it consume?
3. Who benefits: Caleb, clients, students, parents, collaborators, or
   listeners?
4. Does it belong on the public site, in private operations, or in a separate
   published experience?
5. What becomes the source of truth?
6. What personal data is collected, transmitted, or retained?
7. Can the data be exported and the vendor replaced?
8. What is the manual fallback?
9. How will failure be noticed and recovery tested?
10. Does the result feel more inviting and creativity-focused, or merely more
    automated?

Prefer the smallest feature that removes a repeated burden and preserves a
clear escape hatch.
