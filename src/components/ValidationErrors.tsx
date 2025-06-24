import type { ValidationError } from '../types';

interface ValidationErrorsProps {
  errors: ValidationError[];
}

export const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="validation-errors">
      <h3>Please fix the following errors:</h3>
      <ul className="error-list">
        {errors.map((error, index) => (
          <li key={index} className="error-item">
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}; 