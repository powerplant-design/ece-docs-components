import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider, Modal } from 'ece-docs-components';

const brands = ['Lightn', 'ECE', 'School', 'GP'] as const;

const sampleVariable = {
  _id: 'var-1',
  name: 'Centre name',
  value: 'Sample policy wording for the centre.',
  defaultValue: 'Default suggested wording.',
  pluralValue: 'Sample policy wordings for the centre.',
  validFrom: new Date(),
  customerHelpText: 'Help text for customers.',
  writerHelpText: 'Help text for writers.',
  state: 'Accepted',
  hidden: false,
  canBeBlank: false,
  vertical: 'ECE',
  requirementType: 'Default',
};

brands.forEach((brand) => {
  it(`Modal (${brand}) has no a11y violations`, async () => {
    const { container } = render(
      <ThemeProvider theme={brand}>
        <Modal
          isOpen={true}
          onClose={() => {}}
          onSave={() => {}}
          onSubmit={() => {}}
          onDeclineWording={() => {}}
          onPrevious={() => {}}
          onNext={() => {}}
          currentPage={1}
          totalPages={3}
          isLoading={false}
          variable={sampleVariable as any}
          isLeafOrganisation={true}
        />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});