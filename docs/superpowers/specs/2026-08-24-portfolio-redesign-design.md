# Portfolio Site Redesign — Design Spec

**Date:** 2026-08-24
**Status:** Approved for planning

## Context

The site ("Seventh Trumpet Portfolio") is a Next.js + Tailwind v4 + DaisyUI single-page
portfolio with a gothic/emo-industrial aesthetic and three swappable themes (Seventh
Trumpet / Black Parade / Californication) driven entirely by CSS custom properties in
`app/globals.css`. The visual identity — colors, fonts (Cinzel + JetBrains Mono), glow/
glitch/scanline effects, clip-path angular cards, VS-Code-style sidebar nav — is liked
and must be preserved exactly. What needs work is everything *under* that identity://
every component hand-rolls its own inline styles and hover handlers (no shared
primitives), the layout forces full-viewport `scroll-snap` sections regardless of
content length, the mobile experience was clearly a desktop-first afterthought, and
several accessibility basics (focus rings, reduced-motion, contrast, aria-labels) are
missing outright. Two outright bugs were also found during review (see "Bugs to fix").

This redesign is a structural/UX pass, not a re-skin: no color, font, or theme value
changes.

## Plan Split

This spec is large enough to implement as two separate plans rather than one:

- **Plan A — Foundation:** design tokens, the five `components/ui/` primitives,
  scroll-snap removal, responsive nav, footer/main-content spacing fix, and the two
  concrete bugs (gallery mobile padding, footer overlap). Ships a working, fully
  testable improvement on its own.
- **Plan B — Component migration:** one task per section component (Hero, About,
  TechStack, Projects, Experience, Contact, CreativeArtifacts) migrating it onto the
  Plan A primitives and applying its component-specific accessibility fixes
  (aria-labels, reduced-motion guards).

Run Plan A to completion first; Plan B depends on the primitives it creates.

## Goals

- Extract shared UI primitives (Button, Badge, Card, SectionHeader, Container) to kill
  the duplicated inline-style/hover-handler pattern repeated in every component.
- Replace forced `scroll-snap` full-viewport sections with natural document flow so
  section height matches content, not the viewport.
- Make the VS-Code sidebar nav genuinely responsive: desktop sidebar stays, mobile gets
  a real top-bar + drawer with focus management, not just a `transform`-hidden copy of
  the desktop element.
- Fix accessibility gaps: focus-visible rings, aria-labels on icon-only controls,
  `prefers-reduced-motion` guards on decorative animation, contrast audit across all
  three themes, ≥44px touch targets on mobile.
- Consolidate ad hoc spacing/font-size values into a token scale (4/8px spacing rhythm,
  a defined type scale) so components stop inventing one-off values like `0.85rem`,
  `1.75rem`, `2px` per component.
- Fix the two concrete bugs found (gallery mobile padding, fixed-footer overlap).

## Non-goals

- No changes to `--clr-*`, `--bg-*`, `--hero-gradient`, gradients, glow shadows, fonts,
  or any of the three theme palettes.
- No content/copy changes.
- No new sections, pages, or features beyond what exists (Hero, About, TechStack,
  Projects, CreativeArtifacts, Experience, Contact, Footer, `/gallery`).
- `TechStack.tsx`'s bespoke mechanical-keyboard interaction (physical key press →
  keycap animation, Web Audio click) is a signature feature — keep the interaction
  model as-is; only apply token/accessibility fixes (aria-labels, focus states, reduced
  motion for the infinite holographic-flicker animation), not a rewrite of the
  mechanism.
- No migration to shadcn/ui or any external component library — "structured design
  system" here means our own small `components/ui/` primitives on top of the existing
  Tailwind + CSS-vars setup, not adopting a new dependency.

## 1. Design Tokens (`app/globals.css`)

Add alongside the existing color custom properties, in `:root` (theme-independent —
these don't vary per theme):

```css
/* Spacing scale (4px base rhythm) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */

/* Type scale */
--text-xs: 0.75rem;   /* 12px — labels, timestamps */
--text-sm: 0.875rem;  /* 14px — secondary body */
--text-base: 1rem;    /* 16px — body default */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.5rem;    /* 24px */
--text-2xl: 2rem;     /* 32px */
--text-3xl: 3rem;     /* 48px — section titles, clamp()'d up from here */

/* Z-index scale (documents the existing ad hoc values: 1000 footer, 1100 sidebar/theme
   switcher, 1101 mobile toggle, 2000 lightbox) */
--z-nav: 1000;
--z-overlay: 1100;
--z-modal: 2000;
```

Change `body { font-size: 15px; }` (`globals.css:182`) to
`body { font-size: var(--text-base); }` (16px) — fixes the mobile auto-zoom-on-focus
risk and the sub-minimum body text size. Component font-sizes that were previously
one-off values (`0.85rem`, `0.9rem`, `0.82rem`, etc.) get remapped to the nearest token
in `--text-*` as each component is touched — this doesn't have to be a single global
find-replace, just: no new one-off sizes going forward, and existing ones get fixed
opportunistically per component in the tasks below.

Add a global focus style (themes inherit it via `--clr-primary`, so it auto-adapts per
theme with zero extra work):

```css
:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}
```

Add a reduced-motion guard wrapping the existing decorative `@keyframes` usage:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up,
  .animate-flicker,
  .animate-pulse-glow,
  .glitch:hover,
  .glitch:hover::before,
  .glitch:hover::after {
    animation: none !important;
    transition: none !important;
  }
}
```

Components with **JS-driven** infinite loops need a `prefers-reduced-motion` check in
the component itself (see Task list) since CSS alone can't stop a `setInterval`/
Framer Motion `repeat: Infinity` loop. Priority differs by trigger: Hero's typewriter
tagline cycle and About's code-typing effect both autoplay unconditionally on
scroll-into-view with no user action — these are the real motion-sensitivity risk and
should be fixed first. TechStack's holographic-flicker animation only plays on
hover/keypress, a deliberate user action — still worth guarding for completeness, but
lower priority than the two autoplaying loops.

## 2. Component Primitives (`components/ui/`)

New directory, five small files, each wrapping an existing CSS class/pattern rather
than inventing new visual language:

- **`Button.tsx`** — `variant: "primary" | "outline"`, `size?: "sm" | "md"`. Replaces
  the duplicated inline CTA styling + `onMouseEnter`/`onMouseLeave` pairs in
  `Hero.tsx:145-196` and `Contact.tsx:50-83`. Hover state becomes a real CSS class
  (`.btn-primary:hover`) so it also works correctly with `:focus-visible` for keyboard
  users — the current `onMouseEnter` approach never fires on keyboard focus, which
  means keyboard users currently get zero visual feedback on these buttons.
- **`Badge.tsx`** — wraps the existing `.tech-badge` class (already defined in
  `globals.css:550-570`) plus the ad hoc pill style duplicated in
  `About.tsx:100-129`. Props: `icon?: ReactNode`, `children`.
- **`Card.tsx`** — wraps `.industrial-card` (`globals.css:421-459`), used by
  `Projects.tsx`, `Experience.tsx`'s timeline card, and `CreativeArtifacts.tsx`.
  Accepts `accentColor?: string` for the per-project accent border (replaces the
  `project-card-${id}` className lookup pattern).
- **`SectionHeader.tsx`** — wraps `.section-title` + the `// comment-style` subtitle
  paragraph pattern repeated identically in `Projects.tsx:75-89`,
  `Experience.tsx:45-59`, `Contact.tsx:29-34`, `CreativeArtifacts.tsx:125-138`. Props:
  `title: string`, `subtitle?: string`.
- **`Container.tsx`** — thin wrapper applying `max-width` + horizontal padding
  consistently (currently every section hand-writes its own
  `maxWidth: "1200px", margin: "0 auto"`).

Each section component (`Hero`, `About`, `TechStack`, `Projects`, `Experience`,
`Contact`, `CreativeArtifacts`) is updated to consume these primitives in place of its
inline-styled duplicates. `TechStack.tsx`'s keycap grid keeps its own bespoke markup
(that's the signature interaction, not something to templatize) — only its header
block and any plain buttons/badges route through the new primitives.

## 3. Layout & Navigation

**Drop forced scroll-snap.** Remove `scroll-snap-type: y mandatory` from `html`
(`globals.css:188-191`) and `scroll-snap-align: start` / `scroll-snap-stop: always`
from `.vertical-section` (`globals.css:216-226`). Change `.vertical-section` from
`min-height: 100vh` to `min-height: auto` with generous vertical padding
(`var(--space-24) var(--space-16)` desktop) so section height follows content. Add
`scroll-margin-top: var(--space-8)` to `.vertical-section` so anchor-link scrolling
(`Navbar.tsx`'s `scrollIntoView`) still lands with breathing room instead of flush
against the viewport top.

**Responsive nav.** Desktop (≥1024px) keeps the current `.vscode-sidebar` fixed
layout unchanged. Below 1024px, replace the current "same fixed sidebar element,
just `transform`-slid off-screen" approach (`globals.css:894-911`) with:
- A slim top bar (theme-matched background, holds only the mobile menu toggle +
  brand mark) instead of a floating top-right button.
- The drawer, when open, gets `role="dialog"` `aria-modal="true"`, traps focus (first
  focusable element receives focus on open, `Escape` closes it, focus returns to the
  toggle button on close), and the toggle button gets
  `aria-label="Toggle navigation menu"` + `aria-expanded={isMobileOpen}`
  (`Navbar.tsx:106-123` currently has neither).
- Touch targets for `.file` / `.folder-header` nav items bumped to a minimum 44px
  tap height on mobile via a `@media (max-width: 768px)` override (currently
  `padding: 0.35rem 0.75rem` ≈ 30px).

**Fixed-footer overlap fix.** Keep the footer visually `position: fixed` (that's the
intended persistent-brand-bar look). `Footer.tsx`'s three flex-wrapped children
(brand / "Crafted with ♥" / copyright) can currently wrap to two lines on narrow
phones, so a single guessed height value isn't reliable — first make the footer
reliably single-line by hiding the center "Crafted with ♥ by SUCHAKREE" line below
480px (`@media (max-width: 480px) { .footer-signature { display: none; } }` — it's the
least essential of the three, brand mark and copyright stay). With that in place,
define `--footer-height: 3.25rem` (52px — matches the now-guaranteed single-line
height plus its `0.5rem` vertical padding) as a token in `app/globals.css`, and add
`padding-bottom: var(--footer-height)` to `.main-content-wrapper`
(`globals.css:780-786`) instead of the current one-off `paddingBottom: "100px"`
hardcoded only in `Contact.tsx:18` (remove that inline style once the global padding
is in place). This guarantees no section's content is ever obscured, not just the
last one.

**Gallery mobile padding bug.** In `app/gallery/page.tsx`, `CreativeArtifacts` is
rendered with `isGalleryPage={true}`, which sets an inline
`paddingLeft: isGalleryPage ? "20rem" : undefined` in `CreativeArtifacts.tsx:120`.
Because inline styles beat the `.vertical-section` mobile media-query override, this
produces a permanent 20rem (320px) blank gutter on mobile regardless of viewport.
Fix: remove the inline `paddingLeft`/`paddingRight`/`paddingTop` overrides from
`CreativeArtifacts.tsx` and instead add a `.gallery-page-section` class (desktop:
`padding-left: 20rem`, mobile: falls back to the standard `.vertical-section` mobile
padding like every other section already does).

## 4. Theme Verification

After the structural changes, manually check all three themes
(`?theme` via the existing `ThemeSwitcher`) at 375px, 768px, 1024px, 1440px for:
- Text contrast ≥4.5:1 for body text, ≥3:1 for large text (Californication's white
  text and Black Parade's muted grays are the likely offenders — spot-check with
  browser devtools contrast checker, do not introduce new colors to fix this, only
  flag if an existing pairing genuinely fails and needs a second look).
- `:focus-visible` ring renders legibly against each theme's background.
- Clip-path/angular-corner styling still looks correct in Californication, which
  already sets `--rounded-box: 0rem` / `--rounded-btn: 0rem` — the new `Button`/`Card`
  primitives must not hardcode `border-radius` in a way that fights this per-theme
  override.

## Bugs to Fix (rolled into tasks above)

1. Gallery page mobile padding gutter (Section 3, "Gallery mobile padding bug").
2. Fixed-footer content overlap only compensated on one section (Section 3, "Fixed-
   footer overlap fix").
3. `components/SmoothScroller.tsx` (Lenis) is fully implemented but never imported —
   delete the dead file rather than wiring it up. `Navbar.tsx`'s anchor navigation
   calls native `section.scrollIntoView({ behavior: "smooth" })`; mixing that with
   Lenis's own scroll hijacking is a known source of double-scroll/jank bugs, and
   avoiding it safely would mean also rewriting the nav's scroll calls to go through
   `window.lenis.scrollTo(...)` — scope creep beyond this redesign. The existing
   `html { scroll-behavior: smooth; }` (`globals.css:174-176`) is sufficient once
   scroll-snap is removed.

## File List

- Modify: `app/globals.css` (tokens, remove scroll-snap, focus/reduced-motion rules,
  responsive nav rules, footer spacing var)
- Delete: `components/SmoothScroller.tsx` (dead code, never imported — see "Bugs to
  Fix" item 3)
- Modify: `app/gallery/page.tsx` (remove reliance on inline padding hack — see
  `CreativeArtifacts.tsx` fix)
- Create: `components/ui/Button.tsx`, `Badge.tsx`, `Card.tsx`, `SectionHeader.tsx`,
  `Container.tsx`
- Modify: `components/Navbar.tsx` (responsive drawer, aria attributes, focus trap)
- Modify: `components/Hero.tsx` (use `Button`, reduced-motion guard on tagline loop)
- Modify: `components/About.tsx` (use `Card`/`Badge`, reduced-motion guard on typing
  loop)
- Modify: `components/TechStack.tsx` (aria-labels on keycap buttons, reduced-motion
  guard on holographic flicker, header via `SectionHeader`)
- Modify: `components/Projects.tsx` (use `Card`, `Badge`, `SectionHeader`, `Button`
  for links)
- Modify: `components/Experience.tsx` (use `Card`, `SectionHeader`)
- Modify: `components/Contact.tsx` (use `Button`, `SectionHeader`)
- Modify: `components/CreativeArtifacts.tsx` (use `SectionHeader`, fix gallery padding
  bug, aria-label on lightbox close button)
- Modify: `components/Footer.tsx` (hide `.footer-signature` center line below 480px
  so height stays single-line and predictable; height becomes a shared
  `--footer-height` var consumed by `.main-content-wrapper`)

## Verification

- `npm run build` succeeds with no TypeScript errors.
- Manual pass at 375px, 768px, 1024px, 1440px, all three themes: no horizontal
  scroll, no content hidden behind the fixed footer, mobile drawer opens/closes/traps
  focus/`Escape`-closes correctly, `/gallery` has no left-gutter bug on mobile.
- Keyboard-only pass: Tab through the whole page — every interactive element (nav
  items, buttons, badges-if-interactive, theme switcher, TechStack keycaps, lightbox
  close) shows a visible focus ring and is operable without a mouse.
- `prefers-reduced-motion: reduce` (via browser devtools emulation): glitch, flicker,
  pulse-glow, Hero tagline typing, About code-typing, and TechStack holographic
  flicker all stop or reduce to a static state.
- Visual diff against current site: colors, fonts, and per-theme identity must be
  pixel-identical — only spacing, structure, and interaction should change.
