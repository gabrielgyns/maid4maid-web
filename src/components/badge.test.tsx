import { render, screen } from '@testing-library/react';
import Badge from './badge';

describe('Badge', () => {
  it('renders with provided text', () => {
    render(<Badge text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
