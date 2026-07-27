import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, ReadBy } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`ReadBy (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <ReadBy names={['Jane Doe', 'John Smith', 'Aroha Ngata']} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});