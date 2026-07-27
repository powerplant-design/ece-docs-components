import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  ThemeProvider,
  Progress,
  StepIndicator,
} from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`Progress (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Progress current={3} total={10} showLabel />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it(`StepIndicator (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <StepIndicator
          steps={['Introduction', 'Policies', 'Review', 'Submit']}
          currentStep={2}
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});