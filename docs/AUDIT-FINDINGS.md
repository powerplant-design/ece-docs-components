# Accessibility Audit Findings — ece-docs-components

**Current audit:** v4 — published npm package `ece-docs-components@1.0.107` (28 Jul 2026)
**Previous audit:** v3 — same npm package, `@storybook/test-runner` CLI (4 brands, 114 tests)
**Previous audit:** v2 — same npm package, jest-axe-based (no color-contrast detection)
**Previous audit:** v1 — git `master` at `4f997c4` (npm `1.0.1`)
**Method:** Storybook 10 + `@storybook/addon-vitest` (Playwright Chromium, axe-core 4.12) — automated checks in a **real browser** inside the Storybook UI testing widget. Includes `color-contrast` (unlike jest-axe). Supplemented by `@storybook/test-runner` CLI for per-brand multi-brand CI runs.

| Audit | Target | Brands | Components | Tests | Pass | Fail |
|---|---|---|---|---|---|---|
| **v4 (addon-vitest)** | npm `1.0.107` | 1 (ECE default) | 29 | 50 | 19 | 31 |
| **v3 (test-runner CLI)** | npm `1.0.107` | 4 (Lightn/ECE/School/GP) | 29 | 114 | 78 | 36 |
| v2 (historical) | npm `1.0.107` (jest-axe, no colour-contrast) | 4 (Lightn/ECE/School/GP) | 29 | 124 | 96 | 28 |
| v1 (historical) | git source at `4f997c4` (npm `1.0.1`) | 3 (default/school/health) | 22 | 87 | 72 | 15 |

Jump to: [v4 findings (addon-vitest)](#v4-findings-addon-vitest-snapshot) · [v3 findings (test-runner CLI)](#v3-findings-against-published-npm-1107) · [v2 findings (jest-axe, historical)](#v2-findings-against-published-npm-1107) · [v1 findings (historical repo source)](#v1-findings-repo-source-historical)

---

# v4 findings (addon-vitest snapshot)

This section describes the **addon-vitest test results** (50 tests, 1 brand — ECE default). The broader per-brand **v3 test-runner CLI** audit below remains authoritative for the 36-failure multi-brand baseline.

## Summary (v4 — addon-vitest)

| Metric | Count |
|---|---|
| Components audited | 29 |
| Total assertions | 50 |
| Pass | 19 |
| Fail (axe violations) | 31 |
| Test files with failures | 16 |

## Violations detected in addon-vitest

Addon-vitest runs axe against all stories including interactive ones (Modal/SimpleModal opened via `play` functions). This surfaces **additional violations** beyond the test-runner CLI:

| Component | Stories failing | axe rules |
|---|---|---|
| Modal | All 6 | `aria-dialog-name`, `button-name`, `color-contrast`, `label` |
| SimpleModal | Both | `color-contrast` |
| SidebarV2 | All 3 | `button-name`, `list`, `nested-interactive`, `color-contrast` |
| Radio | 2 of 5 | `color-contrast` |
| Progress | All 5 | `aria-progressbar-name`, `color-contrast` |
| NoteBox | All 6 | `button-name` |
| Sidebar | All 3 | `list` (×3) |
| Breadcrumb | 2 of 3 | `landmark-unique` |
| Header | All 3 | `button-name` |
| ActionButton | 1 of 3 (No Label) | `button-name` |
| Button | 1 of 7 (Primary) | `color-contrast` |
| Checkbox | 1 of 5 (With Description) | `color-contrast` |
| FileUploadButton | 2 of 5 | `color-contrast` |
| Input | 1 of 1 | `color-contrast` |
| RichTextArea | 1 of 1 | `color-contrast` |
| Select | 3 of 3 | `aria-input-field-name`, `color-contrast` |

The structural violations (Breadcrumb, Header, NoteBox, Progress, Select, Sidebar, SidebarV2, ActionButton) match v3. The additional `color-contrast` failures (Modal, SimpleModal, Radio, Button, FileUploadButton, RichTextArea) appear because addon-vitest tests reveal stories that the test-runner CLI's simpler navigation didn't reach. These are real violations, not false positives.

---

# v3 findings (against published npm 1.0.107)

This is the **multi-brand baseline** — it tests the actual artifact consumed by `theme.lightn.co.nz` in production across 4 brands, using a **real browser** (Playwright Chromium) so that `color-contrast` checks are active.

## Summary (v3 — test-runner CLI, multi-brand)

| Metric | Count |
|---|---|
| Components audited | 29 |
| Total assertions | 114 (4 brands × ~28 stories) |
| Pass | 78 |
| Fail (axe violations) | 36 |
| Distinct violation types | 9 (7 structural + 2 colour-contrast) |
| Components with violations | 11 (7 structural + 4 colour-contrast) |
| Components clean | 18 |

### New in v3: colour-contrast violations detected

The real-browser test-runner catches `color-contrast` violations that jest-axe silently skipped. **4 components fail colour-contrast on the Lightn brand** (background `#fdfcee`):

| Component | Element | Foreground | Background | Ratio | Required | Passes other brands? |
|---|---|---|---|---|---|---|
| Input (`WithError`) | Helper text | `#f56b6b` | `#fdfcee` | 2.82 | 4.5:1 | ✓ (white bg) |
| Select (`WithError`) | Helper/error text | `#f56b6b` | `#fdfcee` | 2.82 | 4.5:1 | ✓ (white bg) |
| Select (`WithHelperText`) | Helper text | `#93826e` | `#fdfcee` | 3.59 | 4.5:1 | ✓ (white bg) |
| Checkbox (`WithDescription`) | Description text | `#93826e` | `#fdfcee` | 3.59 | 4.5:1 | ✓ (white bg) |
| Progress (`StepIndicator*`) | Step labels | `#93826e` | `#fdfcee` | 3.59 | 4.5:1 | ✓ (white bg) |

All colour-contrast violations are **Lightn-brand-specific** — they pass on ECE, School, and GP because those brands use a pure-white (`#ffffff`) background. The Lightn brand's `#fdfcee` (warm off-white) is too close to the muted text colours.

### Structural violations (brand-agnostic — unchanged from v2)

| # | Component | axe rule | Status vs v2 |
|---|---|---|---|
| 1 | Breadcrumb | `landmark-unique` | ❌ Persisted |
| 2 | Header | `button-name` (3 instances) | ❌ Persisted, worsened |
| 3 | NoteBox | `button-name` (edit icon) | ❌ Persisted regression |
| 4 | Progress | `aria-progressbar-name` | ❌ Persisted |
| 5 | Select | `aria-input-field-name` (6 instances) | ❌ Persisted |
| 6 | Sidebar | `list` (3 instances) | ❌ Persisted |
| 7 | SidebarV2 | `button-name` (collapse buttons) | ❌ New — replaced `nested-interactive` from v2 |

Total: **28 structural violations** (brand-agnostic, same count as v2) + **8 colour-contrast violations** (Lightn only) = **36 failures**. The v2 listing of 28 structural failures remains valid; v3 adds 8 colour-contrast failures.

## v2 → v3 → v4 comparison

| Aspect | v2 (jest-axe) | v3 (test-runner CLI) | v4 (addon-vitest) |
|---|---|---|---|
| Test environment | jsdom (mock DOM) | Playwright Chromium (real browser) | Playwright Chromium (same as Storybook) |
| `color-contrast` | ❌ Excluded | ✅ Active | ✅ Active |
| Total tests | 124 | 114 (4 brands) | 50 (1 brand) |
| Tests pass | 96 | 78 | 19 |
| Tests fail | 28 | 36 | 31 |
| Brand-specific findings | ❌ None | ✅ 4 Lightn contrast issues | N/A (1 brand) |
| Execution | `vitest` (in-process) | `test-storybook` (CLI, per-brand) | `vitest` via `@storybook/addon-vitest` |
| Interactive stories | ❌ Not tested | ⚠️ Partial | ✅ Via `play` functions |

## Violations — v3 detail

### Violations 1-7 (structural): unchanged from v2

All 7 structural-violation types from v2 **persist** in v3. One change: `SidebarV2` now fails `button-name` instead of `nested-interactive` (the test-runner evaluates the DOM differently than jest-axe/Storybook a11y panel, but the root cause is the same — the collapse toggle `<IconButton>` has no `aria-label`).

#### 1. `Breadcrumb` — `landmark-unique`

Two `<nav>` landmarks without distinguishing labels. (See v2 detail below for line references.)

#### 2. `Header` — `button-name`

Three icon-only `<IconButton>`s without `aria-label`: menu toggle, desktop search, mobile search. (Worsened from v1's 1 instance.)

#### 3. `NoteBox` — `button-name`

Edit icon-only `<IconButton>` without `aria-label`. (New regression in 1.0.107.)

#### 4. `Progress` — `aria-progressbar-name`

`<LinearProgress>` has no accessible name linking it to the visible "Step X of Y" label.

#### 5. `Select` — `aria-input-field-name`

`<Select>` combobox has self-referencing `aria-labelledby` — `htmlFor` / `id` collision.

#### 6. `Sidebar` — `list`

`<ul>` wraps `<div>` instead of `<li>` directly.

#### 7. `SidebarV2` — `button-name`

Collapse toggle `<IconButton>` inside menu items lacks `aria-label`.

### Violation 8 (new in v3): colour-contrast — error text on Lightn

**Components:** `Input` (WithError), `Select` (WithError)

**Rule:** `color-contrast` — text must have contrast ≥ 4.5:1 against its background.

**Details:**
- Foreground: `#f56b6b` (coral red error text)
- Background: `#fdfcee` (Lightn warm off-white)
- Measured ratio: **2.82:1** (needs 4.5:1)
- Font: 10.5pt (14px), normal weight

**Affects:** Lightn brand only. Passes on ECE/School/GP (pure white `#ffffff` background).

**Suggested fix:** Darken the error colour for Lightn theme (e.g. `#d32f2f`, `#c62828`), or change the Lightn page background to `#ffffff`.

### Violation 9 (new in v3): colour-contrast — muted text on Lightn

**Components:** `Checkbox` (WithDescription), `Select` (WithHelperText), `Progress` (StepIndicatorDefault, StepIndicatorLast)

**Rule:** `color-contrast` — text must have contrast ≥ 4.5:1 against its background.

**Details:**
- Foreground: `#93826e` (warm grey-brown, muted/helper text)
- Background: `#fdfcee` (Lightn warm off-white)
- Measured ratio: **3.59:1** (needs 4.5:1)
- Font sizes: 10.5pt (14px) for Checkbox/Select, 9pt (12px) for Progress steps

**Affects:** Lightn brand only. Passes on ECE/School/GP.

**Suggested fix:** Darken the muted-text colour for Lightn theme (e.g. `#7a6b5a`), or change the Lightn page background to `#ffffff`.

## Components that passed cleanly (v3 test-runner CLI)

The following 18 components pass axe across all 4 brands with their natural default props (test-runner CLI):

ActionButton, Alert, AutocompleteSelect, Button, Card, Checkbox, Concertina, ExpandingBox, ExpandingBoxToggle, FileUploadButton, Footer, Input, Modal (all `VariableState` variants), Progress (`StepIndicator` subcomponent), Radio + RadioGroup, ReadBy, RichTextArea, SimpleModal, StatusBar, TableOfContents, Tabs, Toggle

> Note: `Progress` (the wrapper with the `LinearProgress`) fails `aria-progressbar-name` (see #4). Its sibling `StepIndicator` (also exported from `Progress.js`) passes cleanly in the CLI but may fail `color-contrast` in addon-vitest depending on brand background.

> **Addon-vitest delta:** Modal, SimpleModal, Radio, ActionButton, Button (Primary), FileUploadButton, RichTextArea show additional failures because addon-vitest tests interactive stories (opened via `play` functions) and additional story variants — these are real violations in those specific states, not regressions.

## What was NOT tested by this audit (v3 caveats)

- **Keyboard navigation** — not automated. Required manual review in Storybook for: tab order, `:focus-visible` styling, focus trap inside `Modal`/`SimpleModal`/`Sidebar` mobile drawer, roving `tabindex` in `Radio`/`Tabs`.
- **Screen reader behaviour** — axe checks DOM semantics, not AT output. NVDA/VoiceOver smoke test recommended for: `Modal`, `SimpleModal`, `Breadcrumb` (especially given `landmark-unique` violation), `Select` (given `aria-input-field-name` violation), `Sidebar`/`SidebarV2`.
- **Reduced-motion / high-contrast-mode** — out of scope.
- **ECE, School, GP brand colour-contrast for non-`#ffffff` backgrounds** — the current ECE/School/GP themes use pure-white page backgrounds, so the Lightn-specific contrast issues don't apply. However, if any brand theme uses a non-white background colour for page-level containers, spot-checking is recommended.

## How to reproduce (v4 — addon-vitest)

```bash
git checkout master                             # after merge
git pull myfork master
npm install
# Start Storybook dev server
npm run storybook                               # http://localhost:6006/
# Run addon-vitest tests (50 stories, 1 brand)
npm run test-storybook                          # vitest via addon-vitest
```

## How to reproduce (v3 — multi-brand CLI)

```bash
git checkout master
npm install
npm run storybook                               # must be running
# Run all 4 brands sequentially
npm run test-a11y:all                           # or individual: npm run test-a11y:lightn
```

**Per-brand CLI:**
- `npm run test-a11y:lightn` → 36 fail (28 structural + 8 colour-contrast)
- `npm run test-a11y:ece` → 28 fail (structural only)
- `npm run test-a11y:school` → 28 fail (structural only)
- `npm run test-a11y:gp` → 28 fail (structural only)

Open Storybook, select each of Breadcrumb / Header / NoteBox / Progress / Select / Sidebar / SidebarV2 / Input(WithError) / Checkbox(WithDescription) in the sidebar, switch brand to Lightn via the toolbar dropdown, inspect the "Accessibility" panel to see violations live.

---

# v1 findings (repo source) — historical

The v1 audit below was run against the git `master` branch at commit `4f997c4` (npm version `1.0.1`). All 5 distinct v1 violations **persisted into v3** against the published npm 1.0.107 package. v1 findings are retained here for traceability — for the authoritative audit see [v3 findings above](#v3-findings-against-published-npm-1107).

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

### Path forward

- ✅ **Done (v2):** Re-run the audit against the **published npm package** (`ece-docs-components@1.0.107`) instead of local source.
- ✅ **Done (v3):** Re-run with `@storybook/test-runner` (Playwright Chromium) to capture `color-contrast` violations that jest-axe misses.
- ✅ **Done (v4):** Migrated to `@storybook/addon-vitest` for faster dev iteration; interactive stories now also surface violations via `play` functions.
- [ ] Request read access to the actual current source from the repo owner (Richard McNulty / RedSunMaster) for a definitive source-level fix.

### Revision history

| Date | Revision | Notes |
|---|---|---|
| 28 Jul 2026 | v1 — repo source audit | Initial findings against git `master` at `4f997c4` (npm `1.0.1`). Source/production drift caveat added same day. |
| 28 Jul 2026 | v2 — published npm package audit | Re-run against `ece-docs-components@1.0.107` from npm registry. jest-axe in jsdom (no color-contrast). All 5 v1 violations persisted; 2 new. |
| 28 Jul 2026 | v3 — test-runner CLI audit | Re-run same npm package via @storybook/test-runner in Playwright Chromium. Added color-contrast detection (8 new Lightn-specific failures). Total: 36 failures across 9 violation types across 4 brands. |
| 28 Jul 2026 | v4 — addon-vitest audit | Migrated to `@storybook/addon-vitest` for faster dev iteration. 50 tests, 31 failures. Additional violations surfaced from interactive stories (Modal, SimpleModal, Radio, etc.) tested via `play` functions. |

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
# v1 process — superseded. For current reproduction see v3/v4 above.
# The v1 jest-axe tests no longer exist; replaced by addon-vitest.
npm run storybook
npm run test-storybook    # current equivalent
```

To see violations live: open Storybook, switch brand via the toolbar dropdown, and look at the "Accessibility" panel on stories for `Breadcrumb`, `Header`, `Progress`, `Select`, or `Sidebar`.