import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Header } from '../Header';

// Mock the useBetting hook
vi.mock('../../../hooks/useBetting', () => ({
  useBetting: vi.fn(),
}));

import { useBetting } from '../../../hooks/useBetting';

const mockUseBetting = useBetting as vi.MockedFunction<typeof useBetting>;

describe('Header', () => {
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

  it('should display the app title', () => {
    render(<Header onDepositClick={mockOnDepositClick} />);
    
    expect(screen.getByText('SportsBet')).toBeInTheDocument();
  });

  it('should display user balance in Brazilian Real format', () => {
    render(<Header onDepositClick={mockOnDepositClick} />);
    
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
  });

  it('should display balance label on desktop', () => {
    render(<Header onDepositClick={mockOnDepositClick} />);
    
    expect(screen.getByText('Saldo:')).toBeInTheDocument();
  });

  it('should display deposit button with full text on desktop', () => {
    render(<Header onDepositClick={mockOnDepositClick} />);
    
    expect(screen.getByText('Depositar')).toBeInTheDocument();
  });

  it('should call onDepositClick when deposit button is clicked', () => {
    render(<Header onDepositClick={mockOnDepositClick} />);
    
    const depositButton = screen.getByText('Depositar');
    fireEvent.click(depositButton);
    
    expect(mockOnDepositClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading spinner when balance is loading', () => {
    mockUseBetting.mockReturnValue({
      user: { balance: 100, totalBets: 0, totalWins: 0, totalLosses: 0 },
      loading: { events: false, bets: false, balance: true },
      isLoading: true,
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

    render(<Header onDepositClick={mockOnDepositClick} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('R$ 100,00')).not.toBeInTheDocument();
  });

  it('should disable deposit button when balance is loading', () => {
    mockUseBetting.mockReturnValue({
      user: { balance: 100, totalBets: 0, totalWins: 0, totalLosses: 0 },
      loading: { events: false, bets: false, balance: true },
      isLoading: true,
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

    render(<Header onDepositClick={mockOnDepositClick} />);
    
    const depositButton = screen.getByRole('button', { name: /depositar/i });
    expect(depositButton).toBeDisabled();
  });

  it('should format different balance amounts correctly', () => {
    mockUseBetting.mockReturnValue({
      user: { balance: 1234.56, totalBets: 0, totalWins: 0, totalLosses: 0 },
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

    render(<Header onDepositClick={mockOnDepositClick} />);
    
    expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument();
  });

  it('should format zero balance correctly', () => {
    mockUseBetting.mockReturnValue({
      user: { balance: 0, totalBets: 0, totalWins: 0, totalLosses: 0 },
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

    render(<Header onDepositClick={mockOnDepositClick} />);
    
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
  });
});