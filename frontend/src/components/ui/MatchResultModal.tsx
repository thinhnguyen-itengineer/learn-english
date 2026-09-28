import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Flame, Shield, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { RankBadge, RankTier, RankDivision, tierConfig } from './RankBadge';

export interface MatchResultData {
  isWinner: boolean;
  isDraw?: boolean;
  finishReason?: 'NormalCompletion' | 'Timeout' | 'Forfeit' | 'DisconnectTimeout';
  myFinalScore: number;
  opponentFinalScore: number;
  trophyChange: number;
  newTrophy: number;
  newTier: RankTier;
  newDivision?: RankDivision;
  earnedXp: number;
  winStreak: number;
  isPromotion?: boolean;
  isDemoted?: boolean;
  isShieldUsed?: boolean;
}

export interface MatchResultModalProps {
  data: MatchResultData;
  onPlayAgain?: () => void;
  onBackToLobby?: () => void;
  className?: string;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  data,
  onPlayAgain,
  onBackToLobby,
  className = '',
}) => {
  const {
    isWinner,
    isDraw = false,
    myFinalScore,
    opponentFinalScore,
    trophyChange,
    newTrophy,
    newTier,
    newDivision,
    earnedXp,
    winStreak,
    isPromotion,
    isShieldUsed,
  } = data;

  // Counter ticker effect for Trophy display
  const startTrophy = Math.max(0, newTrophy - trophyChange);
  const [displayedTrophy, setDisplayedTrophy] = useState(startTrophy);

  useEffect(() => {
    // Launch fireworks confetti on Victory!
    if (isWinner) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#facc15', '#10b981', '#3b82f6', '#ec4899', '#f97316'],
        });
      } catch (e) {
        // Fallback gracefully if canvas is unavailable
      }
    }

    // Number ticker animation
    const duration = 1200; // ms
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = (newTrophy - startTrophy) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayedTrophy(newTrophy);
        clearInterval(timer);
      } else {
        setDisplayedTrophy(Math.round(startTrophy + increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isWinner, newTrophy, startTrophy, trophyChange]);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl
        select-none animate-in fade-in duration-200 overflow-y-auto
        ${className}
      `}
    >
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center my-auto">
        {/* Glow backdrop */}
        {isWinner ? (
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        ) : (
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Promotion Announcement Alert Banner */}
        {isPromotion && (
          <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-yellow-950 font-black text-xs py-2 px-4 rounded-2xl mb-4 uppercase tracking-widest shadow-lg flex items-center justify-center gap-1.5 animate-bounce">
            <Sparkles className="w-4 h-4 fill-yellow-950" />
            <span>Chúc Mừng! Bạn Đã Thăng Hạng!</span>
            <Sparkles className="w-4 h-4 fill-yellow-950" />
          </div>
        )}

        {/* Main Status Header Icon & Title */}
        <div className="my-2">
          {isWinner ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-500/20 border-3 border-yellow-400 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)] mb-3 animate-pop-bounce">
                <Trophy className="w-12 h-12 text-yellow-400 fill-yellow-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-yellow-300 tracking-tight drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)]">
                CHIẾN THẮNG!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">
                Phản xạ từ vựng xuất sắc!
              </p>
            </div>
          ) : isDraw ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-blue-500/20 border-3 border-blue-400 flex items-center justify-center shadow mb-3">
                <Award className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-blue-300 tracking-tight">
                TRẬN ĐẤU HÒA!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">
                Hai bên ngang tài ngang sức!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center mb-3">
                <Shield className="w-12 h-12 text-slate-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-200 tracking-tight">
                THẤT BẠI
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-bold mt-1">
                Đừng nản lòng, hãy phục thù ở trận sau!
              </p>
            </div>
          )}
        </div>

        {/* Score Comparison Box */}
        <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 my-4 flex items-center justify-around">
          <div>
            <p className="text-xs text-slate-400 font-bold">Điểm của bạn</p>
            <p className="text-2xl font-black font-mono text-emerald-400">
              {myFinalScore.toLocaleString()}
            </p>
          </div>
          <div className="text-slate-600 font-black text-lg">VS</div>
          <div>
            <p className="text-xs text-slate-400 font-bold">Điểm đối thủ</p>
            <p className="text-2xl font-black font-mono text-purple-400">
              {opponentFinalScore.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Trophy Ticker Card */}
        <div className="w-full bg-gradient-to-b from-slate-800 to-slate-850 border-2 border-slate-700 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Điểm Cúp Xếp Hạng</span>
            <RankBadge tier={newTier} division={newDivision} size="sm" />
          </div>

          <div className="flex items-baseline justify-center gap-3">
            <span className="text-4xl sm:text-5xl font-black font-mono text-yellow-300">
              {displayedTrophy.toLocaleString()}
            </span>
            <span
              className={`
                text-lg font-black font-mono
                ${trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}
              `}
            >
              {trophyChange >= 0 ? `+${trophyChange}` : `${trophyChange}`}
            </span>
          </div>

          {/* Demotion Shield Alert if used */}
          {isShieldUsed && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-blue-300 font-bold bg-blue-950/60 border border-blue-500/40 rounded-xl py-1 px-2">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Khiên bảo vệ đã kích hoạt! Điểm sàn được giữ nguyên.</span>
            </div>
          )}
        </div>

        {/* Bonus Chips: XP & Streak */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-400/40 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            +{earnedXp} EXP Nhận Được
          </span>

          {winStreak >= 3 && isWinner && (
            <span className="inline-flex items-center gap-1 text-xs font-black bg-orange-500/20 text-orange-300 border border-orange-400/40 px-3 py-1.5 rounded-xl">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              Chuỗi Thắng {winStreak} Trận!
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {onPlayAgain && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onPlayAgain}
              leftIcon={<RotateCcw className="w-5 h-5" />}
            >
              Tìm Trận Khác
            </Button>
          )}

          {onBackToLobby && (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={onBackToLobby}
              leftIcon={<Home className="w-5 h-5" />}
            >
              Về Sảnh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
