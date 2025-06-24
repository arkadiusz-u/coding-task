import './checkbox.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  disabled = false, 
  className = '' 
}: CheckboxProps) => {
  return (
    <label className={`select-checkbox ${className} ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="checkmark"></span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
}; 