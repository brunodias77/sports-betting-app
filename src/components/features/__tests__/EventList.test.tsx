import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventList from '../EventList';
import type { SportEvent, BetPrediction } from '../../../types';
import { SportType, EventStatus } from '../../../types';

// Mock the useEvents hook
const mockUseEvents = vi.fn();
vi.mock('../../../hooks/useEvents', () => ({
  useEvents: () => mockUseEvents()
}));

// Mock EventCard component
vi.mock('../EventCard', () => ({
  default: ({ event, onBetClick }: { event: SportEvent; onBetClick: Function }) => (
    <div data-testid={`event-card-${event.id}`}>
      <span>{event.homeTeam} vs {event.awayTeam}</span>
      <span>{event.status}</span>
      <button onClick={() => onBetClick(event, 'home')}>
        Bet on {event.homeTeam}
      </button>
    </div>
  )
}));

// Mock events data
const mockEvents: SportEvent[] = [
  {
    id: 'upcoming-1',
    homeTeam: 'Flamengo',
    awayTeam: 'Palmeiras',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    odds: { home: 1.85, draw: 3.20, away: 2.10 },
    sport: SportType.FOOTBALL,
    status: EventStatus.UPCOMING
  },
  {
    id: 'live-1',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    date: new Date(Date.now() - 30 * 60 * 1000),
    odds: { home: 1.95, away: 1.85 },
    sport: SportType.BASKETBALL,
    status: EventStatus.LIVE
  },
  {
    id: 'finished-1',
    homeTeam: 'Novak Djokovic',
    awayTeam: 'Rafael Nadal',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    odds: { home: 2.10, away: 1.75 },
    sport: SportType.TENNIS,
    status: EventStatus.FINISHED
  },
  {
    id: 'upcoming-2',
    homeTeam: 'Corinthians',
    awayTeam: 'São Paulo',
    date: new Date(Date.now() + 48 * 60 * 60 * 1000),
    odds: { home: 2.30, draw: 3.10, away: 2.80 },
    sport: SportType.FOOTBALL,
    status: EventStatus.UPCOMING
  }
];

describe('EventList', () => {
  const mockOnBetClick = vi.fn();
  const mockRetryLoadEvents = vi.fn();
  const mockClearErrors = vi.fn();

  beforeEach(() => {
    mockOnBetClick.mockClear();
    mockRetryLoadEvents.mockClear();
    mockClearErrors.mockClear();
    
    // Default mock implementation
    mockUseEvents.mockReturnValue({
      events: [],
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });
  });

  it('should display loading state correctly', () => {
    mockUseEvents.mockReturnValue({
      events: [],
      loading: true,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByText('Carregando eventos esportivos...')).toBeInTheDocument();
  });

  it('should display error state with retry button', () => {
    const errorMessage = 'Network connection failed';
    
    mockUseEvents.mockReturnValue({
      events: [],
      loading: false,
      error: errorMessage,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    expect(screen.getByRole('heading', { name: 'Erro ao carregar eventos' })).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: 'Tentar novamente' });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetryLoadEvents).toHaveBeenCalledTimes(1);
  });

  it('should display error state with retry button always available', () => {
    const errorMessage = 'Connection timeout';
    
    mockUseEvents.mockReturnValue({
      events: [],
      loading: false,
      error: errorMessage,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    expect(screen.getByRole('heading', { name: 'Erro ao carregar eventos' })).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('should display empty state when no events are available', () => {
    mockUseEvents.mockReturnValue({
      events: [],
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    expect(screen.getByText('Nenhum evento disponível')).toBeInTheDocument();
    expect(screen.getByText(/Não há eventos esportivos disponíveis no momento/)).toBeInTheDocument();
  });

  it('should render events grouped by status', () => {
    mockUseEvents.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    // Check that all events are rendered
    expect(screen.getByTestId('event-card-upcoming-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-live-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-finished-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-upcoming-2')).toBeInTheDocument();

    // Check section headers are displayed when multiple sections exist
    expect(screen.getByText('🔴 Ao Vivo')).toBeInTheDocument();
    expect(screen.getByText('📅 Próximos Jogos')).toBeInTheDocument();
    expect(screen.getByText('✅ Finalizados')).toBeInTheDocument();
  });

  it('should not show section headers when only one section has events', () => {
    const upcomingOnlyEvents = mockEvents.filter(event => event.status === EventStatus.UPCOMING);
    
    mockUseEvents.mockReturnValue({
      events: upcomingOnlyEvents,
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    // Section headers should not be displayed
    expect(screen.queryByText('📅 Próximos Jogos')).not.toBeInTheDocument();
    
    // But events should still be rendered
    expect(screen.getByTestId('event-card-upcoming-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-upcoming-2')).toBeInTheDocument();
  });

  it('should handle bet clicks correctly', () => {
    mockUseEvents.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    const betButton = screen.getByRole('button', { name: 'Bet on Flamengo' });
    fireEvent.click(betButton);

    expect(mockOnBetClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'upcoming-1',
        homeTeam: 'Flamengo',
        awayTeam: 'Palmeiras'
      }),
      'home'
    );
  });

  it('should render events in correct order (live, upcoming, finished)', () => {
    mockUseEvents.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    const eventCards = screen.getAllByTestId(/event-card-/);
    const eventIds = eventCards.map(card => card.getAttribute('data-testid'));

    // Live events should come first
    expect(eventIds[0]).toBe('event-card-live-1');
    
    // Then upcoming events
    expect(eventIds[1]).toBe('event-card-upcoming-1');
    expect(eventIds[2]).toBe('event-card-upcoming-2');
    
    // Finally finished events
    expect(eventIds[3]).toBe('event-card-finished-1');
  });

  it('should handle undefined or null events gracefully', () => {
    mockUseEvents.mockReturnValue({
      events: undefined as any,
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    expect(screen.getByText('Nenhum evento disponível')).toBeInTheDocument();
  });

  it('should display correct grid layout classes', () => {
    mockUseEvents.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    // Check that grid container has correct classes
    const gridContainers = screen.getAllByRole('generic').filter(el => 
      el.className.includes('grid')
    );
    
    expect(gridContainers.length).toBeGreaterThan(0);
    gridContainers.forEach(container => {
      expect(container).toHaveClass('grid', 'gap-4');
    });
  });

  it('should be accessible', () => {
    mockUseEvents.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    // Check that section headings are properly structured
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    headings.forEach(heading => {
      expect(heading).toHaveClass('text-lg', 'font-semibold');
    });
  });

  it('should handle loading state with events', () => {
    mockUseEvents.mockReturnValue({
      events: mockEvents,
      loading: true,
      error: null,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    // Loading should take precedence over events
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.queryByTestId('event-card-upcoming-1')).not.toBeInTheDocument();
  });

  it('should handle error state with events', () => {
    mockUseEvents.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: "Network error",
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    });

    render(<EventList onBetClick={mockOnBetClick} />);

    // Error should take precedence over events
    expect(screen.getByText('Erro ao carregar eventos')).toBeInTheDocument();
    expect(screen.queryByTestId('event-card-upcoming-1')).not.toBeInTheDocument();
  });
});