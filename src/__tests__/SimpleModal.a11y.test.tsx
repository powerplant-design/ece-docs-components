import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, SimpleModal } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`SimpleModal (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <SimpleModal isOpen={true} onClose={() => {}} title="Confirm action">
          <p>Are you sure you want to proceed with this action?</p>
        </SimpleModal>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});