import { render, screen } from '@testing-library/react';
import App from './App';

test('renders status text', () => {
  render(<App />);
  const status = screen.getByTestId('status-text');
  expect(status).toBeInTheDocument();
});
