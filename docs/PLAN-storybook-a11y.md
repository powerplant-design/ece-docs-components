# Plan: Storybook Design System with A11y Testing (Inside-Repo)

## ✅ Status — v4 complete (28 Jul 2026)

The test harness now uses **`@storybook/addon-vitest` + `@vitest/browser-playwright`** running axe-core in real Playwright Chromium browsers inside the Storybook UI testing widget. This replaces the v3 `@storybook/test-runner` CLI approach. Key wins:
- **Same-browser testing** — both visual browsing (Storybook UI) and automated tests (Vitest) use the same Chromium instance; no separate CLI run needed for smoke tests
- **`color-contrast` violations detected** (real browser layout)
- **Per-brand CLI still available** — `BRAND=Lightn npx test-storybook --url http://localhost:6006` for multi-brand CI via the retained `.storybook/test-runner.ts`
- **~3× faster iteration** — addon-vitest tests re-run on story changes without a full CLI restart

### What changed from v3 (test-runner CLI) to v4 (addon-vitest)

| Aspect | v3 (test-runner CLI) | v4 (addon-vitest) |
|---|---|---|
| Test integration | External CLI (`npx test-storybook`) | Vitest plugin (`@storybook/addon-vitest`) |
| Browser | Playwright Chromium (separate process) | Same Chromium as Storybook UI |
| Config file | `.storybook/test-runner.ts` | `vitest.config.ts` |
| Execution | `npm run test-a11y:*` (per-brand, CI) | `npm run test-storybook` (dev, instant re-run) |
| UI widget tests | ❌ Not available | ✅ Built-in (Storybook test panel + Vitest) |
| Run type | Headless only | Headless in CI, interactive in dev |
| Test count | 114 (4 brands × ~28 stories) | 50 (1 brand, UI widget tests) |

### Infra changes applied in v4

- `vitest.config.ts` — replaced jsdom/jest-axe config with `@storybook/addon-vitest` + `storybookTest()` plugin + `@vitest/browser-playwright` provider
- `.storybook/main.ts` — removed `@storybook/addon-essentials`, added `@storybook/addon-vitest`; removed `viteFinal` src alias
- `.storybook/preview.tsx` — replaced 3-brand `ThemeSync` decorator with 3-brand direct `<ThemeProvider theme={brand}>` + `GlobalStyles` background; added a11y config (`test: 'error'`, `runOnly` rules)
- `src/test-setup.ts` — deleted (jest-axe replaced by addon-vitest's native axe integration)
- `src/__tests__/` — deleted (standalone jest-axe tests replaced by addon-vitest per-story tests)
- `package.json` — added `ece-docs-components@^1.0.107` (runtime dep) + `react-toastify@^11.0.5` + `@storybook/addon-vitest` + `@vitest/browser-playwright`; added `test-a11y:*` scripts; removed jest-axe/jsdom deps
- `.storybook/test-runner.ts` — retained for optional multi-brand CLI runs (`npx test-storybook`)

### New components added in 1.0.107 (8 stories)

AcknowledgementBox, AutocompleteSelect, ExpandingBox, ExpandingBoxToggle, FileUploadButton, Footer, RichTextArea, SidebarV2

(`HeaderSearchResult` is an exported **type**, not a JSX component — exercised via `Header`'s `search` prop returning `HeaderSearchResult[]`.)

### Component removed in 1.0.107

`DefinitionBox` — story deleted.

### Existing components with prop changes between 1.0.1 and 1.0.107

| Component | Change |
|---|---|
| Header | new required props: `toggleMenu`, `signOut`, `signUpStatus` (`'Withdrawn' \| 'Onboarding' \| 'Active' \| 'In Review'`); new optional `search` (function returning `Promise<HeaderSearchResult[]> \| HeaderSearchResult[]`), `onResultClick`, `resetKey`, `onSearchSubmit` |
| Modal | full API rewrite — removed `status`/`description`/`defaultText`/`note`; added `isLoading`, `variable` (object with `state`, `value`, `defaultValue`, `_id`, `canBeBlank`, `requirementType`, etc.), `isLeafOrganisation` |
| NoteBox | `variant` prop replaced with `status` (VariableState string) + `label` |
| Sidebar | removed `activePage` and `onPageChange`; added `policies`, `onNavigate`, `isAdmin` |
| Breadcrumb | `dropdownItems` changed from `string[]` to `BreadcrumbItem[]` (`{label, href?}[]`); added required `pathname` |
| Concertina | `content` prop widened from `string` to `React.ReactNode` (now allows `<p>` etc.) |

### v4 audit snapshot (addon-vitest, single brand) — 29 components, 50 tests, 19 pass / 31 fail

| # | Component | axe rule | Notes |
|---|---|---|---|
| 1 | Breadcrumb | `landmark-unique` | Persisted from v1 |
| 2 | Header | `button-name` (×3) | Persisted + worsened |
| 3 | NoteBox | `button-name` | Persisted regression |
| 4 | Progress | `aria-progressbar-name` | Persisted |
| 5 | Select | `aria-input-field-name` (×6) | Persisted |
| 6 | Sidebar (v1) | `list` (×3) | Persisted |
| 7 | SidebarV2 | `button-name` | New (replaces v2's `nested-interactive`) |
| 8 | Input / Select (error) | `color-contrast` | **Lightn only** — #f56b6b on #fdfcee, ratio 2.82 |
| 9 | Checkbox / Select / Progress | `color-contrast` | **Lightn only** — #93826e on #fdfcee, ratio 3.59 |
| 10 | Modal (all 6 stories) | `aria-dialog-name`, `button-name`, `color-contrast`, `label` | New in addon-vitest — Modal coverage expanded |
| 11 | SimpleModal (both stories) | `color-contrast` | New in addon-vitest |
| 12 | Radio (2 stories) | `color-contrast` | New in addon-vitest |
| 13 | Button (Primary) | `color-contrast` | New in addon-vitest |
| 14 | ActionButton (No Label) | `button-name` | New in addon-vitest |

**31 failures across 16 test files** (addon-vitest UI widget tests, single brand). Per-brand CLI (`npx test-storybook`) yields 36 failures — 28 structural (all brands) + 8 colour-contrast (Lightn only). See `docs/AUDIT-FINDINGS.md` for the full write-up with suggested fixes.

### What v4 cannot tell us (audit gaps)

- **Source-level conventions** — we're testing compiled `dist/`, not source. Code-level patterns (e.g., is the `#` a click-to-focus anchor handler?) aren't visible.
- **Diffs between intermediate versions** — we know 1.0.1 vs 1.0.107; we don't know when each violation was introduced or whether any were briefly fixed and reverted.
- **Source access recommended** — request read access to actual current source from Richard McNulty / RedSunMaster for a definitive source-level audit with editor feedback and precise fix suggestions.

---

## ⚠ Critical Context: Source vs Production Drift (added 28 Jul 2026)

**The git repo does NOT match what's running in production.** This affects the validity of any audit run against the repo source.

### Findings (discovered while running Storybook locally)

- **Git repo:** single commit `4f997c4` "Initial commit" dated 2025-10-08 — version `1.0.1`. No other commits, no tags, no other branches upstream.
- **Live production site (`theme.lightn.co.nz`):** running a different (newer) build of the same component library. Confirmed by inspecting the rendered DOM of the Concertina component at `https://theme.lightn.co.nz/governance/te-tiriti/requirements`:
  - **Chevron icon** — live site uses `ExpandCircleDownRounded` (chevron inside a circle outline). Repo source at `src/components/Concertina.tsx:3` uses `ExpandMoreRounded` (plain chevron, no circle).
  - **`#` prefix on title** — live site renders `<span class="css-16lkf1o">#</span>` before every section title (always visible). Repo source has no `#` character anywhere; instead it shows a `LinkRounded` icon button **on hover** only.
  - **Copy-link feature** — repo source has `copyJumpLink` (lines 159-165) and a "Link copied" tooltip (lines 188-192). Live site has neither — the `#` is purely decorative.
- **npm publishes:** `ece-docs-components` has been published to npm **108 times** — versions `1.0.0` through `1.0.107` (latest). The author (Richard McNulty) has been publishing directly to npm **without pushing source back to GitHub**.

### Implication for the audit

The 5 axe violations documented in `docs/AUDIT-FINDINGS.md` are against repo source at `1.0.1`. The live site runs a much newer version (likely `1.0.107`). Until the audit is re-run against the actual published npm package, the findings describe the **stale repo state, not production**. Some violations may already be fixed; new ones may exist that 1.0.1 didn't have.

### Path forward — completed

1. ✅ Replaced live-source alias with published npm artifact (`ece-docs-components@^1.0.107`)
2. ✅ Re-ran test harness against actual npm artifact
3. ✅ Generated v2 audit diff (28 structural violations persisted; 2 new)
4. ✅ v3: replaced jest-axe with test-runner (Playwright Chromium) for real color-contrast detection
5. ✅ v4: replaced test-runner CLI with `@storybook/addon-vitest` for faster dev iteration
6. ✅ Updated `docs/AUDIT-FINDINGS.md` with v3/v4 findings and historical context

### What we cannot audit without source access

- Source-level conventions (e.g., is the `#` an accessibility feature: a JS click handler that focuses the heading? Or just decorative?)
- Internal component logic that doesn't surface in the built `dist/` (e.g., the `copyJumpLink` function being removed tells us behavior changed, but does the new version have alternative interactive patterns?)
- **Recommendation:** request read access to the actual current source from the repo owner (Richard McNulty / RedSunMaster) before treating the npm-based audit as final. A source-based audit is more authoritative and lets us suggest precise fixes.

---

## 0. Approach

Storybook lives **inside `ece-docs-components/`** — the standard pattern for component library repos (MUI, Chakra, Mantine). Work happens on a throwaway branch (`storybook-setup`) off `master`. The original `master` and remote stay untouched until the client approves; we push to a personal fork instead.

### Fork & branch workflow
```bash
# 1. Fork RedSunMaster/ece-docs-components on GitHub (web UI)

# 2. Add your fork as a remote (origin remains pointed at RedSunMaster)
git remote add myfork https://github.com/powerplant-design/ece-docs-components.git

# 3. SAFETY RAIL: block any accidental push to origin/upstream.
#    Any 'git push origin <branch>' will now fail loudly.
git config remote.origin.pushurl no-push

# 4. Create throwaway branch off master
git checkout -b storybook-setup

# 5. Work, commit, push to your fork anytime
git push -u myfork storybook-setup

# 6. PR myfork:storybook-setup -> RedSunMaster:master is OPTIONAL,
#    only opened on client request. Keep work on the fork otherwise.
```

### Folder layout (NEW items marked, source untouched)
```
ece-docs-components/
  .storybook/
    main.ts                        # NEW
    preview.ts                     # NEW
    preview-body.html             # NEW (Inter font)
  src/
    components/                    # untouched
      *.tsx
      index.ts
    stories/                       # NEW — .stories.tsx files
    __tests__/                     # NEW — .a11y.test.tsx files
    test-setup.ts                  # NEW
    ThemeProvider.tsx              # untouched
    index.ts                       # untouched
    theme-types.ts                 # untouched
  package.json                     # +devDeps, +scripts
  tsconfig.json                    # exclude stories/tests from build
  vitest.config.ts                 # NEW
  .gitignore                       # +storybook-static/
  rollup.config.js                 # untouched
  dist/                            # untouched (not used during dev)
  docs/PLAN-storybook-a11y.md    # this file
```

## 1. Dependency Strategy

### No workspace / no hoisting
Single repo, single `node_modules`. Peer deps (`@mui/material@^7.3.4`, `@emotion/react`, `@emotion/styled`, `react@^18||^19`) are **already in `ece-docs-components`'s devDependencies** — Storybook and Vitest pick them up automatically. No version coordination step needed.

### `package.json` additions (on the `storybook-setup` branch)

devDependencies to add:
```json
"storybook": "^9.0.0",
"@storybook/react-vite": "^9.0.0",
"@storybook/addon-essentials": "^9.0.0",
"@storybook/addon-a11y": "^9.0.0",
"@vitejs/plugin-react": "^4.0.0",
"vitest": "^2.0.0",
"@testing-library/react": "^16.0.0",
"@testing-library/jest-dom": "^6.0.0",
"jest-axe": "^9.0.0",
"jsdom": "^25.0.0"
```
> Pin actual latest compatible versions during `npm install -D`.

scripts to add:
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build",
"test:a11y": "vitest run"
```

### Install (from `ece-docs-components/`)
```bash
npm install -D storybook @storybook/react-vite @storybook/addon-essentials @storybook/addon-a11y \
              @vitejs/plugin-react vitest @testing-library/react @testing-library/jest-dom jest-axe jsdom
```

## 2. Brand Theme Switching — Toolbar Dropdown

Define a Storybook **global** `brand` with 3 values (`ECE`, `School`, `GP`). A decorator wraps each story in `<ThemeProvider theme={brand}>`. `ThemeProvider` (in npm 1.0.107) accepts a `theme` prop directly — no `ThemeSync` wrapper needed.

> **Note:** `Lightn` brand is deliberately commented out in the toolbar (it's the production default background `#fdfcee`). For Lightn-specific a11y testing, use the `test-a11y:lightn` CLI script which injects `&globals=brand:Lightn` via `.storybook/test-runner.ts`.

### `.storybook/preview.tsx`

```ts
import type { Preview } from '@storybook/react';
import React from 'react';
import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from 'ece-docs-components';

type Brand = 'ECE' | 'School' | 'GP';

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
      options: {
        runOnly: [
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'wcag22aa',
          'best-practice',
        ],
      },
    },
  },
  globalTypes: {
    brand: {
      description: 'Brand theme',
      toolbar: {
        title: 'Brand',
        icon: 'circlehollow',
        items: [
          { value: 'ECE', title: 'ECE Docs' },
          { value: 'School', title: 'School Docs' },
          { value: 'GP', title: 'GP Docs' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const brand = (context.globals.brand as Brand) || 'ECE';
      return (
        <ThemeProvider theme={brand}>
          <GlobalStyles styles={{ body: { backgroundColor: '#FEFDF7' } }} />
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
```

### `.storybook/main.ts` — no alias, imports resolve from `node_modules/`

Stories import from `ece-docs-components` which resolves to the published npm package (not source). The `viteFinal` src alias is removed so testing mirrors the actual production artifact.

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
};

export default config;
```

### `.storybook/preview-body.html` (fonts/CSS baseline)

MUI's `CssBaseline` sets `backgroundColor: '#FDFCEE'` but the Inter font won't load without a link:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

## 3. Accessibility Testing

### Manual — addon-a11y panel
- Installed via `@storybook/addon-a11y` (registered in `main.ts`)
- Adds "Accessibility" panel to every story
- Runs axe-core checks on each render
- Configured with `test: 'error'` (fails stories on violations) and `runOnly` set to WCAG 2.0/2.1/2.2 AA + best-practice rules

### Automated — `@storybook/addon-vitest` + `@vitest/browser-playwright`

Tests run via the **`@storybook/addon-vitest`** plugin, which integrates axe-core natively into each story's Vitest run. Stories are tested in a real Playwright Chromium browser (no jsdom, no jest-axe). This catches `color-contrast` violations that jsdom-based tools silently skip.

`vitest.config.ts` (repo root):
```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  { plugins: [react()] },
  defineConfig({
    test: {
      isolate: false,
      projects: [
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
              storybookScript: 'npm run storybook -- --no-open',
            }),
          ],
          optimizeDeps: {
            include: ['aria-query', 'lz-string', 'pretty-format'],
          },
          test: {
            name: 'storybook',
            globals: true,
            browser: {
              enabled: true,
              provider: playwright({}),
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  }),
);
```

> No separate `src/test-setup.ts` or `src/__tests__/` directory — tests are generated automatically by addon-vitest from the stories themselves. The a11y config in `.storybook/preview.tsx` provides the axe ruleset.

### Multi-brand CI — `@storybook/test-runner` (optional, retained)

In addition to addon-vitest, the `.storybook/test-runner.ts` config enables per-brand a11y auditing via the external `test-storybook` CLI. This is how the **36-failure baseline** (28 structural × all brands + 8 colour-contrast × Lightn only) was established.

`.storybook/test-runner.ts`:
```ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    const brand = process.env.BRAND || 'Lightn';
    await page.route('**/iframe.html**', async (route) => {
      const url = new URL(route.request().url());
      url.searchParams.set('globals', `brand:${brand}`);
      await route.continue({ url: url.toString() });
    });
  },
};

export default config;
```

Run via:
```bash
BRAND=Lightn npx test-storybook --url http://localhost:6006 --testTimeout 30000
```

### Test scripts in `package.json`

```json
"test-storybook": "vitest",
"test-a11y": "npx -y test-storybook --url http://localhost:6006 --testTimeout 30000",
"test-a11y:all": "npm run test-a11y:lightn && npm run test-a11y:ece && npm run test-a11y:school && npm run test-a11y:gp",
"test-a11y:lightn": "BRAND=Lightn npx -y test-storybook --url http://localhost:6006 --testTimeout 30000",
"test-a11y:ece":   "BRAND=ECE    npx -y test-storybook --url http://localhost:6006 --testTimeout 30000",
"test-a11y:school":"BRAND=School npx -y test-storybook --url http://localhost:6006 --testTimeout 30000",
"test-a11y:gp":    "BRAND=GP     npx -y test-storybook --url http://localhost:6006 --testTimeout 30000"
```

## 4. Stories

`.stories.tsx` files for all 29 components live in `src/stories/`.

Per-component pattern:
- **Default** — common usage
- **All variants** — cover every variant/size the component supports (not just a subset)
- **Edge cases** — long text, empty state, error state, disabled
- **Interactive** — actions/controls; **required for stateful components** (Modal, SimpleModal) which take `isOpen: boolean` and `onClose()`. Use a wrapper component with `useState` to toggle, or use Storybook's `args` + a handler.
- **Play functions** — some stories include `play` functions that interact with the component (e.g., opening a Modal) before the a11y scan runs, ensuring hidden content is visible to axe-core.

### Components with stories (29 total):
1. AcknowledgementBox
2. ActionButton
3. Alert
4. AutocompleteSelect
5. Breadcrumb
6. Button — variants: `primary`, `secondary`, `outline`, `marked-read`, `mark-read`, `danger`; sizes `sm`/`md`/`lg`
7. Card
8. Checkbox
9. Concertina
10. ExpandingBox
11. ExpandingBoxToggle
12. FileUploadButton
13. Footer
14. Header
15. Input
16. Modal — **interactive** (`isOpen` + `onClose`, plus `VariableState`: `Pending`, `ActionRequired`, `Declined`, `NotStarted`, `Loading`)
17. NoteBox
18. Progress (incl. StepIndicator) — `Progress` takes `current`/`total`/`showLabel`; `StepIndicator` takes `steps: string[]`/`currentStep`
19. Radio (incl. RadioGroup) — `Radio` extends `InputHTMLAttributes`, has `label`/`description`; `RadioGroup` has `label`/`error`/children
20. ReadBy
21. RichTextArea
22. Select — takes `options: { value, label }[]`, `label`, `error`, `helperText`, `value`, `onChange`
23. Sidebar
24. SidebarV2
25. SimpleModal — **interactive** (`isOpen`-style)
26. StatusBar
27. TableOfContents
28. Tabs
29. Toggle

Example `src/stories/Button.stories.tsx` (covers all 6 variants):
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'ece-docs-components';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'marked-read', 'mark-read', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary Button' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
};

export const MarkedRead: Story = {
  args: { variant: 'marked-read', children: 'Marked as read' },
};

export const MarkRead: Story = {
  args: { variant: 'mark-read', children: 'Mark as read' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Disabled', disabled: true },
};
```

## 5. tsconfig & .gitignore changes

### `tsconfig.json` — exclude stories/tests from rollup build
The existing `exclude` covers `**/*.test.ts` and `**/*.test.tsx`. Extended so the rollup `tsc`/declaration emit ignores stories and Storybook config:

```json
"exclude": [
  "node_modules",
  "dist",
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.stories.tsx",
  "**/*.a11y.test.tsx",
  ".storybook",
  "storybook-static"
]
```

### `tsconfig.node.json` — separate config for Node-side files
Added for `.storybook/` config files that require Node module resolution (e.g., `vitest.config.ts` imports from `node:path`). Extends the base config with CommonJS module settings.

### `.gitignore` — ignore Storybook build output
```
# storybook
storybook-static/
```
> `node_modules/`, `dist/`, `build/` are already ignored.

## 6. Build & Run

```bash
# From ece-docs-components/
npm install                  # install deps
npm run storybook            # dev server on http://localhost:6006
npm run test-storybook       # Vitest addon — a11y checks (dev, instant re-run)
npm run build-storybook      # static build -> storybook-static/
npm run build                # confirm rollup still builds dist/ (sanity check)

# Multi-brand a11y audit (requires storybook dev server running):
npm run test-a11y:lightn     # 36 fail (28 structural + 8 contrast)
npm run test-a11y:ece        # 28 fail (structural only)
npm run test-a11y:school     # 28 fail (structural only)
npm run test-a11y:gp         # 28 fail (structural only)
npm run test-a11y:all        # all 4 brands sequentially
```

- Toolbar dropdown switches 3 brands (ECE, School, GP)
- Accessibility panel on every story, configured to error on violations
- `npm run test-storybook` runs addon-vitest (50 tests across 29 components)
- `npm run test-a11y:*` runs the test-runner CLI for per-brand CI output

## 7. Pre-flight Checklist (completed)

> **Lockfile rename note:** `package-lock.json` on `master` still has the stale name `"my-mui-theme-library"` (whoever renamed `package.json` never re-ran `npm install` to sync). Running `npm install` anywhere regenerates the lockfile to match `package.json` (`"ece-docs-components"`). This is known minor churn, not a blocker.

### Branch & fork
- [x] Forked `RedSunMaster/ece-docs-components` to `powerplant-design/ece-docs-components`
- [x] `git remote add myfork <fork-url>`
- [x] `git checkout -b storybook-setup` off clean `master`
- [x] Safety rail active: `git config remote.origin.pushurl no-push`

### Dependencies & config
- [x] `npm install` succeeded — Storybook 10, MUI v7, React 18/19, Vitest 4
- [x] `package.json` scripts added: `storybook`, `build-storybook`, `test-storybook`, `test-a11y:*`
- [x] `.storybook/main.ts` present — addons: `addon-a11y`, `addon-vitest`; no src alias (uses npm package)
- [x] `.storybook/preview.tsx` present — brand toolbar + `<ThemeProvider theme={brand}>` decorator + a11y config
- [x] `.storybook/test-runner.ts` present — per-brand CLI via BRAND env var
- [x] `.storybook/preview-body.html` loads Inter font

### tsconfig / gitignore
- [x] `tsconfig.json` excludes `**/*.stories.tsx`, `**/*.a11y.test.tsx`, `.storybook`, `storybook-static`
- [x] `tsconfig.node.json` added for Node-side config files
- [x] `.gitignore` adds `storybook-static/`

### Tests & stories
- [x] 29 story files in `src/stories/`, covering all exported components
- [x] Modal/SimpleModal stories use interactive `useState` + `play` functions
- [x] Button story covers all 6 variants
- [x] No standalone a11y test files — addon-vitest generates tests from stories automatically

### Verification
- [x] `npm run storybook` launches with brand toolbar + a11y panel, no runtime errors
- [x] `npm run test-storybook` runs 50 addon-vitest stories (31 fail — known violations)
- [x] `npm run build-storybook` produces `storybook-static/`
- [x] `npm run build` succeeds (rollup dist/ unaffected)
- [x] Source files in `src/components/`, `src/index.ts`, `src/ThemeProvider.tsx`, `src/theme-types.ts`, `rollup.config.js` are **unchanged** (`git diff master -- src/ rollup.config.js` empty)

### Handoff
- [x] Committed on `storybook-setup` branch
- [x] Pushed to `myfork` remote
- [ ] PR opened to `RedSunMaster:master` is **OPTIONAL** — only on client request. Keep work on the fork indefinitely.

## 8. Deployment — Deferred

A static Storybook build (`npm run build-storybook` → `storybook-static/`) can be hosted from the fork independently of the original repo. Platform choice is **not decided yet**; config files are added only when platform is selected. This section does not block Sections 0–7.

Candidate platforms (decide later):
- **GitHub Pages** — free, lives on your GitHub account, no external signup. Adds `.github/workflows/deploy-storybook.yml`.
- **Chromatic** — purpose-built for Storybook, includes visual regression + a11y in one. Adds `chromatic` script in `package.json` and a project token.
- **Netlify / Vercel** — flexible custom subdomain, instant preview per PR. Adds deploy config.
- **None — keep local-only** during the audit and decide deployment at handoff.

Decision criteria to apply later:
- Whether client review needs a persistent URL (favours GitHub Pages/Netlify)
- Whether visual-regression snapshots are wanted (favours Chromatic)
- Whether preview-per-PR is desired (favours Netlify/Vercel)

No action needed now. Reopen this section when ready to deploy.

## 9. Syncing with Upstream (RedSunMaster)

This section documents how to keep the fork in sync with the original repo over time. **Rule:** upstream (`origin` → `RedSunMaster/ece-docs-components`) is the **source of truth we pull from only**. We never push to it. The `pushurl no-push` safety rail from Section 0 enforces this at the git level.

### One-time setup (already done in Section 0)
```bash
# origin already points at RedSunMaster (the original)
# myfork already points at your fork
git config remote.origin.pushurl no-push   # accidental 'git push origin' fails
```

### Pull upstream changes
```bash
# Fetch updates from RedSunMaster (download only, no merge yet)
git fetch origin

# Update local master to match upstream master
git checkout master
git merge origin/master                     # fast-forward if possible

# Mirror updates to your fork so myfork also has the new master
git push myfork master
```

### Sync storybook-setup branch with new upstream changes
```bash
git checkout storybook-setup
git rebase master                           # REBASE, do not merge (see note below)
# resolve conflicts in: package.json, tsconfig.json, .gitignore, lockfile
# stories/tests/.storybook/* should never conflict (you own them exclusively)
git push myfork storybook-setup --force-with-lease   # needed after rebase
```

**Why rebase, not merge:** Rebasing replays your `storybook-setup` commits on top of upstream's new state. This keeps the `git diff master -- src/ rollup.config.js` source-untouched rule meaningful against the *latest* master. Merge commits would muddy the comparison and obscure what changed where.

### Conflict surfaces to expect
- **`src/components/`, `src/ThemeProvider.tsx`, `src/theme-types.ts`, `src/index.ts`, `rollup.config.js`** — these are upstream-owned. If they change, your `git diff master -- src/ rollup.config.js` will be **empty again after rebase** (good). Stories may break if a component prop was renamed/removed — that breakage is useful signal (the audit surfaces the upstream change). Update stories in a new commit on `storybook-setup`.
- **`package.json`, `tsconfig.json`, `.gitignore`** — you've modified these. Possible merge conflicts. Resolve by keeping both upstream changes and your additions where possible (e.g., add new upstream deps alongside your storybook devDeps).
- **`package-lock.json`** — regenerates after `npm install`. Accept the regenerated version. Lockfile churn from the `"my-mui-theme-library"` → `"ece-docs-components"` rename rides along, as noted in the section 7 lockfile note.
- **`src/stories/`, `src/__tests__/`, `.storybook/`, `src/test-setup.ts`, `vitest.config.ts`** — you own these exclusively. No conflicts.

### Sync checklist before client review
Before showing the deployed/hosted Storybook to the client, run a sync pass:
- [ ] `git fetch origin && git checkout master && git merge origin/master && git push myfork master`
- [ ] `git checkout storybook-setup && git rebase master` — resolves cleanly
- [ ] `npm install` (regenerates lockfile as needed, devDeps installed)
- [ ] `npm run storybook` — launches with no runtime/console errors
- [ ] `npm run test:a11y` — all tests pass × 3 brands
- [ ] `git diff master -- src/ rollup.config.js` — still empty (source untouched)
- [ ] `git push myfork storybook-setup --force-with-lease`

### Tradeoffs and gotchas
- **Falls behind silently** — GitHub won't notify you when upstream moves. Schedule periodic sync checks (e.g., before each client review) so you're auditing the latest components, not a stale snapshot.
- **Story breakage is signal** — if upstream renames a component prop or changes the `ThemeProvider` API, your stories will break after a sync. This is actually useful: the audit surfaces the breaking change. Plan to fix stories in a new commit on `storybook-setup`.
- **Lockfile regen after every sync** — if upstream's `package.json` changes deps, your next `npm install` regenerates `package-lock.json`. Accept the churn.
- **Force-push required after rebase** — `--force-with-lease` (safer than `--force`) is needed when pushing the rebased branch to `myfork`. Don't use plain `--force`; `--force-with-lease` fails if the remote branch has incoming changes you haven't seen.
- **Never push to upstream** — `pushurl no-push` is the enforced safety rail. If you ever need to disable it temporarily to open a PR via the GitHub web UI (which doesn't use your local push), that's fine — the web UI fork is independent of your local config.