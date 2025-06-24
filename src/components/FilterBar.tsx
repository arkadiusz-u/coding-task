import type { SportFilter, DateRange } from '../types';
import { Select } from './ui/select';
import { DateRangePicker } from './ui/date-range-picker';
import { formatSportName } from '../utils';

interface FilterBarProps {
  sportFilter: SportFilter;
  onSportFilterChange: (filter: SportFilter) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  totalGames: number;
  selectedGames: number;
}

const sportOptions = [
  { value: 'all' as SportFilter, label: formatSportName('all') },
  { value: 'soccer_epl' as SportFilter, label: formatSportName('soccer_epl') },
  { value: 'basketball_nba' as SportFilter, label: formatSportName('basketball_nba') },
  { value: 'americanfootball_nfl' as SportFilter, label: formatSportName('americanfootball_nfl') },
  { value: 'icehockey_ahl' as SportFilter, label: formatSportName('icehockey_ahl') },
  { value: 'mma_mixed_martial_arts' as SportFilter, label: formatSportName('mma_mixed_martial_arts') }
];

export const FilterBar = ({ 
  sportFilter, 
  onSportFilterChange, 
  dateRange,
  onDateRangeChange,
  totalGames, 
  selectedGames 
}: FilterBarProps) => {
  return (
    <div className="filter-bar">
      <h3 className="filter-label">Filters:</h3>
      <div className="filter-controls">
        <div className="sport-filter">
          <Select
            options={sportOptions}
            value={sportFilter}
            onChange={onSportFilterChange}
            placeholder="Select sport"
          />
        </div>
        <div className="date-filter">
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Select date range"
          />
        </div>
      </div>
      
      <div className="game-stats">
        <span className="total-games">Total games: {totalGames}</span>
        <span className="selected-games">Selected: {selectedGames}</span>
      </div>
    </div>
  );
}; 