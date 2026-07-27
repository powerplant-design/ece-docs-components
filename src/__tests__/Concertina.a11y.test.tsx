import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useEffect } from 'react';
import { ThemeProvider, useTheme, Concertina } from 'ece-docs-components';

const brands = ['default', 'school', 'health'] as const;

const ThemeSync = ({ brand }: { brand: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand as 'default' | 'school' | 'health'); }, [brand, setTheme]);
  return null;
};

const sections = [
  {
    id: 'section-1',
    title: 'Philosophy and Values',
    content: 'Our philosophy is rooted in respect for children and their whānau.',
  },
  {
    id: 'section-2',
    title: 'Te Tiriti o Waitangi',
    content: 'We honour our commitments under Te Tiriti o Waitangi.',
  },
];

brands.forEach((brand) => {
  it(`Concertina (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSync brand={brand} />
        <Concertina sections={sections} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});