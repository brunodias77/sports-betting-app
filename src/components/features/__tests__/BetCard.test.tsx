import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BetCard from '../BetCard';
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
  id: 'bet-1',
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

describe('BetCard', () => {
  it('should display bet information correctly', () => {
    const bet = createMockBet();
    render(<BetCard bet={bet} />);

    // Check if basic bet information is displayed
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
    expect(screen.getByText('2.50')).toBeInTheDocument(); // Odds use dot separator
    expect(screen.getByText('Casa')).toBeInTheDocument();
    expect(screen.getByText('Ativa')).toBeInTheDocument();
  });

  it('should display event information when showEvent is true', () => {
    const bet = createMockBet();
    render(<BetCard bet={bet} showEvent={true} />);

    expect(screen.getByText('Flamengo vs Palmeiras')).toBeInTheDocument();
    expect(screen.getByText('Football')).toBeInTheDocument();
  });

  it('should hide event information when showEvent is false', () => {
    const bet = createMockBet();
    render(<BetCard bet={bet} showEvent={false} />);

    expect(screen.queryByText('Flamengo vs Palmeiras')).not.toBeInTheDocument();
    expect(screen.queryByText('Football')).not.toBeInTheDocument();
  });

  it('should display active bet status correctly', () => {
    const bet = createMockBet({ status: BetStatus.ACTIVE });
    render(<BetCard bet={bet} />);

    expect(screen.getByText('Ativa')).toBeInTheDocument();
    expect(screen.getByText('Ganho potencial:')).toBeInTheDocument();
    expect(screen.getByText('R$ 125,00')).toBeInTheDocument();
  });

  it('should display won bet status correctly', () => {
    const bet = createMockBet({ 
      status: BetStatus.WON,
      potentialWin: 125
    });
    render(<BetCard bet={bet} />);

    expect(screen.getByText('Ganha')).toBeInTheDocument();
    expect(screen.getByText('Ganho:')).toBeInTheDocument();
    expect(screen.getByText('R$ 125,00')).toBeInTheDocument();
  });

  it('should display lost bet status correctly', () => {
    const bet = createMockBet({ 
      status: BetStatus.LOST,
      amount: 50
    });
    render(<BetCard bet={bet} />);

    expect(screen.getByText('Perdida')).toBeInTheDocument();
    expect(screen.getByText('Perda:')).toBeInTheDocument();
    // Check for the loss amount specifically in the loss section
    const lossElements = screen.getAllByText('R$ 50,00');
    expect(lossElements.length).toBeGreaterThan(0);
  });

  it('should display different prediction labels correctly', () => {
    const homeBet = createMockBet({ prediction: BetPrediction.HOME });
    const { rerender } = render(<BetCard bet={homeBet} />);
    expect(screen.getByText('Casa')).toBeInTheDocument();

    const drawBet = createMockBet({ prediction: BetPrediction.DRAW });
    rerender(<BetCard bet={drawBet} />);
    expect(screen.getByText('Empate')).toBeInTheDocument();

    const awayBet = createMockBet({ prediction: BetPrediction.AWAY });
    rerender(<BetCard bet={awayBet} />);
    expect(screen.getByText('Visitante')).toBeInTheDocument();
  });

  it('should format currency values correctly', () => {
    const bet = createMockBet({ 
      amount: 123.45,
      potentialWin: 246.90
    });
    render(<BetCard bet={bet} />);

    expect(screen.getByText('R$ 123,45')).toBeInTheDocument();
    expect(screen.getByText('R$ 246,90')).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    const bet = createMockBet({
      createdAt: new Date('2024-01-15T18:30:00')
    });
    render(<BetCard bet={bet} />);

    // Check if date is formatted in Brazilian format
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/18:30/)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const bet = createMockBet();
    const { container } = render(<BetCard bet={bet} className="custom-class" />);
    
    const cardElement = container.querySelector('.custom-class');
    expect(cardElement).toBeInTheDocument();
  });

  it('should handle different sports correctly', () => {
    const basketballBet = createMockBet({
      event: { ...mockEvent, sport: SportType.BASKETBALL }
    });
    render(<BetCard bet={basketballBet} />);

    expect(screen.getByText('Basketball')).toBeInTheDocument();
  });
});