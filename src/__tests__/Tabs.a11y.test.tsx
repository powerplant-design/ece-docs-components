import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Tabs } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const tabs = [
  { id: 'overview', label: 'Overview', content: 'Overview content goes here.' },
  { id: 'details', label: 'Details', content: 'Detailed information about the policy.' },
  { id: 'history', label: 'History', content: 'Version history and revisions.' },
];

brands.forEach((brand) => {
  it(`Tabs (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Tabs tabs={tabs} defaultTab="overview" />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});