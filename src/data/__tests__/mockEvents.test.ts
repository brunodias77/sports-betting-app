import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateMockEventsForSport,
  generateAllMockEvents,
  generateTestScenarioEvents,
  populateStoreWithMockEvents,
  defaultMockEvents,
  testScenarioEvents
} from '../mockEvents';
import { SportType, EventStatus } from '../../types';

describe('Mock Events Generation', () => {
  describe('generateMockEventsForSport', () => {
    it('should generate the correct number of events for a sport', () => {
      const events = generateMockEventsForSport(SportType.FOOTBALL, 10);
      expect(events).toHaveLength(10);
    });

    it('should generate events with correct sport type', () => {
      const events = generateMockEventsForSport(SportType.BASKETBALL, 5);
      events.forEach(event => {
        expect(event.sport).toBe(SportType.BASKETBALL);
      });
    });

    it('should generate events with valid structure', () => {
      const events = generateMockEventsForSport(SportType.TENNIS, 3);
      
      events.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('homeTeam');
        expect(event).toHaveProperty('awayTeam');
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('odds');
        expect(event).toHaveProperty('sport');
        expect(event).toHaveProperty('status');
        
        expect(typeof event.id).toBe('string');
        expect(typeof event.homeTeam).toBe('string');
        expect(typeof event.awayTeam).toBe('string');
        expect(event.date).toBeInstanceOf(Date);
        expect(typeof event.odds).toBe('object');
        expect(Object.values(SportType)).toContain(event.sport);
        expect(Object.values(EventStatus)).toContain(event.status);
      });
    });

    it('should generate different home and away teams', () => {
      const events = generateMockEventsForSport(SportType.FOOTBALL, 10);
      
      events.forEach(event => {
        expect(event.homeTeam).not.toBe(event.awayTeam);
      });
    });

    it('should generate valid odds for football (with draw)', () => {
      const events = generateMockEventsForSport(SportType.FOOTBALL, 5);
      
      events.forEach(event => {
        expect(event.odds.home).toBeGreaterThan(1);
        expect(event.odds.away).toBeGreaterThan(1);
        expect(event.odds.draw).toBeGreaterThan(1);
        expect(typeof event.odds.draw).toBe('number');
      });
    });

    it('should generate valid odds for tennis (without draw)', () => {
      const events = generateMockEventsForSport(SportType.TENNIS, 5);
      
      events.forEach(event => {
        expect(event.odds.home).toBeGreaterThan(1);
        expect(event.odds.away).toBeGreaterThan(1);
        expect(event.odds.draw).toBeUndefined();
      });
    });

    it('should respect status distribution', () => {
      const events = generateMockEventsForSport(SportType.FOOTBALL, 100, {
        upcoming: 1.0,
        live: 0.0,
        finished: 0.0
      });
      
      events.forEach(event => {
        expect(event.status).toBe(EventStatus.UPCOMING);
      });
    });

    it('should generate unique event IDs', () => {
      const events = generateMockEventsForSport(SportType.VOLLEYBALL, 20);
      const ids = events.map(event => event.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(events.length);
    });
  });

  describe('generateAllMockEvents', () => {
    it('should generate the correct total number of events', () => {
      const events = generateAllMockEvents(20);
      expect(events).toHaveLength(20);
    });

    it('should include all sport types', () => {
      const events = generateAllMockEvents(40);
      const sports = new Set(events.map(event => event.sport));
      
      expect(sports.has(SportType.FOOTBALL)).toBe(true);
      expect(sports.has(SportType.BASKETBALL)).toBe(true);
      expect(sports.has(SportType.TENNIS)).toBe(true);
      expect(sports.has(SportType.VOLLEYBALL)).toBe(true);
    });

    it('should distribute events roughly evenly across sports', () => {
      const events = generateAllMockEvents(40);
      const sportCounts = events.reduce((acc, event) => {
        acc[event.sport] = (acc[event.sport] || 0) + 1;
        return acc;
      }, {} as Record<SportType, number>);
      
      // Each sport should have around 10 events (40/4)
      Object.values(sportCounts).forEach(count => {
        expect(count).toBeGreaterThanOrEqual(8);
        expect(count).toBeLessThanOrEqual(12);
      });
    });

    it('should sort events by status priority and date', () => {
      const events = generateAllMockEvents(30);
      
      // Check that upcoming events come before live events
      let foundLive = false;
      let foundFinished = false;
      
      events.forEach(event => {
        if (event.status === EventStatus.LIVE) {
          foundLive = true;
        } else if (event.status === EventStatus.FINISHED) {
          foundFinished = true;
          expect(foundLive).toBe(true); // Should have found live events before finished
        } else if (event.status === EventStatus.UPCOMING && foundLive) {
          // This would be wrong - upcoming should come before live
          expect(false).toBe(true);
        }
      });
    });
  });

  describe('generateTestScenarioEvents', () => {
    it('should generate exactly 5 test scenario events', () => {
      const events = generateTestScenarioEvents();
      expect(events).toHaveLength(5);
    });

    it('should include all required test scenarios', () => {
      const events = generateTestScenarioEvents();
      const ids = events.map(event => event.id);
      
      expect(ids).toContain('test_upcoming_high_odds');
      expect(ids).toContain('test_live_close_odds');
      expect(ids).toContain('test_finished_tennis');
      expect(ids).toContain('test_underdog_scenario');
      expect(ids).toContain('test_starting_soon');
    });

    it('should have events with different statuses', () => {
      const events = generateTestScenarioEvents();
      const statuses = new Set(events.map(event => event.status));
      
      expect(statuses.has(EventStatus.UPCOMING)).toBe(true);
      expect(statuses.has(EventStatus.LIVE)).toBe(true);
      expect(statuses.has(EventStatus.FINISHED)).toBe(true);
    });

    it('should have events with different sports', () => {
      const events = generateTestScenarioEvents();
      const sports = new Set(events.map(event => event.sport));
      
      expect(sports.size).toBeGreaterThan(1);
    });

    it('should have realistic odds values', () => {
      const events = generateTestScenarioEvents();
      
      events.forEach(event => {
        expect(event.odds.home).toBeGreaterThan(1);
        expect(event.odds.away).toBeGreaterThan(1);
        
        if (event.odds.draw !== undefined) {
          expect(event.odds.draw).toBeGreaterThan(1);
        }
      });
    });
  });

  describe('populateStoreWithMockEvents', () => {
    let mockStore: any;

    beforeEach(() => {
      mockStore = {
        setEvents: vi.fn()
      };
    });

    it('should call setEvents on the store with test scenarios', () => {
      populateStoreWithMockEvents(mockStore, true);
      
      expect(mockStore.setEvents).toHaveBeenCalledTimes(1);
      const calledWith = mockStore.setEvents.mock.calls[0][0];
      expect(calledWith).toHaveLength(5); // Test scenarios
    });

    it('should call setEvents on the store with generated events', () => {
      populateStoreWithMockEvents(mockStore, false);
      
      expect(mockStore.setEvents).toHaveBeenCalledTimes(1);
      const calledWith = mockStore.setEvents.mock.calls[0][0];
      expect(calledWith.length).toBeGreaterThan(5); // Generated events
    });
  });

  describe('exported constants', () => {
    it('should export defaultMockEvents with correct length', () => {
      expect(defaultMockEvents).toHaveLength(30);
    });

    it('should export testScenarioEvents with correct length', () => {
      expect(testScenarioEvents).toHaveLength(5);
    });

    it('should have valid event structures in defaultMockEvents', () => {
      defaultMockEvents.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('homeTeam');
        expect(event).toHaveProperty('awayTeam');
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('odds');
        expect(event).toHaveProperty('sport');
        expect(event).toHaveProperty('status');
      });
    });

    it('should have valid event structures in testScenarioEvents', () => {
      testScenarioEvents.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('homeTeam');
        expect(event).toHaveProperty('awayTeam');
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('odds');
        expect(event).toHaveProperty('sport');
        expect(event).toHaveProperty('status');
      });
    });
  });

  describe('edge cases and validation', () => {
    it('should handle zero events request', () => {
      const events = generateMockEventsForSport(SportType.FOOTBALL, 0);
      expect(events).toHaveLength(0);
    });

    it('should handle large number of events', () => {
      const events = generateMockEventsForSport(SportType.BASKETBALL, 1000);
      expect(events).toHaveLength(1000);
      
      // Check that we still get unique IDs
      const ids = events.map(event => event.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(1000);
    });

    it('should generate dates in correct ranges based on status', () => {
      const now = new Date();
      const events = generateMockEventsForSport(SportType.FOOTBALL, 100);
      
      events.forEach(event => {
        if (event.status === EventStatus.FINISHED) {
          expect(event.date.getTime()).toBeLessThan(now.getTime());
        } else if (event.status === EventStatus.UPCOMING) {
          expect(event.date.getTime()).toBeGreaterThan(now.getTime());
        }
        // Live events can be around now, so we don't test them strictly
      });
    });
  });
});