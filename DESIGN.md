---
name: PracticePulse
description: A graded operating ledger for independent wellness instructors — not a wellness app.
colors:
  paper: "#F2F1ED"
  paper-raised: "#FFFFFF"
  paper-sunken: "#E8E6DF"
  ink: "#141311"
  ink-soft: "#524F47"
  ink-faint: "#6B675E"
  rule: "#D9D6CC"
  rule-strong: "#B9B6AA"
  ledger-red: "#A32E22"
  ledger-red-soft: "#F4E4DF"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontWeight: 400
  numeral:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontWeight: 700
    fontFeatureSettings: "tnum 1"
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "11px"
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  none: "0px"
spacing:
  hairline: "1px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ledger-red}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  kpi-card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: PracticePulse

## Overview

**Creative North Star: "The Ledger"**

PracticePulse refuses to look like a wellness app. Every independent-instructor product in this
category defaults to the same look — a warm cream ground, an airy serif display face, rounded
pill buttons, soft drop-shadowed cards, lotus/zen iconography — because the category reads as
"soft, calming, spa-adjacent." This system is built on the opposite instinct: the product's real
job is business intelligence for a working professional, so it borrows its visual grammar from a
graded business report — a state-of-the-studio ledger an instructor would actually keep. Every
number reads like a ledger entry (monospace, tabular). Every rating is a literal graded mark, not
a star. Every approval is a stamp, not a colored badge. The one accent color is used the way
accounting uses red ink — functionally, for negative or flagged states — never decoratively.

This was chosen through Impeccable's concept-roll process (direction 3 of 7 grounded candidates,
seed `0b771ea1`) against six catalog challengers; the strongest challenger — a recording-studio
VU-meter-bridge world — was judged competitive but not adopted for this build, in favor of the
Ledger's broader legibility across a mostly task-first (Operate-mode) app.

**Key characteristics:**
- Restrained color strategy: near-monochrome ink-on-paper, with one functional red accent
- Zero border-radius everywhere — sharp corners read as "document," not "app"
- Monospace numerals carry the display weight typically given to a display serif
- A hand-drawn "stamp" motif (rotated border, circled grade) is the system's signature interaction

**Exception: the public Landing page (`/`).** On 2026-09-16 the user explicitly asked, after being
told this reverses the Ledger direction, for the public marketing page specifically to match a
pasted reference screenshot — a warm-cream, terracotta-accent, forest-green, serif-display
template. That page (`frontend/src/pages/Landing.jsx`) runs on its own separate `warm.*` Tailwind
tokens and `font-display`/`font-warm` faces (Playfair Display + Poppins), defined alongside but
never merged into the tokens above, and renders its own header/footer instead of the shared
`Navbar`/app footer. Every other route — including the instant a visitor clicks "Log in" or "Join"
from that page — is on The Ledger as documented below. Do not extend the warm palette to any other
route without the same kind of explicit, informed override; do not quietly migrate The Ledger
toward warm tones because the Landing page sits next to it.

## Colors

Near-monochrome and paper-based, deliberately cool rather than warm/cream, with exactly one
functional accent.

### Primary
- **Ink** (`#141311`): the only "brand color" in the system. Carries headlines, primary buttons,
  primary numerals, borders that need to read as structural (not decorative).

### Neutral
- **Paper** (`#F2F1ED`): page background. Cool, neutral off-white — chosen specifically to avoid
  the "warm cream ground" that AI-generated interfaces default to.
- **Paper Raised** (`#FFFFFF`): card/panel surfaces sitting on the page ground; the only depth cue
  in the system (no shadows).
- **Paper Sunken** (`#E8E6DF`): image/avatar placeholder wells, subtly recessed.
- **Ink Soft** (`#524F47`): secondary body text (subheads, descriptions). Contrast ratio 7.2:1 on
  paper.
- **Ink Faint** (`#6B675E`): tertiary text (captions, counts, timestamps). Contrast ratio 5.0:1 on
  paper — deliberately kept at/above the 4.5:1 floor for small text.
- **Rule** (`#D9D6CC`): hairline dividers and default input/card borders.
- **Rule Strong** (`#B9B6AA`): scrollbar thumb, stronger dividers.

### Functional (not decorative)
- **Ledger Red** (`#A32E22`): reserved for grading marks, flags, negative states, and the one
  primary hover treatment. Contrast ratio 6.3:1 on paper.
- **Ledger Red Soft** (`#F4E4DF`): reserved tint for red-adjacent surfaces (currently unused in
  built screens; kept for future negative-state banners).

### Named Rules
**The In-The-Red Rule.** Red is never a "brand accent." It appears only where it functions as a
literal accounting/grading mark: a selected grade circle, a flagged review, a rejected account, a
hover state on an action that "stamps" something. If a use of red can't be described as marking
something graded, approved, or flagged, it's the wrong color.

## Typography

**Display / Body Font:** Archivo (with system-ui, sans-serif fallback)
**Numeral Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** One grotesk carries every headline and every sentence of body copy — deliberately
*not* paired with a display serif, which is the category's most common "premium" tell (see
Don'ts). JetBrains Mono is reserved entirely for numbers: KPI values, ratings, dates, counts. The
pairing reads as "measured" rather than "designed to look elegant."

### Hierarchy
- **Display** (Archivo, 800, `text-5xl`–`text-6xl`, `-0.04em` tracking, `leading-[0.98]`): page
  H1s on Persuade surfaces (Landing hero).
- **Headline** (Archivo, 800, `text-2xl`–`text-3xl`, `-0.04em` tracking): page H1s on Operate
  surfaces (Dashboard, Admin, forms, profile pages).
- **Numeral — hero** (JetBrains Mono, 700, `text-5xl`–`text-6xl`, tabular figures): the single
  dominant stat in a panel (Landing sample ledger, engagement score, average rating).
- **Numeral — data** (JetBrains Mono, 700, `text-lg`–`text-3xl`, tabular figures): KPI card
  values, chart-adjacent figures, table cells.
- **Label** (JetBrains Mono, 500, 11px, `0.05em` tracking, uppercase): field labels, masthead
  captions, tab labels, chip text. Never sits directly above a page heading (see Don'ts).
- **Body** (Archivo, 400, `text-sm`–`text-base`): paragraph copy, max measure ~60ch on prose
  blocks.

### Named Rules
**The No-Serif Rule.** No serif face ships anywhere in this system. The category default pairs a
grotesk body with a high-contrast serif display for "editorial gravitas"; this system gets its
gravitas from monospace ledger numerals instead. A future contributor adding a serif "for
elegance" is reintroducing the exact rut this system was built to refuse.

## Layout

Single-column content max-width `max-w-3xl`–`max-w-6xl` depending on surface density, centered,
`px-4 sm:px-6` gutters. Grids of repeated data (KPI rows, directory listings, admin tables) use
`gap-px bg-rule` so the gap itself renders as a hairline rule between cells, rather than a gap plus
separately-bordered cards — this is the system's main "ledger sheet" structural device. Custom
breakpoint `xs: 420px` is added below Tailwind's default `sm` specifically so cards/forms with a
label-plus-control row (grade selectors, nav) can stack before `sm`'s 640px, since the earliest
squeeze point on a real phone happens well under 640px.

## Elevation & Depth

No shadows anywhere in the system. Depth is conveyed by exactly two devices: (1) a background
value shift (`paper` → `paper-raised` white) for anything "on top of" the page, and (2) a 1px
`rule`-colored border. This is a deliberate rejection of the soft-drop-shadow card language the
category defaults to.

### Named Rules
**The Flat Ledger Rule.** If a component needs to look "raised," give it a white fill and a
hairline border, never a shadow. The one sanctioned exception is the `.stamp` utility (rotation +
irregular double-border), which reads as a physical ink stamp, not elevation.

## Shapes

Border-radius is `0` everywhere except two intentional exceptions: the QR-code image itself (kept
square, no radius either, for the record) and nothing else — every button, input, card, chip, and
avatar well is a hard rectangle. The one curved form in the system is the hand-drawn circle SVG
path in `GradeSelector`, which is deliberately imperfect/organic (a Catmull-Rom-style wobble, not
a true circle) to read as drawn-on rather than vector-perfect.

## Components

### Buttons
- **Shape:** hard rectangle, `0` radius.
- **Primary:** `bg-ink text-paper`, `px-6 py-3`, uppercase JetBrains Mono label, wrapped in the
  `.stamp` utility (slight rotation + offset double border) on the highest-intent actions (submit,
  primary CTA). Hover: `bg-ledger-red`.
- **Secondary:** transparent fill, `border border-ink`, same label treatment. Hover: inverts to
  `bg-ink text-paper`.

### Grade Selector (signature component)
A row of five JetBrains Mono numerals (1–5); selecting one draws a hand-circled red mark around it
via an animated SVG stroke (`stroke-dasharray`/`stroke-dashoffset`, 0.32s ease-out, respects
`prefers-reduced-motion`). Replaces a conventional star-rating widget system-wide — stars never
appear anywhere in this product. Stacks label-above-control below the `xs` breakpoint.

### Chips / Tags
- **Style:** `border border-ink` (or `border-ledger-red` for a "flagged" semantic), no fill, no
  radius, small JetBrains Mono or Archivo text depending on context.

### Cards / Containers ("ledger panels")
- **Corner Style:** `0` radius, always.
- **Background:** `paper-raised` (white) on the `paper` page ground.
- **Border:** `1px solid` `rule` (default) or `ink` (masthead-style panels: hero sample ledger,
  public-profile credential card).
- **Internal Padding:** `p-4`–`p-6` depending on density.

### Inputs / Fields
- **Style:** `border border-rule`, `0` radius, `bg-paper` fill (not white — inputs sit visually
  "in" the page, not "on" a card).
- **Focus:** border darkens to `ink`; global `:focus-visible` outline is `2px solid ledger-red`.

### Navigation
JetBrains Mono uppercase labels, `whitespace-nowrap`, wraps onto a second row (`flex-wrap`) rather
than truncating or hiding behind a hamburger menu below `sm`. Wordmark is a bordered "PP" mono mark
plus the full wordmark, both always visible (no icon-only collapse).

## Do's and Don'ts

### Do:
- **Do** render every number in JetBrains Mono with tabular figures — this is the system's most
  load-bearing typographic rule.
- **Do** use `gap-px bg-rule` grids for repeated data instead of individually-bordered, shadowed
  cards.
- **Do** keep red strictly functional (grading, flags, negative states, one hover treatment) — see
  the In-The-Red Rule.
- **Do** stack label-above-control on any row that pairs a text label with a multi-item control
  below the `xs` (420px) breakpoint.

### Don't:
- **Don't** add a serif face, anywhere, for any reason — see the No-Serif Rule.
- **Don't** place a small uppercase label directly above a page heading (a "kicker"/"eyebrow").
  This was shipped across nine surfaces in the first pass of this redesign and removed in the
  finish review; the heading must lead. The one sanctioned exception is a bordered "stamp" object
  (a discrete graphic mark, not a typographic label) directly above a confirmation heading, such as
  the "Recorded" stamp on the feedback thank-you screen.
- **Don't** use star icons, unicode or otherwise, for ratings — use the Grade Selector / graded
  numeral display instead.
- **Don't** add a drop shadow to a card for "elevation" — see the Flat Ledger Rule.
- **Don't** round a corner. If a component needs to look softer, that's a signal it doesn't belong
  in this system, not a cue to add `rounded-*`.
