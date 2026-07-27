import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useEffect } from 'react';
import { ThemeProvider, useTheme, Tabs } from 'ece-docs-components';

const brands = ['default', 'school', 'health'] as const;

const ThemeSync = ({ brand }: { brand: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand as 'default' | 'school' | 'health'); }, [brand, setTheme]);
  return null;
};

const tabs = [
  { id: 'overview', label: 'Overview', content: 'Overview content goes here.' },
  { id: 'details', label: 'Details', content: 'Detailed information about the policy.' },
  { id: 'history', label: 'History', content: 'Version history and revisions.' },
];

brands.forEach((brand) => {
  it(`Tabs (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSync brand={brand} />
        <Tabs tabs={tabs} defaultTab="overview" />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});