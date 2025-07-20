import { useEffect } from 'react';
import { useBettingStore } from '../stores/bettingStore';
import { populateStoreWithMockEvents } from '../data/mockEvents';

/**
 * Custom hook for managing events data
 * Provides events, loading state, error state, and actions
 */
export function useEvents() {
  const {
    events,
    loading,
    error,
    loadEvents,
    setEvents,
    updateEventStatus,
    setLoading,
    setError,
    clearErrors
  } = useBettingStore();

  // Load events on mount if not already loaded
  useEffect(() => {
    if (events.length === 0 && !loading.events) {
      loadEventsWithMockData();
    }
  }, []);

  /**
   * Load events with mock data fallback
   */
  const loadEventsWithMockData = async () => {
    try {
      setLoading('events', true);
      setError('events', null);

      // In a real app, this would be an API call
      // For now, we simulate loading and use mock data
      await new Promise(resolve => setTimeout(resolve, 800));

      // Populate with mock events
      populateStoreWithMockEvents(useBettingStore.getState());
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar eventos';
      setError('events', errorMessage);
    } finally {
      setLoading('events', false);
    }
  };

  /**
   * Retry loading events
   */
  const retryLoadEvents = () => {
    clearErrors();
    loadEventsWithMockData();
  };

  /**
   * Simulate real-time event status updates
   * In a real app, this would be handled by WebSocket or polling
   */
  const simulateEventUpdates = () => {
    const upcomingEvents = events.filter(event => event.status === 'upcoming');
    
    if (upcomingEvents.length > 0) {
      // Randomly select an upcoming event to make "live"
      const randomEvent = upcomingEvents[Math.floor(Math.random() * upcomingEvents.length)];
      const now = new Date();
      
      // Only update if the event date is close to now (within 30 minutes)
      const timeDiff = randomEvent.date.getTime() - now.getTime();
      if (timeDiff <= 30 * 60 * 1000 && timeDiff >= -5 * 60 * 1000) {
        updateEventStatus(randomEvent.id, 'live');
      }
    }
  };

  // Set up interval for simulating real-time updates
  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(simulateEventUpdates, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [events]);

  return {
    events,
    loading: loading.events,
    error: error.events,
    loadEvents: loadEventsWithMockData,
    retryLoadEvents,
    updateEventStatus,
    clearErrors
  };
}