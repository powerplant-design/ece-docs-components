import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined),
      'ece-docs-components': join(dirname(fileURLToPath(import.meta.url)), '..', 'src'),
    };
    return config;
  },
};

export default config;