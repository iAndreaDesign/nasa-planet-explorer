import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage (scaffold)', () => {
  it('renders the application title as the main heading', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1, name: 'NASA Planet Explorer' })).toBeInTheDocument();
  });
});
