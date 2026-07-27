import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, ExpandingBoxToggle } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`ExpandingBoxToggle (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <ExpandingBoxToggle term="Philosophy and Values" open={true} setOpen={() => {}} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});