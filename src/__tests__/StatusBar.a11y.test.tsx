import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, StatusBar } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`StatusBar (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <StatusBar itemCount={3} variant="actionstarted" onNextClick={() => {}} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});