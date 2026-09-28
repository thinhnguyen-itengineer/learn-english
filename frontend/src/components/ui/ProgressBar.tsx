import React from 'react';

export type ProgressColor = 'emerald' | 'purple' | 'amber' | 'blue' | 'gold' | 'rose';
export type ProgressSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressBarProps {
  value: number; // Current value
  max?: number; // Max value (default 100 or 10)
  color?: ProgressColor;
  size?: ProgressSize;
  label?: string;
  showText?: boolean;
  animatedStripes?: boolean;
  headIcon?: React.ReactNode;
  className?: string;
}

const colorStyles: Record<ProgressColor, {
  track: string;
  fill: string;
  glow: string;
  textColor: string;
}> = {
  emerald: {
    track: 'bg-emerald-950/50 border-emerald-800/60',
    fill: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    textColor: 'text-emerald-300',
  },
  purple: {
    track: 'bg-purple-950/50 border-purple-800/60',
    fill: 'bg-gradient-to-r from-purple-600 to-purple-400',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    textColor: 'text-purple-300',
  },
  amber: {
    track: 'bg-amber-950/50 border-amber-800/60',
    fill: 'bg-gradient-to-r from-amber-600 to-amber-400',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    textColor: 'text-amber-300',
  },
  blue: {
    track: 'bg-blue-950/50 border-blue-800/60',
    fill: 'bg-gradient-to-r from-blue-600 to-blue-400',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    textColor: 'text-blue-300',
  },
  gold: {
    track: 'bg-yellow-950/50 border-yellow-800/60',
    fill: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-yellow-300',
    glow: 'shadow-[0_0_16px_rgba(234,179,8,0.6)]',
    textColor: 'text-yellow-300',
  },
  rose: {
    track: 'bg-rose-950/50 border-rose-800/60',
    fill: 'bg-gradient-to-r from-rose-600 to-rose-400',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]',
    textColor: 'text-rose-300',
  },
};

const sizeHeights: Record<ProgressSize, string> = {
  sm: 'h-2 rounded-full',
  md: 'h-3.5 rounded-xl',
  lg: 'h-5 rounded-2xl',
  xl: 'h-7 rounded-2xl',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'emerald',
  size = 'md',
  label,
  showText = false,
  animatedStripes = true,
  headIcon,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const style = colorStyles[color];

  return (
    <div className={`w-full select-none ${className}`}>
      {(label || showText) && (
        <div className="flex justify-between items-center text-xs font-bold mb-1.5 px-0.5">
          {label && <span className="text-slate-300">{label}</span>}
          {showText && (
            <span className={`${style.textColor} font-mono font-black`}>
              {value}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}

      <div
        className={`
          relative w-full overflow-hidden border p-[2px] shadow-inner
          ${style.track}
          ${sizeHeights[size]}
        `}
      >
        {/* Progress fill */}
        <div
          className={`
            h-full rounded-xl transition-all duration-300 ease-out relative
            ${style.fill}
            ${percentage > 0 ? style.glow : ''}
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated subtle gloss shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-xl" />

          {/* Running Head Icon */}
          {headIcon && percentage > 3 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 filter drop-shadow">
              {headIcon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
