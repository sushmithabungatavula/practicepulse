---
name: PracticePulse
description: A warm, professional reputation & feedback platform for independent wellness instructors.
colors:
  paper: "#FBF6ED"
  paper-raised: "#FFFFFF"
  paper-sunken: "#F0E6D3"
  ink: "#201B15"
  ink-soft: "#6B6255"
  ink-faint: "#786F60"
  rule: "#EFE4D2"
  rule-strong: "#DDAF6C"
  accent: "#E2522C"
  accent-dark: "#C4562C"
  accent-soft: "#FCE8DD"
  forest: "#14302A"
  forest-soft: "#C9C1AF"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontWeight: 600
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontWeight: 400
rounded:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "1.75rem"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dark}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
---

# Design System: PracticePulse

## Overview

**Creative North Star: "The Warm Studio"**

PracticePulse presents as a warm, human, professionally-run wellness practice — the visual
opposite of a cold SaaS dashboard. Cream paper grounds, one confident terracotta accent, deep
forest-green for contrast sections, Playfair Display headlines paired with Poppins body text, real
photography, and soft rounded shapes everywhere (buttons are full pills, cards are large-radius
rounded rectangles, never a sharp corner). One system, used identically on every route — the
marketing Landing page and every signed-in screen (Dashboard, Admin, forms) share the same tokens,
the same header, and the same footer.

**History.** This is the second visual system this app shipped. The first, "The Ledger," was a
deliberately austere ink-on-paper system (zero radius, monospace numerals, no serif) chosen
specifically to avoid the warm-cream-plus-serif look common to wellness-app templates. On
2026-09-16 the user was shown that outcome, asked for a specific warm reference template's look on
the Landing page anyway, confirmed after being told this reversed the earlier direction, and then
asked for the same warm system applied consistently everywhere. The Ledger's tokens and components
were removed rather than kept dormant — there is one design system in this codebase, not two.

**Key characteristics:**
- Warm, human palette: cream ground, terracotta accent used generously (not just functionally),
  deep forest-green for high-contrast sections (dark "why switch" block, CTA banners, footer)
- Soft, rounded shapes everywhere: full-pill buttons, large-radius cards (`rounded-2xl`/`3xl`),
  circular avatars and photo crops
- Playfair Display carries every heading (set globally via the `h1, h2, h3` base rule); Poppins
  carries body/UI text
- Real sourced photography (Pexels, URLs verified to resolve) on the Landing page; other surfaces
  use color/typography only, no photography needed
- Star ratings (not the earlier system's numeral-grading mechanic) for anything rating-related

## Colors

Warm and inviting rather than neutral-cool; one accent used with real presence, not rationed.

### Primary
- **Terracotta accent** (`#E2522C`): primary buttons, links, active states, star fills, the one
  color that "is" the brand. Used generously — CTA buttons, nav "Join" button, active tab
  underline, price/stat highlights.

### Secondary
- **Forest green** (`#14302A`): full-bleed contrast sections — the "why instructors switch" panel,
  CTA banners, and the site footer. Never used for small UI elements, only large background
  regions with light text on top.

### Neutral
- **Paper** (`#FBF6ED`): page background, cream.
- **Paper Raised** (`#FFFFFF`): cards/panels sitting on the page.
- **Paper Sunken** (`#F0E6D3`): avatar/image placeholder wells.
- **Ink** (`#201B15`): primary text, near-black with a warm cast.
- **Ink Soft** (`#6B6255`): secondary body text. 5.6:1 contrast on paper.
- **Ink Faint** (`#786F60`): tertiary text (captions, counts). 4.6:1 contrast on paper — kept at or
  above the accessibility floor deliberately after an earlier faint value failed at 2.9:1.
- **Rule** (`#EFE4D2`): borders, dividers, input strokes.

### Named Rules
**The One Accent Rule.** Terracotta is the only saturated accent in the system. It is allowed to
be generous (every primary CTA, every active state) precisely because nothing else competes with
it — no second or third accent color, no rainbow of status colors. Green/red semantic coloring
(e.g. for admin approve/reject) is deliberately avoided in favor of ink/accent/faint text-only
distinctions, so the one accent keeps its meaning.

## Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** Poppins (with system-ui, sans-serif fallback)

**Character:** A classic editorial serif for headlines paired with a warm, rounded, highly
legible grotesk for everything else — the pairing named directly in the reference the user
provided, chosen for approachability over the previous system's deliberately clinical mono/grotesk
pairing.

### Hierarchy
- **Display / Headline** (Playfair Display, 600, `text-2xl`–`text-5xl`): set globally via the
  `h1, h2, h3` base rule in `index.css` — pages do not need to repeat the font family on every
  heading.
- **Stat numerals** (Playfair Display, bold, `text-3xl`–`text-5xl`): KPI values, engagement score,
  average rating — uses the display face rather than a separate mono face.
- **Body** (Poppins, 400, `text-sm`–`text-base`): paragraph copy, form labels use 600 weight.
- **Label/eyebrow** (Poppins, 700, `text-[13px]`, tracked uppercase, accent color): section
  eyebrows on the Landing page only (e.g. "WHY INSTRUCTORS SWITCH"); not used as a kicker directly
  atop a page's main H1 on app screens, where the heading leads on its own.

## Layout

Single-column content, `max-w-md` (forms) to `max-w-6xl` (dashboards/directory), centered, generous
`px-6`–`px-[72px]` gutters that scale with breakpoint. Repeated data (KPI rows, directory listings)
uses a real `gap-4` grid of individually-rounded, individually-bordered cards — not a hairline-rule
grid. A custom `xs: 420px` breakpoint stacks label-plus-control rows (star rating rows, nav) before
Tailwind's default `sm` (640px), since that's where a real phone first gets tight.

## Elevation & Depth

Soft, real drop shadows are back (unlike the predecessor system, which was intentionally flat).
`shadow-sm` on form cards, `shadow-md`/`shadow-2xl` on hero imagery and elevated panels (the dark
section's white stat card). Depth reads as "lifted paper," not "printed document."

## Shapes

Rounded, generously: `rounded-full` on every button and pill/chip, `rounded-xl` on inputs,
`rounded-2xl`–`rounded-3xl` on cards and panels, `rounded-full` on avatars. No sharp corners
anywhere in the system — this is the clearest visual signal distinguishing it from the predecessor
system, which was zero-radius everywhere.

## Components

### Buttons
- **Shape:** `rounded-full` always.
- **Primary:** `bg-accent text-white`, hover `bg-accent-dark`.
- **Secondary (dark):** `bg-ink text-white`, used for a page's second CTA (e.g. "Browse
  instructors" beside "Create your ledger").
- **Ghost/outline:** `border border-rule`, hover inverts to `bg-accent text-white border-accent`.

### Star rating (signature component)
`GradeSelector` renders five outlined stars (`stroke` SVG, `text-rule-strong`); clicking fills
stars up to that value with `fill-accent text-accent`, plus a small hover scale. Used for every
rating input in the product; testimonial/review displays elsewhere use the same visual language as
literal `★`/`☆` characters at matching sizes.

### Cards / Containers
- **Corner style:** `rounded-2xl` to `rounded-3xl`.
- **Background:** `paper-raised` (white) on the `paper` page ground, or plain `white` with a
  `border-rule` stroke and `shadow-sm` for form cards.
- **Internal padding:** `p-5`–`p-8` depending on density.

### Inputs / Fields
- **Style:** `rounded-xl`, `border border-rule`, `bg-paper` fill.
- **Focus:** border becomes `accent`.

### Navigation
One shared `Navbar` component, used on every route including the Landing page (no separate
marketing header). Logo + wordmark on the left, links + auth state in the center/right, primary
action ("Join as instructor") as a filled accent pill. Sticky, cream translucent background with a
bottom hairline. A single shared footer (`App.jsx`) — dark forest-green, Product/Company/Chicago
columns — renders on every route.

## Do's and Don'ts

### Do:
- **Do** use Playfair Display for every heading via the global `h1, h2, h3` rule — don't repeat the
  font-family utility class on individual headings.
- **Do** keep terracotta as the only saturated accent color in the system — see the One Accent
  Rule.
- **Do** use `rounded-full` on every button and chip, `rounded-2xl`+ on every card.
- **Do** use the shared `Navbar`/footer on every route, including Landing — one header, one footer,
  everywhere.

### Don't:
- **Don't** reintroduce a monospace face, zero-radius shapes, or a second accent color — those
  belonged to the retired Ledger system and reintroducing pieces of it (a mono numeral here, a
  sharp-cornered card there) fragments the system back into two.
- **Don't** add a kicker/eyebrow label directly above a page's main heading on Operate-mode
  screens (Dashboard, Admin, forms) — the heading leads. Eyebrows are reserved for Landing-page
  section intros, where they're a deliberate editorial device, not a crutch.
- **Don't** invent a second dark color or a green/red semantic-status palette — admin
  approve/reject/suspend actions use text-only ink/accent/faint distinctions, not colored badges
  beyond the one accent.
