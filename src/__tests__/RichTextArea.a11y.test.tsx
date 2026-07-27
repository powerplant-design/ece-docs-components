import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, RichTextArea } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`RichTextArea (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <RichTextArea
          value="Sample text"
          onChange={() => {}}
          question={null}
          label="Policy wording"
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});