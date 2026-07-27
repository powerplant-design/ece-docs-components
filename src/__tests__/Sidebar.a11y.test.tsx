import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Sidebar } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const policies = [
  { id: 1, title: 'Philosophy and Values', url: '/policies/philosophy' },
  { id: 2, title: 'Te Tiriti o Waitangi', url: '/policies/te-tiriti' },
];

brands.forEach((brand) => {
  it(`Sidebar (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Sidebar
          isOpen={true}
          onToggle={() => {}}
          centreName="Happy Kids Early Learning Centre"
          policies={policies}
          onNavigate={() => {}}
          isAdmin
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});