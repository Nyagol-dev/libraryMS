import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import DueDateBadge from '../components/DueDateBadge';
import DueDateBanner from '../components/DueDateBanner';
import { useOverdueCount } from '../hooks/useOverdueCount';

// Mock usersAPI
vi.mock('../services/api', () => ({
  usersAPI: {
    getMyTransactions: vi.fn(),
  },
}));

describe('DueDateBadge Component', () => {
  it('returns null if dueDate is missing', () => {
    const { container } = render(<DueDateBadge dueDate={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders RED badge OVERDUE when past due', () => {
    // 2 days in the past
    const pastDate = new Date(Date.now() - 2 * 86400000).toISOString();
    render(<DueDateBadge dueDate={pastDate} />);
    
    const badge = screen.getByText('OVERDUE');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-red-100');
  });

  it('renders ORANGE badge Due Tomorrow when due in 1 day', () => {
    // 1 day in the future
    const tomorrow = new Date(Date.now() + 1 * 86400000).toISOString();
    render(<DueDateBadge dueDate={tomorrow} />);
    
    const badge = screen.getByText('Due Tomorrow');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-orange-100');
  });

  it('renders YELLOW badge Due in N days when due in 3 days', () => {
    // 3 days in the future
    const threeDays = new Date(Date.now() + 3 * 86400000).toISOString();
    render(<DueDateBadge dueDate={threeDays} />);
    
    const badge = screen.getByText('Due in 3 days');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-yellow-100');
  });

  it('renders GRAY badge with formatted date when more than 3 days away', () => {
    // 5 days in the future
    const fiveDays = new Date(Date.now() + 5 * 86400000);
    render(<DueDateBadge dueDate={fiveDays.toISOString()} />);
    
    const expectedText = `Due: ${fiveDays.toLocaleDateString()}`;
    const badge = screen.getByText(expectedText);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-gray-100');
  });
});

describe('DueDateBanner Component', () => {
  it('returns null if no transactions due within 5 days', () => {
    const farDate = new Date(Date.now() + 10 * 86400000).toISOString();
    const transactions = [
      {
        _id: 't1',
        type: 'issue',
        status: 'approved',
        dueDate: farDate,
        book: { title: 'Far Away Book', bookType: 'physical' }
      }
    ];

    const { container } = render(<DueDateBanner transactions={transactions} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Red, Orange, and Yellow banners based on due dates', () => {
    const pastDate = new Date(Date.now() - 1 * 86400000).toISOString();
    const tomorrow = new Date(Date.now() + 1 * 86400000).toISOString();
    const threeDays = new Date(Date.now() + 3 * 86400000).toISOString();

    const transactions = [
      {
        _id: 't1',
        type: 'issue',
        status: 'approved',
        dueDate: pastDate,
        book: { title: 'Overdue Book', bookType: 'physical' }
      },
      {
        _id: 't2',
        type: 'issue',
        status: 'approved',
        dueDate: tomorrow,
        book: { title: 'Tomorrow Book', bookType: 'physical' }
      },
      {
        _id: 't3',
        type: 'issue',
        status: 'approved',
        dueDate: threeDays,
        book: { title: 'Soon Book', bookType: 'physical' }
      }
    ];

    render(<DueDateBanner transactions={transactions} />);

    expect(screen.getByText(/OVERDUE: Overdue Book/)).toBeInTheDocument();
    expect(screen.getByText(/Tomorrow Book is due TOMORROW/)).toBeInTheDocument();
    expect(screen.getByText(/Soon Book is due in 3 days/)).toBeInTheDocument();
  });

  it('dismisses a banner when clicking the X button', () => {
    const tomorrow = new Date(Date.now() + 1 * 86400000).toISOString();
    const transactions = [
      {
        _id: 't1',
        type: 'issue',
        status: 'approved',
        dueDate: tomorrow,
        book: { title: 'Tomorrow Book', bookType: 'physical' }
      }
    ];

    render(<DueDateBanner transactions={transactions} />);
    
    const bannerText = screen.getByText(/Tomorrow Book is due TOMORROW/);
    expect(bannerText).toBeInTheDocument();

    const dismissButton = screen.getByRole('button');
    fireEvent.click(dismissButton);

    expect(bannerText).not.toBeInTheDocument();
  });
});

// A small wrapper to test the custom hook
const HookWrapper = ({ testCallback }) => {
  const count = useOverdueCount();
  testCallback(count);
  return null;
};

describe('useOverdueCount Hook', () => {
  it('returns the count of approved, unreturned, overdue physical issue transactions', async () => {
    const { usersAPI } = await import('../services/api');
    const pastDate = new Date(Date.now() - 2 * 86400000).toISOString();
    const farDate = new Date(Date.now() + 10 * 86400000).toISOString();

    usersAPI.getMyTransactions.mockResolvedValue({
      data: [
        {
          _id: 't1',
          type: 'issue',
          status: 'approved',
          dueDate: pastDate, // overdue
          returnedAt: null,
          book: { title: 'Overdue Physical', bookType: 'physical' }
        },
        {
          _id: 't2',
          type: 'issue',
          status: 'approved',
          dueDate: pastDate, // overdue
          returnedAt: new Date().toISOString(), // returned already!
          book: { title: 'Overdue Returned', bookType: 'physical' }
        },
        {
          _id: 't3',
          type: 'issue',
          status: 'approved',
          dueDate: farDate, // not overdue
          returnedAt: null,
          book: { title: 'Future Book', bookType: 'physical' }
        },
        {
          _id: 't4',
          type: 'issue',
          status: 'pending', // pending approval
          dueDate: pastDate,
          returnedAt: null,
          book: { title: 'Pending Book', bookType: 'physical' }
        }
      ]
    });

    let hookCount = null;
    render(<HookWrapper testCallback={(c) => { hookCount = c; }} />);

    await waitFor(() => {
      expect(hookCount).toBe(1); // Only t1 qualifies as approved, unreturned, overdue issue
    });
  });

  it('gracefully returns 0 on API errors', async () => {
    const { usersAPI } = await import('../services/api');
    usersAPI.getMyTransactions.mockRejectedValue(new Error('Network error'));

    let hookCount = null;
    render(<HookWrapper testCallback={(c) => { hookCount = c; }} />);

    await waitFor(() => {
      expect(hookCount).toBe(0);
    });
  });
});
