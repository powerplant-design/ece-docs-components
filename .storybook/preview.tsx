import type { Preview } from '@storybook/react';
import React from 'react';
import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from 'ece-docs-components';

type Brand = 'ECE' | 'School' | 'GP';

const preview: Preview = {
  parameters: {
    a11y: {
      // Fail loudly on every axe violation across all stories (including
      // color-contrast, since Vitest addon runs axe in real Chromium).
      test: 'error',
      options: {
        // WCAG 2.0 A/AA + 2.1 A/AA + 2.2 AA + best practices.
        // 2.2 AA adds rules like target-size, focus-appearance, dragging.
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
          // { value: 'Lightn', title: 'Lightn (default)' },
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