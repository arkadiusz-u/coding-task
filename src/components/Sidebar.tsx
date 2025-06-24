import type { Game, BetSelection } from '../types';
import { Checkbox } from './ui/checkbox';
import { SelectedGamesList } from './SelectedGamesList';
import { Button } from './ui/button';

interface SidebarProps {
  selectedGames: Game[];
  betSelections: Map<number, BetSelection>;
  onBetChange: (gameId: number, betType: 'home' | 'away' | 'draw', stake: number) => void;
  onRemoveGame: (gameId: number) => void;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  totalStake: number;
}

export const Sidebar = ({ 
  selectedGames, 
  betSelections, 
  onBetChange, 
  onRemoveGame,
  termsAccepted,
  onTermsChange,
  onSubmit,
  isSubmitting,
  totalStake
}: SidebarProps) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Selected Games ({selectedGames.length})</h3>
        <div className="total-stake">
          Total: €{totalStake.toFixed(2)}
        </div>
      </div>
      
      <div className="sidebar-content">
        <SelectedGamesList
          selectedGames={selectedGames}
          betSelections={betSelections}
          onBetChange={onBetChange}
          onRemoveGame={onRemoveGame}
        />
      </div>

      <div className="sidebar-footer">
        <div className="terms-section">
          <Checkbox
            checked={termsAccepted}
            onChange={onTermsChange}
            label="I accept the Terms & Conditions"
            className="terms-checkbox"
          />
        </div>

        <Button
          className="submit-button"
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting || !termsAccepted || selectedGames.length === 0}
        >
          {isSubmitting ? 'Submitting...' : `Place Bets (€${totalStake.toFixed(2)})`}
        </Button>
      </div>
    </div>
  );
}; 