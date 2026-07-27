import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useEffect } from 'react';
import { SearchRounded } from '@mui/icons-material';
import { ThemeProvider, useTheme, ActionButton } from 'ece-docs-components';

const brands = ['default', 'school', 'health'] as const;

const ThemeSync = ({ brand }: { brand: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand as 'default' | 'school' | 'health'); }, [brand, setTheme]);
  return null;
};

brands.forEach((brand) => {
  it(`ActionButton (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSync brand={brand} />
        <ActionButton icon={SearchRounded} label="Search" onClick={() => {}} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});