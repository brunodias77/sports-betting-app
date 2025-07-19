import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Layout } from '../Layout';

// Mock the useBetting hook
vi.mock('../../../hooks/useBetting', () => ({
  useBetting: vi.fn(),
}));

import { useBetting } from '../../../hooks/useBetting';

const mockUseBetting = useBetting as vi.MockedFunction<typeof useBetting>;

describe('Layout', () => {
  const mockOnDepositClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBetting.mockReturnValue({
      user: { balance: 100, totalBets: 0, totalWins: 0, totalLosses: 0 },
      loading: { events: false, bets: false, balance: false },
      isLoading: false,
      // Add other required properties with mock values
      events: [],
      bets: [],
      error: { events: null, bets: null, balance: null },
      loadEvents: vi.fn(),
      setEvents: vi.fn(),
      updateEventStatus: vi.fn(),
      placeBet: vi.fn(),
      resolveBet: vi.fn(),
      getBetsByStatus: vi.fn(),
      getBettingStats: vi.fn(),
      updateBalance: vi.fn(),
      depositBalance: vi.fn(),
      withdrawBalance: vi.fn(),
      canAffordBet: vi.fn(),
      resetStore: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      activeBets: [],
      wonBets: [],
      lostBets: [],
      hasErrors: false,
    });
  });

  it('should render header component', () => {
    render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('SportsBet')).toBeInTheDocument();
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
  });

  it('should render navigation component', () => {
    render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Test Content</div>
      </Layout>
    );
    
    // Check for navigation items (both desktop and mobile versions)
    expect(screen.getAllByText('Eventos')).toHaveLength(2);
    expect(screen.getAllByText('Apostas')).toHaveLength(2);
    expect(screen.getAllByText('Estatísticas')).toHaveLength(2);
    expect(screen.getAllByText('Saldo')).toHaveLength(2);
  });

  it('should render children content', () => {
    render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );
    
    expect(screen.getAllByTestId('test-content')).toHaveLength(2);
    expect(screen.getAllByText('Test Content')).toHaveLength(2);
  });

  it('should pass onDepositClick to header component', () => {
    render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Test Content</div>
      </Layout>
    );
    
    const depositButton = screen.getByRole('button', { name: /depositar/i });
    fireEvent.click(depositButton);
    
    expect(mockOnDepositClick).toHaveBeenCalledTimes(1);
  });

  it('should have default onDepositClick when not provided', () => {
    // This should not throw an error
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    const depositButton = screen.getByRole('button', { name: /depositar/i });
    fireEvent.click(depositButton);
    
    // Should not throw an error - content appears in both desktop and mobile
    expect(screen.getAllByText('Test Content')).toHaveLength(2);
  });

  it('should handle navigation section changes', () => {
    render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Test Content</div>
      </Layout>
    );
    
    // Initially events should be active
    expect(screen.getAllByRole('button', { current: 'page' })).toHaveLength(2);
    
    // Click on Apostas navigation
    const apostasButtons = screen.getAllByText('Apostas');
    fireEvent.click(apostasButtons[0]); // Click desktop version
    
    // Now Apostas should be active
    const activeButtons = screen.getAllByRole('button', { current: 'page' });
    expect(activeButtons).toHaveLength(2);
    activeButtons.forEach(button => {
      expect(button).toHaveTextContent('Apostas');
    });
  });

  it('should have proper semantic HTML structure', () => {
    render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Test Content</div>
      </Layout>
    );
    
    // Check for semantic HTML elements
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getAllByRole('navigation')).toHaveLength(2); // desktop + mobile nav
    expect(screen.getByRole('main')).toBeInTheDocument(); // main content
  });

  it('should have responsive layout classes', () => {
    const { container } = render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Test Content</div>
      </Layout>
    );
    
    // Check for responsive classes
    const desktopContent = container.querySelector('.hidden.md\\:block');
    const mobileContent = container.querySelector('.md\\:hidden');
    
    expect(desktopContent).toBeInTheDocument();
    expect(mobileContent).toBeInTheDocument();
  });

  it('should have proper spacing and layout structure', () => {
    const { container } = render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Test Content</div>
      </Layout>
    );
    
    // Check for main layout container
    const mainContainer = container.querySelector('.min-h-screen.bg-gray-50');
    expect(mainContainer).toBeInTheDocument();
    
    // Check for content containers
    const contentContainers = container.querySelectorAll('.bg-white.rounded-lg.shadow-sm');
    expect(contentContainers.length).toBeGreaterThan(0);
  });

  it('should handle multiple children', () => {
    render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </Layout>
    );
    
    // Content appears in both desktop and mobile containers
    expect(screen.getAllByTestId('child-1')).toHaveLength(2);
    expect(screen.getAllByTestId('child-2')).toHaveLength(2);
    expect(screen.getAllByTestId('child-3')).toHaveLength(2);
  });

  it('should maintain navigation state independently', () => {
    const { rerender } = render(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Content 1</div>
      </Layout>
    );
    
    // Change navigation to Apostas
    const apostasButtons = screen.getAllByText('Apostas');
    fireEvent.click(apostasButtons[0]);
    
    // Rerender with different content
    rerender(
      <Layout onDepositClick={mockOnDepositClick}>
        <div>Content 2</div>
      </Layout>
    );
    
    // Navigation state should be maintained
    const activeButtons = screen.getAllByRole('button', { current: 'page' });
    activeButtons.forEach(button => {
      expect(button).toHaveTextContent('Apostas');
    });
    
    expect(screen.getAllByText('Content 2')).toHaveLength(2);
  });
});