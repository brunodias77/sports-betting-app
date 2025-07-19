import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'live';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  size = 'md', 
  children, 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-danger-100 text-danger-800',
    warning: 'bg-warning-100 text-warning-800',
    live: 'bg-danger-500 text-white animate-pulse'
  };
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  return (
    <span className={classes}>
      {variant === 'live' && (
        <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
      )}
      {children}
    </span>
  );
};

export default Badge;