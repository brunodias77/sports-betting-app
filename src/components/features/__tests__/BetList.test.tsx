import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BetList from '../BetList';
import { Bet, BetStatus, BetPrediction, SportType, EventStatus } from '../../../types';

// Mock data for testing
const mockEvent = {
  id: 'event-1',
  homeTeam: 'Flamengo',
  awayTeam: 'Palmeiras',
  date: new Date('2024-01-15T20:00:00'),
  odds: { home: 2.5, draw: 3.2, away: 2.8 },
  sport: SportType.FOOTBALL,
  status: EventStatus.UPCOMING
};

const createMockBet = (overrides: Partial<Bet> = {}): Bet => ({
  id: `bet-${Math.random()}`,
  eventId: 'event-1',
  event: mockEvent,
  amount: 50,
  odds: 2.5,
  prediction: BetPrediction.HOME,
  status: BetStatus.ACTIVE,
  createdAt: new Date('2024-01-15T18:00:00'),
  potentialWin: 125,
  ...overrides
});

const mockBets: Bet[] = [
  createMockBet({ id: 'bet-1', status: BetStatus.ACTIVE }),
  createMockBet({ id: 'bet-2', status: BetStatus.WON }),
  createMockBet({ id: 'bet-3', status: BetStatus.LOST }),
  createMockBet({ id: 'bet-4', status: BetStatus.ACTIVE }),
];

describe('BetList', () => {
  it('should display loading state', () => {
    render(<BetList bets={[]} loading={true} />);
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display error state with retry button', () => {
    const onRetry = vi.fn();
    render(
      <BetList 
        bets={[]} 
        error="Erro de conexão" 
        onRetry={onRetry}
      />
    );

    expect(screen.getByText('Erro ao carregar apostas')).toBeInTheDocument();
    expect(screen.getByText('Erro de conexão')).toBeInTheDocument();
    
    const retryButton = screen.getByText('Tentar novamente');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should display error state without retry button when onRetry is not provided', () => {
    render(
      <BetList 
        bets={[]} 
        error="Erro de conexão"
      />
    );

    expect(screen.getByText('Erro ao carregar apostas')).toBeInTheDocument();
    expect(screen.queryByText('Tentar novamente')).not.toBeInTheDocument();
  });

  it('should display empty state when no bets', () => {
    render(<BetList bets={[]} />);

    expect(screen.getByText('Você ainda não fez nenhuma aposta. Que tal começar agora?')).toBeInTheDocument();
  });

  it('should display all bets by default', () => {
    render(<BetList bets={mockBets} />);

    // Should show all 4 bets
    expect(screen.getAllByText('Flamengo vs Palmeiras')).toHaveLength(4);
    
    // Check filter button counts
    expect(screen.getByText('4')).toBeInTheDocument(); // All bets count
  });

  it('should display filter buttons with correct counts', () => {
    render(<BetList bets={mockBets} />);

    // Check all filter buttons are present
    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('Ativas')).toBeInTheDocument();
    expect(screen.getByText('Ganhas')).toBeInTheDocument();
    expect(screen.getByText('Perdidas')).toBeInTheDocument();

    // Check counts (4 total, 2 active, 1 won, 1 lost)
    const countElements = screen.getAllByText(/[0-9]+/);
    const counts = countElements.map(el => el.textContent);
    expect(counts).toContain('4'); // Total
    expect(counts).toContain('2'); // Active
    expect(counts).toContain('1'); // Won
    expect(counts).toContain('1'); // Lost
  });

  it('should filter bets by active status', () => {
    render(<BetList bets={mockBets} />);

    const activeButton = screen.getByText('Ativas');
    fireEvent.click(activeButton);

    // Should show only active bets (2)
    expect(screen.getAllByText('Ativa')).toHaveLength(2);
    expect(screen.queryByText('Ganha')).not.toBeInTheDocument();
    expect(screen.queryByText('Perdida')).not.toBeInTheDocument();
  });

  it('should filter bets by won status', () => {
    render(<BetList bets={mockBets} />);

    const wonButton = screen.getByText('Ganhas');
    fireEvent.click(wonButton);

    // Should show only won bets (1)
    expect(screen.getByText('Ganha')).toBeInTheDocument();
    expect(screen.queryByText('Ativa')).not.toBeInTheDocument();
    expect(screen.queryByText('Perdida')).not.toBeInTheDocument();
  });

  it('should filter bets by lost status', () => {
    render(<BetList bets={mockBets} />);

    const lostButton = screen.getByText('Perdidas');
    fireEvent.click(lostButton);

    // Should show only lost bets (1)
    expect(screen.getByText('Perdida')).toBeInTheDocument();
    expect(screen.queryByText('Ativa')).not.toBeInTheDocument();
    expect(screen.queryByText('Ganha')).not.toBeInTheDocument();
  });

  it('should show appropriate empty message for each filter', () => {
    const emptyBets: Bet[] = [];
    
    const { rerender } = render(<BetList bets={emptyBets} />);
    expect(screen.getByText('Você ainda não fez nenhuma aposta. Que tal começar agora?')).toBeInTheDocument();

    // Test active filter empty message
    rerender(<BetList bets={emptyBets} />);
    const activeButtons = screen.getAllByText('Ativas');
    fireEvent.click(activeButtons[0]);
    expect(screen.getByText('Você não tem apostas ativas no momento.')).toBeInTheDocument();

    // Test won filter empty message
    rerender(<BetList bets={emptyBets} />);
    const wonButtons = screen.getAllByText('Ganhas');
    fireEvent.click(wonButtons[0]);
    expect(screen.getByText('Você ainda não ganhou nenhuma aposta. Continue tentando!')).toBeInTheDocument();

    // Test lost filter empty message
    rerender(<BetList bets={emptyBets} />);
    const lostButtons = screen.getAllByText('Perdidas');
    fireEvent.click(lostButtons[0]);
    expect(screen.getByText('Você ainda não perdeu nenhuma aposta. Boa sorte!')).toBeInTheDocument();
  });

  it('should highlight active filter button', () => {
    render(<BetList bets={mockBets} />);

    const allButton = screen.getByText('Todas');
    const activeButton = screen.getByText('Ativas');

    // Initially "Todas" should be active (primary variant)
    expect(allButton.closest('button')).toHaveClass('bg-primary-600');
    expect(activeButton.closest('button')).toHaveClass('bg-gray-200');

    // Click active filter
    fireEvent.click(activeButton);

    // Now "Ativas" should be active
    expect(activeButton.closest('button')).toHaveClass('bg-primary-600');
    expect(allButton.closest('button')).toHaveClass('bg-gray-200');
  });

  it('should apply custom className', () => {
    const { container } = render(<BetList bets={[]} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show bet cards with event information', () => {
    render(<BetList bets={mockBets} />);

    // All bet cards should show event information
    expect(screen.getAllByText('Flamengo vs Palmeiras')).toHaveLength(4);
    expect(screen.getAllByText('Football')).toHaveLength(4);
  });
});