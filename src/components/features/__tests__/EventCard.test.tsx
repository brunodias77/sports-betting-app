import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventCard from '../EventCard';
import { SportEvent, SportType, EventStatus, BetPrediction } from '../../../types';

// Mock event data
const mockUpcomingFootballEvent: SportEvent = {
  id: 'test-event-1',
  homeTeam: 'Flamengo',
  awayTeam: 'Palmeiras',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  odds: { home: 1.85, draw: 3.20, away: 2.10 },
  sport: SportType.FOOTBALL,
  status: EventStatus.UPCOMING
};

const mockLiveBasketballEvent: SportEvent = {
  id: 'test-event-2',
  homeTeam: 'Lakers',
  awayTeam: 'Warriors',
  date: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  odds: { home: 1.95, away: 1.85 },
  sport: SportType.BASKETBALL,
  status: EventStatus.LIVE
};

const mockFinishedTennisEvent: SportEvent = {
  id: 'test-event-3',
  homeTeam: 'Novak Djokovic',
  awayTeam: 'Rafael Nadal',
  date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  odds: { home: 2.10, away: 1.75 },
  sport: SportType.TENNIS,
  status: EventStatus.FINISHED
};

describe('EventCard', () => {
  const mockOnBetClick = vi.fn();

  beforeEach(() => {
    mockOnBetClick.mockClear();
  });

  it('should display event information correctly', () => {
    render(<EventCard event={mockUpcomingFootballEvent} onBetClick={mockOnBetClick} />);
    
    expect(screen.getByText('Futebol')).toBeInTheDocument();
    expect(screen.getByText('Flamengo')).toBeInTheDocument();
    expect(screen.getByText('Palmeiras')).toBeInTheDocument();
    expect(screen.getByText('vs')).toBeInTheDocument();
    expect(screen.getByText('Em breve')).toBeInTheDocument();
  });

  it('should display odds buttons for upcoming events', () => {
    render(<EventCard event={mockUpcomingFootballEvent} onBetClick={mockOnBetClick} />);
    
    expect(screen.getByText('Casa')).toBeInTheDocument();
    expect(screen.getByText('1.85')).toBeInTheDocument();
    expect(screen.getByText('Empate')).toBeInTheDocument();
    expect(screen.getByText('3.20')).toBeInTheDocument();
    expect(screen.getByText('Visitante')).toBeInTheDocument();
    expect(screen.getByText('2.10')).toBeInTheDocument();
  });

  it('should handle bet button clicks correctly', () => {
    render(<EventCard event={mockUpcomingFootballEvent} onBetClick={mockOnBetClick} />);
    
    const homeButton = screen.getByRole('button', { name: /Casa 1.85/i });
    const drawButton = screen.getByRole('button', { name: /Empate 3.20/i });
    const awayButton = screen.getByRole('button', { name: /Visitante 2.10/i });
    
    fireEvent.click(homeButton);
    expect(mockOnBetClick).toHaveBeenCalledWith(mockUpcomingFootballEvent, BetPrediction.HOME);
    
    fireEvent.click(drawButton);
    expect(mockOnBetClick).toHaveBeenCalledWith(mockUpcomingFootballEvent, BetPrediction.DRAW);
    
    fireEvent.click(awayButton);
    expect(mockOnBetClick).toHaveBeenCalledWith(mockUpcomingFootballEvent, BetPrediction.AWAY);
    
    expect(mockOnBetClick).toHaveBeenCalledTimes(3);
  });

  it('should display live event with proper styling', () => {
    render(<EventCard event={mockLiveBasketballEvent} onBetClick={mockOnBetClick} />);
    
    expect(screen.getByText('AO VIVO')).toBeInTheDocument();
    expect(screen.getByText('Basquete')).toBeInTheDocument();
    expect(screen.getByText('Lakers')).toBeInTheDocument();
    expect(screen.getByText('Warriors')).toBeInTheDocument();
  });

  it('should not display draw odds for tennis events', () => {
    const tennisEvent = { ...mockLiveBasketballEvent, sport: SportType.TENNIS };
    render(<EventCard event={tennisEvent} onBetClick={mockOnBetClick} />);
    
    expect(screen.queryByText('Empate')).not.toBeInTheDocument();
    expect(screen.getByText('Casa')).toBeInTheDocument();
    expect(screen.getByText('Visitante')).toBeInTheDocument();
  });

  it('should not display betting options for finished events', () => {
    render(<EventCard event={mockFinishedTennisEvent} onBetClick={mockOnBetClick} />);
    
    expect(screen.getByText('Finalizado')).toBeInTheDocument();
    expect(screen.getByText('Evento finalizado - Apostas não disponíveis')).toBeInTheDocument();
    expect(screen.queryByText('Casa')).not.toBeInTheDocument();
    expect(screen.queryByText('Visitante')).not.toBeInTheDocument();
  });

  it('should display correct sport names in Portuguese', () => {
    const footballEvent = { ...mockUpcomingFootballEvent, sport: SportType.FOOTBALL };
    const basketballEvent = { ...mockUpcomingFootballEvent, sport: SportType.BASKETBALL };
    const tennisEvent = { ...mockUpcomingFootballEvent, sport: SportType.TENNIS };
    const volleyballEvent = { ...mockUpcomingFootballEvent, sport: SportType.VOLLEYBALL };
    
    const { rerender } = render(<EventCard event={footballEvent} onBetClick={mockOnBetClick} />);
    expect(screen.getByText('Futebol')).toBeInTheDocument();
    
    rerender(<EventCard event={basketballEvent} onBetClick={mockOnBetClick} />);
    expect(screen.getByText('Basquete')).toBeInTheDocument();
    
    rerender(<EventCard event={tennisEvent} onBetClick={mockOnBetClick} />);
    expect(screen.getByText('Tênis')).toBeInTheDocument();
    
    rerender(<EventCard event={volleyballEvent} onBetClick={mockOnBetClick} />);
    expect(screen.getByText('Vôlei')).toBeInTheDocument();
  });

  it('should format dates correctly', () => {
    const today = new Date();
    const todayEvent = { 
      ...mockUpcomingFootballEvent, 
      date: new Date(today.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now
    };
    
    render(<EventCard event={todayEvent} onBetClick={mockOnBetClick} />);
    
    // Should display time only for today's events
    const timeRegex = /\d{2}:\d{2}/;
    expect(screen.getByText(timeRegex)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<EventCard event={mockUpcomingFootballEvent} onBetClick={mockOnBetClick} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeEnabled();
      expect(button).not.toHaveAttribute('aria-disabled', 'true');
    });
    
    // Check that buttons have proper accessible names
    expect(screen.getByRole('button', { name: /Casa 1.85/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Empate 3.20/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Visitante 2.10/i })).toBeInTheDocument();
  });

  it('should handle events without draw odds', () => {
    const eventWithoutDraw = {
      ...mockUpcomingFootballEvent,
      odds: { home: 1.85, away: 2.10 }
    };
    
    render(<EventCard event={eventWithoutDraw} onBetClick={mockOnBetClick} />);
    
    expect(screen.queryByText('Empate')).not.toBeInTheDocument();
    expect(screen.getByText('Casa')).toBeInTheDocument();
    expect(screen.getByText('Visitante')).toBeInTheDocument();
  });
});