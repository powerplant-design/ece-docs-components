import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Header, HeaderSearchResult } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const sampleSearch = (query: string): HeaderSearchResult[] => [
  { label: `${query} result`, value: 'sample', description: 'A sample search result' },
];

brands.forEach((brand) => {
  it(`Header (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Header
          userName="John Doe"
          userInitials="JD"
          toggleMenu={() => {}}
          signOut={() => {}}
          signUpStatus="Active"
          search={sampleSearch}
          onResultClick={() => {}}
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});