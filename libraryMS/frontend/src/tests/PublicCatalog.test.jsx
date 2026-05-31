/**
 * PublicCatalog.test.jsx
 *
 * Tests the PublicCatalog page component.
 *
 * Key notes about the component implementation:
 *  - Books are fetched via publicAPI.getBooks() which returns { data: { books: [...] } }
 *  - Stats are fetched via publicAPI.getStats() which returns { data: { ... } }
 *  - The "Electronic" badge is rendered when `book.fileUrl` is truthy
 *  - The "Physical" badge is rendered when `book.fileUrl` is falsy
 *  - Filter buttons: 'all' | 'physical' | 'electronic' — electronic shows books
 *    with fileUrl, physical shows books without fileUrl
 *  - "Login to Borrow" (inside the Details modal) / "Borrow" (card) both navigate
 *    to /login
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import PublicCatalog from '../pages/PublicCatalog';

// ─── Mock the entire API module ───────────────────────────────────────────────
vi.mock('../services/api', () => ({
  publicAPI: {
    getBooks: vi.fn(),
    getStats: vi.fn(),
    searchBooks: vi.fn(),
    getBook: vi.fn(),
  },
  // Other named exports must be present to avoid import errors in other modules
  authAPI: {},
  booksAPI: {},
  usersAPI: {},
  transactionsAPI: {},
  ebookAPI: {},
  default: {},
}));

// ─── Mock LoadingSpinner to avoid CSS issues in jsdom ─────────────────────────
vi.mock('../components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner" />,
}));

// ─── Mock react-router-dom's useNavigate ─────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const physicalBook = {
  _id: 'book-physical-1',
  title: 'Physical Wonders',
  author: 'Author A',
  genre: 'Science',
  bookType: 'physical',
  fileUrl: null, // no fileUrl → Physical badge
  availability: { totalCopies: 3, availableCopies: 2 },
  coverImage: null,
};

const electronicBook = {
  _id: 'book-electronic-1',
  title: 'Electronic Marvels',
  author: 'Author B',
  genre: 'Technology',
  bookType: 'electronic',
  fileUrl: 'uploads/marvels.pdf', // fileUrl present → Electronic badge
  availability: { totalCopies: 1, availableCopies: 1 },
  coverImage: null,
};

const dummyStats = {
  totalBooks: 42,
  availablePhysical: 20,
  totalElectronic: 10,
  totalMembers: 150,
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const renderCatalog = () =>
  render(
    <MemoryRouter initialEntries={['/catalog']}>
      <PublicCatalog />
    </MemoryRouter>
  );

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('PublicCatalog Page', () => {
  beforeEach(async () => {
    // Import and configure the mock before each test
    const { publicAPI } = await import('../services/api');

    publicAPI.getBooks.mockResolvedValue({
      data: { books: [physicalBook, electronicBook] },
    });

    publicAPI.getStats.mockResolvedValue({ data: dummyStats });

    publicAPI.searchBooks.mockResolvedValue({ data: [] });

    mockNavigate.mockClear();
  });

  // ── 1. Renders without requiring authentication ──────────────────────────
  it('renders the Public Catalog page without requiring authentication', async () => {
    renderCatalog();

    // The heading should appear
    expect(await screen.findByRole('heading', { name: /public catalog/i })).toBeInTheDocument();
  });

  // ── 2. Both books appear on screen ──────────────────────────────────────
  it('displays both books in the catalog', async () => {
    renderCatalog();

    expect(await screen.findByText('Physical Wonders')).toBeInTheDocument();
    expect(await screen.findByText('Electronic Marvels')).toBeInTheDocument();
  });

  // ── 3. Physical badge ────────────────────────────────────────────────────
  it('shows a "Physical" badge for the physical book', async () => {
    renderCatalog();

    // Wait for books to load
    await screen.findByText('Physical Wonders');

    // The component renders a badge containing "Physical" when there is no fileUrl
    const physicalBadges = screen.getAllByText(/physical/i);
    expect(physicalBadges.length).toBeGreaterThan(0);
  });

  // ── 4. Electronic badge ──────────────────────────────────────────────────
  it('shows an "Electronic" badge for the electronic book', async () => {
    renderCatalog();

    await screen.findByText('Electronic Marvels');

    const electronicBadges = screen.getAllByText(/electronic/i);
    expect(electronicBadges.length).toBeGreaterThan(0);
  });

  // ── 5. Filtering to "Electronic" hides the physical book ────────────────
  it('clicking the "electronic" filter hides the physical book', async () => {
    renderCatalog();

    // Wait for both books to appear
    await screen.findByText('Physical Wonders');
    await screen.findByText('Electronic Marvels');

    // Click the 'electronic' filter tab
    const electronicFilterBtn = screen.getByRole('button', { name: /^electronic$/i });
    fireEvent.click(electronicFilterBtn);

    // Physical book should no longer be visible
    await waitFor(() => {
      expect(screen.queryByText('Physical Wonders')).not.toBeInTheDocument();
    });

    // Electronic book should still be visible
    expect(screen.getByText('Electronic Marvels')).toBeInTheDocument();
  });

  // ── 6. "Borrow" / card navigation goes to /login ────────────────────────
  it('clicking the "Borrow" button on a card navigates to /login', async () => {
    renderCatalog();

    // Wait for books to load
    await screen.findByText('Physical Wonders');

    // Get all "Borrow" buttons and click the first one
    const borrowButtons = screen.getAllByRole('button', { name: /^borrow$/i });
    fireEvent.click(borrowButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/login',
      expect.objectContaining({ state: expect.objectContaining({ from: '/catalog' }) })
    );
  });

  // ── 7. "Login to Borrow" inside Details modal navigates to /login ────────
  it('clicking "Login to Borrow" in the details modal navigates to /login', async () => {
    renderCatalog();

    await screen.findByText('Physical Wonders');

    // Open the details modal for the first book
    const detailsButtons = screen.getAllByRole('button', { name: /details/i });
    fireEvent.click(detailsButtons[0]);

    // Wait for the modal "Login to Borrow" button
    const loginToBorrowBtn = await screen.findByRole('button', { name: /login to borrow/i });
    fireEvent.click(loginToBorrowBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/login',
      expect.objectContaining({ state: expect.objectContaining({ from: '/catalog' }) })
    );
  });
});
