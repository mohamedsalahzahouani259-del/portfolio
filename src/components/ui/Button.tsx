import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  rightIcon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
}

const renderSlot = (slot: React.ReactNode | React.ComponentType<{ className?: string }> | undefined) => {
  if (!slot) return null;
  if (React.isValidElement(slot)) {
    return slot;
  }
  if (typeof slot === 'function' || (typeof slot === 'object' && slot !== null)) {
    const Comp = slot as React.ComponentType<{ className?: string }>;
    return <Comp className="w-4 h-4 shrink-0" />;
  }
  return slot as React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  icon: IconComponent,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-xs shadow-indigo-600/20 border border-transparent',
    secondary:
      'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 focus:ring-indigo-500 shadow-2xs',
    outline:
      'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-indigo-500',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 border border-transparent',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-xs shadow-rose-600/20 border border-transparent',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-xs shadow-emerald-600/20 border border-transparent',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 gap-1.5',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  };

  const renderIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin shrink-0" />;
    return renderSlot(IconComponent || leftIcon);
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {renderIcon()}
      {children}
      {!isLoading && renderSlot(rightIcon)}
    </button>
  );
};
