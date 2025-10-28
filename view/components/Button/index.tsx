import React from 'react';
import './styles.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'medium',
  children,
  className,
  ...props
}) => {
  return (
    <button 
      className={`button ${variant} ${size} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};