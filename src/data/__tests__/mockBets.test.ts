import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateMockBets,
  generateBettingTestScenarios,
  generateStatisticsTestScenarios,
  populateStoreWithMockBets,
  createComprehensiveMockData,
  defaultMockBets,
  testScenarioBets,
  statisticsTestScenarios
} from '../mockBets';
import { generateTestScenarioEvents, generateAllMockEvents } from '../mockEvents';
import { BetStatus, BetPrediction, EventStatus } from '../../types';

describe('Mock Betting Data Generation', () => {
  describe('generateMockBets', () => {
    it('should generate bets for given events', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 2);
      
      expect(bets.length).toBeGreaterThanOrEqual(0);
      
      // Each bet should reference a valid event
      bets.forEach(bet => {
        expect(events.some(event => event.id === bet.eventId)).toBe(true);
      });
    });

    it('should generate bets with valid structure', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 1);
      
      bets.forEach(bet => {
        expect(bet).toHaveProperty('id');
        expect(bet).toHaveProperty('eventId');
        expect(bet).toHaveProperty('event');
        expect(bet).toHaveProperty('amount');
        expect(bet).toHaveProperty('odds');
        expect(bet).toHaveProperty('prediction');
        expect(bet).toHaveProperty('status');
        expect(bet).toHaveProperty('createdAt');
        expect(bet).toHaveProperty('potentialWin');
        
        expect(typeof bet.id).toBe('string');
        expect(typeof bet.eventId).toBe('string');
        expect(typeof bet.event).toBe('object');
        expect(typeof bet.amount).toBe('number');
        expect(typeof bet.odds).toBe('number');
        expect(Object.values(BetPrediction)).toContain(bet.prediction);
        expect(Object.values(BetStatus)).toContain(bet.status);
        expect(bet.createdAt).toBeInstanceOf(Date);
        expect(typeof bet.potentialWin).toBe('number');
      });
    });

    it('should generate unique bet IDs', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 3);
      
      const ids = bets.map(bet => bet.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(bets.length);
    });

    it('should calculate potential winnings correctly', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 2);
      
      bets.forEach(bet => {
        const expectedWin = bet.amount * bet.odds;
        expect(bet.potentialWin).toBeCloseTo(expectedWin, 2);
      });
    });

    it('should set active status for upcoming events', () => {
      const events = generateTestScenarioEvents().filter(e => e.status === EventStatus.UPCOMING);
      const bets = generateMockBets(events, 2);
      
      bets.forEach(bet => {
        if (bet.event.status === EventStatus.UPCOMING) {
          expect(bet.status).toBe(BetStatus.ACTIVE);
        }
      });
    });

    it('should generate realistic bet amounts', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 5);
      
      bets.forEach(bet => {
        expect(bet.amount).toBeGreaterThanOrEqual(5);
        expect(bet.amount).toBeLessThanOrEqual(500);
        expect(Number.isInteger(bet.amount)).toBe(true);
      });
    });

    it('should use correct odds for predictions', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 2);
      
      bets.forEach(bet => {
        const event = bet.event;
        switch (bet.prediction) {
          case BetPrediction.HOME:
            expect(bet.odds).toBe(event.odds.home);
            break;
          case BetPrediction.AWAY:
            expect(bet.odds).toBe(event.odds.away);
            break;
          case BetPrediction.DRAW:
            expect(bet.odds).toBe(event.odds.draw);
            break;
        }
      });
    });

    it('should not generate draw bets for tennis', () => {
      const events = generateTestScenarioEvents().filter(e => e.sport === 'tennis');
      const bets = generateMockBets(events, 5);
      
      bets.forEach(bet => {
        if (bet.event.sport === 'tennis') {
          expect(bet.prediction).not.toBe(BetPrediction.DRAW);
        }
      });
    });

    it('should sort bets by creation date (newest first)', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 3);
      
      for (let i = 1; i < bets.length; i++) {
        expect(bets[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(bets[i].createdAt.getTime());
      }
    });
  });

  describe('generateBettingTestScenarios', () => {
    it('should generate exactly 6 test scenario bets', () => {
      const bets = generateBettingTestScenarios();
      expect(bets).toHaveLength(6);
    });

    it('should include all required test scenarios', () => {
      const bets = generateBettingTestScenarios();
      const ids = bets.map(bet => bet.id);
      
      expect(ids).toContain('test_high_value_win');
      expect(ids).toContain('test_small_loss');
      expect(ids).toContain('test_active_upcoming');
      expect(ids).toContain('test_active_live');
      expect(ids).toContain('test_draw_bet');
      expect(ids).toContain('test_underdog_win');
    });

    it('should have bets with different statuses', () => {
      const bets = generateBettingTestScenarios();
      const statuses = new Set(bets.map(bet => bet.status));
      
      expect(statuses.has(BetStatus.WON)).toBe(true);
      expect(statuses.has(BetStatus.LOST)).toBe(true);
      expect(statuses.has(BetStatus.ACTIVE)).toBe(true);
    });

    it('should have bets with different predictions', () => {
      const bets = generateBettingTestScenarios();
      const predictions = new Set(bets.map(bet => bet.prediction));
      
      expect(predictions.has(BetPrediction.HOME)).toBe(true);
      expect(predictions.has(BetPrediction.AWAY)).toBe(true);
      expect(predictions.has(BetPrediction.DRAW)).toBe(true);
    });

    it('should have realistic bet amounts and odds', () => {
      const bets = generateBettingTestScenarios();
      
      bets.forEach(bet => {
        expect(bet.amount).toBeGreaterThan(0);
        expect(bet.odds).toBeGreaterThan(1);
        expect(bet.potentialWin).toBeGreaterThan(bet.amount);
      });
    });
  });

  describe('generateStatisticsTestScenarios', () => {
    let scenarios: ReturnType<typeof generateStatisticsTestScenarios>;

    beforeEach(() => {
      scenarios = generateStatisticsTestScenarios();
    });

    it('should generate all scenario types', () => {
      expect(scenarios).toHaveProperty('allWins');
      expect(scenarios).toHaveProperty('allLosses');
      expect(scenarios).toHaveProperty('noBets');
      expect(scenarios).toHaveProperty('mixedResults');
      expect(scenarios).toHaveProperty('onlyActive');
    });

    it('should have correct bet statuses in allWins scenario', () => {
      scenarios.allWins.forEach(bet => {
        expect(bet.status).toBe(BetStatus.WON);
      });
    });

    it('should have correct bet statuses in allLosses scenario', () => {
      scenarios.allLosses.forEach(bet => {
        expect(bet.status).toBe(BetStatus.LOST);
      });
    });

    it('should have empty array for noBets scenario', () => {
      expect(scenarios.noBets).toHaveLength(0);
    });

    it('should have mixed statuses in mixedResults scenario', () => {
      const statuses = new Set(scenarios.mixedResults.map(bet => bet.status));
      expect(statuses.size).toBeGreaterThan(1);
    });

    it('should have only active bets in onlyActive scenario', () => {
      scenarios.onlyActive.forEach(bet => {
        expect(bet.status).toBe(BetStatus.ACTIVE);
      });
    });

    it('should have valid bet structures in all scenarios', () => {
      Object.values(scenarios).forEach(scenarioBets => {
        scenarioBets.forEach(bet => {
          expect(bet).toHaveProperty('id');
          expect(bet).toHaveProperty('eventId');
          expect(bet).toHaveProperty('amount');
          expect(bet).toHaveProperty('odds');
          expect(bet).toHaveProperty('prediction');
          expect(bet).toHaveProperty('status');
          expect(bet).toHaveProperty('createdAt');
          expect(bet).toHaveProperty('potentialWin');
        });
      });
    });
  });

  describe('populateStoreWithMockBets', () => {
    let mockStore: any;
    let mockState: any;

    beforeEach(() => {
      mockState = {
        bets: [],
        user: {
          totalBets: 0,
          totalWins: 0,
          totalLosses: 0
        }
      };
      
      mockStore = {
        getState: vi.fn(() => mockState)
      };
    });

    it('should populate store with test scenario bets', () => {
      populateStoreWithMockBets(mockStore, 'test');
      
      expect(mockState.bets).toHaveLength(6); // Test scenarios
    });

    it('should populate store with all wins scenario', () => {
      populateStoreWithMockBets(mockStore, 'allWins');
      
      mockState.bets.forEach((bet: any) => {
        expect(bet.status).toBe(BetStatus.WON);
      });
    });

    it('should populate store with all losses scenario', () => {
      populateStoreWithMockBets(mockStore, 'allLosses');
      
      mockState.bets.forEach((bet: any) => {
        expect(bet.status).toBe(BetStatus.LOST);
      });
    });

    it('should populate store with no bets scenario', () => {
      populateStoreWithMockBets(mockStore, 'noBets');
      
      expect(mockState.bets).toHaveLength(0);
    });

    it('should populate store with default scenario', () => {
      populateStoreWithMockBets(mockStore, 'default');
      
      expect(mockState.bets.length).toBeGreaterThan(0);
    });

    it('should update user statistics correctly', () => {
      populateStoreWithMockBets(mockStore, 'test');
      
      const wonBets = mockState.bets.filter((bet: any) => bet.status === BetStatus.WON);
      const lostBets = mockState.bets.filter((bet: unknown) => bet.status === BetStatus.LOST);
      
      expect(mockState.user.totalBets).toBe(mockState.bets.length);
      expect(mockState.user.totalWins).toBe(wonBets.length);
      expect(mockState.user.totalLosses).toBe(lostBets.length);
    });
  });

  describe('createComprehensiveMockData', () => {
    it('should create events and bets together', () => {
      const data = createComprehensiveMockData(10, 2);
      
      expect(data).toHaveProperty('events');
      expect(data).toHaveProperty('bets');
      expect(data.events).toHaveLength(10);
      expect(data.bets.length).toBeGreaterThanOrEqual(0);
    });

    it('should create bets that reference the generated events', () => {
      const data = createComprehensiveMockData(5, 1);
      
      data.bets.forEach(bet => {
        expect(data.events.some(event => event.id === bet.eventId)).toBe(true);
      });
    });

    it('should handle zero events', () => {
      const data = createComprehensiveMockData(0, 1);
      
      expect(data.events).toHaveLength(0);
      expect(data.bets).toHaveLength(0);
    });

    it('should handle zero bets per event', () => {
      const data = createComprehensiveMockData(5, 0);
      
      expect(data.events).toHaveLength(5);
      expect(data.bets).toHaveLength(0);
    });
  });

  describe('exported constants', () => {
    it('should export defaultMockBets with valid structure', () => {
      expect(Array.isArray(defaultMockBets)).toBe(true);
      
      defaultMockBets.forEach(bet => {
        expect(bet).toHaveProperty('id');
        expect(bet).toHaveProperty('eventId');
        expect(bet).toHaveProperty('amount');
        expect(bet).toHaveProperty('odds');
        expect(bet).toHaveProperty('prediction');
        expect(bet).toHaveProperty('status');
        expect(bet).toHaveProperty('createdAt');
        expect(bet).toHaveProperty('potentialWin');
      });
    });

    it('should export testScenarioBets with correct length', () => {
      expect(testScenarioBets).toHaveLength(6);
    });

    it('should export statisticsTestScenarios with all scenarios', () => {
      expect(statisticsTestScenarios).toHaveProperty('allWins');
      expect(statisticsTestScenarios).toHaveProperty('allLosses');
      expect(statisticsTestScenarios).toHaveProperty('noBets');
      expect(statisticsTestScenarios).toHaveProperty('mixedResults');
      expect(statisticsTestScenarios).toHaveProperty('onlyActive');
    });
  });

  describe('edge cases and validation', () => {
    it('should handle events with no draw odds correctly', () => {
      const events = generateTestScenarioEvents().filter(e => e.sport === 'tennis');
      const bets = generateMockBets(events, 3);
      
      bets.forEach(bet => {
        if (bet.event.sport === 'tennis') {
          expect([BetPrediction.HOME, BetPrediction.AWAY]).toContain(bet.prediction);
        }
      });
    });

    it('should handle large number of bets', () => {
      const events = generateAllMockEvents(5);
      const bets = generateMockBets(events, 20); // Many bets per event
      
      expect(bets.length).toBeGreaterThan(0);
      
      // Check that all bets are valid
      bets.forEach(bet => {
        expect(bet.amount).toBeGreaterThan(0);
        expect(bet.odds).toBeGreaterThan(1);
        expect(bet.potentialWin).toBeGreaterThan(bet.amount);
      });
    });

    it('should create bets with dates before event dates', () => {
      const events = generateTestScenarioEvents();
      const bets = generateMockBets(events, 2);
      
      bets.forEach(bet => {
        expect(bet.createdAt.getTime()).toBeLessThanOrEqual(bet.event.date.getTime());
      });
    });

    it('should handle events with different statuses correctly', () => {
      const events = generateAllMockEvents(20);
      const bets = generateMockBets(events, 1);
      
      bets.forEach(bet => {
        if (bet.event.status === EventStatus.UPCOMING) {
          expect(bet.status).toBe(BetStatus.ACTIVE);
        }
        // For other statuses, any bet status is valid based on distribution
      });
    });
  });
});