import { useState, useRef, useEffect } from 'react';
import { ArrowIcon } from './ArrowIcon';
import './select.css';

interface SelectOption<T = string> {
  value: T;
  label: string;
}

interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const Select = <T extends string = string>({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  label
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`select-container ${className} ${disabled ? 'disabled' : ''}`}>
      {label && (
        <label className="select-label">{label}</label>
      )}
      <div 
        ref={selectRef}
        className={`select ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="select-trigger">
          <span className="select-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="select-arrow">
            <ArrowIcon />
          </span>
        </div>
        
        {isOpen && (
          <div className="select-dropdown">
            <div className="select-options">
              {options.map((option) => (
                <div
                  key={String(option.value)}
                  className={`select-option ${option.value === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                  {option.value === value && (
                    <span className="select-checkmark">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 