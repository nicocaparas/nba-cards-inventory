import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock(
  'axios',
  () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
  { virtual: true }
);
jest.mock(
  'react-router-dom',
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    NavLink: ({ children }) => <a href="/">{children}</a>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ path, element }) => (path === '/' ? element : null),
  }),
  { virtual: true }
);

test('renders app navigation', () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);
  expect(screen.getAllByText(/collection/i).length).toBeGreaterThan(0);
});
