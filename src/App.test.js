import { render, screen } from '@testing-library/react';
import App from './App';

test('shows loading text before sample renders', () => {
  render(<App />);
  expect(screen.getByText(/loading summit page/i)).toBeInTheDocument();
});
