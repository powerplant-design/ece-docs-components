import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, AcknowledgementBox } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`AcknowledgementBox (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <AcknowledgementBox>
          <p>Acknowledgement text</p>
        </AcknowledgementBox>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});