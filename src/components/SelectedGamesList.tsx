import type { Game, BetSelection } from '../types';
import { SelectedGameCard } from './SelectedGameCard';

interface SelectedGamesListProps {
  selectedGames: Game[];
  betSelections: Map<number, BetSelection>;
  onBetChange: (gameId: number, betType: 'home' | 'away' | 'draw', stake: number) => void;
  onRemoveGame: (gameId: number) => void;
}

export const SelectedGamesList = ({ 
  selectedGames, 
  betSelections, 
  onBetChange, 
  onRemoveGame 
}: SelectedGamesListProps) => {
  if (selectedGames.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎯</div>
        <p>No games selected</p>
        <span>Select games from the main grid to start betting</span>
      </div>
    );
  }

  return (
    <div className="selected-games-list">
      {selectedGames.map(game => {
        const betSelection = betSelections.get(game.id);
        
        return (
          <SelectedGameCard
            key={game.id}
            game={game}
            betSelection={betSelection}
            onBetChange={onBetChange}
            onRemoveGame={onRemoveGame}
          />
        );
      })}
    </div>
  );
}; 