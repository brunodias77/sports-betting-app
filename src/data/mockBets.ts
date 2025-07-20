import { Bet, BetStatus, BetPrediction, SportEvent } from '../types';
import { generateTestScenarioEvents, generateAllMockEvents } from './mockEvents';

/**
 * Generates a random bet amount within realistic ranges
 * @param min - Minimum bet amount
 * @param max - Maximum bet amount
 * @returns Random bet amount
 */
function generateBetAmount(min: number = 5, max: number = 500): number {
  // Use weighted distribution - more small bets than large ones
  const weights = [0.4, 0.3, 0.2, 0.1]; // 40% small, 30% medium, 20% large, 10% very large
  const ranges = [
    { min: 5, max: 25 },     // Small bets
    { min: 25, max: 100 },   // Medium bets  
    { min: 100, max: 250 },  // Large bets
    { min: 250, max: 500 }   // Very large bets
  ];
  
  const rand = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) {
      const range = ranges[i];
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects a random prediction for a bet
 * @param event - The sport event to bet on
 * @returns Random bet prediction
 */
function generateBetPrediction(event: SportEvent): BetPrediction {
  const predictions = [BetPrediction.HOME, BetPrediction.AWAY];
  
  // Add draw option for sports that support it
  if (event.odds.draw !== undefined) {
    predictions.push(BetPrediction.DRAW);
  }
  
  return predictions[Math.floor(Math.random() * predictions.length)];
}

/**
 * Gets the odds for a specific prediction
 * @param event - The sport event
 * @param prediction - The bet prediction
 * @returns The odds for the prediction
 */
function getOddsForPrediction(event: SportEvent, prediction: BetPrediction): number {
  switch (prediction) {
    case BetPrediction.HOME:
      return event.odds.home;
    case BetPrediction.AWAY:
      return event.odds.away;
    case BetPrediction.DRAW:
      return event.odds.draw || 3.0; // Fallback if draw not available
    default:
      return event.odds.home;
  }
}

/**
 * Generates a random date within a specified range from an event date
 * @param eventDate - The event date
 * @param daysBefore - Maximum days before the event
 * @returns Random date before the event
 */
function generateBetDate(eventDate: Date, daysBefore: number = 7): Date {
  const maxMs = daysBefore * 24 * 60 * 60 * 1000;
  const randomMs = Math.random() * maxMs;
  return new Date(eventDate.getTime() - randomMs);
}

/**
 * Generates mock bets for a given set of events
 * @param events - Array of sport events to create bets for
 * @param betsPerEvent - Average number of bets per event
 * @param statusDistribution - Distribution of bet statuses
 * @returns Array of mock bets
 */
export function generateMockBets(
  events: SportEvent[],
  betsPerEvent: number = 2,
  statusDistribution: { active: number; won: number; lost: number } = { active: 0.4, won: 0.3, lost: 0.3 }
): Bet[] {
  const bets: Bet[] = [];
  
  events.forEach((event, eventIndex) => {
    // Vary the number of bets per event (0 to betsPerEvent * 2)
    const numBets = Math.floor(Math.random() * (betsPerEvent * 2 + 1));
    
    for (let i = 0; i < numBets; i++) {
      const prediction = generateBetPrediction(event);
      const odds = getOddsForPrediction(event, prediction);
      const amount = generateBetAmount();
      const potentialWin = amount * odds;
      
      // Determine bet status based on event status and distribution
      let status: BetStatus;
      if (event.status === 'upcoming') {
        status = BetStatus.ACTIVE; // All bets on upcoming events are active
      } else {
        // For finished/live events, use distribution
        const rand = Math.random();
        if (rand < statusDistribution.won) {
          status = BetStatus.WON;
        } else if (rand < statusDistribution.won + statusDistribution.lost) {
          status = BetStatus.LOST;
        } else {
          status = BetStatus.ACTIVE;
        }
      }
      
      const bet: Bet = {
        id: `bet_${eventIndex}_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        eventId: event.id,
        event,
        amount,
        odds,
        prediction,
        status,
        createdAt: generateBetDate(event.date),
        potentialWin
      };
      
      bets.push(bet);
    }
  });
  
  // Sort bets by creation date (newest first)
  return bets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Generates specific test scenarios for betting data
 * @returns Array of bets covering various edge cases
 */
export function generateBettingTestScenarios(): Bet[] {
  const testEvents = generateTestScenarioEvents();
  const now = new Date();
  
  return [
    // High-value winning bet
    {
      id: 'test_high_value_win',
      eventId: testEvents[2].id, // Finished tennis match
      event: testEvents[2],
      amount: 500,
      odds: 2.10,
      prediction: BetPrediction.HOME,
      status: BetStatus.WON,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      potentialWin: 1050
    },
    
    // Small losing bet
    {
      id: 'test_small_loss',
      eventId: testEvents[2].id, // Same finished tennis match
      event: testEvents[2],
      amount: 10,
      odds: 1.75,
      prediction: BetPrediction.AWAY,
      status: BetStatus.LOST,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      potentialWin: 17.5
    },
    
    // Active bet on upcoming event
    {
      id: 'test_active_upcoming',
      eventId: testEvents[0].id, // Upcoming football match
      event: testEvents[0],
      amount: 100,
      odds: 1.85,
      prediction: BetPrediction.HOME,
      status: BetStatus.ACTIVE,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      potentialWin: 185
    },
    
    // Active bet on live event
    {
      id: 'test_active_live',
      eventId: testEvents[1].id, // Live basketball game
      event: testEvents[1],
      amount: 75,
      odds: 1.95,
      prediction: BetPrediction.HOME,
      status: BetStatus.ACTIVE,
      createdAt: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
      potentialWin: 146.25
    },
    
    // Draw bet (football only)
    {
      id: 'test_draw_bet',
      eventId: testEvents[0].id, // Upcoming football match
      event: testEvents[0],
      amount: 50,
      odds: 3.20,
      prediction: BetPrediction.DRAW,
      status: BetStatus.ACTIVE,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      potentialWin: 160
    },
    
    // Underdog winning bet (high odds)
    {
      id: 'test_underdog_win',
      eventId: testEvents[3].id, // Underdog scenario volleyball
      event: testEvents[3],
      amount: 25,
      odds: 8.00,
      prediction: BetPrediction.AWAY,
      status: BetStatus.WON,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      potentialWin: 200
    }
  ];
}

/**
 * Generates edge case scenarios for testing statistics calculations
 * @returns Object containing different betting scenarios
 */
export function generateStatisticsTestScenarios(): {
  allWins: Bet[];
  allLosses: Bet[];
  noBets: Bet[];
  mixedResults: Bet[];
  onlyActive: Bet[];
} {
  const testEvents = generateTestScenarioEvents();
  const now = new Date();
  
  // All winning bets scenario
  const allWins: Bet[] = [
    {
      id: 'stats_win_1',
      eventId: testEvents[0].id,
      event: testEvents[0],
      amount: 100,
      odds: 2.0,
      prediction: BetPrediction.HOME,
      status: BetStatus.WON,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      potentialWin: 200
    },
    {
      id: 'stats_win_2',
      eventId: testEvents[1].id,
      event: testEvents[1],
      amount: 50,
      odds: 1.5,
      prediction: BetPrediction.AWAY,
      status: BetStatus.WON,
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      potentialWin: 75
    }
  ];
  
  // All losing bets scenario
  const allLosses: Bet[] = [
    {
      id: 'stats_loss_1',
      eventId: testEvents[0].id,
      event: testEvents[0],
      amount: 100,
      odds: 2.0,
      prediction: BetPrediction.HOME,
      status: BetStatus.LOST,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      potentialWin: 200
    },
    {
      id: 'stats_loss_2',
      eventId: testEvents[1].id,
      event: testEvents[1],
      amount: 75,
      odds: 1.8,
      prediction: BetPrediction.AWAY,
      status: BetStatus.LOST,
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      potentialWin: 135
    }
  ];
  
  // Mixed results scenario
  const mixedResults: Bet[] = [
    ...allWins.slice(0, 1), // 1 win
    ...allLosses.slice(0, 1), // 1 loss
    {
      id: 'stats_active_1',
      eventId: testEvents[2].id,
      event: testEvents[2],
      amount: 60,
      odds: 2.5,
      prediction: BetPrediction.HOME,
      status: BetStatus.ACTIVE,
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      potentialWin: 150
    }
  ];
  
  // Only active bets scenario
  const onlyActive: Bet[] = [
    {
      id: 'stats_active_only_1',
      eventId: testEvents[0].id,
      event: testEvents[0],
      amount: 100,
      odds: 1.9,
      prediction: BetPrediction.HOME,
      status: BetStatus.ACTIVE,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      potentialWin: 190
    },
    {
      id: 'stats_active_only_2',
      eventId: testEvents[1].id,
      event: testEvents[1],
      amount: 50,
      odds: 2.2,
      prediction: BetPrediction.AWAY,
      status: BetStatus.ACTIVE,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      potentialWin: 110
    }
  ];
  
  return {
    allWins,
    allLosses,
    noBets: [],
    mixedResults,
    onlyActive
  };
}

/**
 * Utility function to populate the store with mock betting data
 * @param store - The betting store instance
 * @param scenario - Which scenario to use ('default', 'test', 'allWins', 'allLosses', 'noBets', 'mixed', 'onlyActive')
 */
export function populateStoreWithMockBets(
  store: unknown,
  scenario: 'default' | 'test' | 'allWins' | 'allLosses' | 'noBets' | 'mixed' | 'onlyActive' = 'default'
): void {
  let bets: Bet[];
  
  switch (scenario) {
    case 'test':
      bets = generateBettingTestScenarios();
      break;
    case 'allWins':
      bets = generateStatisticsTestScenarios().allWins;
      break;
    case 'allLosses':
      bets = generateStatisticsTestScenarios().allLosses;
      break;
    case 'noBets':
      bets = [];
      break;
    case 'mixed':
      bets = generateStatisticsTestScenarios().mixedResults;
      break;
    case 'onlyActive':
      bets = generateStatisticsTestScenarios().onlyActive;
      break;
    default:
      // Generate bets for default mock events
      const events = generateAllMockEvents(20);
      bets = generateMockBets(events, 1.5);
      break;
  }
  
  // For real store usage, you would call store methods to update state
  // For testing, we simulate by directly updating the mock store state
  if (typeof store.getState === 'function') {
    const state = store.getState();
    state.bets = bets;
    
    // Update user stats based on the bets
    const wonBets = bets.filter(bet => bet.status === BetStatus.WON);
    const lostBets = bets.filter(bet => bet.status === BetStatus.LOST);
    
    state.user.totalBets = bets.length;
    state.user.totalWins = wonBets.length;
    state.user.totalLosses = lostBets.length;
  }
}

/**
 * Creates a comprehensive mock dataset with events and bets
 * @param numEvents - Number of events to generate
 * @param betsPerEvent - Average bets per event
 * @returns Object with events and bets
 */
export function createComprehensiveMockData(
  numEvents: number = 25,
  betsPerEvent: number = 2
): { events: SportEvent[]; bets: Bet[] } {
  const events = generateAllMockEvents(numEvents);
  const bets = generateMockBets(events, betsPerEvent);
  
  return { events, bets };
}

// Export default mock data for immediate use
export const defaultMockBets = (() => {
  const events = generateAllMockEvents(15);
  return generateMockBets(events, 1.5);
})();

export const testScenarioBets = generateBettingTestScenarios();
export const statisticsTestScenarios = generateStatisticsTestScenarios();