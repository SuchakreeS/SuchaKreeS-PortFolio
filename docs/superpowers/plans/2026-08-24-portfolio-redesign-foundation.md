# Portfolio Redesign — Plan A: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the design-token layer, five reusable UI primitives, and fix the
structural/accessibility/layout problems (scroll-snap, responsive nav, footer overlap,
gallery padding bug, dead code) in the existing portfolio site — with zero visual
identity change (colors, fonts, per-theme palettes stay exactly as they are today).

**Architecture:** This is a Next.js 15 App Router + Tailwind v4 + DaisyUI site. All
theming runs through CSS custom properties in `app/globals.css`, swapped via a
`[data-theme]` attribute on `<html>`. This plan adds new tokens and utility classes
alongside the existing ones, adds five presentational React components under
`components/ui/`, and edits `globals.css` / `Navbar.tsx` / `Footer.tsx` /
`Contact.tsx` / `CreativeArtifacts.tsx` for the structural fixes. No section component
(Hero, About, TechStack, Projects, Experience) is migrated onto the new primitives in
this plan — that's Plan B, which depends on the primitives this plan creates.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS v4,
DaisyUI v5, `lucide-react` for icons. No test runner is installed in this repo —
verification in this plan is `npm run build` (TypeScript + Next.js build must succeed
with zero errors) plus manual browser checks with exact steps and exact pass criteria.

**Spec:** `docs/superpowers/specs/2026-08-24-portfolio-redesign-design.md`

## Global Constraints

- Zero changes to any `--clr-*`, `--bg-*`, `--hero-gradient`, `--glow-*`, or per-theme
  (`[data-theme="black-parade"]`, `[data-theme="californication"]`) values.
- Zero changes to `--font-display` (Cinzel) / `--font-mono` (JetBrains Mono).
- No new npm dependencies.
- No test framework introduced — verify via `npm run build` and manual browser checks
  as specified per task.
- Every commit must leave `npm run build` passing (no broken intermediate states).

---

## Task 1: Design Tokens & Global Accessibility/Motion Rules

**Files:**
- Modify: `app/globals.css:15-61` (add tokens to `:root`), `app/globals.css:178-186`
  (`body` font-size)

**Interfaces:**
- Produces: CSS custom properties `--space-1` through `--space-24`, `--text-xs`
  through `--text-3xl`, `--z-nav`, `--z-overlay`, `--z-modal` — consumed by every
  later task in this plan and by Plan B.
- Produces: global `:focus-visible` outline rule and a `prefers-reduced-motion`
  media-query block — consumed by Task 6 (nav) and by Plan B's component tasks.

- [ ] **Step 1: Add spacing, type, and z-index tokens to `:root`**

In `app/globals.css`, inside the existing `:root { ... }` block (the one starting at
line 15, right after the `--btn-glow: var(--glow-purple);` line at line 60), add:

```css
  /* ---------- Spacing Scale (4px base rhythm) ---------- */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* ---------- Type Scale ---------- */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-3xl: 3rem;

  /* ---------- Z-Index Scale ---------- */
  --z-nav: 1000;
  --z-overlay: 1100;
  --z-modal: 2000;
```

These are theme-independent (no per-theme override needed) since they're spacing/type
values, not colors.

- [ ] **Step 2: Bump base body font-size to 16px**

In `app/globals.css`, find (around line 178):

```css
body {
  background-color: var(--bg-void);
  color: var(--clr-text);
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1.7;
  position: relative;
  transition: background-color 0.4s ease, color 0.4s ease;
}
```

Change `font-size: 15px;` to `font-size: var(--text-base);`.

- [ ] **Step 3: Add global focus-visible ring**

In `app/globals.css`, right after the `/* ---------- Base Reset ---------- */` block
(after the `*::-webkit-scrollbar { display: none; }` rule around line 214), add:

```css
/* =============================================
   FOCUS VISIBILITY
   ============================================= */
:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}
```

- [ ] **Step 4: Add reduced-motion guard for CSS-driven animation**

At the very end of `app/globals.css`, add:

```css
/* =============================================
   REDUCED MOTION
   ============================================= */
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

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: build completes with no TypeScript or CSS errors (Tailwind v4 processes
plain CSS custom properties without special syntax, so no new errors are expected).

Run: `npm run dev`, open `http://localhost:3000` in a browser, open devtools, and:
1. Inspect `<body>` → Computed styles → confirm `font-size: 16px`.
2. Click into the address bar then press Tab repeatedly until a page link/button
   receives focus (e.g. the "View Projects" hero button) → confirm a visible purple
   outline ring appears around it.
3. In devtools, open the Rendering tab → "Emulate CSS media feature
   prefers-reduced-motion" → set to "reduce" → hover over a project title (glitch
   effect) → confirm no glitch animation plays.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "feat: add design tokens, focus-visible ring, reduced-motion guard

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: UI Primitives — Container, Button, Badge, Card, SectionHeader

**Files:**
- Create: `components/ui/Container.tsx`
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/SectionHeader.tsx`
- Modify: `app/globals.css` (append new utility classes; modify existing
  `.section-title` rule at lines 576-594)

**Interfaces:**
- Consumes: `--space-*`, `--text-*` tokens from Task 1.
- Produces (consumed by Plan B):
  - `Container({ children: ReactNode, maxWidth?: string, className?: string })`
  - `Button({ variant?: "primary" | "outline", size?: "sm" | "md", href?: string,
    children: ReactNode, ...rest })` — renders `<a>` when `href` is passed, `<button>`
    otherwise.
  - `Badge({ icon?: ReactNode, children: ReactNode, variant?: "pill" | "tech" })`
  - `Card({ children: ReactNode, accentColor?: string, className?: string,
    as?: "div" | "article" })`
  - `SectionHeader({ title: string, subtitle?: string })`

- [ ] **Step 1: Create `Container`**

Create `components/ui/Container.tsx`:

```tsx
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function Container({
  children,
  maxWidth = "1200px",
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`container-primitive ${className}`.trim()}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}
```

Append to `app/globals.css`:

```css
/* =============================================
   CONTAINER PRIMITIVE
   ============================================= */
.container-primitive {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}
```

- [ ] **Step 2: Create `Button`**

Create `components/ui/Button.tsx`:

```tsx
"use client";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: undefined };

type ButtonAsAnchor = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children, ...rest } = props;
  const classes = ["btn-primitive", `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
```

Append to `app/globals.css`:

```css
/* =============================================
   BUTTON PRIMITIVE
   ============================================= */
.btn-primitive {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  border: none;
  clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
  transition: background 0.25s, color 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.btn-md {
  padding: var(--space-3) var(--space-8);
  font-size: var(--text-xs);
}

.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
}

.btn-primary {
  background: var(--clr-primary);
  color: #fff;
  border: 1px solid var(--clr-primary);
}

.btn-primary:hover,
.btn-primary:focus-visible {
  background: var(--clr-secondary);
  box-shadow: var(--glow-purple);
}

.btn-outline {
  background: transparent;
  color: var(--clr-primary);
  border: 1px solid var(--clr-primary);
}

.btn-outline:hover,
.btn-outline:focus-visible {
  background: var(--clr-primary-subtle);
  box-shadow: var(--glow-purple);
}
```

- [ ] **Step 3: Create `Badge`**

Create `components/ui/Badge.tsx`:

```tsx
import { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  children: ReactNode;
  variant?: "pill" | "tech";
}

export default function Badge({ icon, children, variant = "pill" }: BadgeProps) {
  const className = variant === "tech" ? "tech-badge" : "badge-pill";
  return (
    <span className={className}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
}
```

Append to `app/globals.css`:

```css
/* =============================================
   BADGE PILL (generalized from About.tsx interest pills)
   ============================================= */
.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px var(--space-4);
  border: 1px solid var(--clr-dim);
  background: var(--bg-surface);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--clr-muted);
  border-radius: 2px;
  transition: all 0.25s;
}

.badge-pill:hover,
.badge-pill:focus-visible {
  border-color: var(--clr-primary);
  color: var(--clr-primary);
  box-shadow: var(--glow-purple);
}

.badge-icon {
  color: var(--clr-primary);
  display: inline-flex;
}
```

- [ ] **Step 4: Create `Card`**

Create `components/ui/Card.tsx`:

```tsx
import { CSSProperties, ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  accentColor?: string;
  className?: string;
  as?: ElementType;
}

export default function Card({
  children,
  accentColor,
  className = "",
  as: Tag = "div",
}: CardProps) {
  const style: CSSProperties | undefined = accentColor
    ? ({
        "--card-border": accentColor,
        "--current-card-glow": `0 0 14px ${accentColor}99, 0 0 36px ${accentColor}33`,
      } as CSSProperties)
    : undefined;

  return (
    <Tag className={`industrial-card ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
```

No new CSS needed — `Card` wraps the existing `.industrial-card` class
(`app/globals.css:421-459`), unchanged.

- [ ] **Step 5: Create `SectionHeader`, and move the title clamp into CSS**

Create `components/ui/SectionHeader.tsx`:

```tsx
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
```

In `app/globals.css`, find the existing `.section-title` rule (around line 576):

```css
.section-title {
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--clr-text);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}
```

Add one line so the responsive size (previously repeated inline in every section
component) lives in the shared class:

```css
.section-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  color: var(--clr-text);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}
```

Then append new rules for the header wrapper and subtitle:

```css
/* =============================================
   SECTION HEADER
   ============================================= */
.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-subtitle {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--clr-muted);
  margin-top: var(--space-3);
}
```

(Existing components still set an inline `fontSize` on `.section-title` in some
places — those are harmless overrides for now and get cleaned up in Plan B when each
component migrates to `SectionHeader`. This step only adds the shared default.)

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors. All five new files must
type-check (no `any` leaking from the props, `Button`'s discriminated union between
`<a>`/`<button>` must compile cleanly).

Since nothing consumes these components yet (Plan B does that), there's no visual
check possible in the running app for this task — a clean `npm run build` is the pass
criterion.

- [ ] **Step 7: Commit**

```bash
git add components/ui/ app/globals.css
git commit -m "feat: add Container, Button, Badge, Card, SectionHeader primitives

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3: Remove Forced Scroll-Snap

**Files:**
- Modify: `app/globals.css:188-191` (remove `scroll-snap-type` from `html`)
- Modify: `app/globals.css:216-226` (`.vertical-section`)

**Interfaces:**
- Consumes: `--space-*` tokens from Task 1.
- Produces: `.vertical-section` no longer forces 100vh/scroll-snap — consumed
  implicitly by every page using it (`app/page.tsx`, `app/gallery/page.tsx`).

- [ ] **Step 1: Remove scroll-snap-type from `html`**

In `app/globals.css`, find (around line 188):

```css
html {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
```

Replace with:

```css
html {
  scroll-behavior: smooth;
}
```

(This duplicates the earlier `html { scroll-behavior: smooth; }` rule at line 174-176
— that's fine, it was already duplicated before this change; removing the whole block
is also acceptable but leaving a no-op duplicate avoids touching an unrelated rule.)

- [ ] **Step 2: Change `.vertical-section` from forced 100vh/snap to content-driven flow**

In `app/globals.css`, find (around line 216):

```css
.vertical-section {
  min-height: 100vh;
  width: 100vw;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6rem 4rem;
  padding-left: 20rem;
}
```

Replace with:

```css
.vertical-section {
  min-height: auto;
  width: 100%;
  scroll-margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-24) var(--space-16);
  padding-left: 20rem;
}
```

(`width: 100vw` → `100%` avoids a horizontal-scrollbar-width overflow bug that
`100vw` is known to cause on some browsers when a vertical scrollbar is present;
`20rem` left padding for sidebar clearance is untouched here — Task 5 addresses its
one-off inline-style override on the gallery page specifically, this rule itself is
correct and shared by all sections including the gallery.)

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build completes with no errors (pure CSS change).

Run: `npm run dev`, open `http://localhost:3000`:
1. Scroll the page slowly with a mouse wheel. Confirm scrolling feels normal/free —
   no snapping/jumping between sections.
2. Confirm each section's height now matches its content (e.g. the "Experience"
   section, which has more content than "Contact", should visibly be taller, not
   forced to the same 100vh box).
3. Click a sidebar nav link (e.g. "Contact") — confirm the page scrolls smoothly to
   that section and the section heading isn't flush against the very top edge of the
   viewport (the `scroll-margin-top` should leave a small gap).
4. Resize the browser window narrower (or open devtools device toolbar at 375px) —
   confirm no horizontal scrollbar appears.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "fix: remove forced scroll-snap, let sections size to content

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: Footer Height Token & Overlap Fix

**Files:**
- Modify: `components/Footer.tsx:56-65` (add `footer-signature` class to the center
  "Crafted with" block)
- Modify: `app/globals.css` (add `.footer-signature` mobile hide rule, `--footer-height`
  token, `.main-content-wrapper` padding-bottom)
- Modify: `components/Contact.tsx:11-19` (remove one-off inline `paddingBottom`)

**Interfaces:**
- Consumes: `--space-*` tokens from Task 1.
- Produces: `--footer-height` token and `.footer-signature` class — no other task
  depends on these, this closes out the footer-overlap bug from the spec.

- [ ] **Step 1: Mark the footer's center signature block with a class**

In `components/Footer.tsx`, find (around line 67):

```tsx
        {/* Center */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--clr-muted)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            letterSpacing: "0.05em",
          }}
        >
```

Add a `className="footer-signature"` prop to that `<p>`:

```tsx
        {/* Center */}
        <p
          className="footer-signature"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--clr-muted)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            letterSpacing: "0.05em",
          }}
        >
```

- [ ] **Step 2: Hide the signature line on narrow phones, define footer height token,
  and pad `.main-content-wrapper`**

Append to `app/globals.css`:

```css
/* =============================================
   FOOTER
   ============================================= */
:root {
  --footer-height: 3.25rem;
}

@media (max-width: 480px) {
  .footer-signature {
    display: none;
  }
}
```

In `app/globals.css`, find the existing `.main-content-wrapper` rule (around line
780):

```css
.main-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0;
  width: 100%;
}
```

Add `padding-bottom: var(--footer-height);`:

```css
.main-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0;
  width: 100%;
  padding-bottom: var(--footer-height);
}
```

- [ ] **Step 3: Remove the one-off `paddingBottom` hack from `Contact.tsx`**

In `components/Contact.tsx`, find (around line 11):

```tsx
    <section
      id="contact"
      className="vertical-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "100px", // space for sticky footer
      }}
    >
```

Remove the `paddingBottom` line:

```tsx
    <section
      id="contact"
      className="vertical-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build completes with no errors.

Run: `npm run dev`, open `http://localhost:3000`:
1. Scroll to the very bottom of the page (past the Contact section's social links) —
   confirm the last piece of content (the bottom "stud" divider row in Contact) is
   fully visible above the fixed footer, not clipped behind it.
2. Open devtools device toolbar, set width to 375px — confirm the footer shows only
   the brand mark (left) and copyright (right); the center "Crafted with ♥" text is
   hidden and the footer stays a single line (no wrapping).
3. Set width back to 1440px — confirm all three footer items (brand, "Crafted with",
   copyright) are visible again.

- [ ] **Step 5: Commit**

```bash
git add components/Footer.tsx components/Contact.tsx app/globals.css
git commit -m "fix: footer no longer overlaps section content on any screen size

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5: Fix Gallery Page Mobile Padding Bug

**Files:**
- Modify: `components/CreativeArtifacts.tsx:113-123`
- Modify: `app/globals.css` (add `.gallery-page-section` rule)

**Interfaces:**
- Consumes: nothing new from earlier tasks (independent of Tasks 1-4, but ordered
  here to keep layout-bug fixes grouped).
- Produces: nothing consumed by later tasks — closes the gallery padding bug from the
  spec.

- [ ] **Step 1: Replace inline padding overrides with a CSS class**

In `components/CreativeArtifacts.tsx`, find (around line 113):

```tsx
    <section 
      id="artifacts" 
      className={`vertical-section ${!isGalleryPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`} 
      style={{ 
        background: "var(--bg-void)", 
        paddingTop: isGalleryPage ? "10rem" : undefined,
        paddingLeft: isGalleryPage ? "20rem" : undefined,
        paddingRight: isGalleryPage ? "4rem" : undefined
      }}
    >
```

Replace with:

```tsx
    <section 
      id="artifacts" 
      className={`vertical-section ${!isGalleryPage ? 'h-screen overflow-hidden' : 'min-h-screen gallery-page-section'}`} 
      style={{ background: "var(--bg-void)" }}
    >
```

- [ ] **Step 2: Add the `.gallery-page-section` rule with a mobile override**

Append to `app/globals.css`:

```css
/* =============================================
   GALLERY PAGE SECTION
   ============================================= */
.gallery-page-section {
  padding-top: var(--space-24);
  padding-left: 20rem;
  padding-right: var(--space-16);
}

@media (max-width: 768px) {
  .gallery-page-section {
    padding-top: var(--space-16);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build completes with no errors.

Run: `npm run dev`, open `http://localhost:3000/gallery`:
1. At desktop width (1440px), confirm the gallery grid is still offset to clear the
   fixed sidebar (same visual position as before this change).
2. Open devtools device toolbar, set width to 375px — confirm there is **no** large
   blank gutter on the left of the gallery grid; the grid uses the same mobile
   padding as every other section (1.5rem).
3. Confirm no horizontal scrollbar appears at 375px.

- [ ] **Step 4: Commit**

```bash
git add components/CreativeArtifacts.tsx app/globals.css
git commit -m "fix: gallery page mobile padding no longer stuck at desktop 20rem gutter

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6: Responsive Navigation — Mobile Top Bar & Accessible Drawer

**Files:**
- Modify: `components/Navbar.tsx` (mobile toggle button, drawer open/close, focus
  management)
- Modify: `app/globals.css:894-916` (mobile nav styles, touch target sizing)

**Interfaces:**
- Consumes: `--space-*`, `--z-overlay` tokens from Task 1.
- Produces: nothing consumed by later tasks — this is the last structural task.

- [ ] **Step 1: Add focus-trap and keyboard-close logic to `Navbar`**

In `components/Navbar.tsx`, the current imports are (line 1-6):

```tsx
"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X, Folder, Skull, Music, Star } from "lucide-react";
import { useTheme } from "./ThemeProvider";
```

Add `useRef` to the React import:

```tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X, Folder, Skull, Music, Star } from "lucide-react";
import { useTheme } from "./ThemeProvider";
```

Inside `export default function Navbar() {`, right after the existing state
declarations (around line 68-69):

```tsx
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
```

Add refs and a new effect for focus trap + Escape-to-close:

```tsx
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMobileOpen) return;

    const drawer = drawerRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableEls = drawer
      ? Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelector))
      : [];
    focusableEls[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
        mobileToggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);
```

- [ ] **Step 2: Add aria attributes to the mobile toggle button and wire up the ref**

In `components/Navbar.tsx`, find the mobile toggle button (around line 106):

```tsx
      {/* Mobile Toggle Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1101,
          background: "var(--bg-elevated)",
          border: "1px solid var(--clr-dim)",
          padding: "0.5rem",
          borderRadius: "4px",
          display: "none",
          color: "var(--clr-text)"
        }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
```

Replace with:

```tsx
      {/* Mobile Toggle Button */}
      <button
        ref={mobileToggleRef}
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileOpen}
        aria-controls="vscode-sidebar-nav"
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1101,
          background: "var(--bg-elevated)",
          border: "1px solid var(--clr-dim)",
          padding: "0.75rem",
          borderRadius: "4px",
          display: "none",
          color: "var(--clr-text)"
        }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
```

(`padding` bumped from `0.5rem` to `0.75rem` so the 20px icon plus padding clears the
44px minimum touch target.)

- [ ] **Step 3: Wire the drawer ref and id, add `role="dialog"`/`aria-modal`**

In `components/Navbar.tsx`, find the sidebar nav element (around line 126):

```tsx
      {/* Sidebar */}
      <nav className={`vscode-sidebar ${isMobileOpen ? 'open' : ''}`}>
```

Replace with:

```tsx
      {/* Sidebar */}
      <nav
        ref={drawerRef}
        id="vscode-sidebar-nav"
        className={`vscode-sidebar ${isMobileOpen ? 'open' : ''}`}
        role={isMobileOpen ? "dialog" : undefined}
        aria-modal={isMobileOpen ? true : undefined}
        aria-label="Site navigation"
      >
```

(`role`/`aria-modal` are only applied while the drawer is the mobile overlay
presentation — on desktop, where `isMobileOpen` is always `false` because the toggle
button is hidden via the `display: none` in Step 2's CSS-controlled `.mobile-menu-btn`,
this has no effect on the always-visible desktop sidebar's semantics.)

- [ ] **Step 4: Increase mobile touch target sizing for nav items**

In `app/globals.css`, find the mobile media query block (around line 894):

```css
@media (max-width: 768px) {
  .vscode-sidebar {
    transform: translate(-100%, -50%);
  }

  .vscode-sidebar.open {
    transform: translate(0, -50%);
  }

  .vertical-section {
    padding-left: 1.5rem;
  }

  .main-content-wrapper {
    margin-left: 0;
    padding-left: 0;
    width: 100%;
  }

  .mobile-menu-btn {
    display: block !important;
  }
}
```

Add touch-target sizing rules for `.folder-header` and `.file` inside the same block:

```css
@media (max-width: 768px) {
  .vscode-sidebar {
    transform: translate(-100%, -50%);
  }

  .vscode-sidebar.open {
    transform: translate(0, -50%);
  }

  .vertical-section {
    padding-left: 1.5rem;
  }

  .main-content-wrapper {
    margin-left: 0;
    padding-left: 0;
    width: 100%;
  }

  .mobile-menu-btn {
    display: block !important;
  }

  .folder-header,
  .file {
    min-height: 44px;
    padding-top: var(--space-3);
    padding-bottom: var(--space-3);
  }
}
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open devtools device toolbar at 375px width, open
`http://localhost:3000`:
1. Confirm the mobile toggle button (top-right) is visible and the desktop sidebar is
   hidden off-screen.
2. Click the toggle button — confirm the drawer slides in, and keyboard focus lands
   on the first focusable item inside it (the "Welcome" folder header).
3. Press `Tab` repeatedly — confirm focus cycles only among items inside the drawer
   (it does not escape to page content behind the overlay) and wraps back to the
   first item after the last.
4. Press `Shift+Tab` from the first item — confirm focus wraps to the last item.
5. Press `Escape` — confirm the drawer closes and keyboard focus returns to the
   toggle button.
6. Using devtools' Accessibility pane (or by inspecting the DOM), confirm the toggle
   button has `aria-expanded="true"` while open and `aria-expanded="false"` while
   closed, and `aria-label` text changes between "Open navigation menu" / "Close
   navigation menu".
7. With the drawer open, tap/click each nav item — confirm each has a visibly
   comfortable tap height (no cramped rows).

- [ ] **Step 6: Commit**

```bash
git add components/Navbar.tsx app/globals.css
git commit -m "feat: accessible mobile nav drawer with focus trap and touch targets

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 7: Delete Dead SmoothScroller File

**Files:**
- Delete: `components/SmoothScroller.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing — pure cleanup, independent of every other task in this plan.

- [ ] **Step 1: Confirm the file is truly unused**

Run: `grep -r "SmoothScroller" --include="*.tsx" --include="*.ts" . -l` (excluding
`node_modules` — run from the repo root; if using ripgrep: `rg "SmoothScroller" -g '!node_modules'`)
Expected: the only match is `components/SmoothScroller.tsx` itself (its own
definition) — no file imports it.

- [ ] **Step 2: Delete the file**

```bash
git rm components/SmoothScroller.tsx
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build completes with no errors (deleting an unimported file cannot break
the build).

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove unused SmoothScroller (Lenis) component

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Final Verification (after all 7 tasks)

- [ ] Run `npm run build` — succeeds with zero errors.
- [ ] Run `npm run lint` — no new lint errors introduced (pre-existing warnings, if
  any, are out of scope for this plan).
- [ ] Manual pass across all three themes (use the existing `ThemeSwitcher` UI) at
  375px, 768px, 1024px, 1440px: no horizontal scroll anywhere, footer never overlaps
  content, `/gallery` has no mobile padding gutter bug, mobile drawer opens/closes/
  traps focus/`Escape`-closes correctly on all three themes.
- [ ] Visual diff against the pre-plan site: confirm colors, fonts, and per-theme
  identity are pixel-identical — only spacing, structure, and interaction changed.
