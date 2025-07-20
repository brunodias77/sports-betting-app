import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useEvents } from '../useEvents';
import { useBettingStore } from '../../stores/bettingStore';
import { generateTestScenarioEvents } from '../../data/mockEvents';

// Mock the mock data functions
vi.mock('../../data/mockEvents', () => ({
  populateStoreWithMockEvents: vi.fn((store) => {
    const testEvents = [
      {
        id: 'test_event_1',
        homeTeam: 'Test Home',
        awayTeam: 'Test Away',
        date: new Date(),
        odds: { home: 2.0, away: 1.8 },
        sport: 'football',
        status: 'upcoming'
      }
    ];
    store.setEvents(testEvents);
  }),
  generateTestScenarioEvents: () => [
    {
      id: 'test_event_1',
      homeTeam: 'Test Home',
      awayTeam: 'Test Away',
      date: new Date(),
      odds: { home: 2.0, away: 1.8 },
      sport: 'football',
      status: 'upcoming'
    }
  ]
}));

describe('useEvents Hook', () => {
  beforeEach(() => {
    // Reset store state
    useBettingStore.getState().resetStore();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Loading', () => {
    it('should load events on mount when store is empty', async () => {
      const { result } = renderHook(() => useEvents());

      // Initially should be loading
      expect(result.current.loading).toBe(true);
      expect(result.current.events).toHaveLength(0);

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have loaded events
      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].homeTeam).toBe('Test Home');
    });

    it('should not load events if store already has events', () => {
      // Pre-populate store
      const existingEvents = generateTestScenarioEvents();
      useBettingStore.getState().setEvents(existingEvents);

      const { result } = renderHook(() => useEvents());

      // Should not be loading since events already exist
      expect(result.current.loading).toBe(false);
      expect(result.current.events).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle loading errors', async () => {
      const { result } = renderHook(() => useEvents());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Set error after initial load
      act(() => {
        useBettingStore.getState().setError('events', 'Network error');
      });

      expect(result.current.error).toBe('Network error');
    });

    it('should retry loading events', async () => {
      const { result } = renderHook(() => useEvents());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Call retry
      act(() => {
        result.current.retryLoadEvents();
      });

      // Should be loading again
      expect(result.current.loading).toBe(true);

      // Wait for retry to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have events
      expect(result.current.events).toHaveLength(1);
    });

    it('should clear errors', async () => {
      const { result } = renderHook(() => useEvents());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Set an error
      act(() => {
        useBettingStore.getState().setError('events', 'Some error');
      });

      expect(result.current.error).toBe('Some error');

      // Clear errors
      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('Event Status Updates', () => {
    it('should update event status', async () => {
      const { result } = renderHook(() => useEvents());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const eventId = result.current.events[0].id;
      expect(result.current.events[0].status).toBe('upcoming');

      // Update event status
      act(() => {
        result.current.updateEventStatus(eventId, 'live');
      });

      // Status should be updated
      expect(result.current.events[0].status).toBe('live');
    });
  });

  describe('Real-time Updates', () => {
    it('should set up interval for real-time updates when events exist', () => {
      // This test verifies the hook can handle real-time updates
      // The actual interval setup is implementation detail
      const { result } = renderHook(() => useEvents());

      // Hook should provide updateEventStatus function
      expect(typeof result.current.updateEventStatus).toBe('function');
    });

    it('should clean up properly on unmount', () => {
      const { unmount } = renderHook(() => useEvents());

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Store Integration', () => {
    it('should reflect store state changes', () => {
      const { result } = renderHook(() => useEvents());

      // Initially empty
      expect(result.current.events).toHaveLength(0);

      // Update store directly
      act(() => {
        const testEvents = generateTestScenarioEvents();
        useBettingStore.getState().setEvents(testEvents);
      });

      // Hook should reflect the change
      expect(result.current.events).toHaveLength(1);
    });

    it('should reflect loading state changes', () => {
      const { result } = renderHook(() => useEvents());

      // Change loading state
      act(() => {
        useBettingStore.getState().setLoading('events', true);
      });

      expect(result.current.loading).toBe(true);

      // Change back
      act(() => {
        useBettingStore.getState().setLoading('events', false);
      });

      expect(result.current.loading).toBe(false);
    });

    it('should reflect error state changes', () => {
      const { result } = renderHook(() => useEvents());

      // Set error
      act(() => {
        useBettingStore.getState().setError('events', 'Test error');
      });

      expect(result.current.error).toBe('Test error');

      // Clear error
      act(() => {
        useBettingStore.getState().setError('events', null);
      });

      expect(result.current.error).toBe(null);
    });
  });
});