import { SportEvent, SportType, EventStatus } from '../types';

// Team names for different sports
const footballTeams = [
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos', 'Grêmio',
  'Internacional', 'Atlético-MG', 'Cruzeiro', 'Botafogo', 'Vasco', 'Fluminense',
  'Athletico-PR', 'Fortaleza', 'Ceará', 'Bahia'
];

const basketballTeams = [
  'Lakers', 'Warriors', 'Celtics', 'Heat', 'Nets', 'Bucks',
  'Suns', 'Nuggets', 'Clippers', 'Mavericks', 'Sixers', 'Hawks',
  'Bulls', 'Knicks', 'Raptors', 'Spurs'
];

const tennisPlayers = [
  'Novak Djokovic', 'Rafael Nadal', 'Carlos Alcaraz', 'Daniil Medvedev',
  'Stefanos Tsitsipas', 'Alexander Zverev', 'Andrey Rublev', 'Casper Ruud',
  'Taylor Fritz', 'Jannik Sinner', 'Holger Rune', 'Felix Auger-Aliassime',
  'Cameron Norrie', 'Hubert Hurkacz', 'Frances Tiafoe', 'Tommy Paul'
];

const volleyballTeams = [
  'Sada Cruzeiro', 'Taubaté', 'Minas', 'Sesi-SP', 'Corinthians/Guarulhos',
  'Itapetininga', 'Montes Claros', 'Brasília', 'Campinas', 'Osasco',
  'Praia Clube', 'Dentil/Praia Clube', 'Fluminense', 'Botafogo', 'Vôlei Renata', 'Bauru'
];

/**
 * Generates random odds for a sport event
 * @param sport - The sport type to generate odds for
 * @returns Odds object with home, away, and optionally draw odds
 */
function generateOdds(sport: SportType): { home: number; draw?: number; away: number } {
  // Generate base odds between 1.5 and 4.0
  const homeOdds = Number((Math.random() * 2.5 + 1.5).toFixed(2));
  const awayOdds = Number((Math.random() * 2.5 + 1.5).toFixed(2));
  
  // Tennis doesn't have draw, others do
  if (sport === SportType.TENNIS) {
    return {
      home: homeOdds,
      away: awayOdds
    };
  }
  
  // Generate draw odds (usually higher)
  const drawOdds = Number((Math.random() * 2.0 + 2.5).toFixed(2));
  
  return {
    home: homeOdds,
    draw: drawOdds,
    away: awayOdds
  };
}

/**
 * Generates a random date within a specified range
 * @param daysFromNow - Number of days from now (negative for past, positive for future)
 * @param variance - Random variance in hours
 * @returns Date object
 */
function generateDate(daysFromNow: number, variance: number = 24): Date {
  const now = new Date();
  const baseDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
  const varianceMs = (Math.random() - 0.5) * variance * 60 * 60 * 1000;
  return new Date(baseDate.getTime() + varianceMs);
}

/**
 * Selects two random different items from an array
 * @param array - Array to select from
 * @returns Tuple with two different items
 */
function selectTwoRandom<T>(array: T[]): [T, T] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

/**
 * Generates mock sport events for a specific sport
 * @param sport - Sport type to generate events for
 * @param count - Number of events to generate
 * @param statusDistribution - Distribution of event statuses
 * @returns Array of mock sport events
 */
export function generateMockEventsForSport(
  sport: SportType,
  count: number,
  statusDistribution: { upcoming: number; live: number; finished: number } = { upcoming: 0.6, live: 0.2, finished: 0.2 }
): SportEvent[] {
  const events: SportEvent[] = [];
  
  // Get appropriate team/player names for the sport
  let participants: string[];
  switch (sport) {
    case SportType.FOOTBALL:
      participants = footballTeams;
      break;
    case SportType.BASKETBALL:
      participants = basketballTeams;
      break;
    case SportType.TENNIS:
      participants = tennisPlayers;
      break;
    case SportType.VOLLEYBALL:
      participants = volleyballTeams;
      break;
    default:
      participants = footballTeams;
  }
  
  for (let i = 0; i < count; i++) {
    const [homeTeam, awayTeam] = selectTwoRandom(participants);
    
    // Determine status based on distribution
    const rand = Math.random();
    let status: EventStatus;
    let date: Date;
    
    if (rand < statusDistribution.finished) {
      status = EventStatus.FINISHED;
      date = generateDate(-Math.random() * 7 - 0.5, 12); // Past week, at least 12 hours ago
    } else if (rand < statusDistribution.finished + statusDistribution.live) {
      status = EventStatus.LIVE;
      date = generateDate(0, 2); // Around now
    } else {
      status = EventStatus.UPCOMING;
      date = generateDate(Math.random() * 14 + 0.5, 12); // Next 2 weeks, at least 12 hours from now
    }
    
    const event: SportEvent = {
      id: `${sport}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      homeTeam,
      awayTeam,
      date,
      odds: generateOdds(sport),
      sport,
      status
    };
    
    events.push(event);
  }
  
  return events;
}

/**
 * Generates a comprehensive set of mock events for all sports
 * @param totalEvents - Total number of events to generate
 * @returns Array of mock sport events across all sports
 */
export function generateAllMockEvents(totalEvents: number = 50): SportEvent[] {
  const eventsPerSport = Math.floor(totalEvents / 4);
  const remainder = totalEvents % 4;
  
  const events: SportEvent[] = [
    ...generateMockEventsForSport(SportType.FOOTBALL, eventsPerSport + (remainder > 0 ? 1 : 0)),
    ...generateMockEventsForSport(SportType.BASKETBALL, eventsPerSport + (remainder > 1 ? 1 : 0)),
    ...generateMockEventsForSport(SportType.TENNIS, eventsPerSport + (remainder > 2 ? 1 : 0)),
    ...generateMockEventsForSport(SportType.VOLLEYBALL, eventsPerSport)
  ];
  
  // Sort by date (upcoming first, then live, then finished)
  return events.sort((a, b) => {
    // Priority: upcoming > live > finished
    const statusPriority = { upcoming: 0, live: 1, finished: 2 };
    const aPriority = statusPriority[a.status];
    const bPriority = statusPriority[b.status];
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Within same status, sort by date
    return a.date.getTime() - b.date.getTime();
  });
}

/**
 * Generates mock events with specific scenarios for testing
 * @returns Array of mock events covering edge cases
 */
export function generateTestScenarioEvents(): SportEvent[] {
  const now = new Date();
  
  return [
    // Upcoming football match with high odds
    {
      id: 'test_upcoming_high_odds',
      homeTeam: 'Flamengo',
      awayTeam: 'Palmeiras',
      date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      odds: { home: 1.85, draw: 3.20, away: 4.50 },
      sport: SportType.FOOTBALL,
      status: EventStatus.UPCOMING
    },
    
    // Live basketball game with close odds
    {
      id: 'test_live_close_odds',
      homeTeam: 'Lakers',
      awayTeam: 'Warriors',
      date: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      odds: { home: 1.95, away: 1.85 },
      sport: SportType.BASKETBALL,
      status: EventStatus.LIVE
    },
    
    // Finished tennis match
    {
      id: 'test_finished_tennis',
      homeTeam: 'Novak Djokovic',
      awayTeam: 'Rafael Nadal',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      odds: { home: 2.10, away: 1.75 },
      sport: SportType.TENNIS,
      status: EventStatus.FINISHED
    },
    
    // Upcoming volleyball with very high away odds (underdog scenario)
    {
      id: 'test_underdog_scenario',
      homeTeam: 'Sada Cruzeiro',
      awayTeam: 'Taubaté',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      odds: { home: 1.25, draw: 4.50, away: 8.00 },
      sport: SportType.VOLLEYBALL,
      status: EventStatus.UPCOMING
    },
    
    // Event happening very soon (edge case for live transition)
    {
      id: 'test_starting_soon',
      homeTeam: 'Corinthians',
      awayTeam: 'São Paulo',
      date: new Date(now.getTime() + 15 * 60 * 1000), // 15 minutes from now
      odds: { home: 2.30, draw: 3.10, away: 2.80 },
      sport: SportType.FOOTBALL,
      status: EventStatus.UPCOMING
    }
  ];
}

/**
 * Utility function to populate the store with mock events
 * @param store - The betting store instance
 * @param useTestScenarios - Whether to use test scenarios or generate random events
 */
export function populateStoreWithMockEvents(
  store: any,
  useTestScenarios: boolean = false
): void {
  const events = useTestScenarios 
    ? generateTestScenarioEvents()
    : generateAllMockEvents();
    
  store.setEvents(events);
}

// Export default mock events for immediate use
export const defaultMockEvents = generateAllMockEvents(30);
export const testScenarioEvents = generateTestScenarioEvents();