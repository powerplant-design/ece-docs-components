# Accessibility Audit Findings — ece-docs-components

**Current audit:** v2 — published npm package `ece-docs-components@1.0.107` (28 Jul 2026, commit `a3a1caf`)
**Previous audit:** v1 — git `master` at `4f997c4` (npm `1.0.1`) — retained below under "v1 findings (repo source)" for historical context
**Method:** Storybook 10 + `@storybook/addon-a11y` (axe-core 4.x) — automated checks against the rendered DOM of each component across brand themes.

| Audit | Target | Brands | Components | Tests | Pass | Fail |
|---|---|---|---|---|---|---|
| **v2 (current)** | npm `1.0.107` (production artifact) | 4 (Lightn/ECE/School/GP) | 29 | 124 | 96 | 28 |
| v1 (historical) | git source at `4f997c4` (npm `1.0.1`) | 3 (default/school/health) | 22 | 87 | 72 | 15 |

Jump to: [v2 findings (production package)](#v2-findings-against-published-npm-1107) · [v1 findings (historical repo source)](#v1-findings-repo-source-historical)

---

# v2 findings (against published npm 1.0.107)

This is the **authoritative audit** — it tests the actual artifact consumed by `theme.lightn.co.nz` in production.

## Summary

| Metric | Count |
|---|---|
| Components audited | 29 |
| Total assertions | 124 |
| Pass | 96 |
| Fail (axe violations) | 28 |
| Distinct violation types | 7 |
| Components with violations | 7 |
| Components clean | 22 |

All 28 failures are **source-side** in the published npm package (`node_modules/ece-docs-components/dist/esm/components/*.js`). All are **brand-agnostic** — the same violation fires on all 4 brands (Lightn, ECE, School, GP). No brand-specific contrast or colour issues were detected (note: `color-contrast` is excluded by jest-axe default).

## v1 → v2 comparison: every original violation persisted

| # | Component | axe rule | v1 (1.0.1) | v2 (1.0.107) | Notes |
|---|---|---|---|---|---|
| 1 | Breadcrumb | `landmark-unique` | ❌ | ❌ | **Persisted** — same root cause |
| 2 | Header | `button-name` | ❌ | ❌ | **Worsened** — v1 had 1 unlabelled search button; v2 has 3 (menu toggle, desktop search, mobile search) |
| 3 | NoteBox | `button-name` | ✓ | ❌ | **New regression** — new `EditButton` (icon-only) added without `aria-label` |
| 4 | Progress | `aria-progressbar-name` | ❌ | ❌ | **Persisted** |
| 5 | Select | `aria-input-field-name` | ❌ | ❌ | **Persisted** — same `aria-labelledby` self-reference issue |
| 6 | Sidebar | `list` | ❌ | ❌ | **Persisted** — `<ul>` still wraps `<div>` before `<li>` |
| 7 | SidebarV2 (new) | `nested-interactive` | n/a | ❌ | **New component, new violation** — `ListItemButton` (interactive) contains focusable descendants |

**The npm package received no a11y improvements between versions 1.0.1 (Oct 2025) and 1.0.107 (Jul 2026).** All 5 original violations persisted through 106 intervening publishes; NoteBox regressed (gained a violation); SidebarV2 shipped new with a violation.

## Violations — v2 detail

### 1. `Breadcrumb` — `landmark-unique` (all 4 brands)

**Where:** `node_modules/ece-docs-components/dist/esm/components/Breadcrumb.js:174` — outer `<Box component="nav">`, and `Breadcrumb.js:182` — inner `<Breadcrumbs>` (defaults to `<nav>`).

The component renders two `<nav>` landmarks, neither with an `aria-label`/`aria-labelledby`/`title`. Confirmed the inner `Breadcrumbs` has the same default in 1.0.107 as in 1.0.1.

**Suggested fix:** add `aria-label="Breadcrumb"` to one of them (recommended: the inner `Breadcrumbs`), or drop `component="nav"` from the outer `Box`.

### 2. `Header` — `button-name` (all 4 brands) — **worsened vs v1**

**Where:** `Header.js:462` — three icon-only `IconButton`s without `aria-label`:
1. **Menu toggle** (line 462 onwards) — `<IconButton disableRipple={true} onClick={toggleMenu} ...><MenuRounded/></IconButton>` — no `aria-label`
2. **Desktop search button** — `<StyledSearchButton onClick={handleSearchClick}><StyledSearchIcon><SearchRounded/></StyledSearchIcon></StyledSearchButton>` — no `aria-label`. `StyledSearchButton` is `styled(IconButton)` at `Header.js:141`.
3. **Mobile search button** — `<StyledSearchButton disableRipple={true} onClick={toggleMobileSearch}>...` — no `aria-label`

v1 only flagged the desktop search button. The menu toggle and mobile search buttons were added between 1.0.1 and 1.0.107 without `aria-label`s.

**Suggested fix:** add `aria-label="Open menu"`, `aria-label="Search"`, and `aria-label="Search"` to each respectively. i18n: extract strings if the consumer app supports multiple languages.

### 3. `NoteBox` — `button-name` (all 4 brands) — **new regression**

**Where:** `NoteBox.js:82` — `const EditButton = styled(IconButton)(...)` and `NoteBox.js:140` — `<EditButton className="edit-button" onClick=...>` — the `EditButton` is rendered inside a `<span class="highlight-span">` next to the highlighted children text. It's an icon-only `IconButton` (no text content visible) but has **no `aria-label`**.

The `EditButton` was added between 1.0.1 (which had no edit affordance on highlighted text) and 1.0.107.

**Suggested fix:** add `aria-label="Edit"` (or `aria-label={`Edit ${label}`}` if `label` prop is provided) to the `EditButton` usage at line 140.

### 4. `Progress` — `aria-progressbar-name` (all 4 brands)

**Where:** `Progress.js:19` — `<StyledLinearProgress variant="determinate" value={percentage} />` — no `aria-label` or `aria-labelledby` connecting it to the visible "Step {current} of {total}" label above it.

Identical to v1 — the violation persisted across all 106 publishes.

**Suggested fix:** add `aria-label={`Progress: step ${current} of ${total}`}` to the `StyledLinearProgress` element, OR add an `id` to the "Step X of Y" `<Typography>` and reference it via `aria-labelledby`.

### 5. `Select` — `aria-input-field-name` (all 4 brands)

**Where:** `Select.js:57` — `StyledLabel htmlFor={selectId}` (the label) AND `StyledSelect id={selectId}` (the select itself) — same `selectId` for both. MUI's rendered `div[role="combobox"]` therefore ends up with `aria-labelledby` pointing back at its own `id` (self-reference). The visible `<InputLabel htmlFor>` association isn't exposed to assistive tech.

Persisted from v1 — same root cause.

**Suggested fix:** give the label its own `id` (e.g. `${selectId}-label`) and pass `labelId={labelId}` to `MuiSelect`. MUI forwards this to `aria-labelledby` on the combobox, resolving the self-reference.

### 6. `Sidebar` (original) — `list` (all 4 brands)

**Where:** The original `Sidebar` — still shipped in 1.0.107 alongside `SidebarV2`. `<List>` (renders `<ul>`) wraps a `<Box>` (renders `<div>`) which wraps `<MenuItemButton>` (renders `<li>`).

Confirmed the structure continues from `Sidebar.js:197` — `<List sx={{p:0}}>` containing `<Box sx={{mb:1}}>` containing `<MenuItemButton>`.

Persisted from v1.

**Suggested fix:** move the `mb: 1` margin onto the `<MenuItemButton>` directly and drop the wrapping `<Box>`, OR replace the wrapping `<Box>` with a `<>` fragment, so `<ul>` contains `<li>` directly.

### 7. `SidebarV2` — `nested-interactive` (all 4 brands) — **new component, new violation**

**Where:** `SidebarV2.js:115` — `<MenuItemButton>` (interactive element, renders `<li role="button">` or similar) contains nested focusable descendants. Specifically, when an item has `item.items` (sub-items), an `<IconButton>` for the collapse toggle (`SidebarV2.js:148`) is rendered **inside** the `<MenuItemButton>`. Both are independently focusable/clickable, creating nested interactive semantics.

**Suggested fix:** restructure so the collapse `<IconButton>` is a **sibling** of `<MenuItemButton>`, not a descendant. Or move navigation behaviour to the inner `<ListItemText>` and drop `ListItemButton`'s interactive semantics in favour of a plain `<li>` wrapper. Or split the row into two separate controls (navigate vs expand) using a grid layout.

## Components that passed cleanly (v2)

The following 22 components pass axe across all 4 brands with their natural default props:

ActionButton, Alert, AutocompleteSelect, Button, Card, Checkbox, Concertina, ExpandingBox, ExpandingBoxToggle, FileUploadButton, Footer, Input, Modal (all `VariableState` variants), Progress (`StepIndicator` subcomponent — the parent `Progress` component itself fails, see violation #4), Radio + RadioGroup, ReadBy, RichTextArea, SimpleModal, StatusBar, TableOfContents, Tabs, Toggle

> Note: `Progress` (the wrapper with the `LinearProgress`) fails `aria-progressbar-name` (see #4). Its sibling `StepIndicator` (also exported from `Progress.js`) passes cleanly. Similarly, `Radio` and `RadioGroup` are separate exports from `Radio.js`, both passing. `Modal` covers all `VariableState` status values the component accepts (`Pending`, `ActionRequired`, `Declined`, `NotStarted`, `Loading`).

## What was NOT tested by this audit (v2 caveats)

- **Color contrast (WCAG AA/AAA)** — jest-axe excludes `color-contrast` by default; requires a rendered layout engine. Visual review in Storybook is needed. The 4 brand palettes (especially Lightn, the new default) should be manually checked for contrast ratio on text/background combinations.
- **Keyboard navigation** — not automated. Required manual review in Storybook for: tab order, `:focus-visible` styling, focus trap inside `Modal`/`SimpleModal`/`Sidebar` mobile drawer, roving `tabindex` in `Radio`/`Tabs`.
- **Screen reader behaviour** — axe checks DOM semantics, not AT output. NVDA/VoiceOver smoke test recommended for: `Modal`, `SimpleModal`, `Breadcrumb` (especially given `landmark-unique` violation), `Select` (given `aria-input-field-name` violation), `Sidebar`/`SidebarV2`.
- **Reduced-motion / high-contrast-mode** — out of scope.
- **`SidebarV2` `matchMedia`** — jsdom mock environment lacks `window.matchMedia`; test environment polyfilled `window.matchMedia` inline to let `SidebarV2` render. Production browsers have `matchMedia` natively.

## How to reproduce (v2)

```bash
git checkout storybook-setup
git pull myfork storybook-setup
npm install                                     # installs ece-docs-components@^1.0.107 + react-toastify@^11.0.5
npm run test:a11y                               # 124 tests, 28 fail (the 7 violations × 4 brands)
npm run storybook                               # dev server on http://localhost:6006/ — brand dropdown has 4 options
npm run build-storybook                         # static build -> storybook-static/
```

Open Storybook, select each of Breadcrumb / Header / NoteBox / Progress / Select / Sidebar / SidebarV2 in the sidebar, switch brand via the toolbar dropdown, inspect the "Accessibility" panel to see the violations live.

---

# v1 findings (repo source) — historical

The v1 audit below was run against the git `master` branch at commit `4f997c4` (npm version `1.0.1`). All 5 distinct v1 violations (**marked with ⚠ below**) **persisted into v2** against the published npm 1.0.107 package. v1 findings are retained here for traceability — for the authoritative audit see [v2 findings above](#v2-findings-against-published-npm-1107).

---

## v1 Critical Caveat: Audit is against stale repo source, NOT production

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
| 28 Jul 2026 | v2 — published npm package audit | Re-run against `ece-docs-components@1.0.107` from npm registry (commit `a3a1caf`). All 5 v1 violations persisted; 2 new violations (NoteBox regression + SidebarV2 new component). See v2 section above. |

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

## How to reproduce (v1)

```bash
# v1 process — superseded by v2 (see "How to reproduce (v2)" above)
# From the ece-docs-components/ dir on the storybook-setup branch BEFORE the v2 retarget:
npm install
npm run test:a11y         # vitest run — automated axe checks across 3 brands × 22 components
npm run storybook         # dev server on http://localhost:6006 — manual a11y panel per story
npm run build-storybook   # static build -> storybook-static/ for hosting
```

To see violations live: open Storybook, switch brand via the toolbar dropdown, and look at the "Accessibility" panel on stories for `Breadcrumb`, `Header`, `Progress`, `Select`, or `Sidebar`.