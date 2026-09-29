import React from 'react';
import { ArrowLeft, Heart, Search, Flame, Clock, Trophy, Pause } from 'lucide-react';

export type LifeType = 'hearts' | 'magnifiers';

export interface GameHUDProps {
  /** Game title (e.g. 'Audio Blitz', 'Cloze Master', 'Grammar Detective') */
  title: string;
  /** Optional icon or emoji representation */
  icon?: React.ReactNode;
  /** Remaining lives / magnifiers */
  lives?: number;
  /** Max lives allowed */
  maxLives?: number;
  /** Life icon type: hearts (default) or magnifiers */
  lifeType?: LifeType;
  /** Current player score */
  score: number;
  /** Current streak / combo count */
  streak?: number;
  /** Combo multiplier (e.g. 1.2x, 1.5x, 2.0x) */
  comboMultiplier?: number;
  /** Time remaining in seconds */
  timeLeft?: number;
  /** Total time for question/round in seconds */
  totalTime?: number;
  /** Question or word progress (e.g. { current: 3, total: 8 }) */
  progress?: { current: number; total: number };
  /** Triggered when user clicks Back / Exit */
  onExit?: () => void;
  /** Triggered when user clicks Pause */
  onPause?: () => void;
  /** Custom extra styling classes */
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  title,
  icon,
  lives = 3,
  maxLives = 3,
  lifeType = 'hearts',
  score,
  streak = 0,
  comboMultiplier = 1.0,
  timeLeft,
  totalTime = 15,
  progress,
  onExit,
  onPause,
  className = '',
}) => {
  const isTimeCritical = timeLeft !== undefined && timeLeft <= 5;
  const timePercentage = timeLeft !== undefined && totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col gap-2 select-none ${className}`}>
      {/* Top Main Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 border-2 border-slate-700/80 shadow-[0_4px_0_#1e293b] backdrop-blur-md">
        {/* Left: Exit button & Title */}
        <div className="flex items-center gap-2.5">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              aria-label="Thoát trò chơi"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow-[0_2px_0_#1e293b] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            {icon && <span className="text-xl shrink-0">{icon}</span>}
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-black text-slate-100 tracking-wide truncate">
                {title}
              </span>
              {progress && (
                <span className="text-[11px] font-bold text-slate-400 font-mono">
                  Tiến độ: {progress.current}/{progress.total}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Lives (Hearts or Magnifiers) */}
        {lives !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            {Array.from({ length: maxLives }).map((_, i) => {
              const active = i < lives;
              return (
                <span
                  key={i}
                  className={`
                    transition-all duration-300
                    ${active ? 'scale-100' : 'scale-75 opacity-25 grayscale'}
                  `}
                >
                  {lifeType === 'hearts' ? (
                    <Heart
                      className={`w-5 h-5 ${active ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-600'}`}
                    />
                  ) : (
                    <Search
                      className={`w-5 h-5 ${active ? 'text-amber-400 fill-amber-400/20' : 'text-slate-600'}`}
                    />
                  )}
                </span>
              );
            })}
          </div>
        )}

        {/* Right: Score, Streak, & Timer */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Streak Flame Badge */}
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-black animate-combo-bounce">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-400" />
              <span>x{comboMultiplier.toFixed(1)}</span>
            </div>
          )}

          {/* Score Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs md:text-sm font-black">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono">{score.toLocaleString()}</span>
          </div>

          {/* Time Badge (if timeLeft is given) */}
          {timeLeft !== undefined && (
            <div
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs md:text-sm font-black font-mono transition-colors
                ${isTimeCritical
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                  : 'bg-slate-950/80 text-cyan-300 border-slate-800'}
              `}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}

          {/* Pause Button */}
          {onPause && (
            <button
              type="button"
              onClick={onPause}
              aria-label="Tạm dừng"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-[0_2px_0_#1e293b] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Linear Countdown Progress Line (Underneath HUD) */}
      {timeLeft !== undefined && (
        <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className={`
              h-full transition-all duration-300 ease-linear rounded-full
              ${isTimeCritical ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-400'}
            `}
            style={{ width: `${Math.max(0, Math.min(100, timePercentage))}%` }}
          />
        </div>
      )}
    </div>
  );
};
