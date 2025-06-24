import type { Game, BetSelection, ValidationError, SportFilter, DateRange } from './types';

export const formatSportName = (sport: string): string => {
  const sportNames: Record<string, string> = {
    soccer_epl: 'Premier League',
    basketball_nba: 'NBA',
    americanfootball_nfl: 'NFL',
    icehockey_ahl: 'AHL Hockey',
    mma_mixed_martial_arts: 'MMA'
  };
  return sportNames[sport] || sport;
};

export const getBestOdds = (game: Game) => {
  const h2hMarkets = game.bookmakers
    .map(bm => bm.markets.find(m => m.key === 'h2h'))
    .filter(Boolean);

  if (h2hMarkets.length === 0) return null;

  const outcomes = h2hMarkets[0]!.outcomes;
  const homeTeam = game.home_team;
  
  // Extract away team from outcomes (any team that's not home team and not "Draw")
  const awayTeam = outcomes.find(o => o.name !== homeTeam && o.name !== 'Draw')?.name || '';

  return {
    home: outcomes.find(o => o.name === homeTeam)?.price || 0,
    away: outcomes.find(o => o.name === awayTeam)?.price || 0,
    draw: outcomes.find(o => o.name === 'Draw')?.price || 0
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


export const validateBetSelection = (bets: BetSelection[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (bets.length === 0) {
    errors.push({ field: 'general', message: 'At least one game must be selected' });
    return errors;
  }

  bets.forEach((bet, index) => {
    if (!bet.betType) {
      errors.push({ field: `bet-${index}`, message: 'Bet type is required' });
    }
    if (!bet.stake || bet.stake < 1 || bet.stake > 1000) {
      errors.push({ field: `stake-${index}`, message: 'Stake must be between €1 and €1000' });
    }
  });

  return errors;
};

export const calculatePotentialWinnings = (stake: number, odds: number): number => {
  return stake * odds;
};

export const filterGamesBySport = (games: Game[], sportFilter: SportFilter): Game[] => {
  if (sportFilter === 'all') return games;
  return games.filter(game => game.sport === sportFilter);
};

export const filterGamesByDateRange = (games: Game[], dateRange: DateRange): Game[] => {
  if (!dateRange.start && !dateRange.end) return games;
  
  return games.filter(game => {
    const gameDate = new Date(game.commence_time);
    const gameDateOnly = new Date(gameDate.getFullYear(), gameDate.getMonth(), gameDate.getDate());
    
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return gameDateOnly >= startDate && gameDateOnly <= endDate;
    } else if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      return gameDateOnly >= startDate;
    } else if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      return gameDateOnly <= endDate;
    }
    
    return true;
  });
};
