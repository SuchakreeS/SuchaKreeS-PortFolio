# Portfolio Redesign — Plan B: Component Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the site's section components (Hero, About, TechStack, Projects,
Experience, Contact, CreativeArtifacts) onto the `components/ui/` primitives Plan A
built (`Button`, `Badge`, `SectionHeader`, `Card`), killing the duplicated
inline-style/hover-handler pattern in each — plus each component's own
accessibility fix from the spec (aria-labels, reduced-motion guards) — with zero
visual identity change (colors, fonts, per-theme palettes stay exactly as they are).

**Architecture:** Next.js 15 App Router + Tailwind v4 + DaisyUI, same as Plan A. Each
task touches exactly one section component file, swapping its duplicated
inline-styled markup for the shared primitive where doing so is a genuine
zero-visual-diff wrapper, and leaving bespoke visual treatments (About's code-editor
mockup panel, Experience's top-accent-border timeline card, CreativeArtifacts'
`motion.div`-based artifact cards) as hand-styled — forcing every "card-shaped" thing
onto the generic `.industrial-card` clip-path shape would itself be a re-skin the
spec's non-goals forbid. Each task's scoping decision is explained inline.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS v4,
`lucide-react`, `framer-motion`. No test runner installed — verification is
`npm run build` plus manual browser checks with exact steps and pass criteria, same
as Plan A.

**Spec:** `docs/superpowers/specs/2026-08-24-portfolio-redesign-design.md`

## Global Constraints

- Zero changes to any `--clr-*`, `--bg-*`, `--hero-gradient`, `--glow-*`, or per-theme
  (`[data-theme="black-parade"]`, `[data-theme="californication"]`) values.
- Zero changes to `--font-display` (Cinzel) / `--font-mono` (JetBrains Mono).
- No new npm dependencies.
- No test framework introduced — verify via `npm run build` and manual browser checks.
- Every commit must leave `npm run build` passing.
- `TechStack.tsx`'s mechanical-keyboard interaction (physical key press → keycap
  animation, Web Audio click) keeps its bespoke markup — only its header, aria-labels,
  and reduced-motion guard are in scope, not a rewrite of the keycap grid mechanism.
- Do not use `Card`'s `accentColor` prop on `Projects.tsx`'s cards — the existing
  `project-card-{id}` CSS classes carry theme-specific glow overrides (notably
  `--card-glow-wong`/`-velvet`/`-luxe` in the Californication theme) that
  `accentColor`'s hardcoded, non-theme-aware glow would silently break. Pass the
  existing `project-card-{id}` class through `Card`'s `className` prop instead.

---

## Task 1: Fix Button's Clipped Focus-Visible Ring (carryover from Plan A)

Plan A's final review found that `.btn-primitive`'s `clip-path` clips all painting
including `outline`/`box-shadow`, and a first attempted fix (`.btn-primitive:focus-visible`
with an inset `box-shadow`) is silently overridden by `.btn-primary:focus-visible` /
`.btn-outline:focus-visible`, which both still declare an outward (non-inset)
`box-shadow: var(--glow-purple)` at equal CSS specificity, winning by source order.
Since `Button` had zero consumers when Plan A shipped, this was parked rather than
blocking — but Task 2 below is the first task to actually render a `Button`, so it
must be fixed first.

**Files:**
- Modify: `app/globals.css` (the `.btn-primary:hover, .btn-primary:focus-visible`
  and `.btn-outline:hover, .btn-outline:focus-visible` rules)

**Interfaces:**
- Consumes: `.btn-primitive:focus-visible`'s existing inset-ring rule (already in
  `app/globals.css`, added by Plan A — untouched by this task).
- Produces: a working keyboard focus ring on every `Button` — consumed by every
  later task in this plan that renders a `Button`.

- [ ] **Step 1: Split the `:hover`/`:focus-visible` combinator so focus-visible stops
  declaring a competing `box-shadow`**

In `app/globals.css`, find:

```css
.btn-primary:hover,
.btn-primary:focus-visible {
  background: var(--clr-secondary);
  box-shadow: var(--glow-purple);
}
```

Replace with:

```css
.btn-primary:hover {
  background: var(--clr-secondary);
  box-shadow: var(--glow-purple);
}

.btn-primary:focus-visible {
  background: var(--clr-secondary);
}
```

Then find:

```css
.btn-outline:hover,
.btn-outline:focus-visible {
  background: var(--clr-primary-subtle);
  box-shadow: var(--glow-purple);
}
```

Replace with:

```css
.btn-outline:hover {
  background: var(--clr-primary-subtle);
  box-shadow: var(--glow-purple);
}

.btn-outline:focus-visible {
  background: var(--clr-primary-subtle);
}
```

Neither `:focus-visible` rule declares `box-shadow` any more, so
`.btn-primitive:focus-visible`'s existing `box-shadow: inset 0 0 0 2px var(--clr-primary);`
(unchanged, still in the file) is no longer overridden — it's the only rule setting
that property, so it wins outright regardless of source order or specificity.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build completes with no errors (pure CSS change, no consumers yet).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "fix: Button focus-visible ring no longer overridden by variant hover rules

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: Migrate Hero.tsx

**Files:**
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `Button` from `components/ui/Button.tsx` (Task 1 fixed its focus ring).
- Produces: nothing consumed by later tasks.

**Scope decision:** Hero's two CTA `<a>` elements (`View Projects`, `Get in Touch`)
are a byte-for-byte match for `Button`'s `primary`/`outline` variants — direct
swap, zero visual diff. The tagline typewriter effect (`TAGLINES` cycling via
`setInterval`) autoplays unconditionally on mount with no user action — this is
exactly the kind of motion the spec flagged as the real reduced-motion risk (as
opposed to hover-triggered effects), so it gets a guard.

- [ ] **Step 1: Import `Button`**

In `components/Hero.tsx`, find the import block (lines 1-4):

```tsx
"use client";
import { useEffect, useState } from "react";
import { ChevronDown, Zap, Code2, Skull } from "lucide-react";
import { motion } from "framer-motion";
```

Replace with:

```tsx
"use client";
import { useEffect, useState } from "react";
import { ChevronDown, Zap, Code2, Skull } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
```

- [ ] **Step 2: Add a reduced-motion guard to the typewriter effect**

In `components/Hero.tsx`, find the typing `useEffect` (starts around line 18):

```tsx
  useEffect(() => {
    const target = TAGLINES[taglineIdx];
    if (typing) {
```

Replace with:

```tsx
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(TAGLINES[0]);
      return;
    }
    const target = TAGLINES[taglineIdx];
    if (typing) {
```

(The rest of the effect body and its dependency array `[displayed, typing, taglineIdx]`
are unchanged — this only adds an early-return branch. Reduced-motion users see the
first tagline statically instead of the cycling type/erase animation.)

- [ ] **Step 3: Replace the two CTA `<a>` elements with `Button`**

In `components/Hero.tsx`, find the CTA buttons block (starts around line 140):

```tsx
        {/* CTA buttons */}
        <div
          className="animate-fade-up delay-400"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}
        >
          <a
            href="#projects"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.75rem 2rem",
              background: "var(--clr-primary)",
              color: "#fff",
              border: "none",
              clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
              textDecoration: "none",
              transition: "background 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--clr-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--clr-primary)";
            }}
          >
            View Projects
          </a>
          <a
            href="#contact"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.75rem 2rem",
              background: "transparent",
              color: "var(--clr-primary)",
              border: "1px solid var(--clr-primary)",
              clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
              textDecoration: "none",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(168,85,247,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            Get in Touch
          </a>
        </div>
```

Replace with:

```tsx
        {/* CTA buttons */}
        <div
          className="animate-fade-up delay-400"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}
        >
          <Button href="#projects" variant="primary">
            View Projects
          </Button>
          <Button href="#contact" variant="outline">
            Get in Touch
          </Button>
        </div>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open `http://localhost:3000`:
1. Confirm both hero CTA buttons look visually identical to before (same padding,
   clip-path corners, colors, hover glow) — `Button`'s CSS was built to match this
   exact markup, so there should be no visible diff.
2. Tab to each button with the keyboard — confirm the inset purple focus ring from
   Task 1 is visible (this is the first real-world proof Task 1's fix works).
3. In devtools, emulate `prefers-reduced-motion: reduce`, reload the page — confirm
   the role/tagline text under the name shows the first tagline
   ("Full-Stack Developer") statically with no type/erase animation.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx
git commit -m "refactor: migrate Hero CTAs to Button primitive, guard tagline motion

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3: Migrate About.tsx

**Files:**
- Modify: `components/About.tsx`

**Interfaces:**
- Consumes: `Badge` from `components/ui/Badge.tsx`.
- Produces: nothing consumed by later tasks.

**Scope decision:** The three "interest pill" spans (`Zero-Error Mindset`, etc.) are
exactly the ad hoc pattern `Badge`'s `pill` variant was built to replace — direct
swap. The decorative code-block panel (the fake code editor with traffic-light dots)
is NOT migrated to `Card` — it's a distinct visual element (editor-window mockup with
its own dot-row chrome) that doesn't share `.industrial-card`'s clip-path shape or
background token, and forcing it in would reshape the panel, which the spec's
non-goals forbid. The typing effect that fills in that code block autoplays on
scroll-into-view with no user action — it gets the reduced-motion guard.

- [ ] **Step 1: Import `Badge`**

In `components/About.tsx`, find the import block (lines 1-4):

```tsx
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Beer, Cpu, Music } from "lucide-react";
import { motion } from "framer-motion";
```

Replace with:

```tsx
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Beer, Cpu, Music } from "lucide-react";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
```

- [ ] **Step 2: Add a reduced-motion guard to `startTyping`**

In `components/About.tsx`, find `startTyping` (starts around line 12):

```tsx
  const startTyping = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    const type = () => {
```

Replace with:

```tsx
  const startTyping = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTextIndex(fullText.length);
      return;
    }

    const type = () => {
```

(This shows the code block fully typed out immediately for reduced-motion users
instead of animating character-by-character. `fullText` and `setTextIndex` are
existing variables in this component, unchanged.)

- [ ] **Step 3: Replace the interest pills with `Badge`**

In `components/About.tsx`, find the interest pills block (starts around line 93):

```tsx
          {/* Interest pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {[
              { icon: <Cpu size={14} />, label: "Zero-Error Mindset" },
              { icon: <Beer size={14} />, label: "B.S. Fermentation Tech" },
              { icon: <Music size={14} />, label: "Industrial Precision" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  border: "1px solid var(--clr-dim)",
                  background: "var(--bg-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--clr-muted)",
                  borderRadius: "2px",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--clr-primary)";
                  (e.currentTarget as HTMLSpanElement).style.color = "var(--clr-primary)";
                  (e.currentTarget as HTMLSpanElement).style.boxShadow = "var(--glow-purple)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--clr-dim)";
                  (e.currentTarget as HTMLSpanElement).style.color = "var(--clr-muted)";
                  (e.currentTarget as HTMLSpanElement).style.boxShadow = "none";
                }}
              >
                <span style={{ color: "var(--clr-primary)" }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>
```

Replace with:

```tsx
          {/* Interest pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Badge icon={<Cpu size={14} />}>Zero-Error Mindset</Badge>
            <Badge icon={<Beer size={14} />}>B.S. Fermentation Tech</Badge>
            <Badge icon={<Music size={14} />}>Industrial Precision</Badge>
          </div>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to the About section:
1. Confirm the three interest pills look visually identical to before (same border,
   background, padding, hover glow) — `Badge`'s `.badge-pill` CSS was built from
   this exact markup.
2. Tab to each pill with the keyboard — confirm a focus ring now appears (it didn't
   before, since the old `onMouseEnter` never fired on keyboard focus).
3. In devtools, emulate `prefers-reduced-motion: reduce`, scroll the About section
   out of view and back into view — confirm the code block's text appears instantly
   fully typed, with no character-by-character animation.

- [ ] **Step 5: Commit**

```bash
git add components/About.tsx
git commit -m "refactor: migrate About interest pills to Badge primitive, guard typing motion

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: Migrate TechStack.tsx

**Files:**
- Modify: `components/TechStack.tsx`

**Interfaces:**
- Consumes: `SectionHeader` from `components/ui/SectionHeader.tsx`.
- Produces: nothing consumed by later tasks.

**Scope decision:** Per the spec's explicit non-goal, the keycap grid's bespoke
markup (physical-key-press → animated keycap, Web Audio click, holographic
flicker-on-hover) is NOT rewritten — only its header converges onto
`SectionHeader` (matching every other section for consistency), its 13 keycap
buttons get `aria-label`s (currently icon+letter only, no accessible name), and the
holographic-flicker hover animation — which plays via Framer Motion's
`repeat: Infinity` on the CSS-untouchable `animate`/`transition` props, so it needs
a JS-level reduced-motion check — gets guarded. This flicker only plays on
hover/keypress (a deliberate user action), so per the spec it's lower priority than
Hero/About's autoplaying loops, but still in scope for completeness.

- [ ] **Step 1: Import `SectionHeader` and add a `prefersReducedMotion` state**

In `components/TechStack.tsx`, find the import block (lines 1-7):

```tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, Database, Code, Terminal, Server, HelpCircle,
  Cpu, Layout, Layers, RefreshCw, GitBranch, Ship, Globe
} from "lucide-react";
```

Replace with:

```tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, Database, Code, Terminal, Server, HelpCircle,
  Cpu, Layout, Layers, RefreshCw, GitBranch, Ship, Globe
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
```

In `components/TechStack.tsx`, find the start of the `TechStack` component's state
(around line 353):

```tsx
export default function TechStack() {
  const [focusedTech, setFocusedTech] = useState<TechItem>(techSkills[1]); // Default React.js / Next.js
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
```

Replace with:

```tsx
export default function TechStack() {
  const [focusedTech, setFocusedTech] = useState<TechItem>(techSkills[1]); // Default React.js / Next.js
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const handleChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);
```

- [ ] **Step 2: Replace the header block with `SectionHeader`**

In `components/TechStack.tsx`, find the header block (starts around line 443):

```tsx
        {/* Header Block */}
        <div className="text-center md:text-left mb-12">
          <h2
            className="font-display-bold tracking-[0.16em] uppercase"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "var(--clr-text)"
            }}
          >
            SKILLS
          </h2>
          <p className="font-mono text-xs text-emerald-500/70 tracking-widest mt-1">
            (hint: press any corresponding letter on your physical keyboard)
          </p>
        </div>
```

Replace with:

```tsx
        {/* Header Block */}
        <SectionHeader
          title="Skills"
          subtitle="(hint: press any corresponding letter on your physical keyboard)"
        />
```

- [ ] **Step 3: Add `aria-label` to each of the 13 keycap buttons, and guard the
  holographic-flicker animation**

This exact same two-part edit applies identically at 3 locations — Row 1
(`techSkills.slice(0, 5)`), Row 2 (`techSkills.slice(5, 10)`), Row 3
(`techSkills.slice(10, 13)`) — because the `.map()` body inside each row is
byte-for-byte identical (same `skill`/`colors`/`pressed` variables), just applied to
a different slice of `techSkills`.

**Part A — `aria-label` on the button.** In each of the 3 row blocks, find:

```tsx
                      <motion.button
                        key={skill.key}
                        onClick={() => handleKeyClick(skill)}
                        onMouseEnter={() => handleKeyHover(skill)}
                        onMouseLeave={() => setHoveredKey(null)}
                        whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
```

Replace with:

```tsx
                      <motion.button
                        key={skill.key}
                        aria-label={`${skill.name} — press ${skill.key} key`}
                        onClick={() => handleKeyClick(skill)}
                        onMouseEnter={() => handleKeyHover(skill)}
                        onMouseLeave={() => setHoveredKey(null)}
                        whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
```

This appears 3 times: in Row 1 around line 522, Row 2 around line 616, Row 3 around
line 710. Apply the identical change at each location.

**Part B — guard the flicker.** In each of the 3 row blocks, find:

```tsx
                            <motion.div
                              initial={{ opacity: 0, y: 0, scale: 0.6, z: 0 }}
                              animate={{
                                opacity: [0, 0.8, 0.5, 0.9, 0.6, 0.8], // futuristic glitch flicker
                                y: -50,
                                scale: 1.45,
                                z: 40
                              }}
                              exit={{ opacity: 0, y: 0, scale: 0.6 }}
                              transition={{
                                y: { type: "spring", stiffness: 120, damping: 10 },
                                opacity: { duration: 1.2, repeat: Infinity, repeatType: "reverse" }
                              }}
```

Replace with:

```tsx
                            <motion.div
                              initial={{ opacity: 0, y: 0, scale: 0.6, z: 0 }}
                              animate={
                                prefersReducedMotion
                                  ? { opacity: 0.8, y: -50, scale: 1.45, z: 40 }
                                  : {
                                      opacity: [0, 0.8, 0.5, 0.9, 0.6, 0.8], // futuristic glitch flicker
                                      y: -50,
                                      scale: 1.45,
                                      z: 40,
                                    }
                              }
                              exit={{ opacity: 0, y: 0, scale: 0.6 }}
                              transition={
                                prefersReducedMotion
                                  ? { y: { type: "spring", stiffness: 120, damping: 10 } }
                                  : {
                                      y: { type: "spring", stiffness: 120, damping: 10 },
                                      opacity: { duration: 1.2, repeat: Infinity, repeatType: "reverse" },
                                    }
                              }
```

This appears 3 times: in Row 1 around lines 560-573, Row 2 around lines 654-667, Row
3 around lines 748-761. Apply the identical change at each location.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to the Skills section:
1. Confirm the "SKILLS" heading now renders via `SectionHeader` — title text now
   reads "Skills" (SectionHeader doesn't force uppercase in the string itself, but
   `.section-title`'s CSS applies `text-transform: uppercase`, so it still displays
   as "SKILLS" visually) with the hint line as its subtitle.
2. Using devtools' Accessibility pane, inspect any keycap button (e.g. the
   JavaScript/TypeScript one) — confirm it now has an accessible name like
   "JavaScript / TypeScript — press Q key" instead of no name.
3. Hover a keycap and watch the holographic icon that floats up — confirm it still
   flickers/pulses normally with reduced-motion OFF.
4. In devtools, emulate `prefers-reduced-motion: reduce`, hover a keycap again —
   confirm the floating holographic icon now appears at a steady 0.8 opacity with
   no flicker animation, while the spring-based upward float motion still plays
   (spring positional motion is left alone — only the infinite opacity flicker is
   guarded, matching the spec's lower-priority treatment of this specific effect).

- [ ] **Step 5: Commit**

```bash
git add components/TechStack.tsx
git commit -m "refactor: migrate TechStack header to SectionHeader, add aria-labels, guard flicker motion

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5: Migrate Projects.tsx

**Files:**
- Modify: `components/Projects.tsx`
- Modify: `components/ui/Card.tsx` (add an optional `style` prop — Card currently
  has no way to pass through inline styles, which this task's card wrapper needs)

**Interfaces:**
- Consumes: `SectionHeader`, `Card`, `Button` from `components/ui/`.
- Produces: `Card`'s `style?: CSSProperties` prop — a backwards-compatible addition
  (optional, existing callers unaffected) that later tasks may also use if needed,
  though none currently do.

**Scope decision:** Cards already use the plain `.industrial-card` class via
`className={`industrial-card project-card-${p.id}`}` — a direct `Card` swap, but
passed via `className` (carrying the `project-card-${p.id}` class through), **never**
via `Card`'s `accentColor` prop (see Global Constraints — `accentColor` would break
Californication's per-project themed glow). The GitHub link chips are a small,
subtle link style, not `Button`'s `.tech-badge`-adjacent look — but the spec calls
for this exact convergence, so they become `Button` `outline` `sm`. The `.code-snippet`
tag styling (JetBrains Mono + amethyst brackets) is intentionally NOT converted to
`Badge` — `Badge` only has `pill`/`tech` variants, neither matches this tag's
`<` / `/>` bracket-decorated look, and inventing a third `Badge` variant is scope
creep beyond what Plan A built.

- [ ] **Step 1: Import `SectionHeader`, `Card`, `Button`**

In `components/Projects.tsx`, find the import block (lines 1-3):

```tsx
"use client";
import { ExternalLink, Github, Smartphone, Sunset, Gauge } from "lucide-react";
import { motion } from "framer-motion";
```

Replace with:

```tsx
"use client";
import { ExternalLink, Github, Smartphone, Sunset, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
```

- [ ] **Step 2: Replace the header block with `SectionHeader`**

In `components/Projects.tsx`, find the header block (starts around line 68):

```tsx
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ marginBottom: "3rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}>
            Projects
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--clr-muted)",
              marginTop: "0.75rem",
            }}
          >
            // three acts. one vision.
          </p>
        </div>
      </motion.div>
```

Replace with:

```tsx
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Projects" subtitle="// three acts. one vision." />
      </motion.div>
```

- [ ] **Step 3: Replace the card wrapper with `Card`**

In `components/Projects.tsx`, find the project card opening (starts around line 93):

```tsx
          <motion.article
            key={p.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            className={`industrial-card project-card-${p.id}`}
            style={{ padding: "1.75rem" }}
          >
```

Replace with:

```tsx
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
          >
            <Card as="article" className={`project-card-${p.id}`} style={{ padding: "1.75rem" }}>
```

`Card` doesn't currently accept a `style` prop — add one. In
`components/ui/Card.tsx`, find:

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

Replace with:

```tsx
import { CSSProperties, ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  accentColor?: string;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}

export default function Card({
  children,
  accentColor,
  className = "",
  as: Tag = "div",
  style: styleProp,
}: CardProps) {
  const accentStyle: CSSProperties | undefined = accentColor
    ? ({
        "--card-border": accentColor,
        "--current-card-glow": `0 0 14px ${accentColor}99, 0 0 36px ${accentColor}33`,
      } as CSSProperties)
    : undefined;

  return (
    <Tag className={`industrial-card ${className}`.trim()} style={{ ...accentStyle, ...styleProp }}>
      {children}
    </Tag>
  );
}
```

Now close the wrapper correctly. In `components/Projects.tsx`, find the closing of
the project card (around line 233-234):

```tsx
              </div>
            </motion.article>
          ))}
```

Replace with:

```tsx
              </div>
            </Card>
          </motion.div>
          ))}
```

(This fixes indentation drift from the added `Card` wrapper — the important part is
that `</Card>` closes before `</motion.div>`, which replaces the old
`</motion.article>`.)

- [ ] **Step 4: Replace the GitHub link chips with `Button`**

In `components/Projects.tsx`, find the links block (starts around line 127):

```tsx
                <div style={{ display: "flex", gap: "8px" }}>
                  {p.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "var(--clr-muted)",
                        textDecoration: "none",
                        border: "1px solid var(--clr-dim)",
                        padding: "4px 8px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-primary)";
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--clr-primary)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-muted)";
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--clr-dim)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                      }}
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
```

Replace with:

```tsx
                <div style={{ display: "flex", gap: "8px" }}>
                  {p.links.map((link) => (
                    <Button key={link.label} href={link.href} variant="outline" size="sm">
                      {link.icon}
                      {link.label}
                    </Button>
                  ))}
                </div>
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to Projects:
1. Confirm each project card still has its clip-path corners and hover-glow border
   (via `.industrial-card` + `project-card-{id}`), unchanged.
2. Switch theme to Californication (via the `ThemeSwitcher`) — confirm each
   project's hover glow still uses that theme's distinct per-project color
   (`--card-glow-wong`/`-velvet`/`-luxe`), NOT a generic accent-derived glow — this
   confirms the `accentColor`-avoidance constraint held.
3. Confirm the GitHub links now render as small outlined buttons with clip-path
   corners instead of plain bordered chips — tab to one with the keyboard, confirm
   the inset focus ring from Task 1 appears.
4. Confirm the tech tags (`React`, `Prisma`, etc.) are unchanged — still the
   `<`/`/>`-bracketed `.code-snippet` style, not converted to `Badge`.

- [ ] **Step 6: Commit**

```bash
git add components/Projects.tsx components/ui/Card.tsx
git commit -m "refactor: migrate Projects to Card/Button/SectionHeader primitives

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6: Migrate Experience.tsx

**Files:**
- Modify: `components/Experience.tsx`

**Interfaces:**
- Consumes: `SectionHeader` from `components/ui/SectionHeader.tsx`.
- Produces: nothing consumed by later tasks.

**Scope decision:** The timeline entry card (background `--bg-elevated`, flat
`border-top: 2px solid var(--clr-primary)` accent stripe) is a deliberately distinct
visual language from `.industrial-card`'s clip-path shape and `--bg-surface`
background — it's not migrated to `Card`, same reasoning as About's code panel.
Only the header converges onto `SectionHeader`.

- [ ] **Step 1: Import `SectionHeader`**

In `components/Experience.tsx`, find the import block (lines 1-3):

```tsx
"use client";
import { Briefcase, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
```

Replace with:

```tsx
"use client";
import { Briefcase, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
```

- [ ] **Step 2: Replace the header block with `SectionHeader`**

In `components/Experience.tsx`, find the header block (starts around line 38):

```tsx
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ marginBottom: "3rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}>
            Experience
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--clr-muted)",
              marginTop: "0.75rem",
            }}
          >
            // the riffs that built the repertoire
          </p>
        </div>
      </motion.div>
```

Replace with:

```tsx
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Experience" subtitle="// the riffs that built the repertoire" />
      </motion.div>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to Experience:
1. Confirm the "Experience" heading and subtitle render, with slightly more space
   below the header than before (`SectionHeader`'s `margin-bottom: var(--space-12)`
   = 3rem vs. the old inline `1rem` — an intentional part of the spacing-scale
   consolidation, not a regression).
2. Confirm the timeline cards (with their top purple accent stripe) are completely
   unchanged visually.

- [ ] **Step 4: Commit**

```bash
git add components/Experience.tsx
git commit -m "refactor: migrate Experience header to SectionHeader

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 7: Migrate Contact.tsx

**Files:**
- Modify: `components/Contact.tsx`

**Interfaces:**
- Consumes: `SectionHeader`, `Button` from `components/ui/`.
- Produces: nothing consumed by later tasks.

**Scope decision:** The email CTA is a direct match for `Button`'s `primary` variant
(same clip-path/padding pattern as Hero's buttons, just with a 12px clip vs 10px —
this task also normalizes that to `Button`'s standard 10px, a minor, acceptable
convergence). The social link cards (icon stacked above handle text, `minWidth: 110px`)
are NOT converted to `Button` or `Badge` — neither primitive supports a
vertical icon-over-label layout, and inventing that variant is scope creep.

- [ ] **Step 1: Import `SectionHeader`, `Button`**

In `components/Contact.tsx`, find the import block (lines 1-2):

```tsx
"use client";
import { Mail, Github, Twitter, Linkedin, Send } from "lucide-react";
```

Replace with:

```tsx
"use client";
import { Mail, Github, Twitter, Linkedin, Send } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
```

- [ ] **Step 2: Replace the heading/subtitle with `SectionHeader`**

In `components/Contact.tsx`, find (starts around line 28):

```tsx
        <h2
          className="section-title"
          style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "1rem" }}
        >
          Get In Touch
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--clr-muted)",
            marginBottom: "3rem",
            lineHeight: 1.8,
          }}
        >
          Based in Pathum Thani, Thailand. <br/>
          Whether you have a project idea, want to collaborate, or just want to
          talk shop about industrial precision systems — my inbox is always open.
        </p>
```

Replace with:

```tsx
        <SectionHeader title="Get In Touch" />
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--clr-muted)",
            marginBottom: "3rem",
            lineHeight: 1.8,
          }}
        >
          Based in Pathum Thani, Thailand. <br/>
          Whether you have a project idea, want to collaborate, or just want to
          talk shop about industrial precision systems — my inbox is always open.
        </p>
```

(The multi-sentence paragraph isn't a `SectionHeader` `subtitle` — `subtitle` is
styled for short one-line labels elsewhere in the site; this paragraph stays as its
own element, just no longer duplicating the heading markup.)

- [ ] **Step 3: Replace the email CTA with `Button`**

In `components/Contact.tsx`, find (starts around line 49):

```tsx
        {/* Email CTA */}
        <a
          href="mailto:suchakreesattanusorn@gmail.com"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "1rem 2.5rem",
            background: "transparent",
            color: "var(--clr-primary)",
            border: "1px solid var(--clr-primary)",
            textDecoration: "none",
            clipPath: "polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)",
            transition: "all 0.3s",
            marginBottom: "3rem",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--clr-primary)";
            (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-primary)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
          }}
        >
          <Mail size={16} />
          Say Hello
          <Send size={14} />
        </a>
```

Replace with:

```tsx
        {/* Email CTA */}
        <div style={{ marginBottom: "3rem" }}>
          <Button href="mailto:suchakreesattanusorn@gmail.com" variant="outline">
            <Mail size={16} />
            Say Hello
            <Send size={14} />
          </Button>
        </div>
```

(Note: this changes the hover fill behavior slightly — the original hover turned
the button solid-filled with white text; `Button`'s `outline` variant hover instead
uses `var(--clr-primary-subtle)` background per its shared CSS, matching every other
outline button on the site. This is the intended convergence — Contact's CTA had a
one-off filled-hover treatment that no other outline button on the site uses.)

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to Contact:
1. Confirm "Get In Touch" heading renders via `SectionHeader`.
2. Confirm the "Say Hello" button has clip-path corners, unchanged icon+text
   layout. Hover it — confirm it now gets the subtle tint (`--clr-primary-subtle`)
   background on hover, consistent with the outline `Button`s in Hero/Projects.
3. Tab to the button with the keyboard — confirm the inset focus ring appears.
4. Confirm the two social link cards (GitHub, LinkedIn) below are unchanged.

- [ ] **Step 5: Commit**

```bash
git add components/Contact.tsx
git commit -m "refactor: migrate Contact heading and email CTA to primitives

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 8: Migrate CreativeArtifacts.tsx

**Files:**
- Modify: `components/CreativeArtifacts.tsx`

**Interfaces:**
- Consumes: `SectionHeader` from `components/ui/SectionHeader.tsx`.
- Produces: nothing consumed by later tasks.

**Scope decision:** `ArtifactCard` is a `motion.div` using `.industrial-card` via a
literal className string — `Card` is a plain (non-motion) component, and Framer
Motion's `motion.create(Card)` wrapping is unneeded complexity for a component
whose only job is applying one class string; not migrated, matching the "don't
introduce unneeded abstraction" principle. Only the section header converges onto
`SectionHeader`, and the lightbox's icon-only close button (currently no accessible
name) gets an `aria-label`.

- [ ] **Step 1: Import `SectionHeader`**

In `components/CreativeArtifacts.tsx`, find the import block (lines 1-6):

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Aperture, Image as ImageIcon, X, ZoomIn, ChevronRight, ArrowLeft } from "lucide-react";
import { artifacts, Artifact } from "@/data/artifacts";
```

Replace with:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Aperture, Image as ImageIcon, X, ZoomIn, ChevronRight, ArrowLeft } from "lucide-react";
import { artifacts, Artifact } from "@/data/artifacts";
import SectionHeader from "@/components/ui/SectionHeader";
```

- [ ] **Step 2: Replace the header block with `SectionHeader`**

In `components/CreativeArtifacts.tsx`, find (starts around line 120):

```tsx
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <h2 className="section-title" style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}>
          {isGalleryPage ? "Technical Gallery" : "Creative Artifacts"}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--clr-muted)] mt-2">
          // {isGalleryPage ? "complete mechanical archive" : "precision in pixels. mechanical vision."}
        </p>
      </motion.div>
```

Replace with:

```tsx
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader
          title={isGalleryPage ? "Technical Gallery" : "Creative Artifacts"}
          subtitle={`// ${isGalleryPage ? "complete mechanical archive" : "precision in pixels. mechanical vision."}`}
        />
      </motion.div>
```

- [ ] **Step 3: Add `aria-label` to the lightbox close button**

In `components/CreativeArtifacts.tsx`, find (around line 207):

```tsx
              <button
                className="absolute top-4 right-4 text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors p-2 bg-black/40 backdrop-blur-md rounded-full border border-[var(--clr-dim)]"
                onClick={() => setSelectedId(null)}
              >
                <X size={24} />
              </button>
```

Replace with:

```tsx
              <button
                className="absolute top-4 right-4 text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors p-2 bg-black/40 backdrop-blur-md rounded-full border border-[var(--clr-dim)]"
                onClick={() => setSelectedId(null)}
                aria-label="Close artifact preview"
              >
                <X size={24} />
              </button>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build completes with zero TypeScript errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to Creative Artifacts, and
also check `http://localhost:3000/gallery`:
1. Confirm both pages' headers render via `SectionHeader` with the correct
   title/subtitle text for each mode.
2. Click an artifact to open the lightbox. Using devtools' Accessibility pane,
   confirm the close button (✕, top-right of the lightbox) now has the accessible
   name "Close artifact preview" instead of none.
3. Confirm the artifact grid cards themselves (desaturate-on-hover images,
   scanline overlay, metadata overlay) are completely unchanged.

- [ ] **Step 5: Commit**

```bash
git add components/CreativeArtifacts.tsx
git commit -m "refactor: migrate CreativeArtifacts header to SectionHeader, label lightbox close button

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Final Verification (after all 8 tasks)

- [ ] Run `npm run build` — succeeds with zero errors.
- [ ] Run `npm run lint` — no new lint errors introduced.
- [ ] Manual pass across all three themes (via `ThemeSwitcher`) at 375px, 768px,
  1024px, 1440px: every migrated button/badge/card/header renders identically to
  its pre-migration appearance in all three themes, with particular attention to
  Californication's per-project card glows (Task 5's constraint).
- [ ] Keyboard-only pass: Tab through the whole page — every `Button` and `Badge`
  instance now shows a visible inset focus ring (proving Task 1's fix works
  end-to-end); the TechStack keycap buttons and the lightbox close button now have
  accessible names (verify via the Accessibility pane, not just visually).
- [ ] `prefers-reduced-motion: reduce` pass: Hero's tagline, About's code-typing,
  and TechStack's hover-flicker all stop or reduce to a static state, matching the
  priority order the spec set (Hero/About first-class, TechStack best-effort).
- [ ] Visual diff against the pre-Plan-B site: colors, fonts, and per-theme
  identity remain pixel-identical; only the noted, deliberate spacing/interaction
  convergences (Experience's header margin, Contact's outline-hover behavior)
  should differ, and each is called out in its task above.
