import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Select } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

brands.forEach((brand) => {
  it(`Select (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Select label="Choose an option" options={options} value="option1" onChange={() => {}} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});