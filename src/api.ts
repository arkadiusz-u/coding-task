import type { BetSelection, Game } from "./types";

export const fetchGames = async (): Promise<Game[]> => {
    try {
      const response = await fetch('http://localhost:3001/games');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  };

  export const submitBets = async (bets: BetSelection[]): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('http://localhost:3001/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bets }),
      });
  
      if (response.ok) {
        return { success: true, message: 'Bets submitted successfully!' };
      } else {
        return { success: false, message: 'Failed to submit bets. Please try again.' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };
  