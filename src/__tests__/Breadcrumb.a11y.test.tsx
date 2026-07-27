import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Breadcrumb } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const items = [
  { label: 'Policies', href: '/policies' },
  { label: 'Governance', href: '/policies/governance' },
];

const dropdownItems = [
  { label: 'Philosophy and Values', href: '/policies/governance/philosophy-and-values' },
  { label: 'Te Tiriti o Waitangi', href: '/policies/governance/te-tiriti-o-waitangi' },
  { label: 'Self-Review and Internal Evaluation', href: '/policies/governance/self-review' },
];

brands.forEach((brand) => {
  it(`Breadcrumb (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Breadcrumb
          items={items}
          currentItem="Philosophy and Values"
          pathname="/policies/governance/philosophy-and-values"
          dropdownItems={dropdownItems}
          onItemSelect={() => {}}
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});