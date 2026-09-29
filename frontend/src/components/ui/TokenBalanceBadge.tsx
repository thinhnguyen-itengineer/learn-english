import React from 'react';
import { Coins, AlertCircle } from 'lucide-react';

export interface TokenBalanceBadgeProps {
  balance: number;
  size?: 'sm' | 'md' | 'lg';
  showSoftCap?: boolean;
  dailyTokensEarned?: number;
  dailySoftCap?: number;
  recentDelta?: number | null;
  onClick?: () => void;
  className?: string;
}

export const TokenBalanceBadge: React.FC<TokenBalanceBadgeProps> = ({
  balance,
  size = 'md',
  showSoftCap = false,
  dailyTokensEarned = 0,
  dailySoftCap = 600,
  recentDelta = null,
  onClick,
  className = '',
}) => {
  const isCapReached = dailyTokensEarned >= dailySoftCap;
  const capPercent = Math.min(100, Math.round((dailyTokensEarned / dailySoftCap) * 100));

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1.5 rounded-xl border',
      coin: 'w-3.5 h-3.5',
      number: 'text-xs font-black',
    },
    md: {
      container: 'px-3 py-1.5 text-sm gap-2 rounded-2xl border-2',
      coin: 'w-4 h-4',
      number: 'text-sm font-black',
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2.5 rounded-2xl border-2',
      coin: 'w-5 h-5',
      number: 'text-base font-black',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className={`
          relative inline-flex items-center justify-center font-black tracking-wide
          bg-gradient-to-b from-amber-500/20 via-yellow-950/40 to-amber-950/80
          border-amber-500/80 text-amber-300 shadow-[0_3px_0_#78350f]
          active:shadow-none active:translate-y-[3px] transition-all
          ${currentSize.container}
          ${onClick ? 'cursor-pointer hover:border-amber-400 hover:brightness-110' : 'cursor-default'}
        `}
      >
        <span className="relative flex items-center justify-center shrink-0">
          <Coins className={`${currentSize.coin} text-yellow-400 drop-shadow-[0_1px_4px_rgba(234,179,8,0.8)] animate-coin-shine`} />
        </span>
        
        <span className={`${currentSize.number} text-yellow-300 drop-shadow-sm tabular-nums`}>
          {balance.toLocaleString('en-US')}
        </span>
        <span className="text-[10px] uppercase font-bold text-amber-400/80">Tokens</span>

        {/* Delta floating indicator */}
        {recentDelta !== null && recentDelta !== 0 && (
          <span
            className={`
              absolute -top-3 -right-2 px-1.5 py-0.2 text-[10px] font-black rounded-full shadow-md animate-pop-bounce
              ${recentDelta > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}
            `}
          >
            {recentDelta > 0 ? `+${recentDelta}` : recentDelta}
          </span>
        )}
      </button>

      {/* Optional Daily Soft-Cap Progress Meter */}
      {showSoftCap && (
        <div className="mt-1.5 flex flex-col gap-1 w-full max-w-[140px]">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>Hôm nay</span>
            <span className={isCapReached ? 'text-amber-400 font-extrabold' : 'text-slate-300'}>
              {dailyTokensEarned}/{dailySoftCap}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isCapReached ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
              }`}
              style={{ width: `${capPercent}%` }}
            />
          </div>
          {isCapReached && (
            <div className="flex items-center gap-1 text-[9px] text-amber-400 font-medium">
              <AlertCircle className="w-2.5 h-2.5 shrink-0" />
              <span>Đạt trần (giảm 20% token)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
