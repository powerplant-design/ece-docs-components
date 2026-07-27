import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, NoteBox } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

brands.forEach((brand) => {
  it(`NoteBox (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <NoteBox status="Pending" label="Note">
          Highlighted text within a policy.
        </NoteBox>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});