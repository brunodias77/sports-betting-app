import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import BettingStats from '../BettingStats';
import { useBettingStore } from '../../../stores/bettingStore';
import { BetStatus } from '../../../types';

// Mock the store
vi.mock('../../../stores/bettingStore');

const mockUseBettingStore = vi.mocked(useBettingStore);

describe('BettingStats', () => {
  const mockStore = {
    getBettingStats: vi.fn(),
    getBetsByStatus: vi.fn(),
    loading: { bets: false, events: false, balance: false }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBettingStore.mockReturnValue(mockStore as any);
  });

  it('should render empty state when no bets exist', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 0,
      activeBets: 0,
      wonBets: 0,
      lostBets: 0,
      totalWinnings: 0,
      totalLosses: 0,
      winRate: 0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    render(<BettingStats />);

    expect(screen.getByText('Nenhuma estatística ainda')).toBeInTheDocument();
    expect(screen.getByText('Faça sua primeira aposta para ver suas estatísticas aqui.')).toBeInTheDocument();
  });

  it('should render basic statistics correctly', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 10,
      activeBets: 2,
      wonBets: 6,
      lostBets: 2,
      totalWinnings: 300,
      totalLosses: 100,
      winRate: 75.0
    });
    mockStore.getBetsByStatus.mockReturnValue([
      {
        id: '1',
        amount: 50,
        potentialWin: 100,
        status: BetStatus.ACTIVE
      },
      {
        id: '2',
        amount: 30,
        potentialWin: 60,
        status: BetStatus.ACTIVE
      }
    ]);

    render(<BettingStats />);

    expect(screen.getByText('10')).toBeInTheDocument(); // Total bets
    expect(screen.getByText('75.0%')).toBeInTheDocument(); // Win rate
    expect(screen.getByText('R$ 300,00')).toBeInTheDocument(); // Total winnings
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument(); // Total losses
  });

  it('should calculate and display active bets statistics', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 5,
      activeBets: 2,
      wonBets: 2,
      lostBets: 1,
      totalWinnings: 150,
      totalLosses: 50,
      winRate: 66.7
    });
    mockStore.getBetsByStatus.mockReturnValue([
      {
        id: '1',
        amount: 50,
        potentialWin: 100,
        status: BetStatus.ACTIVE
      },
      {
        id: '2',
        amount: 30,
        potentialWin: 75,
        status: BetStatus.ACTIVE
      }
    ]);

    render(<BettingStats />);

    expect(screen.getByText('2')).toBeInTheDocument(); // Active bets count
    expect(screen.getByText('R$ 80,00')).toBeInTheDocument(); // Active bets value (50 + 30)
    expect(screen.getByText('R$ 175,00')).toBeInTheDocument(); // Potential winnings (100 + 75)
  });

  it('should handle win rate calculation edge cases', () => {
    // Test case with only active bets (no completed bets)
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 2,
      activeBets: 2,
      wonBets: 0,
      lostBets: 0,
      totalWinnings: 0,
      totalLosses: 0,
      winRate: 0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    render(<BettingStats />);

    expect(screen.getByText('N/A')).toBeInTheDocument(); // Win rate should show N/A
  });

  it('should display performance summary when bets exist', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 5,
      activeBets: 1,
      wonBets: 3,
      lostBets: 1,
      totalWinnings: 200,
      totalLosses: 50,
      winRate: 75.0
    });
    mockStore.getBetsByStatus.mockReturnValue([
      {
        id: '1',
        amount: 25,
        potentialWin: 50,
        status: BetStatus.ACTIVE
      }
    ]);

    render(<BettingStats />);

    expect(screen.getByText('Resumo de Performance')).toBeInTheDocument();
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument(); // Net balance (200 - 50)
    expect(screen.getByText('Lucro total')).toBeInTheDocument(); // Positive balance subtitle
  });

  it('should show loading state when bets are loading', () => {
    mockStore.loading.bets = true;
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 0,
      activeBets: 0,
      wonBets: 0,
      lostBets: 0,
      totalWinnings: 0,
      totalLosses: 0,
      winRate: 0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    render(<BettingStats />);

    // Should show loading skeletons
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should format currency values correctly', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 3,
      activeBets: 0,
      wonBets: 2,
      lostBets: 1,
      totalWinnings: 1234.56,
      totalLosses: 567.89,
      winRate: 66.7
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    render(<BettingStats />);

    expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument(); // Brazilian currency format
    expect(screen.getByText('R$ 567,89')).toBeInTheDocument();
  });

  it('should show appropriate subtitles for empty states', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 0,
      activeBets: 0,
      wonBets: 0,
      lostBets: 0,
      totalWinnings: 0,
      totalLosses: 0,
      winRate: 0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    render(<BettingStats />);

    expect(screen.getAllByText('Nenhuma aposta ainda')).toHaveLength(7); // Should appear in multiple cards
  });
});