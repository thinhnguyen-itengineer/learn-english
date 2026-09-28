import React, { useEffect, useState } from 'react';
import { Search, X, Swords, Zap } from 'lucide-react';
import { Button } from './Button';
import { RankBadge, RankTier, RankDivision } from './RankBadge';

export interface MatchmakingPlayer {
  displayName: string;
  avatarUrl: string;
  tier: RankTier;
  division?: RankDivision;
  trophy: number;
}

export interface MatchmakingRadarProps {
  player: MatchmakingPlayer;
  opponent?: MatchmakingPlayer | null;
  status: 'searching' | 'matched' | 'countdown';
  countdownValue?: number; // 3, 2, 1
  elapsedSeconds?: number;
  onCancel?: () => void;
  className?: string;
}

export const MatchmakingRadar: React.FC<MatchmakingRadarProps> = ({
  player,
  opponent,
  status,
  countdownValue = 3,
  elapsedSeconds = 0,
  onCancel,
  className = '',
}) => {
  const [internalSeconds, setInternalSeconds] = useState(elapsedSeconds);

  useEffect(() => {
    if (status !== 'searching') return;
    const interval = setInterval(() => {
      setInternalSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const currentSeconds = elapsedSeconds || internalSeconds;

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = (seconds: number) => {
    if (seconds <= 5) return 'Đang tìm kiếm đối thủ gần Rank (±50 Trophy)...';
    if (seconds <= 10) return 'Mở rộng phạm vi tìm kiếm (±100 Trophy)...';
    if (seconds <= 15) return 'Mở rộng phạm vi tìm kiếm (±200 Trophy)...';
    return 'Đang khởi tạo trận đấu đối kháng tối ưu...';
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl
        select-none animate-in fade-in duration-200
        ${className}
      `}
    >
      <div className="relative w-full max-w-lg bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {status === 'searching' ? (
          /* ================= SEARCHING RADAR STATE ================= */
          <div className="flex flex-col items-center w-full my-4">
            {/* Header info */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold mb-6">
              <Search className="w-3.5 h-3.5 animate-pulse" />
              <span>Đang Tìm Kiếm Trận Đấu 1v1</span>
            </div>

            {/* Concentric Radar Animation Container */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
              {/* Concentric Rings */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20" />
              <div className="absolute inset-6 rounded-full border border-blue-500/30" />
              <div className="absolute inset-12 rounded-full border border-blue-500/40" />

              {/* Pulsing wave expanding */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping duration-1000 opacity-30" />

              {/* Rotating Radar Sweep Beam */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-radar-sweep">
                <div
                  className="w-1/2 h-1/2 origin-bottom-right"
                  style={{
                    background: 'conic-gradient(from 0deg at 100% 100%, rgba(6, 182, 212, 0.4) 0deg, transparent 60deg)',
                  }}
                />
              </div>

              {/* Center Player Avatar */}
              <div className="relative z-10">
                <img
                  src={player.avatarUrl}
                  alt={player.displayName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-3 border-cyan-400 object-cover shadow-[0_0_25px_rgba(6,182,212,0.6)] bg-slate-800"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Bạn
                </span>
              </div>
            </div>

            {/* Timer and Status text */}
            <div className="space-y-2 mb-8">
              <p className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 tracking-wider">
                {formatTimer(currentSeconds)}
              </p>
              <p className="text-sm font-semibold text-slate-300 max-w-sm px-2 animate-pulse">
                {getStatusText(currentSeconds)}
              </p>
            </div>

            {/* Cancel Button */}
            {onCancel && (
              <Button
                variant="danger"
                size="md"
                onClick={onCancel}
                leftIcon={<X className="w-4 h-4" />}
                className="min-w-[160px]"
              >
                Hủy Tìm Trận
              </Button>
            )}
          </div>
        ) : (
          /* ================= MATCH FOUND & COUNTDOWN STATE ================= */
          <div className="flex flex-col items-center w-full my-4 animate-in zoom-in-95 duration-300">
            {/* Header Alert */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black uppercase tracking-wider mb-6 animate-bounce">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>Đã Tìm Thấy Đối Thủ!</span>
            </div>

            {/* 1v1 Confrontation Dual Avatars with VS Badge */}
            <div className="flex items-center justify-between w-full max-w-md my-4 px-2">
              {/* Player 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative mb-2">
                  <img
                    src={player.avatarUrl}
                    alt={player.displayName}
                    className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl border-3 border-emerald-400 object-cover shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-slate-800"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <RankBadge tier={player.tier} division={player.division} size="sm" />
                  </div>
                </div>
                <p className="text-sm sm:text-base font-black text-slate-100 truncate max-w-[120px] mt-2">
                  {player.displayName}
                </p>
                <p className="text-xs text-emerald-400 font-mono font-bold">
                  {player.trophy.toLocaleString()} Cúp
                </p>
              </div>

              {/* VS Center Badge */}
              <div className="flex flex-col items-center px-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse border-2 border-yellow-300">
                  VS
                </div>
                <Swords className="w-4 h-4 text-amber-400 mt-1" />
              </div>

              {/* Player 2 (Opponent) */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative mb-2">
                  <img
                    src={opponent?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=opponent'}
                    alt={opponent?.displayName || 'Đối thủ'}
                    className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl border-3 border-purple-500 object-cover shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-slate-800"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <RankBadge
                      tier={opponent?.tier || 'Silver'}
                      division={opponent?.division || 'I'}
                      size="sm"
                    />
                  </div>
                </div>
                <p className="text-sm sm:text-base font-black text-slate-100 truncate max-w-[120px] mt-2">
                  {opponent?.displayName || 'Đối Thủ'}
                </p>
                <p className="text-xs text-purple-400 font-mono font-bold">
                  {(opponent?.trophy || 0).toLocaleString()} Cúp
                </p>
              </div>
            </div>

            {/* Countdown Big Display */}
            <div className="my-6">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                Trận đấu bắt đầu sau
              </p>
              <div className="text-5xl sm:text-6xl font-black text-amber-400 font-mono animate-pop-bounce tracking-widest drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
                {countdownValue > 0 ? countdownValue : 'CHIẾN!'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
