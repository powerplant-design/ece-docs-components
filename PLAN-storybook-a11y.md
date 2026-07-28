# Plan: Storybook Design System with A11y Testing (Inside-Repo)

## ✅ Status — v3 complete (28 Jul 2026)

The audit harness now uses **`@storybook/test-runner` with Playwright Chromium** against the published npm package `ece-docs-components@1.0.107`. This replaces the v2 jest-axe/jsdom approach. Key wins:
- **`color-contrast` violations now detected** (jest-axe skipped them)
- **Real browser rendering** — no mock/ polyfill hacks for `matchMedia`, `getComputedStyle`, etc.
- **Per-brand CLI** — `BRAND=Lightn npm run test-a11y` injects `&globals=brand:Lightn` via route interception in the test-runner's `preVisit` hook

### What changed from v2 (jest-axe, jsdom) to v3 (test-runner, Playwright Chromium)

| Aspect | v2 (jest-axe) | v3 (test-runner) |
|---|---|---|
| Test environment | jsdom (mock DOM) | Playwright Chromium (real browser) |
| `color-contrast` | ❌ Excluded by default | ✅ Active — 8 Lightn-specific violations found |
| Total tests | 124 | 114 |
| Tests pass | 96 | 78 |
| Tests fail | 28 | 36 |
| Brand-specific findings | ❌ None detected | ✅ 4 Lightn-specific contrast issues |
| Execution | `vitest` (in-process) | `test-storybook` (CLI, per-brand via BRAND env var) |

### Infra changes applied in v3

- `package.json` — added `ece-docs-components@^1.0.107` (runtime dep) + `react-toastify@^11.0.5` (new required peer dep, used by 1.0.107's ThemeProvider which now also renders `<CssBaseline/>` and `<ToastContainer/>`)
- `.storybook/main.ts` — removed the `viteFinal` `ece-docs-components -> src` alias; imports now resolve from `node_modules/`
- `vitest.config.ts` — removed the `resolve.alias` `ece-docs-components -> src`; same behaviour
- `.storybook/preview.tsx` — replaced 3-brand `ThemeSync` decorator with 4-brand direct `<ThemeProvider theme={brand}>` (1.0.107 dropped `setTheme` context; `useTheme()` returns just the MUI `Theme`)

### New components added in 1.0.107 (8 stories + 8 tests created)

AcknowledgementBox, AutocompleteSelect, ExpandingBox, ExpandingBoxToggle, FileUploadButton, Footer, RichTextArea, SidebarV2

(`HeaderSearchResult` is an exported **type**, not a JSX component — exercised via `Header`'s `search` prop returning `HeaderSearchResult[]`.)

### Component removed in 1.0.107

`DefinitionBox` — story + test files deleted in v2.

### Existing components with prop changes between 1.0.1 and 1.0.107

| Component | Change |
|---|---|
| Header | new required props: `toggleMenu`, `signOut`, `signUpStatus` (`'Withdrawn' \| 'Onboarding' \| 'Active' \| 'In Review'`); new optional `search` (function returning `Promise<HeaderSearchResult[]> \| HeaderSearchResult[]`), `onResultClick`, `resetKey`, `onSearchSubmit` |
| Modal | full API rewrite — removed `status`/`description`/`defaultText`/`note`; added `isLoading`, `variable` (object with `state`, `value`, `defaultValue`, `_id`, `canBeBlank`, `requirementType`, etc.), `isLeafOrganisation` |
| NoteBox | `variant` prop replaced with `status` (VariableState string) + `label` |
| Sidebar | removed `activePage` and `onPageChange`; added `policies`, `onNavigate`, `isAdmin` |
| Breadcrumb | `dropdownItems` changed from `string[]` to `BreadcrumbItem[]` (`{label, href?}[]`); added required `pathname` |
| Concertina | `content` prop widened from `string` to `React.ReactNode` (now allows `<p>` etc.) |

### v3 audit findings (against published npm 1.0.107) — 9 distinct violations × 4 brands = 36 failures

| # | Component | axe rule | Notes |
|---|---|---|---|
| 1 | Breadcrumb | `landmark-unique` | Persisted from v1 |
| 2 | Header | `button-name` (×3) | Persisted + worsened |
| 3 | NoteBox | `button-name` | Persisted regression |
| 4 | Progress | `aria-progressbar-name` | Persisted |
| 5 | Select | `aria-input-field-name` (×6) | Persisted |
| 6 | Sidebar (v1) | `list` (×3) | Persisted |
| 7 | SidebarV2 | `button-name` | New (replaces v2's `nested-interactive`) |
| 8 | Input / Select (error) | `color-contrast` | **NEW — Lightn only** — #f56b6b on #fdfcee, ratio 2.82 |
| 9 | Checkbox / Select / Progress | `color-contrast` | **NEW — Lightn only** — #93826e on #fdfcee, ratio 3.59 |

**28 structural violations + 8 colour-contrast violations (Lightn brand only) = 36 total.** See `AUDIT-FINDINGS.md` for the full write-up with suggested fixes.

### What v3 cannot tell us (audit gaps)

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

The 5 axe violations documented in `AUDIT-FINDINGS.md` are against repo source at `1.0.1`. The live site runs a much newer version (likely `1.0.107`). Until the audit is re-run against the actual published npm package, the findings describe the **stale repo state, not production**. Some violations may already be fixed; new ones may exist that 1.0.1 didn't have.

### Path forward — completed

1. ✅ Replaced live-source alias with published npm artifact (`ece-docs-components@^1.0.107`)
2. ✅ Re-ran test harness against actual npm artifact
3. ✅ Generated v2 audit diff (28 structural violations persisted; 2 new)
4. ✅ Escalated to v3: replaced jest-axe with test-runner (Playwright Chromium) for real color-contrast detection — 8 new Lightn-specific contrast violations found
5. ✅ Updated `AUDIT-FINDINGS.md` with v3 findings and historical context

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
  PLAN-storybook-a11y.md          # this file
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

Define a Storybook **global** `brand` with 3 values (`default`, `school`, `health`). A decorator wraps each story in `<ThemeProvider>`. Since `ThemeProvider` does not accept a `brand` prop, we use an inner wrapper component that calls `useTheme().setTheme(brand)` in a `useEffect`.

> **Verified:** `ThemeProvider` signature is `React.FC<{ children: React.ReactNode }>` — confirmed no `brand` prop. `useTheme()` returns `{ currentTheme, setTheme, theme }`. Components like `Select`, `Radio`, `Progress`, `StepIndicator` call `useTheme()` at top level, so they **must** be inside `<ThemeProvider>` — the decorator guarantees this for stories; tests must wrap explicitly.

### `.storybook/preview.tsx`

> **Note:** file extension is `.tsx`, not `.ts` — this file contains JSX (the `<ThemeSync>` and `<Story />` elements in the decorator), so `.ts` would fail Vite's JSX transform.

```ts
import type { Preview } from '@storybook/react';
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../src';

type Brand = 'default' | 'school' | 'health';

const ThemeSync: React.FC<{ brand: Brand }> = ({ brand }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand); }, [brand, setTheme]);
  return null;
};

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Brand theme',
      toolbar: {
        title: 'Brand',
        icon: 'circlehollow',
        items: [
          { value: 'default', title: 'ECE Docs' },
          { value: 'school', title: 'School Docs' },
          { value: 'health', title: 'GP Docs' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const brand: Brand = context.globals.brand || 'default';
      return (
        <ThemeProvider>
          <ThemeSync brand={brand} />
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
```

### `.storybook/main.ts` — with src alias

Vite alias lets stories import `ece-docs-components` and resolve to `src/index.ts` directly — instant feedback on component edits, no `npm run build` needed during dev. Stories are stored in `src/stories/` so they're co-located with source but excluded from the rollup build (see tsconfig change).

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined),
      'ece-docs-components': join(dirname(__dirname), 'src'),
    };
    return config;
  },
};

export default config;
```

### `.storybook/preview-body.html` (fonts/CSS baseline)

MUI's `CssBaseline` sets `backgroundColor: '#FDFCEE'` but the Inter font won't load without a link. Add:

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

### Automated — vitest + jest-axe

`vitest.config.ts` (repo root):
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'ece-docs-components': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
});
```

> Vitest uses the **same `ece-docs-components` → `src` alias** so tests import live source, not built `dist/`.

`src/test-setup.ts` — **must register the jest-axe matcher** (`toHaveNoViolations`) in addition to jest-dom:
```ts
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);
```

Example test `src/__tests__/Button.a11y.test.tsx` (note: `Button` **must be imported**):
```tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useEffect } from 'react';
import { ThemeProvider, useTheme, Button } from 'ece-docs-components';

const brands = ['default', 'school', 'health'] as const;

const ThemeSync = ({ brand }: { brand: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand); }, [brand, setTheme]);
  return null;
};

brands.forEach((brand) => {
  it(`Button (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSync brand={brand} />
        <Button variant="primary" onClick={() => {}}>Click me</Button>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## 4. Stories

Create `.stories.tsx` for all 22 components in `src/stories/`.

Per-component pattern:
- **Default** — common usage
- **All variants** — cover every variant/size the component supports (not just a subset)
- **Edge cases** — long text, empty state, error state, disabled
- **Interactive** — actions/controls; **required for stateful components** (Modal, SimpleModal) which take `isOpen: boolean` and `onClose()`. Use a wrapper component with `useState` to toggle, or use Storybook's `args` + a handler. The simple `args`-only pattern used for Button won't work for these.

### Components to write stories for:
1. ActionButton
2. Alert
3. Breadcrumb
4. Button — **6 variants**: `primary`, `secondary`, `outline`, `marked-read`, `mark-read`, `danger` (see `src/components/Button.tsx:6`); sizes `sm`/`md`/`lg`
5. Card
6. Checkbox
7. Concertina
8. DefinitionBox
9. Header
10. Input
11. Modal — **interactive** (`isOpen` + `onClose`, plus `status` with 6 values: `mandatory`/`optional`/`accepted`/`action-required`/`action-required-note`/`accepted-note`). Write one story per `status` value.
12. NoteBox
13. Progress (incl. StepIndicator) — `Progress` takes `current`/`total`/`showLabel`; `StepIndicator` takes `steps: string[]`/`currentStep`
14. Radio (incl. RadioGroup) — `Radio` extends `InputHTMLAttributes`, has `label`/`description`; `RadioGroup` has `label`/`error`/children
15. ReadBy
16. Select — takes `options: { value, label }[]`, `label`, `error`, `helperText`, `value`, `onChange`
17. Sidebar
18. SimpleModal — **interactive** (likely `isOpen`-style)
19. StatusBar
20. TableOfContents
21. Tabs
22. Toggle

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
The existing `exclude` covers `**/*.test.ts` and `**/*.test.tsx`. Extend it so the rollup `tsc`/declaration emit ignores stories and a11y tests:

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

### `.gitignore` — ignore Storybook build output
Append:
```
# storybook
storybook-static/
```
> `node_modules/`, `dist/`, `build/` are already ignored.

## 6. Build & Run

```bash
# From ece-docs-components/
npm install           # install new devDeps
npm run storybook     # dev server on http://localhost:6006
npm run test:a11y     # automated axe checks
npm run build-storybook   # static build -> storybook-static/
npm run build         # confirm rollup still builds dist/ (sanity check)
```

- Toolbar dropdown switches 3 brands
- All stories re-render with selected theme (live source — no rebuild needed)
- Accessibility panel on every story
- `npm run test:a11y` runs jest-axe across all components × 3 brands

## 7. Pre-flight Checklist

> **Lockfile rename note:** `package-lock.json` on `master` still has the stale name `"my-mui-theme-library"` (whoever renamed `package.json` never re-ran `npm install` to sync). Running `npm install` anywhere regenerates the lockfile to match `package.json` (`"ece-docs-components"`). Discard the diff before branching with `git checkout -- package-lock.json` so `master` stays pristine; the rename then reappears bundled with your Storybook dependency additions on the `storybook-setup` branch — never as a standalone `master` commit. This is a known minor churn, not a blocker.

### Branch & fork
- [ ] Forked `RedSunMaster/ece-docs-components` to your GitHub
- [ ] `git remote add myfork <your-fork-url>`
- [ ] `git checkout -b storybook-setup` off clean `master`
- [ ] Uncommitted `package-lock.json` change on master either committed or stashed before branching

### Dependencies & config
- [ ] `npm install -D` for storybook + a11y + vitest deps succeeded
- [ ] No peer version conflicts (React 18/19, MUI v7, Storybook v9)
- [ ] `package.json` scripts added: `storybook`, `build-storybook`, `test:a11y`
- [ ] `.storybook/main.ts` present with `ece-docs-components` → `src` alias
- [ ] `.storybook/preview.ts` present with brand toolbar + `ThemeSync` decorator
- [ ] `.storybook/preview-body.html` loads Inter font

### tsconfig / gitignore
- [ ] `tsconfig.json` excludes `**/*.stories.tsx`, `**/*.a11y.test.tsx`, `.storybook`, `storybook-static`
- [ ] `.gitignore` adds `storybook-static/`

### Tests & stories
- [ ] `src/test-setup.ts` registers `toHaveNoViolations` matcher
- [ ] `vitest.config.ts` has `ece-docs-components` → `src` alias
- [ ] 22 story files in `src/stories/`, each covering default + all variants + edge cases
- [ ] Modal/SimpleModal stories use interactive `useState` pattern
- [ ] Button story covers all 6 variants
- [ ] 22 a11y test files in `src/__tests__/`, each iterating 3 brands

### Verification
- [ ] `npm run storybook` launches with brand toolbar + a11y panel, no runtime errors
- [ ] Editing a component source reflects instantly in Storybook (alias works)
- [ ] `npm run test:a11y` passes for all 22 components × 3 brands
- [ ] `npm run build` still succeeds (dist/ unaffected by added stories/tests)
- [ ] Source files in `src/components/`, `src/index.ts`, `src/ThemeProvider.tsx`, `src/theme-types.ts`, `rollup.config.js` are **unchanged** (`git diff master -- src/ rollup.config.js` empty)

### Handoff
- [ ] Committed on `storybook-setup` branch
- [ ] Pushed to `myfork` remote
- [ ] PR opened to `RedSunMaster:master` is **OPTIONAL** — only on client request. Otherwise keep work on the fork indefinitely. Findings/fixes from the a11y audit go in a separate writeup document, not as code commits on `storybook-setup` (which is docs/tests only).

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