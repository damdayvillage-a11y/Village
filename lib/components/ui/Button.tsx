'use client';

import React, { forwardRef } from 'react';
// import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  asChild?: boolean;
  children?: React.ReactNode;
}

const getButtonClasses = ({ variant, size, className }: { variant: string; size: string; className?: string }) => {
  const baseClasses = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'active:scale-[0.98] motion-reduce:active:scale-100'
  ];

  const variants = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-400 text-white hover:bg-secondary-500 focus:ring-secondary-400',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    destructive: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return cn(baseClasses, variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className);
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    loading = false, 
    icon, 
    iconPosition = 'left',
    asChild = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    // If asChild is true, just render children as-is for now
    // TODO: Implement proper polymorphic component pattern
    if (asChild) {
      return children as React.ReactElement;
    }

    const isDisabled = disabled || loading;

    // const { onAnimationStart, onAnimationEnd, ...restProps } = props;

    return (
      <button
        ref={ref}
        className={getButtonClasses({ variant, size, className })}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };