// Mock Events exports
export {
  generateMockEventsForSport,
  generateAllMockEvents,
  generateTestScenarioEvents,
  populateStoreWithMockEvents,
  defaultMockEvents,
  testScenarioEvents
} from './mockEvents';

// Mock Bets exports
export {
  generateMockBets,
  generateBettingTestScenarios,
  generateStatisticsTestScenarios,
  populateStoreWithMockBets,
  createComprehensiveMockData,
  defaultMockBets,
  testScenarioBets,
  statisticsTestScenarios
} from './mockBets';

// Utility function to populate store with both events and bets
export function populateStoreWithAllMockData(
  store: any,
  scenario: 'default' | 'test' = 'default'
): void {
  // Import here to avoid circular dependencies
  const { populateStoreWithMockEvents } = require('./mockEvents');
  const { populateStoreWithMockBets } = require('./mockBets');
  
  // Populate events first
  populateStoreWithMockEvents(store, scenario === 'test');
  
  // Then populate bets
  populateStoreWithMockBets(store, scenario);
}