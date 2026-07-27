import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, FileUploadButton } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`FileUploadButton (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <FileUploadButton label="Upload a file" variant="primary" onFileSelect={() => {}} />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});