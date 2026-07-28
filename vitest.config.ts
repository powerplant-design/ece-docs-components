import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Single Storybook test project. The Vitest addon runs this in Playwright
// Chromium inside the Storybook UI testing widget. Brand switching in the
// UI is via the toolbar dropdown (no project-per-brand — that caused
// duplicate project name errors).
//
// For automated multi-brand CLI/CI runs, use @storybook/test-runner with
// the BRAND env var (see .storybook/test-runner.ts and package.json
// test-storybook:brand script).
export default mergeConfig(
  { plugins: [react()] },
  defineConfig({
    test: {
      // Disable isolation mode — running many stories in parallel browser
      // contexts caused "Failed to fetch dynamically imported module"
      // errors. Recommended by Vitest addon FAQ for this failure pattern.
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
          // Pre-bundle CJS packages that @testing-library/dom and friends
          // import as ESM. Vite needs to convert them before serving to the
          // browser test runner, otherwise named-exports like
          // `elementRoles` from `aria-query` and `default` from `lz-string`
          // will fail at runtime.
          optimizeDeps: {
            include: [
              'aria-query',
              'lz-string',
              'pretty-format',
            ],
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