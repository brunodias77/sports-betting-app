import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import BetListContainer from '../BetListContainer';
import { useBettingStore } from '../../../stores/bettingStore';
import { BetStatus, BetPrediction, SportType, EventStatus } from '../../../types';

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

describe('BetListContainer Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useBettingStore.getState();
    store.resetStore();
    
    // Add the mock event to the store so placeBet can find it
    store.setEvents([mockEvent]);
    
    // Add some balance to the user for betting
    store.depositBalance(1000);
  });

  it('should display empty state when no bets exist', () => {
    render(<BetListContainer />);

    expect(screen.getByText('Você ainda não fez nenhuma aposta. Que tal começar agora?')).toBeInTheDocument();
    // Check that all filter buttons show 0 count
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBe(4); // All 4 filter buttons should show 0
  });

  it('should display bets from store', async () => {
    const store = useBettingStore.getState();
    
    // Add a bet to the store
    await store.placeBet({
      eventId: 'event-1',
      amount: 50,
      odds: 2.5,
      prediction: BetPrediction.HOME
    });

    render(<BetListContainer />);

    // Should display the bet
    expect(screen.getByText('Flamengo vs Palmeiras')).toBeInTheDocument();
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
    expect(screen.getByText('Ativa')).toBeInTheDocument();
  });

  it('should filter bets by status', async () => {
    const store = useBettingStore.getState();
    
    // Add multiple bets with different statuses
    await store.placeBet({
      eventId: 'event-1',
      amount: 50,
      odds: 2.5,
      prediction: BetPrediction.HOME
    });

    // Manually resolve one bet as won
    const bets = store.getBetsByStatus();
    if (bets.length > 0) {
      store.resolveBet(bets[0].id, 'won');
    }

    render(<BetListContainer />);

    // Initially should show all bets
    expect(screen.getAllByText('Flamengo vs Palmeiras')).toHaveLength(1);

    // Filter by won bets
    fireEvent.click(screen.getByText('Ganhas'));
    expect(screen.getByText('Ganha')).toBeInTheDocument();

    // Filter by active bets - should show empty since we resolved the only bet
    fireEvent.click(screen.getByText('Ativas'));
    expect(screen.getByText('Você não tem apostas ativas no momento.')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const store = useBettingStore.getState();
    store.setLoading('bets', true);

    render(<BetListContainer />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should handle error state with retry functionality', () => {
    // We need to set the error after the component mounts since it clears errors on mount
    const { rerender } = render(<BetListContainer />);
    
    const store = useBettingStore.getState();
    store.setError('bets', 'Erro ao carregar apostas');
    
    // Re-render to show the error state
    rerender(<BetListContainer />);

    // Check for the main error message (there are two instances of the same text)
    const errorElements = screen.getAllByText('Erro ao carregar apostas');
    expect(errorElements.length).toBeGreaterThan(0);
    
    const retryButton = screen.getByText('Tentar novamente');
    expect(retryButton).toBeInTheDocument();

    // Click retry should clear the error
    fireEvent.click(retryButton);
    
    // Error should be cleared
    const updatedStore = useBettingStore.getState();
    expect(updatedStore.error.bets).toBeNull();
  });

  it('should update when new bets are added', async () => {
    render(<BetListContainer />);

    // Initially empty
    expect(screen.getByText('Você ainda não fez nenhuma aposta. Que tal começar agora?')).toBeInTheDocument();

    // Add a bet
    const store = useBettingStore.getState();
    await store.placeBet({
      eventId: 'event-1',
      amount: 100,
      odds: 3.0,
      prediction: BetPrediction.AWAY
    });

    // Should now display the bet
    await waitFor(() => {
      expect(screen.getByText('Flamengo vs Palmeiras')).toBeInTheDocument();
      expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
    });
  });

  it('should display correct bet counts in filter buttons', async () => {
    const store = useBettingStore.getState();
    
    // Add multiple bets
    await store.placeBet({
      eventId: 'event-1',
      amount: 50,
      odds: 2.5,
      prediction: BetPrediction.HOME
    });

    await store.placeBet({
      eventId: 'event-1',
      amount: 75,
      odds: 2.8,
      prediction: BetPrediction.AWAY
    });

    // Resolve one as won
    const bets = store.getBetsByStatus();
    if (bets.length > 0) {
      store.resolveBet(bets[0].id, 'won');
    }

    render(<BetListContainer />);

    // Check filter button counts more specifically
    expect(screen.getByText('2')).toBeInTheDocument(); // Total
    
    // Check that there are multiple "1" counts (for active, won, etc.)
    const oneElements = screen.getAllByText('1');
    expect(oneElements.length).toBeGreaterThanOrEqual(2); // Active and Won should both be 1
    
    // Check that lost count is 0
    expect(screen.getByText('0')).toBeInTheDocument(); // Lost count
  });

  it('should clear errors on mount', () => {
    const store = useBettingStore.getState();
    store.setError('bets', 'Some error');
    store.setError('events', 'Another error');

    render(<BetListContainer />);

    // Bets error should be cleared, but other errors should remain
    const updatedStore = useBettingStore.getState();
    expect(updatedStore.error.bets).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(<BetListContainer className="custom-container" />);
    
    // The className should be applied to the BetList component
    expect(container.querySelector('.custom-container')).toBeInTheDocument();
  });
});