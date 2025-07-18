import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBettingStore } from '../bettingStore';
import { BetStatus, SportType, EventStatus, BetPrediction } from '../../types';
import type { SportEvent, CreateBetRequest } from '../../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock data
const mockEvent: SportEvent = {
  id: 'event_1',
  homeTeam: 'Team A',
  awayTeam: 'Team B',
  date: new Date('2024-12-31T15:00:00Z'),
  odds: {
    home: 2.5,
    draw: 3.2,
    away: 2.8,
  },
  sport: SportType.FOOTBALL,
  status: EventStatus.UPCOMING,
};

const mockBetRequest: CreateBetRequest = {
  eventId: 'event_1',
  amount: 50,
  odds: 2.5,
  prediction: BetPrediction.HOME,
};

describe('BettingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useBettingStore.getState().resetStore();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useBettingStore.getState();
      
      expect(state.events).toEqual([]);
      expect(state.bets).toEqual([]);
      expect(state.user).toEqual({
        balance: 100,
        totalBets: 0,
        totalWins: 0,
        totalLosses: 0,
      });
      expect(state.loading).toEqual({
        events: false,
        bets: false,
        balance: false,
      });
      expect(state.error).toEqual({
        events: null,
        bets: null,
        balance: null,
      });
    });
  });

  describe('Event Management', () => {
    it('should set events correctly', () => {
      const { setEvents } = useBettingStore.getState();
      const events = [mockEvent];
      
      setEvents(events);
      
      expect(useBettingStore.getState().events).toEqual(events);
    });

    it('should update event status', () => {
      const { setEvents, updateEventStatus } = useBettingStore.getState();
      
      setEvents([mockEvent]);
      updateEventStatus('event_1', EventStatus.LIVE);
      
      const updatedEvent = useBettingStore.getState().events[0];
      expect(updatedEvent.status).toBe(EventStatus.LIVE);
    });

    it('should load events with loading state', async () => {
      const { loadEvents } = useBettingStore.getState();
      
      // Start loading
      const loadPromise = loadEvents();
      expect(useBettingStore.getState().loading.events).toBe(true);
      
      // Wait for completion
      await loadPromise;
      expect(useBettingStore.getState().loading.events).toBe(false);
    });
  });

  describe('Balance Management', () => {
    it('should update balance correctly', () => {
      const { updateBalance } = useBettingStore.getState();
      
      updateBalance(50);
      expect(useBettingStore.getState().user.balance).toBe(150);
      
      updateBalance(-30);
      expect(useBettingStore.getState().user.balance).toBe(120);
    });

    it('should not allow negative balance', () => {
      const { updateBalance } = useBettingStore.getState();
      
      updateBalance(-200);
      expect(useBettingStore.getState().user.balance).toBe(0);
    });

    it('should deposit balance correctly', () => {
      const { depositBalance } = useBettingStore.getState();
      
      depositBalance(100);
      expect(useBettingStore.getState().user.balance).toBe(200);
    });

    it('should throw error for invalid deposit amount', () => {
      const { depositBalance } = useBettingStore.getState();
      
      expect(() => depositBalance(-50)).toThrow('Valor de depósito deve ser positivo');
      expect(() => depositBalance(0)).toThrow('Valor de depósito deve ser positivo');
    });

    it('should withdraw balance correctly', () => {
      const { withdrawBalance } = useBettingStore.getState();
      
      const success = withdrawBalance(50);
      expect(success).toBe(true);
      expect(useBettingStore.getState().user.balance).toBe(50);
    });

    it('should not allow withdrawal of more than available balance', () => {
      const { withdrawBalance } = useBettingStore.getState();
      
      const success = withdrawBalance(150);
      expect(success).toBe(false);
      expect(useBettingStore.getState().user.balance).toBe(100);
    });

    it('should check if user can afford bet', () => {
      const { canAffordBet } = useBettingStore.getState();
      
      expect(canAffordBet(50)).toBe(true);
      expect(canAffordBet(100)).toBe(true);
      expect(canAffordBet(150)).toBe(false);
      expect(canAffordBet(-10)).toBe(false);
    });
  });

  describe('Bet Management', () => {
    beforeEach(() => {
      // Set up events for betting tests
      useBettingStore.getState().setEvents([mockEvent]);
    });

    it('should place bet successfully', async () => {
      const { placeBet } = useBettingStore.getState();
      
      await placeBet(mockBetRequest);
      
      const state = useBettingStore.getState();
      expect(state.bets).toHaveLength(1);
      expect(state.bets[0].amount).toBe(50);
      expect(state.bets[0].status).toBe(BetStatus.ACTIVE);
      expect(state.bets[0].potentialWin).toBe(125); // 50 * 2.5
      expect(state.user.balance).toBe(50); // 100 - 50
      expect(state.user.totalBets).toBe(1);
    });

    it('should not allow bet with insufficient balance', async () => {
      const { placeBet } = useBettingStore.getState();
      
      const largeBetRequest = { ...mockBetRequest, amount: 150 };
      
      await expect(placeBet(largeBetRequest)).rejects.toThrow('Saldo insuficiente para esta aposta');
      expect(useBettingStore.getState().bets).toHaveLength(0);
      expect(useBettingStore.getState().user.balance).toBe(100);
    });

    it('should not allow bet on non-existent event', async () => {
      const { placeBet } = useBettingStore.getState();
      
      const invalidBetRequest = { ...mockBetRequest, eventId: 'non_existent' };
      
      await expect(placeBet(invalidBetRequest)).rejects.toThrow('Evento não encontrado');
    });

    it('should resolve bet as won', async () => {
      const { placeBet, resolveBet } = useBettingStore.getState();
      
      await placeBet(mockBetRequest);
      const betId = useBettingStore.getState().bets[0].id;
      
      resolveBet(betId, 'won');
      
      const state = useBettingStore.getState();
      expect(state.bets[0].status).toBe(BetStatus.WON);
      expect(state.user.balance).toBe(175); // 50 (remaining) + 125 (winnings)
      expect(state.user.totalWins).toBe(1);
    });

    it('should resolve bet as lost', async () => {
      const { placeBet, resolveBet } = useBettingStore.getState();
      
      await placeBet(mockBetRequest);
      const betId = useBettingStore.getState().bets[0].id;
      
      resolveBet(betId, 'lost');
      
      const state = useBettingStore.getState();
      expect(state.bets[0].status).toBe(BetStatus.LOST);
      expect(state.user.balance).toBe(50); // No winnings
      expect(state.user.totalLosses).toBe(1);
    });

    it('should get bets by status', async () => {
      const { placeBet, getBetsByStatus, resolveBet } = useBettingStore.getState();
      
      // Place multiple bets
      await placeBet(mockBetRequest);
      await placeBet({ ...mockBetRequest, amount: 25 });
      
      const betIds = useBettingStore.getState().bets.map(bet => bet.id);
      
      // Resolve one as won, one as lost
      resolveBet(betIds[0], 'won');
      resolveBet(betIds[1], 'lost');
      
      expect(getBetsByStatus(BetStatus.WON)).toHaveLength(1);
      expect(getBetsByStatus(BetStatus.LOST)).toHaveLength(1);
      expect(getBetsByStatus()).toHaveLength(2);
    });

    it('should calculate betting stats correctly', async () => {
      const { placeBet, getBettingStats, resolveBet } = useBettingStore.getState();
      
      // Place bets
      await placeBet(mockBetRequest); // 50 * 2.5 = 125 potential
      await placeBet({ ...mockBetRequest, amount: 30 }); // 30 * 2.5 = 75 potential
      await placeBet({ ...mockBetRequest, amount: 20 }); // Keep active
      
      const betIds = useBettingStore.getState().bets.map(bet => bet.id);
      
      // Resolve first as won, second as lost
      resolveBet(betIds[0], 'won');
      resolveBet(betIds[1], 'lost');
      
      const stats = getBettingStats();
      
      expect(stats.totalBets).toBe(3);
      expect(stats.activeBets).toBe(1);
      expect(stats.wonBets).toBe(1);
      expect(stats.lostBets).toBe(1);
      expect(stats.totalWinnings).toBe(125);
      expect(stats.totalLosses).toBe(30);
      expect(stats.winRate).toBe(50); // 1 win out of 2 resolved bets
    });
  });

  describe('Loading and Error Management', () => {
    it('should set loading state correctly', () => {
      const { setLoading } = useBettingStore.getState();
      
      setLoading('events', true);
      expect(useBettingStore.getState().loading.events).toBe(true);
      
      setLoading('events', false);
      expect(useBettingStore.getState().loading.events).toBe(false);
    });

    it('should set error state correctly', () => {
      const { setError } = useBettingStore.getState();
      
      setError('bets', 'Test error');
      expect(useBettingStore.getState().error.bets).toBe('Test error');
    });

    it('should clear all errors', () => {
      const { setError, clearErrors } = useBettingStore.getState();
      
      setError('events', 'Event error');
      setError('bets', 'Bet error');
      
      clearErrors();
      
      const errorState = useBettingStore.getState().error;
      expect(errorState.events).toBeNull();
      expect(errorState.bets).toBeNull();
      expect(errorState.balance).toBeNull();
    });
  });

  describe('Data Persistence', () => {
    it('should save user data to localStorage', () => {
      const { saveUserData, updateBalance } = useBettingStore.getState();
      
      updateBalance(50);
      saveUserData();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'betting-store',
        expect.stringContaining('"balance":150')
      );
    });

    it('should load user data from localStorage', () => {
      const mockData = {
        state: {
          events: [mockEvent],
          bets: [],
          user: { balance: 200, totalBets: 5, totalWins: 2, totalLosses: 3 },
        }
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
      
      const { loadUserData } = useBettingStore.getState();
      loadUserData();
      
      const state = useBettingStore.getState();
      expect(state.user.balance).toBe(200);
      expect(state.user.totalBets).toBe(5);
    });

    it('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const { loadUserData } = useBettingStore.getState();
      loadUserData();
      
      // Should reset to initial state
      const state = useBettingStore.getState();
      expect(state.user.balance).toBe(100);
      expect(state.events).toEqual([]);
      expect(state.bets).toEqual([]);
    });

    it('should reset store completely', () => {
      const { updateBalance, resetStore } = useBettingStore.getState();
      
      updateBalance(100);
      resetStore();
      
      const state = useBettingStore.getState();
      expect(state.user.balance).toBe(100);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('betting-store');
    });
  });
});