# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React (Vite) + Tailwind CSS frontend; FastAPI + SQLAlchemy backend (JWT auth, Postgres in production via Neon, SQLite for local dev). Deployed on Vercel (static frontend + Python serverless API).

## Users

Two primary audiences:

- **Independent wellness instructors** (yoga, meditation, breathwork, Pilates, mindfulness) — solo practitioners, not gym/studio chains, who currently get client feedback only through occasional conversation or scattered public reviews. They log in to manage a profile, read a private analytics dashboard, and hand out a QR code after class.
- **Students/clients** attending a class — anonymous, one-time visitors to the feedback form via QR code. No account, no login, mobile-first (scanned on a phone right after class), used once per visit.

A third, smaller-surface role: **a platform administrator** who approves instructor accounts, moderates reviews, and monitors platform-wide metrics.

## Product Purpose

PracticePulse gives independent wellness instructors a centralized way to collect anonymous client feedback, monitor satisfaction/engagement/retention trends over time, and showcase verified testimonials on a public professional profile — turning scattered, occasional feedback into an operating business-intelligence habit and a compounding public reputation.

## Positioning

Existing review platforms (Yelp/Google-style) show public star ratings but give instructors no operational insight and no habit loop. PracticePulse is explicitly BI/operations-first, not a public review site and not AI-driven: structured per-class surveys roll up into KPI dashboards (satisfaction, NPS-style recommend rate, retention, engagement score, monthly trend, theme extraction) an instructor can act on, while the public-facing side stays a secondary, earned showcase rather than the point of the product.

## Operating Context

- Instructor-side sessions happen at a desk/laptop, checking a dashboard between classes or planning weekly.
- Student-side sessions happen standing, right after class, on a phone, scanning a QR code taped near the exit or handed out verbally — must be completable in under a minute, thumb-only, no typing-heavy fields beyond two short optional free-text boxes.
- Admin sessions are occasional, desk-based, review-queue style work (approve/reject signups, moderate flagged reviews).
- The public instructor profile is a reputation artifact instructors will link from Instagram bios, websites, and printed studio materials — it needs to hold up as something screenshot-worthy/shareable, not just functional.

## Capabilities and Constraints

- Instructor: registration (pending admin approval), JWT login, editable profile (bio, certifications, specialties, class offerings, gallery via image URLs, social/contact links), auto-generated QR code linking to their feedback form.
- Student feedback: no account; 6 category star ratings (overall, communication, pacing, welcomed, community, knowledge), a 0–10 recommend score, two short free-text fields (favorite aspect, suggestions), optional demographics (experience level, neighborhood, wellness goal), optional consent + display name to publish a comment as a testimonial.
- Analytics dashboard: average rating, satisfaction rate, recommendation rate/NPS, returning-student rate, review growth, a composite engagement score, monthly rating trend chart, per-category breakdown chart, and stopword-filtered keyword-frequency extraction for "common positive themes" / "requested improvements" — deliberately no LLM/AI calls in this pipeline, matching the product's BI-not-AI positioning.
- Public surface: searchable instructor directory + individual profile pages with bio, certifications, specialties, offerings, gallery, rating, and consented testimonials.
- Admin: approve/reject/suspend instructor accounts, remove individual reviews with a recorded reason, platform KPI metrics, CSV export.
- Constraint: designed to comfortably support roughly 30 instructor accounts (small-scale, not built for thousands of concurrent tenants).
- Constraint: photo/gallery fields are plain URLs, not file upload + storage.

## Brand Commitments

Product name is "PracticePulse." No existing logo, color system, or typographic identity has been committed to yet — the current visual treatment (sage/clay palette, Fraunces serif) is a first pass the user has explicitly asked to replace because it reads as generic/AI-templated. Positioning language ("know how your classes are really landing," "business intelligence over AI") from the original brief can inform tone but is not a locked tagline.

## Evidence on Hand

- No real customer logos, press, testimonials, or case studies exist; a seeded demo instructor ("Sushmitha B.," Chicago-based vinyasa/restorative teacher) with ~48 synthetic feedback entries is used for local/demo data only and must not be presented as a real testimonial or real usage evidence.
- No brand photography exists; gallery/profile-photo fields are empty by default (URL-based, instructor-supplied).

## Product Principles

1. BI over AI: every analytics feature must be explainable/derivable from the data an instructor can see, not a black-box model — this is a stated differentiator, not an implementation shortcut.
2. Student-side is a 60-second, thumb-only, anonymous ritual — any added friction (extra required fields, account creation, slow loads) directly costs response volume.
3. Instructor-side is an operating tool checked repeatedly, not a one-time landing page — scanability and information density matter more than persuasion.
4. The public profile is a reputation asset instructors will link elsewhere — it should feel credible and professional enough to put in an Instagram bio, not like a generic SaaS demo screen.
5. Built for a specific, small, real community (independent Chicago wellness instructors), not a generic multi-vertical marketplace — the tone should read as crafted for that world, not templated for "any local service business."

## Accessibility & Inclusion

No formal accessibility standard was specified by the user. Given the student-facing feedback form is used immediately after physical activity (phones, possibly sweaty hands, sometimes outdoors/bright light), touch targets and color contrast should be generous by default; treat this as a practical constraint rather than a formal compliance requirement.
