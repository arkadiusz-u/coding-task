import { useState, useEffect } from 'react';
import { GameCard } from './components/GameCard';
import { FilterBar } from './components/FilterBar';
import { ValidationErrors } from './components/ValidationErrors';
import { Sidebar } from './components/Sidebar';
import { Loader } from './components/Loader';
import type { Game, BetSelection, SportFilter, ValidationError, DateRange } from './types';
import { filterGamesBySport, filterGamesByDateRange, validateBetSelection } from './utils';
import { fetchGames, submitBets } from './api';

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());
  const [betSelections, setBetSelections] = useState<Map<number, BetSelection>>(new Map());
  const [sportFilter, setSportFilter] = useState<SportFilter>('all');
  const [dateRange, setDateRange] = useState<DateRange>({ start: '', end: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    let filtered = filterGamesBySport(games, sportFilter);
    filtered = filterGamesByDateRange(filtered, dateRange);
    setFilteredGames(filtered);
  }, [games, sportFilter, dateRange]);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      const fetchedGames = await fetchGames();
      setGames(fetchedGames);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSelection = (gameId: number, selected: boolean) => {
    const newSelectedGames = new Set(selectedGames);
    const newBetSelections = new Map(betSelections);

    if (selected) {
      newSelectedGames.add(gameId);
    } else {
      newSelectedGames.delete(gameId);
      newBetSelections.delete(gameId);
    }

    setSelectedGames(newSelectedGames);
    setBetSelections(newBetSelections);
    setValidationErrors([]);
    setSubmitMessage(null);
  };

  const handleBetChange = (gameId: number, betType: 'home' | 'away' | 'draw', stake: number) => {
    const newBetSelections = new Map(betSelections);
    newBetSelections.set(gameId, { gameId, betType, stake });
    setBetSelections(newBetSelections);
    setValidationErrors([]);
    setSubmitMessage(null);
  };

  const handleRemoveGame = (gameId: number) => {
    const newSelectedGames = new Set(selectedGames);
    const newBetSelections = new Map(betSelections);
    
    newSelectedGames.delete(gameId);
    newBetSelections.delete(gameId);
    
    setSelectedGames(newSelectedGames);
    setBetSelections(newBetSelections);
    setValidationErrors([]);
    setSubmitMessage(null);
  };

  const handleSubmit = async () => {
    const bets = Array.from(betSelections.values());
    const errors = validateBetSelection(bets);

    if (!termsAccepted) {
      errors.push({ field: 'terms', message: 'You must accept the terms and conditions' });
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await submitBets(bets);
      setSubmitMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });

      if (result.success) {
        setSelectedGames(new Set());
        setBetSelections(new Map());
        setTermsAccepted(false);
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalStake = () => {
    return Array.from(betSelections.values()).reduce((total, bet) => total + bet.stake, 0);
  };

  const getSelectedGamesList = () => {
    return games.filter(game => selectedGames.has(game.id));
  };

  if (isLoading) {
    return <Loader text="Loading games..." />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sports Betting</h1>
        <p>Select your games and place your bets</p>
      </header>

      <div className="app-layout">
        <main className="app-main">
          <FilterBar
            sportFilter={sportFilter}
            onSportFilterChange={setSportFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            totalGames={filteredGames.length}
            selectedGames={selectedGames.size}
          />

          {validationErrors.length > 0 && (
            <ValidationErrors errors={validationErrors} />
          )}

          {submitMessage && (
            <div className={`submit-message ${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}

          <div className="games-grid">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                isSelected={selectedGames.has(game.id)}
                onSelect={handleGameSelection}
              />
            ))}
          </div>

          {filteredGames.length === 0 && !isLoading && (
            <div className="no-games">
              <p>No games available for the selected sport.</p>
            </div>
          )}
        </main>

        <Sidebar
          selectedGames={getSelectedGamesList()}
          betSelections={betSelections}
          onBetChange={handleBetChange}
          onRemoveGame={handleRemoveGame}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          totalStake={getTotalStake()}
        />
      </div>
    </div>
  );
}

export default App;
