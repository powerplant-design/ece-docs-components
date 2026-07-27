import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useEffect } from 'react';
import { ThemeProvider, useTheme, TableOfContents } from 'ece-docs-components';

const brands = ['default', 'school', 'health'] as const;

const ThemeSync = ({ brand }: { brand: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand as 'default' | 'school' | 'health'); }, [brand, setTheme]);
  return null;
};

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'philosophy', title: 'Philosophy and Values' },
  { id: 'te-tiriti', title: 'Te Tiriti o Waitangi' },
  { id: 'review', title: 'Self-Review and Internal Evaluation' },
];

brands.forEach((brand) => {
  it(`TableOfContents (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSync brand={brand} />
        <TableOfContents sections={sections} activeSection="philosophy" />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});