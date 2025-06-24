import type { Game } from '../types';
import { getBestOdds, formatDate, formatSportName } from '../utils';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onSelect: (gameId: number, selected: boolean) => void;
}

export const GameCard = ({ game, isSelected, onSelect }: GameCardProps) => {
  const odds = getBestOdds(game);
  const homeTeam = game.home_team;
  const awayTeam = odds ? 
    (odds.away > 0 ? 
      (game.bookmakers[0]?.markets[0]?.outcomes.find(o => o.name !== homeTeam && o.name !== 'Draw')?.name || '') : 
      ''
    ) : '';

  const handleSelectionChange = (selected: boolean) => {
    onSelect(game.id, selected);
  };

  if (!odds) {
    return (
      <div className="game-card disabled">
        <div className="game-header">
          <Badge variant="primary">{formatSportName(game.sport)}</Badge>
          <span className="game-time">{formatDate(game.commence_time)}</span>
        </div>
        <div className="teams">
          <span>{homeTeam} vs {awayTeam}</span>
        </div>
        <div className="no-odds">No odds available</div>
      </div>
    );
  }

  return (
    <div className={`game-card ${isSelected ? 'selected' : ''}`}>
      <div className="game-header">
        <Badge variant="primary">{formatSportName(game.sport)}</Badge>
        <span className="game-time">{formatDate(game.commence_time)}</span>
        <Checkbox
          checked={isSelected}
          onChange={handleSelectionChange}
        />
      </div>

      <div className="teams">
        <div className="team home">{homeTeam}</div>
        <div className="vs">vs</div>
        <div className="team away">{awayTeam}</div>
      </div>

      <div className="odds-preview">
        <div className="odds-grid">
          <div className="odds-item">
            <span className="team-name">{homeTeam}</span>
            <span className="odds">{odds.home}</span>
          </div>
          
          {odds.draw > 0 && (
            <div className="odds-item">
              <span className="team-name">Draw</span>
              <span className="odds">{odds.draw}</span>
            </div>
          )}
          
          <div className="odds-item">
            <span className="team-name">{awayTeam}</span>
            <span className="odds">{odds.away}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 