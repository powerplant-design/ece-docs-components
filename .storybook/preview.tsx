import type { Preview } from '@storybook/react';
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from 'ece-docs-components';

type Brand = 'default' | 'school' | 'health';

const ThemeSync: React.FC<{ brand: Brand }> = ({ brand }) => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(brand);
  }, [brand, setTheme]);
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
      const brand: Brand = (context.globals.brand as Brand) || 'default';
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