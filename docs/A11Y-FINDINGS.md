# Accessibility Audit Findings — ece-docs-components

**Audit date:** 28 Jul 2026
**Target:** npm package `ece-docs-components@1.0.107`
**Method:** Storybook 10 + `@storybook/test-runner` (Playwright Chromium) + axe-core 4.12
**Background:** All brands share `#fdfcee` (warm cream) page background. Brand-specific palette colours introduce additional contrast failures in ECE and GP.

## Summary

| Brand | Tests | Pass | Fail | Suites |
|-------|-------|------|------|--------|
| ECE   | 114   | 72   | 42   | 16     |
| GP    | 114   | 78   | 36   | 13     |
| School| 114   | 79   | 35   | 13     |
| Lightn| —     | —    | —    | (theme not defined in package) |

Structural violations (same across all brands): ~28–30 test failures.
Shared colour-contrast violations (same across all brands): ~5–7 test failures.
ECE-specific colour-contrast violations (purple `#ad46ff`): 7 additional failures.
GP-specific colour-contrast violations (blue `#4871cf`): 1 additional failure.
School has no brand-specific colour-contrast violations.

## Structural violations (shared across all brands)

### 1. Breadcrumb — `landmark-unique`

Two `<nav>` landmarks without distinguishing labels.

**Where:** `src/components/Breadcrumb.tsx:108–122`

The outer `Box component="nav"` renders a `<nav>` landmark, and the inner `MuiBreadcrumbs` also defaults to rendering its own `<nav>`. Neither carries an `aria-label`.

**Failing stories:** Default, No Dropdown

**Suggested fix:**
```tsx
<MuiBreadcrumbs aria-label="Breadcrumb" separator="/" ...>
```

---

### 2. Header — `button-name` (3 instances)

Three icon-only `<IconButton>`s without `aria-label`: menu toggle, desktop search, mobile search.

**Where:** `src/components/Header.tsx:205`

**Failing stories:** All 3

**Suggested fix:**
```tsx
<StyledSearchButton aria-label="Search">
<IconButton aria-label="Menu">
<IconButton aria-label="Search">
```

---

### 3. NoteBox — `button-name`

Edit icon-only `<IconButton>` without `aria-label`.

**Failing stories:** All 6 (Default, Mandatory, Optional, Accepted, Action Required, With Edit Click)

**Suggested fix:**
```tsx
<IconButton aria-label="Edit">
```

---

### 4. Progress — `aria-progressbar-name`

`<LinearProgress>` has no accessible name linking it to the visible "Step X of Y" label.

**Where:** `src/components/Progress.tsx:43`

**Failing stories:** Progress, Progress Complete, Progress No Label

**Suggested fix:**
```tsx
<StyledLinearProgress
  variant="determinate"
  value={percentage}
  aria-label={`Progress: step ${current} of ${total}`}
/>
```

---

### 5. Select — `aria-input-field-name`

`<Select>` combobox has self-referencing `aria-labelledby` — `htmlFor` / `id` collision.

**Where:** `src/components/Select.tsx:97–102`

**Failing stories:** All 3 (Default, WithHelperText, WithError)

**Suggested fix:**
```tsx
const labelId = `${selectId}-label`;
<StyledInputLabel id={labelId} htmlFor={selectId} ...>
<StyledSelect id={selectId} labelId={labelId} ...>
```

---

### 6. Sidebar — `list`

`<ul>` wraps `<div>` instead of `<li>` directly.

**Where:** `src/components/Sidebar.tsx:231–233` (repeats at line 275–277 for sub-items)

**Failing stories:** All 3

**Suggested fix:**
```tsx
<List sx={{ p: 0 }}>
  {menuItems.map((item) => (
    <MenuItemButton key={item.id} sx={{ mb: 1 }} ...>
      ...
    </MenuItemButton>
  ))}
</List>
```

---

### 7. SidebarV2 — `button-name`, `list`, `nested-interactive`

Collapse toggle `<IconButton>` inside menu items lacks `aria-label`. Also inherits the same `list` structure violation as Sidebar v1.

**Failing stories:** All 3 (Default, Not Admin, Multiple Organisations)

**Suggested fix:**
```tsx
<IconButton aria-label="Toggle section">
```

---

### 8. Modal — `aria-dialog-name`, `button-name`, `label`

Modal dialogs lack accessible names and close buttons lack aria-labels.

**Failing stories:** All 6 (Default, Pending, Action Required, Declined, Not Started, Loading)

**Suggested fix:**
```tsx
<Dialog aria-labelledby="modal-title">
<IconButton aria-label="Close">
```

---

### 9. ActionButton — `button-name`

Icon-only button without `aria-label` when label prop is omitted.

**Failing story:** No Label

**Suggested fix:**
```tsx
<button aria-label={label || 'Action'}>
```

---

## Colour-contrast violations (brand-dependent, bg #fdfcee)

All failures are against the shared production background `#fdfcee`. Three colour groups are shared across ALL brands; two additional groups are brand-specific.

### Shared: `#f56b6b` (coral error text) — all brands

Error/helper text on Input, Select, Radio, and RichTextArea in error state.

| Component | Stories | Foreground | Background | Ratio |
|-----------|---------|------------|------------|-------|
| Input | WithError | `#f56b6b` | `#fdfcee` | 2.82:1 |
| Select | WithError | `#f56b6b` | `#fdfcee` | 2.82:1 |
| Radio | RadioGroupWithError | `#f56b6b` | `#fdfcee` | 2.82:1 |
| RichTextArea | WithError | `#f56b6b` | `#fdfcee` | 2.82:1 |

**Suggested fix:** Darken error colour to `#d32f2f` or `#c62828`.

---

### Shared: `#93826e` (warm grey muted text) — all brands

Muted text for helper text, descriptions, and step indicator labels.

| Component | Stories | Foreground | Background | Ratio | Font |
|-----------|---------|------------|------------|-------|------|
| Select | WithHelperText | `#93826e` | `#fdfcee` | 3.59:1 | 14px |
| Checkbox | WithDescription | `#93826e` | `#fdfcee` | 3.59:1 | 14px |
| Radio | RadioWithDescription | `#93826e` | `#fdfcee` | 3.59:1 | 14px |
| Progress | StepIndicatorDefault, StepIndicatorLast | `#93826e` | `#fdfcee` | 3.59:1 | 12px |

**Suggested fix:** Darken to `#7a6b5a` or `#6b5e4e`.

---

### ECE-only: `#ad46ff` (purple accent) — 7 additional failures

ECE's primary brand colour. Fails as link text on cream bg, and as white text on purple bg.

#### Breadcrumb (Default) — link text
| Foreground | Background | Ratio |
|------------|------------|-------|
| `#ad46ff` | `#fdfcee` | 3.98:1 |

#### Button (Primary) — white text on purple
| Foreground | Background | Ratio |
|------------|------------|-------|
| `#ffffff` | `#ad46ff` | 4.12:1 |

#### FileUploadButton (Primary, WithMaxSize) — purple button
| Foreground | Background | Ratio |
|------------|------------|-------|
| `#ffffff` | `#ad46ff` | 4.12:1 |

#### Header (LongName) — purple element
| Foreground | Background | Ratio |
|------------|------------|-------|
| `#fefdf7` | `#ad46ff` | 4.04:1 |

#### SimpleModal (Default, LongContent) — purple element
| Foreground | Background | Ratio |
|------------|------------|-------|
| `#fefdf7` | `#ad46ff` | 4.04:1 |

**Suggested fix:** Darken ECE purple to `#8c2be0`.

---

### GP-only: `#4871cf` (blue accent) — 1 additional failure

GP's primary brand colour. Barely fails as link text on cream bg.

#### Breadcrumb (Default)
| Foreground | Background | Ratio |
|------------|------------|-------|
| `#4871cf` | `#fdfcee` | 4.48:1 |

**Suggested fix:** Darken GP blue slightly to `#3a5cb0` (ratio ≈4.72:1).

---

### School: no brand-specific contrast violations

School's green (#386e41) and all other palette colours pass WCAG AA against `#fdfcee`.

---

## Components that passed cleanly

Alert, AutocompleteSelect, Card, Concertina, ExpandingBox, ExpandingBoxToggle, Footer, ReadBy, StatusBar, TableOfContents, Tabs, Toggle

---

## How to reproduce

```bash
npm run storybook

# Per-brand CLI (requires Storybook running on :6006)
BRAND=ECE npx test-storybook --url http://localhost:6006 --testTimeout 30000
BRAND=School npx test-storybook --url http://localhost:6006 --testTimeout 30000
BRAND=GP npx test-storybook --url http://localhost:6006 --testTimeout 30000

# All brands
npm run test-a11y:all
```

Open Storybook, select a component, switch brands via the toolbar dropdown, and inspect the **Accessibility** panel to see violations live.

> **Note:** Lightn brand is not defined in the package theme (`src/ThemeProvider.tsx`), so it falls through to the ECE default. No separate audit was performed for Lightn.
