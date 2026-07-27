import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { SearchRounded } from '@mui/icons-material';
import { ThemeProvider, ActionButton } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`ActionButton (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <ActionButton icon={SearchRounded} label="Search" onClick={() => {}} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});