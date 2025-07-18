import { useBettingStore } from '../stores/bettingStore';
import { BetStatus } from '../types';

/**
 * Custom hook that provides convenient access to betting store functionality
 */
export const useBetting = () => {
  const store = useBettingStore();

  return {
    // State
    events: store.events,
    bets: store.bets,
    user: store.user,
    loading: store.loading,
    error: store.error,

    // Event actions
    loadEvents: store.loadEvents,
    setEvents: store.setEvents,
    updateEventStatus: store.updateEventStatus,

    // Bet actions
    placeBet: store.placeBet,
    resolveBet: store.resolveBet,
    getBetsByStatus: store.getBetsByStatus,
    getBettingStats: store.getBettingStats,

    // Balance actions
    updateBalance: store.updateBalance,
    depositBalance: store.depositBalance,
    withdrawBalance: store.withdrawBalance,
    canAffordBet: store.canAffordBet,

    // Utility actions
    resetStore: store.resetStore,
    setLoading: store.setLoading,
    setError: store.setError,
    clearErrors: store.clearErrors,

    // Computed values
    activeBets: store.bets.filter(bet => bet.status === BetStatus.ACTIVE),
    wonBets: store.bets.filter(bet => bet.status === BetStatus.WON),
    lostBets: store.bets.filter(bet => bet.status === BetStatus.LOST),
    isLoading: Object.values(store.loading).some(loading => loading),
    hasErrors: Object.values(store.error).some(error => error !== null),
  };
};

/**
 * Hook for accessing only user-related data and actions
 */
export const useUser = () => {
  const { user, updateBalance, depositBalance, withdrawBalance, canAffordBet } = useBettingStore();

  return {
    user,
    updateBalance,
    depositBalance,
    withdrawBalance,
    canAffordBet,
  };
};

/**
 * Hook for accessing only event-related data and actions
 */
export const useEvents = () => {
  const { events, loadEvents, setEvents, updateEventStatus, loading, error } = useBettingStore();

  return {
    events,
    loadEvents,
    setEvents,
    updateEventStatus,
    isLoading: loading.events,
    error: error.events,
  };
};

/**
 * Hook for accessing only bet-related data and actions
 */
export const useBets = () => {
  const { 
    bets, 
    placeBet, 
    resolveBet, 
    getBetsByStatus, 
    getBettingStats,
    loading,
    error 
  } = useBettingStore();

  return {
    bets,
    placeBet,
    resolveBet,
    getBetsByStatus,
    getBettingStats,
    activeBets: bets.filter(bet => bet.status === BetStatus.ACTIVE),
    wonBets: bets.filter(bet => bet.status === BetStatus.WON),
    lostBets: bets.filter(bet => bet.status === BetStatus.LOST),
    isLoading: loading.bets,
    error: error.bets,
  };
};