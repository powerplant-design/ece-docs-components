import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Toggle } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`Toggle (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Toggle label="Admin view" checked={true} onChange={() => {}} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});