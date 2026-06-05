import { render, screen } from '@testing-library/react';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}), { virtual: true });

jest.mock('react-router-dom', () => {
  const React = require('react');

  return {
    BrowserRouter: ({ children }) => <div>{children}</div>,
    NavLink: ({ children }) => <a href="/">{children}</a>,
    Route: ({ element }) => <>{element}</>,
    Routes: ({ children }) => <>{React.Children.toArray(children)[0]}</>,
  };
}, { virtual: true });

const App = require('./App').default;

test('renders HoopStock home page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Search your collection/i);
  expect(linkElement).toBeInTheDocument();
});
