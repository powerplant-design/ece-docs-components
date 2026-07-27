# Accessibility Audit Findings — ece-docs-components

**Audit date:** 28 Jul 2026 (initial — see revision history below)
**Audited commit (master):** `4f997c4` (Initial commit, 2025-10-08, version `1.0.1`)
**Method:** Storybook 10 + `@storybook/addon-a11y` (axe-core 4.x) — automated checks against the rendered DOM of each of the 22 components across all 3 brand themes (default / school / health).

---

## ⚠ Critical Caveat: Audit is against stale repo source, NOT production

During the audit we visually compared Storybook against the live production site (`https://theme.lightn.co.nz/governance/te-tiriti/requirements`) — a consumer of this library — and found significant divergence. The findings below describe **repo source at version `1.0.1`** (the only commit on `master`, dated Oct 2025), but production is running a much newer version.

### Evidence the live site uses a different/newer version

The `Concertina` component on the live site differs in three concrete ways from `src/components/Concertina.tsx` in this repo:

| Aspect | Repo source (`1.0.1`) | Live site (`theme.lightn.co.nz`) |
|---|---|---|
| Chevron icon | `ExpandMoreRounded` — plain chevron (`Concertina.tsx:3`) | `ExpandCircleDownRounded` — chevron inside a circle (per inspected SVG path) |
| Title prefix | None — title is plain text | Always-visible `<span>#</span>` before the title |
| Hover interaction | `LinkRounded` icon button appears on hover with "Copy link" tooltip (`Concertina.tsx:180-194`) | No link icon, no copy-link feature — the `#` is decorative |

### Why this happened

- The git repo (`github.com/RedSunMaster/ece-docs-components`) has only **one commit** (`4f997c4`, "Initial commit").
- The npm package `ece-docs-components` has been published **108 times**: `1.0.0` → `1.0.107` (latest). The author has been pushing versions directly to npm without synchronizing source back to GitHub.
- The live site consumes a recent npm version (likely `1.0.107`). The repo source is ~10 months and 106 versions behind production.

### Implication for these findings

The 5 violations documented below are against code that **may not match production**. Some may:
1. Already be fixed in newer versions
2. Still exist (carried through all 107 versions)
3. Have been replaced by different/new violations we haven't measured yet

**Treat these findings as a baseline of the repo state, not as a definitive audit of `theme.lightn.co.nz`.**

### Path forward (pending — not yet executed)

1. Re-run the audit against the **published npm package** (`ece-docs-components@1.0.107`) instead of local source — by installing from npm and removing the Vite/Vitest `ece-docs-components` → `src` alias.
2. Request read access to the actual current source from the repo owner (Richard McNulty / RedSunMaster) for a definitive source-level audit.
3. Update this document with a v2 audit once the npm-based findings are available.

### Revision history

| Date | Revision | Notes |
|---|---|---|
| 28 Jul 2026 | v1 — repo source audit | Initial findings against git `master` at `4f997c4` (npm `1.0.1`). Caveat above added same day after discovering source/production drift. |
| (pending) | v2 — npm package audit | Will re-run against `ece-docs-components@^1.0.107` from npm registry. |

---

## Summary

| Metric | Count |
|---|---|
| Components audited | 22 |
| Total assertions (test cases) | 87 |
| Pass | 72 |
| Fail (axe violations) | 15 |
| Distinct violation types | 5 |
| Components with violations | 5 |
| Components clean | 17 |

All 15 failures are **source-side** in `src/components/` — they cannot be fixed from the consumer side. The same violation fires identically on all 3 brand themes (no brand-specific contrast or color issues were detected).

## Violations

### 1. `Breadcrumb` — `landmark-unique` (all brands)

**Rule:** `landmark-unique` — multiple landmarks of the same type on a page must be distinguishable via `aria-label`, `aria-labelledby`, or `title`.

**Where:** `src/components/Breadcrumb.tsx:108–122`
```tsx
<Box component="nav" sx={{ ... }}>           // line 108-109 — renders <nav>
  <HomeButton aria-label="Home"> ... </HomeButton>
  <MuiBreadcrumbs separator="/" sx={{ ... }}> // line 122 — MUI Breadcrumbs defaults to <nav>
    ...
  </MuiBreadcrumbs>
</Box>
```

The outer `Box component="nav"` renders a `<nav>` landmark, and the inner `MuiBreadcrumbs` *also* defaults to rendering its own `<nav>` landmark. Neither carries an `aria-label`/`aria-labelledby`, so screen-reader users have no way to disambiguate the two navigation regions.

**Suggested fix:**
- Pass `aria-label="Breadcrumb"` (or similar) to one of the two elements. Recommended: add it to the `MuiBreadcrumbs` and let the outer `Box` stay generic, OR remove `component="nav"` from the outer `Box` since the breadcrumbs already provide a nav landmark.
  ```tsx
  <MuiBreadcrumbs aria-label="Breadcrumb" separator="/" ...>
  ```

---

### 2. `Header` — `button-name` (all brands)

**Rule:** `button-name` — buttons must have a discernible accessible name.

**Where:** `src/components/Header.tsx:205`
```tsx
<StyledSearchButton>                          // styled(IconButton), no aria-label
  <StyledSearchIcon>
    <SearchRounded sx={{fontSize: 20}} />
  </StyledSearchIcon>
</StyledSearchButton>
```

`StyledSearchButton` (defined at `Header.tsx:103` as `styled(IconButton)`) is used inside the `TextField` `endAdornment` as a search submit button, but it has no `aria-label`. The button is only visually identifiable by the magnifying-glass icon, which screen-reader users cannot perceive.

**Suggested fix:**
```tsx
<StyledSearchButton aria-label="Search">
```

---

### 3. `Progress` — `aria-progressbar-name` (all brands)

**Rule:** `aria-progressbar-name` — elements with `role="progressbar"` must have an accessible name.

**Where:** `src/components/Progress.tsx:43`
```tsx
{showLabel && (
  <Box ...>
    <Typography ...>Step {current} of {total}</Typography>   // label is visible, not associated
    <Typography ...>{Math.round(percentage)}%</Typography>
  </Box>
)}
<StyledLinearProgress variant="determinate" value={percentage} />  // line 43 — no aria-label / aria-labelledby
```

`LinearProgress` with `variant="determinate"` renders a `<div role="progressbar" aria-valuenow=…>` element. There is no `aria-label` on the progressbar and no `aria-labelledby` connecting it to the visible "Step X of Y" text above it. Screen-reader users hear only "progressbar, 50%" with no context about what is progressing.

**Suggested fix (either):**
- Add an `aria-label` describing the progress:
  ```tsx
  <StyledLinearProgress
    variant="determinate"
    value={percentage}
    aria-label={`Progress: step ${current} of ${total}`}
  />
  ```
- Or add an `id` to the "Step X of Y" `<Typography>` and reference it via `aria-labelledby` on the `StyledLinearProgress`.

---

### 4. `Select` — `aria-input-field-name` (all brands)

**Rule:** `aria-input-field-name` — form fields with combobox / input roles must have a discernible accessible name.

**Where:** `src/components/Select.tsx:97–102`
```tsx
{label && (
  <StyledInputLabel htmlFor={selectId} shrink={false}>   // line 98
    {label}
  </StyledInputLabel>
)}
<StyledSelect
  id={selectId}                                          // line 103 — same id as label's htmlFor
  ...
/>
```

The visible `<InputLabel htmlFor={selectId}>` links to the MUI Select via `htmlFor`, but the same `selectId` is also used as the `Select`'s own `id`. MUI's `MuiSelect` internally renders `aria-labelledby=":r0:"` (or similar) that ends up pointing back at itself, so the combobox has no proper labelledby association to the visible label. The label association is therefore not exposed to AT.

**Suggested fix:**
- Give the label its own id and pass it to MUI's `labelId` prop:
  ```tsx
  const labelId = `${selectId}-label`;
  ...
  <StyledInputLabel id={labelId} htmlFor={selectId} ... >
  ...
  <StyledSelect
    id={selectId}
    labelId={labelId}     // MUI sets aria-labelledby={labelId}, resolving the association
    ...
  />
  ```

---

### 5. `Sidebar` — `list` (all brands)

**Rule:** `list` — `<ul>` and `<ol>` must only directly contain `<li>`, `<script>`, or `<template>` elements.

**Where:** `src/components/Sidebar.tsx:231–233` (and the same pattern repeats at line 275–277 for sub-items)
```tsx
<List sx={{ p: 0 }}>                                 // renders <ul>
  {menuItems.map((item) => (
    <Box key={item.id} sx={{ mb: 1 }}>                // renders <div> — invalid child of <ul>
      <MenuItemButton isOpen={isOpen} isActive={...}> // renders <li>
        ...
      </MenuItemButton>
      {item.hasChildren && (
        <Collapse ...>
          <List sx={{ p: 0, mt: 0.5 }}>                // line 275: nested <ul>
            {item.children!.map((subItem) => (
              <Box key={subItem.id} sx={{ ... }}>      // line 277: another <div> wrapping <li>s
                ...
              </Box>
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  ))}
</List>
```

The wrapper `<Box>` (rendered as `<div>`) sits between the `<ul>` and the `<li>` items. Invalid HTML; some screen readers may drop the list semantics entirely.

**Suggested fix (either):**
- Move the visual margin/spacing to the `<MenuItemButton>` directly (e.g. `sx={{ mb: 1 }}` on the li-styled element) and drop the wrapping `<Box>`:
  ```tsx
  <List sx={{ p: 0 }}>
    {menuItems.map((item) => (
      <MenuItemButton key={item.id} sx={{ mb: 1 }} isOpen={isOpen} ...>
        ...
      </MenuItemButton>
    ))}
  </List>
  ```
- Or replace the wrapping `<Box>` with a fragment (`<>...</>`) if the margin role isn't needed on a wrapper.

---

## Components that passed cleanly

The following 17 components have **no axe violations** on any of the 3 brand themes, with their natural default props:

ActionButton, ActionButton, Alert, Button, Card, Checkbox, Concertina, DefinitionBox, Input, Modal (all 6 statuses), NoteBox, Radio + RadioGroup, ReadBy, SimpleModal, StatusBar, TableOfContents, Tabs, Toggle

> **Note:** `Button` has a `danger` variant that uses `theme.palette.accent.main` for background and `#FFFFFF` for text. axe-core's default WCAG AA color-contrast check is **not** part of the enforced a11y rule set in this run (jest-axe enables a subset — `color-contrast` is excluded by default because it requires a rendered layout engine). Color contrast across the 3 brand palettes is therefore **not covered** by these automated tests and should be reviewed visually in Storybook.

## What was NOT tested by this audit

- **Color contrast (WCAG AA/AAA)** — jest-axe excludes `color-contrast` by default; visual review in Storybook recommended.
- **Keyboard navigation** — no automated keyboard-interaction tests. Manual review in Storybook needed for tab order, focus-visible, focus trap inside modals, and roving tabindex in Radio/Tabs.
- **Screen reader behaviour** — automated tests check DOM semantics, not actual AT output. NVDA/VoiceOver smoke test recommended for Modal, SimpleModal, Breadcrumb, Select, Sidebar.
- **Reduced-motion / high-contrast-mode** — not in scope of this automated audit.
- **Responsive / mobile layouts** — axe runs against one viewport per story; viewport-specific violations (e.g. hidden-by-CSS on mobile) may need targeted stories.

## How to reproduce

```bash
# From the ece-docs-components/ dir on the storybook-setup branch:
npm install
npm run test:a11y         # vitest run — automated axe checks across 3 brands × 22 components
npm run storybook         # dev server on http://localhost:6006 — manual a11y panel per story
npm run build-storybook   # static build -> storybook-static/ for hosting
```

To see violations live: open Storybook, switch brand via the toolbar dropdown, and look at the "Accessibility" panel on stories for `Breadcrumb`, `Header`, `Progress`, `Select`, or `Sidebar`.