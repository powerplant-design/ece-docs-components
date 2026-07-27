import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Card } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`Card (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Card variant="default" padding="md">
          This is a card with default styling and medium padding.
        </Card>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});