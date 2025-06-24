import type { Game, BetSelection } from '../types';
import { getBestOdds, calculatePotentialWinnings, formatSportName } from '../utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface SelectedGameCardProps {
  game: Game;
  betSelection?: BetSelection;
  onBetChange?: (gameId: number, betType: 'home' | 'away' | 'draw', stake: number) => void;
  onRemoveGame: (gameId: number) => void;
}

export const SelectedGameCard = ({ 
  game, 
  betSelection,
  onBetChange,
  onRemoveGame 
}: SelectedGameCardProps) => {
  const odds = getBestOdds(game);
  const homeTeam = game.home_team;
  const awayTeam = odds ? 
    (odds.away > 0 ? 
      (game.bookmakers[0]?.markets[0]?.outcomes.find(o => o.name !== homeTeam && o.name !== 'Draw')?.name || '') : 
      ''
    ) : '';

  return (
    <div className="selected-game-card">
      <div className="game-header">
        <div className="game-info">
          <Badge variant="primary">{formatSportName(game.sport)}</Badge>
          <span className="game-time">{game.commence_time}</span>
        </div>
        <Button
          variant="danger"
          icon="×"
          onClick={() => onRemoveGame(game.id)}
          title="Remove game"
          className="remove-game-btn"
        />
      </div>
      
      <div className="teams">
        <span className="home-team">{homeTeam}</span>
        <span className="vs">vs</span>
        <span className="away-team">{awayTeam}</span>
      </div>

      {odds && onBetChange && (
        <div className="bet-config">
          <div className="odds-buttons">
            <button
              className={`odds-btn ${betSelection?.betType === 'home' ? 'selected' : ''}`}
              onClick={() => onBetChange(game.id, 'home', betSelection?.stake || 10)}
            >
              <span className="team-name">{homeTeam}</span>
              <span className="odds">{odds.home}</span>
            </button>
            
            {odds.draw > 0 && (
              <button
                className={`odds-btn ${betSelection?.betType === 'draw' ? 'selected' : ''}`}
                onClick={() => onBetChange(game.id, 'draw', betSelection?.stake || 10)}
              >
                <span className="team-name">Draw</span>
                <span className="odds">{odds.draw}</span>
              </button>
            )}
            
            <button
              className={`odds-btn ${betSelection?.betType === 'away' ? 'selected' : ''}`}
              onClick={() => onBetChange(game.id, 'away', betSelection?.stake || 10)}
            >
              <span className="team-name">{awayTeam}</span>
              <span className="odds">{odds.away}</span>
            </button>
          </div>

          {betSelection?.betType && (
            <div className="stake-input-group">
              <label>
                Stake (€):
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={betSelection.stake}
                  onChange={(e) => onBetChange(game.id, betSelection.betType, Number(e.target.value))}
                  className="stake-input"
                />
              </label>
              <div className="potential-winnings">
                Potential: €{calculatePotentialWinnings(betSelection.stake, odds[betSelection.betType]).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 