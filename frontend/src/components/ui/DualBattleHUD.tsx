import React from 'react';
import { Timer, Flame, WifiOff, Swords } from 'lucide-react';
import { RankBadge, RankTier, RankDivision } from './RankBadge';
import { ProgressBar } from './ProgressBar';

export interface PlayerHUDInfo {
  userId: string;
  displayName: string;
  avatarUrl: string;
  tier: RankTier;
  division?: RankDivision;
  score: number;
  completedPairs: number;
  totalPairs?: number;
  combo: number;
  isDisconnected?: boolean;
  disconnectGraceSeconds?: number;
}

export interface DualBattleHUDProps {
  player: PlayerHUDInfo;
  opponent: PlayerHUDInfo;
  remainingSeconds: number;
  totalSeconds?: number;
  onForfeitClick?: () => void;
  className?: string;
}

export const DualBattleHUD: React.FC<DualBattleHUDProps> = ({
  player,
  opponent,
  remainingSeconds,
  totalSeconds = 60,
  onForfeitClick,
  className = '',
}) => {
  const isTimeCritical = remainingSeconds <= 10;
  const totalPairs = player.totalPairs || 10;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header
      className={`
        w-full bg-slate-900/90 border-b-2 border-slate-800 backdrop-blur-md px-3 py-2.5 sm:px-6 sm:py-3.5
        shadow-lg select-none sticky top-0 z-30
        ${className}
      `}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: You (Player 1) */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={player.avatarUrl}
              alt={player.displayName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 border-emerald-400 bg-slate-800 object-cover shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            />
            {player.combo >= 2 && (
              <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-orange-300 flex items-center gap-0.5 animate-bounce shadow">
                <Flame className="w-2.5 h-2.5 fill-white" />
                x{player.combo}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-slate-100 truncate max-w-[100px] sm:max-w-[140px]">
                {player.displayName} <span className="text-emerald-400 text-[10px]">(Bạn)</span>
              </span>
              <RankBadge tier={player.tier} division={player.division} size="sm" className="hidden sm:inline-flex" />
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm sm:text-lg font-black text-emerald-400 font-mono">
                {player.score.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">pts</span>
              </span>
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
                {player.completedPairs}/{totalPairs}
              </span>
            </div>

            <ProgressBar
              value={player.completedPairs}
              max={totalPairs}
              color="emerald"
              size="sm"
              className="mt-1 max-w-[180px] sm:max-w-[220px]"
            />
          </div>
        </div>

        {/* Center: Timer & Battle VS Badge */}
        <div className="flex flex-col items-center shrink-0 px-1 sm:px-3">
          <div
            className={`
              flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-2xl border-2 font-mono font-black text-sm sm:text-base
              shadow-inner transition-all duration-200
              ${
                isTimeCritical
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-slate-800/90 border-slate-700 text-slate-200'
              }
            `}
          >
            <Timer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTimeCritical ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-[11px] font-black tracking-wider text-amber-400 uppercase">
            <Swords className="w-3 h-3 text-amber-400" />
            <span>1v1 Duel</span>
          </div>
        </div>

        {/* Right Side: Opponent (Player 2) */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 min-w-0 text-right">
          <div className="flex-1 min-w-0 flex flex-col items-end">
            <div className="flex items-center justify-end gap-1.5 flex-wrap">
              <RankBadge tier={opponent.tier} division={opponent.division} size="sm" className="hidden sm:inline-flex" />
              <span className="text-xs sm:text-sm font-black text-slate-100 truncate max-w-[100px] sm:max-w-[140px]">
                {opponent.displayName}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
                {opponent.completedPairs}/{totalPairs}
              </span>
              <span className="text-sm sm:text-lg font-black text-purple-400 font-mono">
                {opponent.score.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">pts</span>
              </span>
            </div>

            <ProgressBar
              value={opponent.completedPairs}
              max={totalPairs}
              color="purple"
              size="sm"
              className="mt-1 max-w-[180px] sm:max-w-[220px]"
            />
          </div>

          <div className="relative shrink-0">
            <img
              src={opponent.avatarUrl}
              alt={opponent.displayName}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 border-purple-500 bg-slate-800 object-cover
                shadow-[0_0_12px_rgba(168,85,247,0.3)]
                ${opponent.isDisconnected ? 'grayscale opacity-60' : ''}
              `}
            />

            {opponent.combo >= 2 && !opponent.isDisconnected && (
              <span className="absolute -bottom-1 -left-1 bg-purple-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-purple-300 flex items-center gap-0.5 animate-bounce shadow">
                <Flame className="w-2.5 h-2.5 fill-white" />
                x{opponent.combo}
              </span>
            )}

            {opponent.isDisconnected && (
              <span
                className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-rose-300 flex items-center gap-0.5 animate-pulse"
                title={`Đối thủ rớt mạng (${opponent.disconnectGraceSeconds ?? 15}s)`}
              >
                <WifiOff className="w-2.5 h-2.5" />
                {opponent.disconnectGraceSeconds ?? 15}s
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
