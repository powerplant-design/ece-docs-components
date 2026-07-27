import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, TableOfContents } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'philosophy', title: 'Philosophy and Values' },
  { id: 'te-tiriti', title: 'Te Tiriti o Waitangi' },
  { id: 'review', title: 'Self-Review and Internal Evaluation' },
];

brands.forEach((brand) => {
  it(`TableOfContents (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <TableOfContents sections={sections} activeSection="philosophy" />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});