// Constants and auxiliary types
export const SportType = {
  FOOTBALL: 'football',
  BASKETBALL: 'basketball',
  TENNIS: 'tennis',
  VOLLEYBALL: 'volleyball'
} as const;

export const EventStatus = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  FINISHED: 'finished'
} as const;

export const BetStatus = {
  ACTIVE: 'active',
  WON: 'won',
  LOST: 'lost'
} as const;

export const BetPrediction = {
  HOME: 'home',
  DRAW: 'draw',
  AWAY: 'away'
} as const;

// Type definitions from constants
export type SportType = typeof SportType[keyof typeof SportType];
export type EventStatus = typeof EventStatus[keyof typeof EventStatus];
export type BetStatus = typeof BetStatus[keyof typeof BetStatus];
export type BetPrediction = typeof BetPrediction[keyof typeof BetPrediction];

// Core interfaces
export interface SportEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  sport: SportType;
  status: EventStatus;
}

export interface Bet {
  id: string;
  eventId: string;
  event: SportEvent;
  amount: number;
  odds: number;
  prediction: BetPrediction;
  status: BetStatus;
  createdAt: Date;
  potentialWin: number;
}

export interface User {
  balance: number;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
}

// Auxiliary types for forms and API
export type CreateBetRequest = Omit<Bet, 'id' | 'createdAt' | 'event' | 'potentialWin'>;

export type UpdateBalanceRequest = {
  amount: number;
  type: 'deposit' | 'withdraw';
};

export type BetResult = 'won' | 'lost';

export interface BettingStats {
  totalBets: number;
  activeBets: number;
  wonBets: number;
  lostBets: number;
  totalWinnings: number;
  totalLosses: number;
  winRate: number;
}

// UI State types
export interface LoadingState {
  events: boolean;
  bets: boolean;
  balance: boolean;
}

export interface ErrorState {
  events: string | null;
  bets: string | null;
  balance: string | null;
}