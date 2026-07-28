# Public lesson-copy parity audit

Audit date: 2026-07-28

This is a discrepancy report, not a public-site content change. The public site
remains marketing and inquiry context only. It is not an operational catalog,
an agreement record, a Student record, or a source of Client authority.

## Sources compared

- Public lesson copy in `src/_data/lessons.json` and
  `src/_includes/sections/lessons.njk`.
- Lesson Manager's active product definitions summarized in
  `docs/PORTAL_FOUNDATION_IMPLEMENTATION.md`.
- The cancellation model in
  `docs/STUDENT_PORTAL_ARCHITECTURE_PLAN.md`.

No Student data or Lesson Manager runtime data was opened, imported, or copied.

## Confirmed alignments

| Public claim | Operational definition | Result |
| --- | --- | --- |
| 60-minute lesson: $75 | one `general-60` credit: $75 | Aligned |
| 90-minute lesson: $100 | one `general-90` credit: $100 | Aligned |
| Four-lesson prices: $250–$350 | four 60-minute lessons: $250; four 90-minute lessons: $350 | Prices align |
| College Prep price: $700 | twelve 60-minute College Prep lessons: $700 | Price aligns |

## Items requiring reviewed copy or traceability

1. **The public four-lesson package combines two typed products.** “Four 60 to
   90-minute lessons” can imply interchangeable durations. Lesson Manager
   defines a four-60 product and a four-90 product, and their credit types do
   not substitute. A future public copy change should name the two variants or
   otherwise avoid implying that duration can vary within one purchase.

2. **“12-week program” is not the operational product definition.** The
   operational catalog defines twelve 60-minute College Prep lessons. A
   12-week curriculum template may support the marketing description, but it
   must not be treated as proof that every purchase is scheduled across exactly
   12 weeks. The wording needs a reviewed business source and a clear
   relationship to the twelve-credit product.

3. **The cancellation answer is stronger and less conditional than the
   operational rule.** The public answer says 24 hours permits rescheduling
   “without charge.” The architecture restores the reserved credit at or above
   the threshold subject to replacement availability, while under-24-hour
   exceptions require a recorded reason. Final public wording must be checked
   against the signed agreement and approved cancellation policy before it is
   changed.

4. **Package expiration is omitted from public lesson copy.** The active
   four-lesson and College Prep definitions use a 90-calendar-day expiration.
   Omission is not necessarily a contradiction because the site promises
   complete policies before enrollment, but the enrollment and agreement flow
   must disclose the exact versioned expiration rule.

5. **Several service and safeguarding claims lack a versioned operational
   source in the compared catalog.** These include the free 20-minute
   consultation, the under-16 adult-on-property rule, the cat/allergy notice,
   emergency-contact requirement, and background-check availability. They may
   be valid public policies; they should be traced to reviewed policy or
   agreement text rather than inferred from application data.

## Change rule

Do not silently rewrite prices, packages, policies, or safeguarding language.
A future change should identify the reviewed business or agreement source,
record the reviewer and effective date, and then update public copy and any
affected private-app presentation vocabulary together. Private app CSS and
public-site CSS remain independent.
