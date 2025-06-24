import { useState, useRef, useEffect } from 'react';
import './date-range-picker.css';
import { ArrowIcon } from './ArrowIcon';

interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (range: { start: string; end: string }) => void;
  className?: string;
  placeholder?: string;
}

export const DateRangePicker = ({ 
  value, 
  onChange, 
  className = '',
  placeholder = 'Select date range'
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState<'start' | 'end'>('start');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const handleDateChange = (field: 'start' | 'end', dateValue: string) => {
    const newRange = { ...value, [field]: dateValue };
    
    if (field === 'start' && activeField === 'start') {
      setActiveField('end');
    }
    
    onChange(newRange);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const displayValue = value.start && value.end 
    ? `${formatDate(value.start)} - ${formatDate(value.end)}`
    : placeholder;

  return (
    <div className={`date-range-picker${isOpen ? ' open' : ''} ${className}`} ref={containerRef}>
      <div 
        className="date-range-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="date-range-picker-value">
          {displayValue}
        </span>
        <ArrowIcon />
      </div>

      {isOpen && (
        <div className="date-range-picker-dropdown">
          <div className="date-range-picker-header">
            <span className="date-range-picker-label">
              {activeField === 'start' ? 'Start date' : 'End date'}
            </span>
          </div>
          
          <div className="date-range-picker-inputs">
            <div className="date-range-picker-input-group">
              <label htmlFor="start-date">Start date:</label>
              <input
                id="start-date"
                type="date"
                value={value.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                onFocus={() => setActiveField('start')}
                className={activeField === 'start' ? 'active' : ''}
              />
            </div>
            
            <div className="date-range-picker-input-group">
              <label htmlFor="end-date">End date:</label>
              <input
                id="end-date"
                type="date"
                value={value.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                onFocus={() => setActiveField('end')}
                className={activeField === 'end' ? 'active' : ''}
                min={value.start}
              />
            </div>
          </div>

          <div className="date-range-picker-actions">
            <button 
              className="date-range-picker-clear"
              onClick={() => onChange({ start: '', end: '' })}
            >
              Clear
            </button>
            <button 
              className="date-range-picker-apply"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 