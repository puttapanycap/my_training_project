---
applyTo: "**/*.html"
description: "Bootstrap-first styling rules for the Aurora Glass project. Use when editing HTML, adding new components, or applying any visual/style changes to markup."
---

# Bootstrap Styling Rules

This project uses **Bootstrap 5.3+** as its UI framework. All styling work must follow these rules.

## 1. Framework

- Use **Bootstrap 5.3+** utility classes, components, and grid system as the default for layout and styling.
- Bootstrap CSS is loaded from `cdn.jsdelivr.net` in the `<head>` — assume it is always available.
- Prefer Bootstrap utility classes (`d-flex`, `gap-3`, `text-center`, `mb-4`, etc.) over writing custom CSS for spacing, flex, or typography.
- For complex components, use Bootstrap's JS components (modal, dropdown, collapse, etc.) via the data attributes API — do not re-implement them.

## 2. No Inline Styles

**Never** add `style="..."` attributes to HTML elements for visual purposes. This includes:

- `style="background: ..."` for colors/gradients
- `style="margin: ..."` or `style="padding: ..."` for spacing
- `style="color: ..."`, `style="font-size: ..."`, etc.

If a Bootstrap utility class exists for the value you need, use the class instead. If no utility class fits, add a new rule to the project's separate `styles.css` file (or create a new dedicated CSS file for the page/section).

## 3. Separate CSS Files

Custom styles must live in external CSS files, never inline in the HTML. The current project structure is:

- `styles.css` — global theme (Aurora glass variables, glass cards, hero, navbar, etc.)
- One CSS file per page/section when a feature grows large enough to justify its own file

When adding a new style:

1. First check if Bootstrap utilities already cover the need.
2. If a custom rule is required, append it to `styles.css` (or the relevant dedicated file) — not to a `<style>` block in the HTML, and not to a `style=""` attribute.
3. If the file does not exist yet, create it and link it in the HTML `<head>` next to the other stylesheet links.

## 4. Forward-Looking Only

This rule applies to **new and edited** HTML. Existing inline styles in the codebase are not in scope for this instruction — they will be migrated opportunistically when the surrounding markup is changed for other reasons, but the agent should not refactor untouched elements just to satisfy this rule.

## 5. Allowed Exceptions

The following are **not** considered inline styling and are permitted:

- Dynamic style values set from JavaScript (e.g. `el.style.transform = ...` for animations, `el.style.width = px + 'px'` for progress bars). These are computed at runtime and cannot live in a static stylesheet.
- Bootstrap attributes required for behavior, such as `data-bs-toggle`, `data-bs-target`, `aria-*` — these are not styles.
