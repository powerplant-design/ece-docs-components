import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    await page.addInitScript(() => {
      (window as any).__test = () => {};
    });

    const brand = process.env.BRAND || 'Lightn';
    await page.route('**/iframe.html**', async (route) => {
      const url = new URL(route.request().url());
      url.searchParams.set('globals', `brand:${brand}`);
      await route.continue({ url: url.toString() });
    });
  },
};

export default config;
