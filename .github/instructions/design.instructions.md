---
applyTo: "**/*.{html,css,js}"
description: "Aurora Glass design system reference — colors, typography, glassmorphism, gradients, animations, and component patterns. Use when: editing visual markup, adding new sections/components, choosing colors or spacing, building glass cards, or matching the existing look of the landing page."
---

# Aurora Glass — Design System Reference

This document is the **visual source of truth** for the Aurora Glass landing page. It pairs with `bootstrap-styling.instructions.md` (which governs *how* to write markup) — this file governs *what the design looks like*.

When adding or editing anything visual, follow the tokens, patterns, and component recipes below. Do not invent new colors, gradients, or layout patterns when one already exists in the system.

---

## 1. Theme

The project ships with **two themes** — a default **dark** "aurora" theme and an optional **light** theme — driven by the `data-theme` attribute on `<html>`.

- **Default theme**: `dark` (deep midnight base + multi-color aurora gradients).
- **Theme toggle**: A `<button id="themeToggle">` in the navbar persists the choice to `localStorage['preferred-theme']` (`'dark' | 'light'`).
- **FOUC prevention**: An inline `<script>` at the top of `<head>` applies the stored theme before paint. Do not move it.
- **Color-scheme hint**: `[data-theme="dark"] { color-scheme: dark; }` / `[data-theme="light"] { color-scheme: light; }` is set in `styles.css`.

> When adding a new component, always test it in **both** themes. Use only the CSS variables defined in `:root` (dark defaults) and `[data-theme="light"]` (light overrides) — never hardcode a color literal for a themed surface.

---

## 2. Color Tokens

All colors must come from the design tokens defined in `styles.css`. Do not introduce new hex values.

### 2.1 Base / ink scale

| Token | Role |
|-------|------|
| `--bg-0` / `--bg-1` / `--bg-2` | Page and section backgrounds (dark by default, light under `[data-theme="light"]`). |
| `--ink-0` | Primary text (titles, strong content). |
| `--ink-1` | Secondary text (body, nav links). |
| `--ink-2` | Muted text (subtitles, helper text, trust copy). |
| `--ink-3` | Most muted text (timestamps, hints). |

### 2.2 Aurora palette

| Token | Hex | Role |
|-------|-----|------|
| `--aurora-1` | `#7c3aed` | Violet — primary brand. |
| `--aurora-2` | `#06b6d4` | Cyan — info, secondary accent. |
| `--aurora-3` | `#ec4899` | Pink — featured/Pro highlight. |
| `--aurora-4` | `#22d3ee` | Teal — icon accents in nav, links. |
| `--aurora-5` | `#10b981` | Green — success, KPI accent. |

### 2.3 Glass surfaces

| Token | Purpose |
|-------|---------|
| `--glass-bg` | Default translucent panel fill. |
| `--glass-bg-strong` | Stronger fill for hover / sticky headers. |
| `--glass-border` | Subtle hairline. |
| `--glass-border-strong` | Visible border on interactive surfaces. |

### 2.4 Status colors (themed)

`--color-success`, `--color-danger`, `--color-primary-soft`, `--color-info-soft`, `--color-warning-soft` (and their `-strong` variants) automatically switch pastel-on-translucent (dark) ↔ dark-on-translucent (light). **Always use the token**, never the raw hex.

### 2.5 Radii

`--radius-lg: 24px` (large cards), `--radius-md: 16px` (medium), `--radius-sm: 12px` (tiles, inputs). **Buttons and pills are `border-radius: 999px`** — never square off a button.

### 2.6 Motion

`--ease: cubic-bezier(0.4, 0, 0.2, 1)` — use for every `transition` that should feel native to the project. Most durations land in `0.25s`–`0.4s`. Long ambient motion (blobs, floating cards) uses `0.4s`+.

> All decorative motion must respect `@media (prefers-reduced-motion: reduce)` — the global rule in `styles.css` disables blob/floating-card/glow/dot animations. Do not add new ambient animations without a reduced-motion override.

---

## 3. Typography

| Element | Font | Weight | Notes |
|---------|------|--------|-------|
| Body | `'Sarabun'`, `'Plus Jakarta Sans'`, sans-serif | 400–600 | `*:not(i)` rule in `styles.css` already enforces this. |
| Headings (`.section-title`, `.hero-title`, `.section-title-sm`, `.price-amount`, `.kpi-value`) | `'Plus Jakarta Sans'`, `'Sarabun'`, sans-serif | 700–800 | Letter-spacing `-0.5px` to `-1.5px` for tightness. |
| Eyebrow / labels | Sarabun, uppercase, `0.4px` tracking, `0.8rem` | 600 | See `.hero-eyebrow`. |
| Icons (`<i>`, `.fas/.far/.fab/.fa`) | `"Font Awesome 6 Free"`, `"Font Awesome 6 Brands"` | — | Forced via `!important` in `styles.css`. |

`hero-title` uses `clamp(2.4rem, 5.5vw, 4.5rem)` and `.section-title` uses `clamp(2rem, 4vw, 3.2rem)`. Always size headings with `clamp()` for responsive scaling — never use fixed pixel sizes for hero/section titles.

---

## 4. Glassmorphism Recipe

Every glass surface in the project uses the same three-layer formula:

````css
.glass-surface {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md); /* or --radius-lg */
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
}
````

For an **iridescent border gradient** (used by `.glass-pricing-card`, `.glass-partner`, `.partner-kpi-card`), layer a `::before` with a 1px padded gradient and `mask-composite: exclude`:

````css
.glass-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.12));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
````

> Apply this exact recipe when introducing a new glass card. Do not roll a one-off background or border.

---

## 5. Gradients — the signature move

Gradients are the project's visual identity. Use the canonical recipes; do not improvise.

| Name | Recipe | Used by |
|------|--------|---------|
| **Primary brand** | `linear-gradient(135deg, var(--aurora-1) 0%, var(--aurora-3) 100%)` | `.aurora-btn-primary`, `.brand-mark`, `.glass-pricing-pro` glow, `.fc-icon`. |
| **Hero title text** | `linear-gradient(135deg, #ec4899 0%, #a855f7 45%, #06b6d4 100%)` with `-webkit-background-clip: text` | `.hero-title-gradient`, `.price-amount`. |
| **Pink→violet→cyan accent** | Same as hero title text | Featured elements. |
| **Cyan glow button** | `linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)` with `0 8px 24px rgba(6, 182, 212, 0.45)` | Navbar CTA only. |
| **Pro card highlight** | `linear-gradient(160deg, rgba(124, 58, 237, 0.18) 0%, rgba(20, 22, 45, 0.6) 60%)` | `.glass-pricing-pro` body. |
| **Popular badge** | `linear-gradient(135deg, #fbbf24, #f59e0b)` with dark text `#422006` | `.popular-badge`, `.comparison-table .ribbon`. |
| **Avatar a1 / a3** | Pink→violet / amber→pink | `.trust-avatars .a1`/`.a3`. |
| **Avatar a2** | Cyan→green | `.trust-avatars .a2`. |
| **Table header (light)** | `rgba(124, 58, 237, 0.18) → rgba(236, 72, 153, 0.18)` | `.glass-comparison` header in light mode. |
| **Dark mode deep** | `--btn-dark-gradient: linear-gradient(135deg, #0f1228 0%, #1a1d3a 100%)` | `.aurora-btn-dark`. |

> When you need a "feature" or "highlight" feel (Pro plan, KPI cards, floating cards), always reach for the **primary brand gradient** (violet→pink). Cyan is reserved for secondary CTAs and info surfaces.

---

## 6. Background system

The animated aurora background is a **fixed, z-index: -1** stack of four blurred radial blobs plus a noise overlay. **Every page must include this stack** for the design to read correctly.

````html
<div class="aurora-bg" aria-hidden="true">
  <div class="aurora-blob aurora-blob-1"></div>
  <div class="aurora-blob aurora-blob-2"></div>
  <div class="aurora-blob aurora-blob-3"></div>
  <div class="aurora-blob aurora-blob-4"></div>
  <div class="aurora-noise"></div>
</div>
````

Rules:

- The `<body>` must carry the class `.aurora-body` (sets `min-height: 100vh` and `background: var(--surface-page)`).
- Blobs use `filter: blur(110px)`, `opacity: var(--blob-opacity)`, `mix-blend-mode: var(--blob-blend)`. Opacity and blend mode differ per theme (`--blob-opacity` is `0.55` in dark / `0.35` in light; `--blob-blend` is `screen` / `multiply`).
- Animations `blobFloat1`–`blobFloat4` use 22s/28s/32s/26s loops with translate + scale. Do not change the timing scale.
- `.aurora-noise` is a `data:image/svg+xml` SVG with `feTurbulence`; `opacity: 0.04`. Do not replace with a different noise approach.

---

## 7. Section layout

The page is composed of these sections, in order. Each has a named class on its root `<section>`:

1. **`.aurora-hero`** — `padding: 6rem 0 4rem`. Eyebrow → gradient title → lead → CTA pair → trust avatars → floating card visual.
2. **`.aurora-pricing`** — `padding: 5rem 0 6rem`, `background: var(--pricing-section-bg)`. Contains the 3-card grid and the **comparison table block** below it.
3. **`.aurora-partners`** — `padding: 5rem 0 6rem`, `background: var(--partners-section-bg)`. Contains KPI tile row and the **SVG line graph card**.
4. **`.aurora-register`** — `padding: 5rem 0`, `background: var(--register-section-bg)`. Two-column split: intro on the left (`d-none d-lg-block`), form card on the right.
5. **`.aurora-footer`** — glass footer with brand mark, link cluster, social buttons, and a divider line.

> Each section uses a different gradient overlay (pricing / partners / register) so adjacent sections feel layered. When adding a new section, give it one of these surface overlays rather than a flat background.

---

## 8. Component catalog

Use these existing components as the canonical implementation. Re-use before re-building.

### 8.1 Navbar — `.aurora-navbar`

- `sticky-top`, `background: var(--navbar-bg)`, `backdrop-filter: blur(20px) saturate(160%)`.
- Brand mark uses `.brand-mark` (36×36 rounded gradient square with the icon).
- Nav links use `.aurora-nav-link` — icon on the left in `var(--aurora-4)`, hover state swaps the icon to `var(--aurora-3)` and lifts the background to `var(--glass-bg)`.
- Right side: CTA button (`.aurora-btn.aurora-btn-glow.aurora-btn-sm`) → theme toggle (`#themeToggle`) → language switcher dropdown (`#langDropdown`).

### 8.2 Buttons — `.aurora-btn`

Pill-shaped (`border-radius: 999px`), `padding: 0.75rem 1.5rem`, weight 600.

| Modifier | Visual |
|----------|--------|
| `.aurora-btn-primary` | Primary brand gradient, white text. |
| `.aurora-btn-glow` | Adds `0 8px 24px rgba(124, 58, 237, 0.45)` shadow + inset highlight. Pair with primary. |
| `.aurora-btn-ghost` | Glass background, `--ink-0` text, translucent border. |
| `.aurora-btn-outline` | Transparent, `--ink-0` text, strong glass border. |
| `.aurora-btn-dark` | `--btn-dark-gradient` for high-contrast neutral CTAs. |
| `.aurora-btn-sm` | `padding: 0.5rem 1.15rem`, `font-size: 0.85rem` for nav-sized CTAs. |

Hover: `translateY(-2px)` + stronger shadow. Never animate `background` alone — always pair with `transform`.

### 8.3 Eyebrow — `.hero-eyebrow`

Pill (`border-radius: 999px`), uppercase `0.8rem`, `0.4px` letter-spacing, glass background, contains `.eyebrow-dot` (8px pulsing pink→violet dot via `dotPulse` 2s). The `.eyebrow-dark` variant uses `var(--glass-bg-strong)` and `var(--ink-0)`.

### 8.4 Glass pricing card — `.glass-pricing-card`

Layered: glass background → iridescent border via `::before` mask-composite → `.card-glow` (top-right radial blur) → body content. Hover: `translateY(-8px)`, stronger border, `0 20px 50px rgba(124, 58, 237, 0.25)`.

The **Pro** variant `.glass-pricing-pro.glass-pricing-card` is scaled `1.02`, uses `--pricing-pro-bg` body and `--pricing-pro-border`, and gets the `.popular-badge` (top-right amber pill with star icon).

### 8.5 Feature tile — `.aurora-feature-tile`

Compact glass tile with `.tile-icon` (48×48 gradient square, 12px radius), `h5` title, and `p` subtitle. `::before` adds a violet hover wash; hover lifts `translateY(-4px)`.

### 8.6 KPI card — `.partner-kpi-card`

Similar to feature tile but with a **corner radial gradient** via `::after` (different color per `.kpi-1` through `.kpi-4`: violet / pink / green / cyan). Layout: `.kpi-icon` → `.kpi-label` (muted) → `.kpi-value` (large, Plus Jakarta Sans) → `.kpi-trend.up` (green pill with arrow).

### 8.7 Trust avatars — `.trust-avatars`

Stack of 4 overlapping 32×32 circles (`.a1`–`.a4`) using gradients (pink→violet, cyan→green, amber→pink, glass). Wrap with `.hero-trust` (pill) containing stars (`#fbbf24`) and a `.trust-text small` line.

### 8.8 Floating cards (hero visual) — `.floating-card`

Three absolutely-positioned glass cards (`.fc-1`/`.fc-2`/`.fc-3`) with offset positions and unique `floatA`/`floatB`/`floatC` keyframes (6s/7s/8s). Each has a `.fc-icon` (44×44 gradient square) in the default/`.green`/`.purple` variants, a `.fc-label` (muted) and `.fc-value` (Plus Jakarta Sans, 1.4rem, weight 700). Backed by `.hero-glow` (radial blur pulsing 5s).

### 8.9 Comparison table — `.comparison-table`

- Scroll wrapper: `.comparison-table-scroll` (max-height `70vh`, sticky header + sticky left `.feature-col`).
- Header: gradient `--table-header-bg` with white text. The **Pro** column `.plan-col-pro` uses `--table-header-pro-bg` (pink→violet reversed) and a `.ribbon` "Popular" badge on top.
- Category rows (`.category-row`): full-width band with `--table-category-bg`, uppercase, `::before` 4px left bar in pink→violet gradient, contains a `.category-badge` icon.
- Value cells use `.value-pill` — `.value-success` (green check), `.value-danger` (red x), `.value-primary` (violet highlight for "Unlimited" / numeric emphasis), `.value-neutral` (glass).
- Action row at the bottom: `.btn-compare` with `.btn-compare-primary` / `.btn-compare-outline-success` / `.btn-compare-dark` variants.
- Filter pills above the table: `.comparison-filter .nav-link` — pill-shaped, `.active` uses the primary brand gradient with an amber icon.

### 8.10 Register card — `.glass-register`

Same glass pattern + `.card-glow`. Two-column: left intro (`.register-intro` with `.register-benefits` and `.register-trust`), right form (`.register-form.needs-validation` Bootstrap). On success, swap content for `.register-success` (green check mark, success pop animation `successPop` 0.6s, summary list).

### 8.11 Footer — `.aurora-footer`

`background: rgba(6, 7, 13, 0.7)`, top hairline border. Three clusters separated by flex: brand mark + name, footer link cluster, `.social-btn` (36×36 glass squares that fill with the primary brand gradient on hover and lift).

---

## 9. Internationalization

Every user-visible string is translatable **inline** via the `data-i18n` attribute.

````html
<span data-i18n data-th="สวัสดี" data-en="Hello">สวัสดี</span>
<input data-i18n-placeholder data-th-placeholder="ชื่อ" data-en-placeholder="Name">
````

Rules:

- Add `data-i18n` (no value) to any element whose text must be translated, plus `data-th` and `data-en` with the translations.
- For input placeholders, use `data-i18n-placeholder` + `data-th-placeholder` / `data-en-placeholder`.
- Default language is **Thai (`th`)**. English (`en`) is the only second language. The active language is stored in `localStorage['preferred-language']` and applied on load.
- Thai is the visible text in the markup (it is the default); the i18n script swaps to `en` text when the user selects English.
- The script lives in `script.js` (the first IIFE). Do not duplicate the logic.

---

## 10. Naming & class conventions

- **Project-prefixed classes** use the `aurora-` namespace (`.aurora-navbar`, `.aurora-btn`, `.aurora-feature-tile`, …).
- **Reusable component classes** use the `glass-` prefix (`.glass-pricing-card`, `.glass-comparison`, `.glass-partner`, `.glass-register`).
- **Modifier classes** are short and semantic (`.kpi-1`, `.tile-1`, `.icon-1`, `.popular-badge`, `.hero-eyebrow`).
- **Bootstrap utility classes** are the default for layout/spacing/typography — see `bootstrap-styling.instructions.md`.
- **No inline `style=""` attributes for visual values** — see `bootstrap-styling.instructions.md`. Use utility classes or the `styles.css` file.
- **BEM-style** when extending the project namespace (`.partner-kpi-card .kpi-icon`, `.comparison-table .category-row .category-cell`).

---

## 11. Quick checklist for new sections

Before shipping a new visual section, confirm:

- [ ] Uses the section-surface background tokens (`--pricing-section-bg`, `--partners-section-bg`, `--register-section-bg`, or a new one with the same gradient-overlay pattern).
- [ ] All colors come from `--aurora-*`, `--ink-*`, `--glass-*`, or status tokens — no raw hex.
- [ ] Glass surfaces use the canonical glassmorphism recipe (§4).
- [ ] Headings use `clamp()` sizing and Plus Jakarta Sans for the title.
- [ ] Buttons are pill-shaped (`border-radius: 999px`) and use the `.aurora-btn` family.
- [ ] Every user-visible string has `data-i18n` + `data-th` + `data-en`.
- [ ] Tested in both dark and light themes — light overrides for any new color exist in `[data-theme="light"]`.
- [ ] Ambient motion (if any) is disabled under `prefers-reduced-motion: reduce`.
- [ ] No `style="..."` attributes; no `<style>` block in the HTML; new CSS appended to `styles.css` (or a new page-scoped file linked in `<head>`).
