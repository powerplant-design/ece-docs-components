import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, SidebarV2, MenuItem } from 'ece-docs-components';

// jsdom does not implement window.matchMedia; SidebarV2 calls it directly
// during render. Polyfill it so the component mounts under test.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as any;
}

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const sampleItems: MenuItem[] = [
  { id: 'home', title: 'Home', url: '/' },
  {
    id: 'policies',
    title: 'Policies',
    url: '/policies',
    items: [
      { id: 'philosophy', title: 'Philosophy and Values', url: '/policies/philosophy' },
      { id: 'te-tiriti', title: 'Te Tiriti o Waitangi', url: '/policies/te-tiriti' },
    ],
  },
  { id: 'settings', title: 'Settings', url: '/settings' },
];

brands.forEach((brand) => {
  it(`SidebarV2 (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <SidebarV2
          isOpen={true}
          onToggle={() => {}}
          items={sampleItems}
          onNavigate={() => {}}
          isAdmin
          currentPath="/policies/philosophy"
          onOrgChange={() => {}}
          hasMultipleOrganisations={false}
          centreName="Happy Kids Early Learning Centre"
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});