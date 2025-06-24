import './button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  title
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      {children && <span className="btn-content">{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
}; 