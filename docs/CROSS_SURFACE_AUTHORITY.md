# Cross-surface authority contract

Version: 1.0

Caleb Kuhlmann Studio is one product family with separately deployable
surfaces. Operational and instructional truth originates in Lesson Manager;
brand direction originates in the public product vision and the reviewed
private-app design contract.

| Content or concern | Authority | Permitted consumers |
| --- | --- | --- |
| Brand principles | Public product vision | All surfaces |
| Pure RGB accent identity | Existing `chk-site` design | Both private app design systems |
| Private app design tokens and component rules | Versioned shared app design contract | Lesson Manager and Student Portal |
| Public marketing copy | `chk-site` | Public website |
| Product catalog and operational policy | Versioned Lesson Manager records and reviewed agreement | Manager, portal, reviewed public copy |
| Assigned curriculum | Lesson Manager | Approved portal projection |
| Milestones and progress | Lesson Manager | Approved portal projection |
| Assignments | Lesson Manager | Approved portal projection |
| Lesson recap | Published immutable Lesson Manager revision | Portal |
| Student resources | Approved Lesson Manager link record | Portal |
| Student and guardian records | Lesson Manager | Minimum scoped portal projection |

Copy parity means exact UTF-8 words, punctuation, capitalization, paragraph
boundaries, sequence, status, hierarchy, and field meaning survive publication
and receipt. Presentation labels are separate. The only current label map is
the versioned mechanical status map (`not-started` → `Not started`,
`in-progress` → `In progress`, `completed` → `Completed`, and `repeated` →
`Repeated`). A mapped label never changes a content value.

Assigned plans are Student-specific snapshots. Template changes never rewrite
them. Curriculum publication uses an instructor-reviewed preview of the
assigned snapshot, then appends an immutable version and outbox intent in one
transaction. Corrections append a superseding version; revocation appends a
revocation version. Portal restore recovery uses confirmed republishing and
reconciliation, never direct database access.

Published recaps are immutable reviewed snapshots. The Portal renders their
published fields and selected resource records exactly; it never combines a
published recap with current lesson or milestone data.

`chk-site` may market services, but public copy is not a Student record and
never becomes curriculum or operational authority. Product facts and policy
claims require a reviewed agreement or versioned catalog source. Private
records and private fixtures never enter the public repository.

Any feature displaying curriculum, milestones, assignments, lesson recaps,
progress, resources, product facts, or policy language must identify its
authoritative source before implementation. The Student Portal must not invent
or independently maintain instructional content.

Any feature introducing a new private-app color, type treatment, brand mark,
navigation pattern, component state, or major layout convention must be
evaluated against the shared Lesson Manager and Student Portal design
contract. Audience-specific density may differ, but the two applications must
remain one recognizable product family.

Cross-surface copy, structure, contract, or styling changes require an
authority and parity review.
