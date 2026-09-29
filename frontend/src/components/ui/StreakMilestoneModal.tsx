import React, { useEffect } from 'react';
import { Flame, Sparkles, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './Button';

export interface StreakMilestoneModalProps {
  /** Current streak milestone count (e.g. 3, 5, 7, 10) */
  streakCount: number;
  /** Active combo multiplier (e.g. 1.25, 1.5, 2.0) */
  multiplier?: number;
  /** Bonus XP or coin points awarded */
  bonusPoints?: number;
  /** Cheerful congratulatory headline */
  title?: string;
  /** Cheerful motivational subtitle */
  subtitle?: string;
  /** Triggered when user clicks Continue button */
  onContinue: () => void;
  /** Custom extra styling classes */
  className?: string;
}

export const StreakMilestoneModal: React.FC<StreakMilestoneModalProps> = ({
  streakCount,
  multiplier = 1.5,
  bonusPoints = 50,
  title = '🔥 BẬT CHẾ ĐỘ RỰC LỬA!',
  subtitle = 'Bạn đang giữ chuỗi trả lời đúng không thể cản phá!',
  onContinue,
  className = '',
}) => {
  // Fire celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f97316', '#eab308', '#10b981', '#06b6d4'],
      });
    } catch {
      // Ignore if running without canvas
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
      <div
        className={`
          relative w-full max-w-md rounded-3xl p-6 md:p-8
          bg-gradient-to-b from-slate-900 to-slate-950
          border-2 border-orange-500/80 shadow-[0_10px_0_#9a3412]
          flex flex-col items-center text-center
          animate-pop-bounce
          ${className}
        `}
      >
        {/* Animated Flame Badge */}
        <div className="relative my-2">
          <div className="absolute -inset-4 rounded-full bg-orange-500/30 blur-2xl animate-pulse pointer-events-none" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-1 flex items-center justify-center shadow-[0_6px_0_#9a3412] animate-streak-flame">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center">
              <Flame className="w-12 h-12 text-orange-400 fill-orange-500 animate-bounce" />
              <span className="text-xs font-black text-amber-300 font-mono -mt-1">
                {streakCount} STREAK
              </span>
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl md:text-2xl font-black text-white mt-4 tracking-wide">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-300 mt-2 max-w-xs leading-relaxed">
          {subtitle}
        </p>

        {/* Multiplier & Bonus Box */}
        <div className="w-full my-5 p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Hệ số điểm
            </span>
            <span className="text-2xl font-black text-yellow-300 font-mono mt-0.5">
              x{multiplier.toFixed(1)}
            </span>
          </div>

          <div className="h-8 w-px bg-orange-800/60" />

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Thưởng chuỗi
            </span>
            <span className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              +{bonusPoints} XP
            </span>
          </div>
        </div>

        {/* Continue Action */}
        <Button
          variant="flame"
          size="lg"
          fullWidth
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Tiếp tục chuỗi thắng
        </Button>
      </div>
    </div>
  );
};
