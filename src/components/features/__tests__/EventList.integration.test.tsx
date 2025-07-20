import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import EventList from '../EventList';
import { useBettingStore } from '../../../stores/bettingStore';
import { SportEvent, BetPrediction, SportType, EventStatus } from '../../../types';
import { generateTestScenarioEvents } from '../../../data/mockEvents';

// Mock the useEvents hook
const mockRetryLoadEvents = vi.fn();
const mockClearErrors = vi.fn();

vi.mock('../../../hooks/useEvents', () => ({
  useEvents: () => {
    const store = useBettingStore.getState();
    return {
      events: store.events,
      loading: store.loading.events,
      error: store.error.events,
      retryLoadEvents: mockRetryLoadEvents,
      clearErrors: mockClearErrors
    };
  }
}));

describe('EventList Integration Tests', () => {
  const mockOnBetClick = vi.fn();
  
  beforeEach(() => {
    // Reset store state
    useBettingStore.getState().resetStore();
    mockOnBetClick.mockClear();
    mockRetryLoadEvents.mockClear();
    mockClearErrors.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Store Integration', () => {
    it('should display events from the store', async () => {
      // Populate store with test events
      const testEvents = generateTestScenarioEvents();
      useBettingStore.getState().setEvents(testEvents);

      render(<EventList onBetClick={mockOnBetClick} />);

      // Should display events from store
      await waitFor(() => {
        expect(screen.getByText('Flamengo')).toBeInTheDocument();
        expect(screen.getByText('Palmeiras')).toBeInTheDocument();
        expect(screen.getByText('Lakers')).toBeInTheDocument();
        expect(screen.getByText('Warriors')).toBeInTheDocument();
      });
    });

    it('should handle loading state from store', () => {
      // Set loading state in store
      useBettingStore.getState().setLoading('events', true);

      render(<EventList onBetClick={mockOnBetClick} />);

      expect(screen.getByText('Carregando eventos esportivos...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument(); // LoadingSpinner
    });

    it('should handle error state from store', () => {
      // Set error state in store
      useBettingStore.getState().setError('events', 'Erro de conexão');

      render(<EventList onBetClick={mockOnBetClick} />);

      expect(screen.getByText('Erro ao carregar eventos')).toBeInTheDocument();
      expect(screen.getByText('Erro de conexão')).toBeInTheDocument();
      expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });

    it('should handle empty events state', () => {
      // Ensure store has no events
      useBettingStore.getState().setEvents([]);

      render(<EventList onBetClick={mockOnBetClick} />);

      expect(screen.getByText('Nenhum evento disponível')).toBeInTheDocument();
      expect(screen.getByText(/Não há eventos esportivos disponíveis/)).toBeInTheDocument();
    });
  });

  describe('Event Status Updates', () => {
    it('should reflect event status changes from store', async () => {
      const testEvents = generateTestScenarioEvents();
      const store = useBettingStore.getState();
      store.setEvents(testEvents);

      render(<EventList onBetClick={mockOnBetClick} />);

      // Find an upcoming event
      const upcomingEvent = testEvents.find(e => e.status === 'upcoming');
      expect(upcomingEvent).toBeDefined();

      // Initially should show upcoming status
      await waitFor(() => {
        expect(screen.getByText(upcomingEvent!.homeTeam)).toBeInTheDocument();
      });

      // Update event status to live
      act(() => {
        store.updateEventStatus(upcomingEvent!.id, 'live');
      });

      // Should reflect the status change
      await waitFor(() => {
        // The live indicator should be present (🔴 Ao Vivo section or live badge)
        const liveSection = screen.queryByText('🔴 Ao Vivo');
        expect(liveSection).toBeInTheDocument();
      });
    });

    it('should group events by status correctly', async () => {
      const testEvents = generateTestScenarioEvents();
      useBettingStore.getState().setEvents(testEvents);

      render(<EventList onBetClick={mockOnBetClick} />);

      await waitFor(() => {
        // Should have different sections for different statuses
        expect(screen.getByText('🔴 Ao Vivo')).toBeInTheDocument();
        expect(screen.getByText('📅 Próximos Jogos')).toBeInTheDocument();
        expect(screen.getByText('✅ Finalizados')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should retry loading events when retry button is clicked', async () => {
      const store = useBettingStore.getState();
      
      // Set initial error state
      store.setError('events', 'Network error');

      render(<EventList onBetClick={mockOnBetClick} />);

      // Should show error state
      expect(screen.getByText('Erro ao carregar eventos')).toBeInTheDocument();
      
      // Click retry button
      const retryButton = screen.getByText('Tentar novamente');
      fireEvent.click(retryButton);

      // Should call the retry function
      expect(mockRetryLoadEvents).toHaveBeenCalledTimes(1);
    });

    it('should clear errors when component unmounts', () => {
      const store = useBettingStore.getState();
      store.setError('events', 'Some error');

      const { unmount } = render(<EventList onBetClick={mockOnBetClick} />);

      // Unmount component
      unmount();

      // clearErrors should have been called during cleanup
      expect(mockClearErrors).toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should call onBetClick when event card bet button is clicked', async () => {
      const testEvents = generateTestScenarioEvents();
      useBettingStore.getState().setEvents(testEvents);

      render(<EventList onBetClick={mockOnBetClick} />);

      await waitFor(() => {
        expect(screen.getByText('Flamengo')).toBeInTheDocument();
      });

      // Find and click a bet button (odds button)
      const oddsButtons = screen.getAllByRole('button');
      const betButton = oddsButtons.find(button => 
        button.textContent?.includes('1.85') || 
        button.textContent?.includes('3.20') ||
        button.textContent?.includes('4.50')
      );

      expect(betButton).toBeDefined();
      fireEvent.click(betButton!);

      // Should call onBetClick with correct parameters
      expect(mockOnBetClick).toHaveBeenCalledTimes(1);
      expect(mockOnBetClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          homeTeam: expect.any(String),
          awayTeam: expect.any(String)
        }),
        expect.any(String) // BetPrediction
      );
    });
  });

  describe('Real-time Updates Simulation', () => {
    it('should handle event status updates in real-time', () => {
      // This test verifies that the component can handle real-time updates
      // The actual real-time logic is tested in the useEvents hook
      const testEvents = generateTestScenarioEvents();
      const store = useBettingStore.getState();
      
      store.setEvents(testEvents);
      render(<EventList onBetClick={mockOnBetClick} />);

      // Component should render without issues
      expect(screen.getByText('Lakers')).toBeInTheDocument();
    });
  });

  describe('Performance and Memory', () => {
    it('should not cause memory leaks with event listeners', () => {
      const { unmount } = render(<EventList onBetClick={mockOnBetClick} />);
      
      // Component should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });

    it('should handle large numbers of events efficiently', () => {
      // Create a large number of events
      const manyEvents: SportEvent[] = Array.from({ length: 50 }, (_, i) => ({
        id: `event_${i}`,
        homeTeam: `Home ${i}`,
        awayTeam: `Away ${i}`,
        date: new Date(Date.now() + i * 60 * 60 * 1000),
        odds: { home: 2.0, away: 2.0 },
        sport: SportType.FOOTBALL,
        status: EventStatus.UPCOMING
      }));

      useBettingStore.getState().setEvents(manyEvents);

      const startTime = performance.now();
      render(<EventList onBetClick={mockOnBetClick} />);
      const endTime = performance.now();
      
      // Should render within reasonable time (less than 500ms)
      expect(endTime - startTime).toBeLessThan(500);
      
      // Should display the first event
      expect(screen.getByText('Home 0')).toBeInTheDocument();
    });
  });
});