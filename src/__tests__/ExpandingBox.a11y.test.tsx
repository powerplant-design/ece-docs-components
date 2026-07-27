import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, ExpandingBox } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`ExpandingBox (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <ExpandingBox open={true} content="Expanded content visible to axe." />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});