import dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import axios from 'axios';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('❌ API_KEY is not set. Please set the API_KEY environment variable or use a .env file.');
  process.exit(1);
}

const SPORTS = [
  'soccer_epl',
  'basketball_nba',
  'americanfootball_nfl',
  'icehockey_ahl',
  'mma_mixed_martial_arts'
];

const REGIONS = 'uk';
const MARKETS = 'h2h';

const GAMES_PER_SPORT = 3;
const FILE_PATH = join(__dirname, '..', 'db.json');

const fetchAllGames = async () => {
  const allGames = [];
  let nextId = 1;

  for (const sport of SPORTS) {
    try {
      console.log(`📡 Fetching ${sport}...`);
      
      const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`, {
        params: {
          regions: REGIONS,
          markets: MARKETS,
          apiKey: API_KEY
        }
      });

      console.log(`Found ${response.data.length} games for ${sport}`);

      const sportGames = response.data.slice(0, GAMES_PER_SPORT).map((game) => ({
        id: nextId++,
        sport,
        commence_time: game.commence_time,
        home_team: game.home_team,
        bookmakers: game.bookmakers
      }));

      allGames.push(...sportGames);
    } catch (err) {
      console.error(`❌ Error fetching data for sport "${sport}": ${err.message}`);
    }
  }

  const dbStructure = {
    games: allGames,
    bets: []
  };

  fs.writeFileSync(FILE_PATH, JSON.stringify(dbStructure, null, 2));
  console.log(`Saved ${allGames.length} games to db.json with initial structure for json-server`);
};

fetchAllGames();