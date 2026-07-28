import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    const brand = process.env.BRAND || 'ECE';
    await page.evaluate((b) => {
      (window as any).__TEST_BRAND__ = b;
    }, brand);
  },
};

export default config;
