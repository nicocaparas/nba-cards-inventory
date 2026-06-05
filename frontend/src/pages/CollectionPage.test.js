import { fireEvent, render, screen } from '@testing-library/react';

const mockSetCards = jest.fn();
const mockFetchCards = jest.fn(() => Promise.resolve([]));

let mockCards = [];

jest.mock('../context/CardsContext', () => ({
  useCards: () => ({
    cards: mockCards,
    setCards: mockSetCards,
    fetchCards: mockFetchCards,
  }),
}));

jest.mock('axios', () => ({
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
}), { virtual: true });

const CollectionPage = require('./CollectionPage').default;

function makeCard(id, playerName) {
  return {
    id,
    playerName,
    cardTitle: `2026 Test ${playerName}`,
    grade: 10,
    grader: 'PSA',
    acquirePrice: 100,
    status: 'Hold',
    acquiredDate: '2026-06-05',
  };
}

describe('CollectionPage Tabulator dashboard', () => {
  let instances;

  beforeEach(() => {
    instances = [];
    mockCards = [
      makeCard('card-1', 'Michael Jordan'),
      makeCard('card-2', 'LeBron James'),
    ];
    mockSetCards.mockClear();
    mockFetchCards.mockClear();

    window.Tabulator = jest.fn(function Tabulator(element, options) {
      const instance = {
        element,
        options,
        setFilter: jest.fn(),
        clearFilter: jest.fn(),
        destroy: jest.fn(),
      };
      instances.push(instance);
      return instance;
    });
  });

  afterEach(() => {
    delete window.Tabulator;
  });

  it('configures 20-row pagination and reapplies player search after table data refresh', () => {
    const { rerender } = render(<CollectionPage />);

    expect(window.Tabulator).toHaveBeenCalledTimes(1);
    expect(instances[0].options.pagination).toBe(true);
    expect(instances[0].options.paginationSize).toBe(20);

    fireEvent.change(screen.getByLabelText(/search by player name/i), {
      target: { value: 'Jordan' },
    });

    expect(instances[0].setFilter).toHaveBeenCalledWith('playerName', 'like', 'Jordan');

    mockCards = [
      ...mockCards,
      makeCard('card-3', 'Stephen Curry'),
    ];
    rerender(<CollectionPage />);

    expect(window.Tabulator).toHaveBeenCalledTimes(2);
    expect(instances[0].destroy).toHaveBeenCalledTimes(1);
    expect(instances[1].options.data).toHaveLength(3);
    expect(instances[1].setFilter).toHaveBeenCalledWith('playerName', 'like', 'Jordan');
  });

  it('sorts ISO acquired dates without relying on Tabulator date plugins', () => {
    render(<CollectionPage />);

    const dateColumn = instances[0].options.columns.find((column) => column.field === 'acquiredDate');

    expect(typeof dateColumn.sorter).toBe('function');
    expect(dateColumn.sorter('2026-06-05', '2026-01-01')).toBeGreaterThan(0);
    expect(dateColumn.sorter('2025-12-31', '2026-01-01')).toBeLessThan(0);
    expect(dateColumn.sorter('', '2026-01-01')).toBeLessThan(0);
  });
});
