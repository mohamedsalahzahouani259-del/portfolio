import React from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: React.ReactNode | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
      const Comp = icon as unknown as React.ComponentType<{ className?: string }>;
      return <Comp className="w-7 h-7" />;
    }
    return icon as React.ReactNode;
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-dashed border-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
        {renderIcon()}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="secondary" size="md">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
