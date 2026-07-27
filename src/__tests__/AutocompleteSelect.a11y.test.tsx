import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, AutocompleteSelect } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const options = [
  { value: 'ece', label: 'ECE Docs' },
  { value: 'school', label: 'School Docs' },
  { value: 'gp', label: 'GP Docs' },
  { value: 'lightn', label: 'Lightn' },
];

brands.forEach((brand) => {
  it(`AutocompleteSelect (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <AutocompleteSelect
          options={options}
          value={options[0]}
          onChange={() => {}}
          label="Choose a product"
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});