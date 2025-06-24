export interface Outcome {
  name: string;
  price: number;
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Game {
  id: number;
  sport: string;
  commence_time: string;
  home_team: string;
  bookmakers: Bookmaker[];
}

export interface BetSelection {
  gameId: number;
  betType: 'home' | 'away' | 'draw';
  stake: number;
}

export interface BetSubmission {
  bets: BetSelection[];
  termsAccepted: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type SportFilter = 'all' | 'soccer_epl' | 'basketball_nba' | 'americanfootball_nfl' | 'icehockey_ahl' | 'mma_mixed_martial_arts';

export interface DateRange {
  start: string; // ISO date string
  end: string;   // ISO date string
} 