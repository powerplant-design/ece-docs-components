import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from 'ece-docs-components';

type Brand = 'ECE' | 'School' | 'GP' | 'Lightn';

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Brand theme',
      toolbar: {
        title: 'Brand',
        icon: 'circlehollow',
        items: [
          { value: 'Lightn', title: 'Lightn (default)' },
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
      const brand = (context.globals.brand as Brand) || 'Lightn';
      return (
        <ThemeProvider theme={brand}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;