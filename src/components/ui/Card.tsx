import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl border border-slate-200/80 shadow-xs transition-all',
          paddings[padding],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
