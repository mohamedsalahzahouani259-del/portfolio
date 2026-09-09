import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ComponentType<{ className?: string }> | React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  color?: 'indigo' | 'emerald' | 'sky' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon: IconInput,
  iconBg,
  iconColor,
  color = 'indigo',
  onClick,
}) => {
  const colorSchemes = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;
  const finalBg = iconBg || scheme.bg;
  const finalText = iconColor || scheme.text;

  const renderIcon = () => {
    if (!IconInput) return null;
    if (React.isValidElement(IconInput)) {
      return IconInput;
    }
    const Comp = IconInput as React.ComponentType<{ className?: string }>;
    return <Comp className="w-5 h-5" />;
  };

  return (
    <Card
      className={clsx(
        'hover:border-slate-300 transition-colors',
        onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 tracking-wider uppercase mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>

          <div className="flex items-center gap-2 mt-2">
            {change && (
              <span
                className={clsx(
                  'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded',
                  change.isPositive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                )}
              >
                {change.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {change.value}
              </span>
            )}
            {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
          </div>
        </div>

        <div
          className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs',
            finalBg,
            finalText
          )}
        >
          {renderIcon()}
        </div>
      </div>
    </Card>
  );
};
