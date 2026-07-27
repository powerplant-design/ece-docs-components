import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useEffect } from 'react';
import { ThemeProvider, useTheme, Breadcrumb } from 'ece-docs-components';

const brands = ['default', 'school', 'health'] as const;

const ThemeSync = ({ brand }: { brand: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand as 'default' | 'school' | 'health'); }, [brand, setTheme]);
  return null;
};

const items = [
  { label: 'Policies', href: '/policies' },
  { label: 'Governance', href: '/policies/governance' },
];

const dropdownItems = [
  'Philosophy and Values',
  'Te Tiriti o Waitangi',
  'Self-Review and Internal Evaluation',
];

brands.forEach((brand) => {
  it(`Breadcrumb (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSync brand={brand} />
        <Breadcrumb
          items={items}
          currentItem="Philosophy and Values"
          dropdownItems={dropdownItems}
          onItemSelect={() => {}}
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});