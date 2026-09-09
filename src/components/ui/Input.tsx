import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  rightElement?: React.ReactNode;
}

const renderSlot = (slot: React.ReactNode | React.ComponentType<{ className?: string }> | undefined) => {
  if (!slot) return null;
  if (React.isValidElement(slot)) return slot;
  if (typeof slot === 'function' || (typeof slot === 'object' && slot !== null)) {
    const Comp = slot as React.ComponentType<{ className?: string }>;
    return <Comp className="w-4 h-4 shrink-0" />;
  }
  return slot as React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightElement, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {renderSlot(leftIcon)}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'block w-full rounded-lg text-sm bg-white transition-all',
                'border border-slate-200 text-slate-900 placeholder:text-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
                'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
                leftIcon ? 'pl-9' : 'pl-3',
                rightElement ? 'pr-10' : 'pr-3',
                'py-2',
                error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
                className
              )
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
