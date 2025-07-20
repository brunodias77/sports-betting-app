import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  SportEvent, 
  Bet, 
  User, 
  BetStatus, 
  CreateBetRequest, 
  BetResult,
  LoadingState,
  ErrorState,
  BettingStats
} from '../types';

interface BettingStore {
  // State
  events: SportEvent[];
  bets: Bet[];
  user: User;
  loading: LoadingState;
  error: ErrorState;

  // Actions for events
  loadEvents: () => Promise<void>;
  setEvents: (events: SportEvent[]) => void;
  updateEventStatus: (eventId: string, status: SportEvent['status']) => void;

  // Actions for bets
  placeBet: (betRequest: CreateBetRequest) => Promise<void>;
  resolveBet: (betId: string, result: BetResult) => void;
  getBetsByStatus: (status?: BetStatus) => Bet[];
  getBettingStats: () => BettingStats;

  // Actions for balance management
  updateBalance: (amount: number) => void;
  depositBalance: (amount: number) => void;
  withdrawBalance: (amount: number) => boolean;
  canAffordBet: (amount: number) => boolean;

  // Actions for data persistence
  loadUserData: () => void;
  saveUserData: () => void;
  resetStore: () => void;

  // Loading and error management
  setLoading: (key: keyof LoadingState, value: boolean) => void;
  setError: (key: keyof ErrorState, value: string | null) => void;
  clearErrors: () => void;
}

const initialUser: User = {
  balance: 100, // Starting balance of R$ 100
  totalBets: 0,
  totalWins: 0,
  totalLosses: 0,
};

const initialLoadingState: LoadingState = {
  events: false,
  bets: false,
  balance: false,
};

const initialErrorState: ErrorState = {
  events: null,
  bets: null,
  balance: null,
};

export const useBettingStore = create<BettingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      bets: [],
      user: initialUser,
      loading: initialLoadingState,
      error: initialErrorState,

      // Event actions
      loadEvents: async () => {
        const { setLoading, setError } = get();
        
        try {
          setLoading('events', true);
          setError('events', null);
          
          // Simulate API call - in real app this would be an actual API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Import mock data dynamically to avoid circular dependencies
          const { generateAllMockEvents } = await import('../data/mockEvents');
          const mockEvents = generateAllMockEvents(30);
          
          set({ events: mockEvents });
        } catch (error) {
          setError('events', 'Erro ao carregar eventos esportivos');
          console.error('Error loading events:', error);
        } finally {
          setLoading('events', false);
        }
      },

      setEvents: (events) => {
        set({ events });
      },

      updateEventStatus: (eventId, status) => {
        set((state) => ({
          events: state.events.map(event =>
            event.id === eventId ? { ...event, status } : event
          )
        }));
      },

      // Bet actions
      placeBet: async (betRequest) => {
        const { user, events, setLoading, setError, canAffordBet } = get();
        
        try {
          setLoading('bets', true);
          setError('bets', null);

          // Validate bet amount against balance
          if (!canAffordBet(betRequest.amount)) {
            throw new Error('Saldo insuficiente para esta aposta');
          }

          // Find the event
          const event = events.find(e => e.id === betRequest.eventId);
          if (!event) {
            throw new Error('Evento não encontrado');
          }

          // Calculate potential win
          const potentialWin = betRequest.amount * betRequest.odds;

          // Create new bet
          const newBet: Bet = {
            id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...betRequest,
            event,
            status: BetStatus.ACTIVE,
            createdAt: new Date(),
            potentialWin,
          };

          // Update state
          set((state) => ({
            bets: [...state.bets, newBet],
            user: {
              ...state.user,
              balance: state.user.balance - betRequest.amount,
              totalBets: state.user.totalBets + 1,
            }
          }));

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer aposta';
          setError('bets', errorMessage);
          throw error;
        } finally {
          setLoading('bets', false);
        }
      },

      resolveBet: (betId, result) => {
        set((state) => {
          const bet = state.bets.find(b => b.id === betId);
          if (!bet || bet.status !== BetStatus.ACTIVE) {
            return state;
          }

          const updatedBet = {
            ...bet,
            status: result === 'won' ? BetStatus.WON : BetStatus.LOST,
          };

          const updatedBets = state.bets.map(b => 
            b.id === betId ? updatedBet : b
          );

          // Update user stats and balance
          const balanceIncrease = result === 'won' ? bet.potentialWin : 0;
          const updatedUser = {
            ...state.user,
            balance: state.user.balance + balanceIncrease,
            totalWins: result === 'won' ? state.user.totalWins + 1 : state.user.totalWins,
            totalLosses: result === 'lost' ? state.user.totalLosses + 1 : state.user.totalLosses,
          };

          return {
            ...state,
            bets: updatedBets,
            user: updatedUser,
          };
        });
      },

      getBetsByStatus: (status) => {
        const { bets } = get();
        return status ? bets.filter(bet => bet.status === status) : bets;
      },

      getBettingStats: () => {
        const { bets } = get();
        
        const activeBets = bets.filter(bet => bet.status === BetStatus.ACTIVE).length;
        const wonBets = bets.filter(bet => bet.status === BetStatus.WON);
        const lostBets = bets.filter(bet => bet.status === BetStatus.LOST);
        
        const totalWinnings = wonBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
        const totalLosses = lostBets.reduce((sum, bet) => sum + bet.amount, 0);
        const winRate = bets.length > 0 ? (wonBets.length / (wonBets.length + lostBets.length)) * 100 : 0;

        return {
          totalBets: bets.length,
          activeBets,
          wonBets: wonBets.length,
          lostBets: lostBets.length,
          totalWinnings,
          totalLosses,
          winRate: isNaN(winRate) ? 0 : winRate,
        };
      },

      // Balance management actions
      updateBalance: (amount) => {
        set((state) => ({
          user: {
            ...state.user,
            balance: Math.max(0, state.user.balance + amount),
          }
        }));
      },

      depositBalance: (amount) => {
        const { setLoading, setError } = get();
        
        try {
          setLoading('balance', true);
          setError('balance', null);

          if (amount <= 0) {
            throw new Error('Valor de depósito deve ser positivo');
          }

          set((state) => ({
            user: {
              ...state.user,
              balance: state.user.balance + amount,
            }
          }));

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer depósito';
          setError('balance', errorMessage);
          throw error;
        } finally {
          setLoading('balance', false);
        }
      },

      withdrawBalance: (amount) => {
        const { user } = get();
        
        if (amount <= 0) {
          return false;
        }

        if (user.balance < amount) {
          return false;
        }

        set((state) => ({
          user: {
            ...state.user,
            balance: state.user.balance - amount,
          }
        }));

        return true;
      },

      canAffordBet: (amount) => {
        const { user } = get();
        return user.balance >= amount && amount > 0;
      },

      // Data persistence actions
      loadUserData: () => {
        try {
          const savedData = localStorage.getItem('betting-store');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.state) {
              set(parsedData.state);
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          // Reset to initial state if data is corrupted
          set({
            events: [],
            bets: [],
            user: initialUser,
            loading: initialLoadingState,
            error: initialErrorState,
          });
        }
      },

      saveUserData: () => {
        try {
          const state = get();
          const dataToSave = {
            events: state.events,
            bets: state.bets,
            user: state.user,
          };
          localStorage.setItem('betting-store', JSON.stringify({ state: dataToSave }));
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      },

      resetStore: () => {
        set({
          events: [],
          bets: [],
          user: initialUser,
          loading: initialLoadingState,
          error: initialErrorState,
        });
        localStorage.removeItem('betting-store');
      },

      // Loading and error management
      setLoading: (key, value) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: value,
          }
        }));
      },

      setError: (key, value) => {
        set((state) => ({
          error: {
            ...state.error,
            [key]: value,
          }
        }));
      },

      clearErrors: () => {
        set({ error: initialErrorState });
      },
    }),
    {
      name: 'betting-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        events: state.events,
        bets: state.bets,
        user: state.user,
      }),
    }
  )
);