import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useEffect } from 'react';
import { ThemeProvider, useTheme, Modal } from 'ece-docs-components';

const brands = ['default', 'school', 'health'] as const;

const ThemeSync = ({ brand }: { brand: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme(brand as 'default' | 'school' | 'health'); }, [brand, setTheme]);
  return null;
};

const statuses = [
  'mandatory',
  'optional',
  'accepted',
  'action-required',
  'action-required-note',
  'accepted-note',
] as const;

brands.forEach((brand) => {
  statuses.forEach((status) => {
    it(`Modal (${brand} / ${status}) has no a11y violations`, async () => {
      const { container } = render(
        <ThemeProvider>
          <ThemeSync brand={brand} />
          <Modal
            isOpen={true}
            onClose={() => {}}
            status={status}
            description="Please review and respond to the suggested wording for this policy section."
            defaultText="Suggested wording goes here."
            note={
              status === 'action-required-note' || status === 'accepted-note'
                ? 'A reviewer has noted an issue with this wording.'
                : undefined
            }
            onSave={() => {}}
            onSubmit={() => {}}
            onDeclineWording={() => {}}
            onPrevious={() => {}}
            onNext={() => {}}
            currentPage={1}
            totalPages={3}
          />
        </ThemeProvider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});