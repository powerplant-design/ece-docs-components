import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  ThemeProvider,
  Radio,
  RadioGroup,
} from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`Radio (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Radio label="Option A" name="opt" />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it(`RadioGroup (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <RadioGroup label="Choose a plan">
          <Radio label="Free" name="plan" />
          <Radio label="Pro" name="plan" />
          <Radio label="Enterprise" name="plan" />
        </RadioGroup>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});