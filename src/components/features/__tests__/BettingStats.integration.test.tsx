import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import BettingStats from '../BettingStats';
import { useBettingStore } from '../../../stores/bettingStore';
import { BetStatus } from '../../../types';

// Mock the store
vi.mock('../../../stores/bettingStore');

const mockUseBettingStore = vi.mocked(useBettingStore);

describe('BettingStats Integration', () => {
  const mockStore = {
    getBettingStats: vi.fn(),
    getBetsByStatus: vi.fn(),
    loading: { bets: false, events: false, balance: false }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBettingStore.mockReturnValue(mockStore as any);
  });

  it('should render complete statistics layout with all sections', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 10,
      activeBets: 3,
      wonBets: 5,
      lostBets: 2,
      totalWinnings: 500,
      totalLosses: 200,
      winRate: 71.4
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
      },
      {
        id: '3',
        amount: 25,
        potentialWin: 50,
        status: BetStatus.ACTIVE
      }
    ]);

    render(<BettingStats />);

    // Check all main sections are present
    expect(screen.getByText('Estatísticas Gerais')).toBeInTheDocument();
    expect(screen.getByText('Apostas Ativas')).toBeInTheDocument();
    expect(screen.getByText('Resumo de Performance')).toBeInTheDocument();

    // Check main statistics
    expect(screen.getByText('10')).toBeInTheDocument(); // Total bets
    expect(screen.getByText('71.4%')).toBeInTheDocument(); // Win rate
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument(); // Total winnings
    expect(screen.getByText('R$ 200,00')).toBeInTheDocument(); // Total losses

    // Check active bets statistics
    expect(screen.getByText('3')).toBeInTheDocument(); // Active bets count
    expect(screen.getByText('R$ 105,00')).toBeInTheDocument(); // Active bets value (50+30+25)
    expect(screen.getByText('R$ 225,00')).toBeInTheDocument(); // Potential winnings (100+75+50)

    // Check performance summary
    expect(screen.getByText('R$ 300,00')).toBeInTheDocument(); // Net balance (500-200)
    expect(screen.getByText('Lucro total')).toBeInTheDocument();
  });

  it('should handle responsive layout classes correctly', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 5,
      activeBets: 1,
      wonBets: 3,
      lostBets: 1,
      totalWinnings: 150,
      totalLosses: 50,
      winRate: 75.0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    const { container } = render(<BettingStats />);

    // Check for responsive grid classes
    const mainStatsGrid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
    expect(mainStatsGrid).toBeInTheDocument();

    const activeStatsGrid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
    expect(activeStatsGrid).toBeInTheDocument();

    const performanceGrid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2');
    expect(performanceGrid).toBeInTheDocument();
  });

  it('should show proper visual separation between sections', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 3,
      activeBets: 1,
      wonBets: 2,
      lostBets: 0,
      totalWinnings: 100,
      totalLosses: 0,
      winRate: 100.0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    const { container } = render(<BettingStats />);

    // Check for section containers with proper styling
    const sections = container.querySelectorAll('section.bg-white.rounded-lg.shadow-sm.border.border-gray-200.p-6');
    expect(sections.length).toBeGreaterThanOrEqual(2); // At least main stats and active bets sections

    // Check for proper spacing between sections
    const mainContainer = container.querySelector('.space-y-8');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should handle edge case with negative balance correctly', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 5,
      activeBets: 0,
      wonBets: 1,
      lostBets: 4,
      totalWinnings: 50,
      totalLosses: 200,
      winRate: 20.0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    render(<BettingStats />);

    // Should show negative balance
    expect(screen.getByText('R$ -150,00')).toBeInTheDocument(); // Net balance (50-200)
    expect(screen.getByText('Prejuízo total')).toBeInTheDocument();
  });

  it('should handle balanced scenario correctly', () => {
    mockStore.getBettingStats.mockReturnValue({
      totalBets: 4,
      activeBets: 0,
      wonBets: 2,
      lostBets: 2,
      totalWinnings: 100,
      totalLosses: 100,
      winRate: 50.0
    });
    mockStore.getBetsByStatus.mockReturnValue([]);

    render(<BettingStats />);

    // Should show balanced state
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument(); // Net balance (100-100)
    expect(screen.getByText('Equilibrado')).toBeInTheDocument();
  });
});