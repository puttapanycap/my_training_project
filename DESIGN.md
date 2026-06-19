# Aurora Glass — Design System

> The visual and interaction language for the Smart Queue landing page.

This document is the human-facing companion to the codebase. It explains *what* the design looks like, *why* the choices were made, and *how* to extend the system without breaking it. The authoritative source for implementation details is [`styles.css`](./styles.css); for agent-driven edits, see [`.github/instructions/design.instructions.md`](./.github/instructions/design.instructions.md).

---

## 1. What is Aurora Glass?

Aurora Glass is a **dark-first, glassmorphism-led** design system built around three signature moves:

1. **Aurora background** — a fixed, slowly-drifting stack of large blurred radial gradients (violet, pink, cyan, green) on a deep midnight base. It is the visual identity of the product.
2. **Translucent glass surfaces** — every card, popover, and elevated panel uses a backdrop-blurred translucent fill with a 1px iridescent border.
3. **A signature gradient** — the violet→pink (`#7c3aed → #ec4899`) brand gradient shows up on primary buttons, brand marks, featured plan highlights, and KPI accent surfaces.

The aesthetic borrows from "northern lights through frosted glass" — soft, glowing, layered, premium. It targets a B2B SaaS audience that expects modern dashboard polish.

A light theme ships alongside the dark default, fully tokenised, but the system is *designed dark-first*. Light mode is the alternate, not the primary.

---

## 2. Design tokens

All visual values live as CSS custom properties at the top of [`styles.css`](./styles.css). Components reference tokens — never raw hex values. This is what makes theming, contrast tuning, and brand updates safe.

### 2.1 The aurora palette

| Token | Hex | Use |
|-------|-----|-----|
| `--aurora-1` | `#7c3aed` | Violet — primary brand. |
| `--aurora-2` | `#06b6d4` | Cyan — info, secondary accent. |
| `--aurora-3` | `#ec4899` | Pink — featured / "Pro" highlight. |
| `--aurora-4` | `#22d3ee` | Teal — icon accents in nav and links. |
| `--aurora-5` | `#10b981` | Green — success and KPI accent. |

These five colors carry the entire brand voice. The hero title gradient (`#ec4899 → #a855f7 → #06b6d4`) is a derived three-stop that uses the palette plus one bridge color (`#a855f7`).

### 2.2 The ink scale

A four-step text hierarchy is defined as `--ink-0` through `--ink-3`, from primary to most-muted. The same scale is redefined under `[data-theme="light"]` so it flips dark-on-light automatically. Use the token, not a manual contrast.

### 2.3 Glass surfaces

| Token | Purpose |
|-------|---------|
| `--glass-bg` | Default translucent panel fill. |
| `--glass-bg-strong` | Stronger fill (hover states, sticky headers). |
| `--glass-border` | Subtle hairline. |
| `--glass-border-strong` | Visible border on interactive surfaces. |

### 2.4 Status colors

`--color-success`, `--color-danger`, `--color-primary-soft`, `--color-info-soft`, `--color-warning-soft` (and `-strong` variants) are themed — pastel-on-translucent in dark mode, dark-on-translucent in light mode. Used in the comparison table value pills, success/error states, and KPI trends.

### 2.5 Radii and motion

| Token | Value | Use |
|-------|-------|-----|
| `--radius-lg` | `24px` | Large cards. |
| `--radius-md` | `16px` | Medium cards, dropdowns. |
| `--radius-sm` | `12px` | Tiles, inputs, icon squares. |
| — | `999px` | All buttons and pills. Always pill. |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | The standard motion curve. |

---

## 3. Themes

Two themes ship out of the box:

- **`dark`** (default) — deep midnight base (`#06070d`), vibrant aurora gradients, pastel-on-translucent status colors.
- **`light`** — soft off-white base (`#f4f6fb`), lower-opacity blobs, slightly more saturated accents.

The active theme is stored on `<html data-theme="...">`. An inline script at the top of `<head>` (before any stylesheet) reads `localStorage['preferred-theme']` and applies it synchronously, preventing the flash of wrong-theme content on page load. **Keep that script at the top of `<head>` — moving it below the stylesheets will cause a visible flash.**

The theme toggle button (`#themeToggle`) in the navbar owns the persistence logic. The button shows the sun in dark mode and the moon in light mode (each icon rotates and fades in/out smoothly via CSS).

When designing new components, test them in both themes — the easiest way to find themed surfaces that don't have a light override is to switch the toggle and inspect.

---

## 4. Typography

| Role | Font | Weight |
|------|------|--------|
| Body | Sarabun → Plus Jakarta Sans → system sans-serif | 400–600 |
| Headings | Plus Jakarta Sans → Sarabun | 700–800 |
| Eyebrow / labels | Sarabun, uppercase, 0.4px tracking | 600 |
| Icons | Font Awesome 6 Free / Brands | — |

**Sarabun** is loaded first because it covers both Latin and Thai glyphs cleanly — the project is bilingual (Thai default, English secondary). **Plus Jakarta Sans** carries the display weight for hero titles, section titles, prices, and KPI values.

The `*:not(i)` rule in `styles.css` enforces the font stack on everything except Font Awesome icons, which have their own `font-family: "Font Awesome 6 Free"`. Don't try to override that with inline `style="font-family: ..."` — it will break icons.

Headings use `clamp()` for responsive sizing (`clamp(2.4rem, 5.5vw, 4.5rem)` for hero, `clamp(2rem, 4vw, 3.2rem)` for section). Don't reach for fixed pixel sizes on hero/section titles — the clamp scale is part of how the layout breathes.

---

## 5. The background system

The aurora background is a fixed, full-viewport, `z-index: -1` stack:

```html
<div class="aurora-bg" aria-hidden="true">
  <div class="aurora-blob aurora-blob-1"></div>
  <div class="aurora-blob aurora-blob-2"></div>
  <div class="aurora-blob aurora-blob-3"></div>
  <div class="aurora-blob aurora-blob-4"></div>
  <div class="aurora-noise"></div>
</div>
```

Each blob is a large (`540px`–`720px`) radial gradient with `filter: blur(110px)`, positioned off-screen corners. They drift slowly via `blobFloat1`–`blobFloat4` keyframes (22s/28s/32s/26s loops). The `mix-blend-mode` differs per theme (`screen` in dark, `multiply` in light) so the blobs add light in dark mode and depth in light mode.

A faint noise overlay (`.aurora-noise`, `opacity: 0.04`) — a `feTurbulence` SVG — sits on top to add organic texture and prevent banding on the gradients.

**Every page that uses Aurora Glass must include this stack.** The design language doesn't read without it.

For users who prefer reduced motion, the global `@media (prefers-reduced-motion: reduce)` rule in `styles.css` disables the blob, floating-card, hero-glow, and eyebrow-dot animations. Any new ambient motion must be added to that override list.

---

## 6. Glassmorphism recipe

Every glass surface in the project uses the same three-layer formula:

1. **Translucent fill** — `background: var(--glass-bg)` with `backdrop-filter: blur(20px) saturate(160%)`.
2. **Hairline border** — `border: 1px solid var(--glass-border)` (or `-strong` for emphasis).
3. **Rounded corners** — `--radius-md` or `--radius-lg` from the token scale.

For the "iridescent" cards (pricing, partner graph, KPI tiles), layer a `::before` pseudo-element with a 1px padded gradient and a `mask-composite: exclude` trick. This produces a thin multi-color border that follows the card's rounded shape.

```css
.glass-card {
  position: relative;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(20px) saturate(160%);
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.12));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
```

**Use this exact recipe for any new glass surface.** Custom borders, custom backdrop-filter values, or one-off backgrounds break the visual coherence.

---

## 7. Gradients

Gradients are the signature move. They appear on primary buttons, the brand mark, hero title text, pricing accent, popular badge, and avatar stacks. The full canonical catalog:

| Gradient | Where it shows up |
|----------|-------------------|
| **Primary brand** — `linear-gradient(135deg, var(--aurora-1) 0%, var(--aurora-3) 100%)` (violet → pink) | `.aurora-btn-primary`, `.brand-mark`, Pro card glow, floating-card icon, social buttons on hover. |
| **Hero title text** — `linear-gradient(135deg, #ec4899 0%, #a855f7 45%, #06b6d4 100%)` with `-webkit-background-clip: text` | `.hero-title-gradient`, `.price-amount`. |
| **Cyan glow** — `linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)` with cyan-tinted shadow | Navbar CTA only. |
| **Pro card highlight** — `linear-gradient(160deg, rgba(124, 58, 237, 0.18) 0%, rgba(20, 22, 45, 0.6) 60%)` | `.glass-pricing-pro` body. |
| **Popular badge** — `linear-gradient(135deg, #fbbf24, #f59e0b)` with `#422006` text | `.popular-badge`, `.comparison-table .ribbon`. |
| **Dark CTA** — `linear-gradient(135deg, #0f1228 0%, #1a1d3a 100%)` | `.aurora-btn-dark` (Enterprise contact button). |

When a new element needs to feel "featured," reach for the primary brand gradient. Cyan is reserved for secondary CTAs and informational surfaces — don't use it on primary actions.

---

## 8. Layout

The page is a single column of named sections. Each section has a class on its `<section>` root and a unique gradient overlay so adjacent sections feel layered rather than stacked.

| Section | Class | Background overlay | Contents |
|---------|-------|--------------------|----------|
| Hero | `.aurora-hero` | none (sits on body) | Eyebrow → gradient title → lead → CTA pair → trust avatars + floating cards. |
| Pricing | `.aurora-pricing` | `--pricing-section-bg` | 3 pricing cards + comparison table block. |
| Partners | `.aurora-partners` | `--partners-section-bg` | KPI tile row + SVG line graph card. |
| Register | `.aurora-register` | `--register-section-bg` | Two-column: intro on the left, form card on the right. |
| Footer | `.aurora-footer` | solid `rgba(6, 7, 13, 0.7)` glass | Brand mark, link cluster, social buttons. |

For a new section, give it one of these surface overlays (or define a new gradient overlay in the same style) rather than a flat background. The layered look is part of the identity.

---

## 9. Component library

Re-use these before building anything new. They are the canonical implementations and define the visual baseline.

### Buttons (`.aurora-btn`)

Pill-shaped, `padding: 0.75rem 1.5rem`, weight 600, hover lifts `translateY(-2px)` and intensifies the shadow.

| Modifier | Use |
|----------|-----|
| `.aurora-btn-primary` | Primary brand gradient. Default for the most important action on a surface. |
| `.aurora-btn-glow` | Adds the violet/pink glow shadow. Pair with `-primary`. |
| `.aurora-btn-ghost` | Glass background, `--ink-0` text, translucent border. Secondary actions. |
| `.aurora-btn-outline` | Transparent with strong glass border. Quiet actions. |
| `.aurora-btn-dark` | `--btn-dark-gradient`. High-contrast neutral CTAs (e.g. "Contact Sales"). |
| `.aurora-btn-sm` | `padding: 0.5rem 1.15rem`, `font-size: 0.85rem`. For nav-sized buttons. |

### Glass pricing card (`.glass-pricing-card`)

Layered glass card with a top-right radial glow (`.card-glow`), an iridescent border via `::before`, and a `translateY(-8px)` hover. The Pro variant (`.glass-pricing-pro`) is scaled `1.02`, gets a pink-tinted border, and carries the `.popular-badge` (amber pill with a star).

### KPI card (`.partner-kpi-card`)

Compact glass tile with a corner radial gradient in a per-card color (`.kpi-1` violet, `.kpi-2` pink, `.kpi-3` green, `.kpi-4` cyan). Layout: icon → label (muted) → value (large, Plus Jakarta Sans) → trend pill.

### Feature tile (`.aurora-feature-tile`)

Smaller version of a KPI card. Uses a 48×48 gradient icon square (`.tile-1`/`-2`/`-3` for pink-violet / cyan-green / purple-indigo) and a violet hover wash via `::before`.

### Eyebrow (`.hero-eyebrow`)

Pill-shaped label with a pulsing pink→violet dot (`.eyebrow-dot`, 2s `dotPulse`). Used above hero and section titles. The `.eyebrow-dark` variant uses the strong glass background and `--ink-0` text for use on darker overlays.

### Trust avatars (`.trust-avatars`)

Stack of 4 overlapping 32×32 circles — pink→violet, cyan→green, amber→pink, plus a "+" glass circle. Wrapped in `.hero-trust` (pill) with amber stars and a small caption.

### Floating cards (`.floating-card`)

Three absolutely-positioned glass cards in the hero visual. Each carries a 44×44 gradient icon (default/`.green`/`.purple`), a small label, and a Plus Jakarta Sans value. They float on independent 6s/7s/8s loops (`floatA`/`floatB`/`floatC`) so the motion never looks synced. Backed by `.hero-glow`, a slowly-pulsing radial blur.

### Comparison table (`.comparison-table`)

A scrollable, sticky-header, sticky-feature-column table. Filter pills above (`.comparison-filter .nav-link`) toggle row visibility by category. Value cells use `.value-pill` (`.value-success` green check, `.value-danger` red x, `.value-primary` violet highlight, `.value-neutral` glass). Action row at the bottom uses `.btn-compare` with three variants (primary / outline-success / dark). The Pro column is highlighted with a pink→violet gradient and a `.ribbon` badge.

### Register card (`.glass-register`)

Same glass pattern as the pricing card. Two-column layout: left intro (benefits list, trust avatars), right form (`.register-form.needs-validation` — Bootstrap's validation, plus a password strength meter and a final `.register-success` state with a green check pop animation).

### Footer (`.aurora-footer`)

Glass footer with three clusters (brand, links, social). Social buttons (`.social-btn`) are 36×36 glass squares that fill with the primary brand gradient on hover.

---

## 10. Internationalization

The page is bilingual. The default is **Thai**, with **English** as a second language selected from the navbar dropdown (`#langDropdown`).

Strings are translated inline via `data-i18n`:

```html
<span data-i18n data-th="สวัสดี" data-en="Hello">สวัสดี</span>
<input data-i18n-placeholder data-th-placeholder="ชื่อ" data-en-placeholder="Name">
```

Rules for new strings:

- Add `data-i18n` (no value) to the element.
- Add `data-th="..."` (Thai, the default visible text) and `data-en="..."` (English).
- For input placeholders, use `data-i18n-placeholder` + the matching `-th-placeholder` / `-en-placeholder` attributes.
- Don't duplicate the i18n logic — it lives in the first IIFE of [`script.js`](./script.js) and reads `localStorage['preferred-language']`.
- The script also updates `<html lang="...">` for accessibility and SEO. Don't try to set the language manually elsewhere.

The visible Thai text in the markup is the default — the i18n script swaps to English text when the user selects English. This is by design: it means the page is fully readable in Thai even with JavaScript disabled.

---

## 11. Motion

Motion is purposeful, not decorative. Three categories:

1. **Micro-interactions** — button hovers (`translateY(-2px)` + shadow), card hovers (`translateY(-8px)`), nav-link hovers (background lift, icon color swap). All use `--ease` at `0.25s`–`0.3s`.
2. **Ambient** — the four aurora blobs drift on 22s/28s/32s/26s loops; floating cards in the hero float on 6s/7s/8s loops; the eyebrow dot pulses on 2s. All designed to be **slow enough to feel like the environment, not like an animation**.
3. **Feedback** — the `successPop` on the register form, the `fadeInRow` on table filter changes, `animate.css` entrance animations on the hero (`.animate__animated .animate__fadeIn*`).

Hard rule: **all ambient motion must be disabled under `prefers-reduced-motion: reduce`**. The global rule in `styles.css` covers the existing animations; any new ambient motion must be added to that override list before shipping.

When animating, pair `transform` with `background`/`box-shadow` changes — never animate `background` alone. The combination gives a more physical feel and is cheaper to composite.

---

## 12. Naming conventions

| Prefix | Use |
|--------|-----|
| `.aurora-…` | Project-level structural classes (`.aurora-navbar`, `.aurora-btn`, `.aurora-feature-tile`, `.aurora-hero`, `.aurora-footer`). |
| `.glass-…` | Reusable component classes with the iridescent border recipe (`.glass-pricing-card`, `.glass-comparison`, `.glass-partner`, `.glass-register`). |
| `.kpi-N`, `.tile-N`, `.icon-N`, `.fc-N` | Modifier classes that swap the color/glow variant. |
| `.value-pill.value-*` | Status variant of the comparison-table value pill. |
| `.btn-compare.*` | Button variant for the comparison-table action row. |

When extending the system, follow the same pattern: pick a structural prefix (`aurora-` for layout, `glass-` for components), then use a short semantic modifier for variants.

**Bootstrap utility classes are the default for layout, spacing, and typography** (see [`bootstrap-styling.instructions.md`](./.github/instructions/bootstrap-styling.instructions.md)). Don't write custom CSS for things Bootstrap utilities already cover.

---

## 13. Conventions & file layout

```
/
├── DESIGN.md                       # ← you are here
├── AGENTS.md                       # project-level coding conventions
├── index.html                      # the landing page
├── styles.css                      # the design system (all tokens, all components)
├── script.js                       # i18n, theme toggle, comparison filter, line graph
├── table.html                      # standalone comparison-table demo
├── assets/                         # images, icons
└── .github/
    └── instructions/
        ├── bootstrap-styling.instructions.md   # how to write markup
        └── design.instructions.md              # agent-facing design reference
```

- **All design tokens live in [`styles.css`](./styles.css).** Do not redefine colors, radii, or motion in component files.
- **No inline `style=""` attributes** for visual values. Use Bootstrap utilities or add a rule to `styles.css`.
- **No `<style>` blocks in HTML.** CSS goes in `styles.css` or a new page-scoped file linked in `<head>`.
- **All user-visible strings have `data-i18n` + `data-th` + `data-en`.** Including in the navbar, footer, and form labels.

---

## 14. How to add a new section

1. **Pick a section class** in the `aurora-` namespace (e.g., `.aurora-testimonials`).
2. **Add a section-surface token** in `:root` (and override in `[data-theme="light"]`) so the section has its own gradient overlay, e.g. `--testimonials-section-bg: linear-gradient(...)`. Then apply it on the section root.
3. **Compose with existing components.** Re-use the glass-card recipe for any elevated surface. Re-use `.aurora-btn`, `.hero-eyebrow`, `.section-title`, `.section-sub` for the section header.
4. **Add translation attributes** to every new string (`data-i18n` + `data-th` + `data-en`).
5. **Test in both themes.** Toggle the theme and inspect every new element. Add `[data-theme="light"]` overrides for any new themed color.
6. **Respect reduced motion.** If you add any ambient animation, add it to the `prefers-reduced-motion: reduce` block in `styles.css`.
7. **Run through the pre-ship checklist:**

   - [ ] Section uses a section-surface background token.
   - [ ] All colors come from `--aurora-*`, `--ink-*`, `--glass-*`, or status tokens.
   - [ ] Glass surfaces use the canonical glassmorphism recipe.
   - [ ] Headings use `clamp()` sizing and Plus Jakarta Sans.
   - [ ] Buttons are pill-shaped and use `.aurora-btn`.
   - [ ] Every user-visible string has `data-i18n` + `data-th` + `data-en`.
   - [ ] Tested in both dark and light themes.
   - [ ] Any new ambient motion is disabled under `prefers-reduced-motion: reduce`.
   - [ ] No `style="..."` attributes; no `<style>` block in HTML; new CSS in `styles.css`.

---

## 15. Related documents

- [`.github/instructions/design.instructions.md`](./.github/instructions/design.instructions.md) — agent-facing design reference (same content, optimised for AI edits).
- [`.github/instructions/bootstrap-styling.instructions.md`](./.github/instructions/bootstrap-styling.instructions.md) — markup rules (Bootstrap-first, no inline styles, separate CSS files).
- [`AGENTS.md`](./AGENTS.md) — high-level coding conventions for the project.
- [`styles.css`](./styles.css) — the design system source of truth.
- [`script.js`](./script.js) — i18n, theme toggle, comparison filter, line graph logic.
