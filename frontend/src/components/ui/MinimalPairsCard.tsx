import React from 'react';
import { Volume2, Award, Zap, Check, X, ArrowRight, Clock, HelpCircle } from 'lucide-react';
import { Button } from './Button';

export interface MinimalPairOption {
  id: string;
  word: string;
  ipa: string;
  meaningVi: string;
  isTargetWord: boolean;
}

export interface MinimalPairsCardProps {
  phoneticFocus: string; // e.g. "/iː/ vs /ɪ/ (Long E vs Short I)"
  targetOptionId: string;
  options: [MinimalPairOption, MinimalPairOption]; // Exactly 2 options
  selectedOptionId?: string;
  isPlayingAudio: boolean;
  timeLeft: number;
  totalTime?: number;
  streakCount?: number;
  isAnswered: boolean;
  onPlayAudio: () => void;
  onSelectOption: (optionId: string) => void;
  onNext?: () => void;
  className?: string;
}

export const MinimalPairsCard: React.FC<MinimalPairsCardProps> = ({
  phoneticFocus,
  targetOptionId,
  options,
  selectedOptionId,
  isPlayingAudio,
  timeLeft,
  totalTime = 8,
  streakCount = 0,
  isAnswered,
  onPlayAudio,
  onSelectOption,
  onNext,
  className = '',
}) => {
  const isTimeCritical = timeLeft <= 3;
  const selectedOption = options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isTargetWord ?? false;

  return (
    <div
      className={`
        w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/95 border-2 border-slate-800
        shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 ${className}
      `}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-rose-400">
            Speaking: Minimal Pairs Duel
          </span>
          <h2 className="text-lg font-black text-white">Cặp âm: {phoneticFocus}</h2>
        </div>

        <div className="flex items-center gap-3">
          {streakCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs font-black">
              <Award className="w-4 h-4 fill-current text-yellow-400" />
              Chuỗi Tai Vàng: {streakCount}
            </div>
          )}
          <div className="flex items-center gap-1 text-slate-300 font-mono text-sm font-bold">
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
            <span className={isTimeCritical ? 'text-rose-400 font-black' : ''}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Secret Mystery Sound Speaker Button */}
      <div className="rounded-3xl bg-slate-950/90 border-2 border-rose-500/40 p-8 flex flex-col items-center justify-center text-center shadow-inner">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Lắng nghe âm thanh phát ra và chọn từ đúng nhất:
        </p>

        <button
          type="button"
          onClick={onPlayAudio}
          className={`
            relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer
            bg-gradient-to-br from-rose-500 to-rose-600 text-white
            shadow-[0_8px_0_#9f1239] active:shadow-none active:translate-y-[8px]
            transition-all duration-150 group
            ${isPlayingAudio ? 'ring-8 ring-rose-400/30 scale-105' : 'hover:scale-105'}
          `}
        >
          <Volume2 className={`w-10 h-10 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          {isPlayingAudio && (
            <span className="absolute -bottom-7 text-[11px] font-black text-rose-400 animate-pulse">
              Đang phát âm thanh...
            </span>
          )}
        </button>

        <p className="text-xs text-slate-500 mt-6 font-semibold">
          (Bấm để nghe lại phát âm bản xứ chuẩn)
        </p>
      </div>

      {/* 2 Big Duel Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt, idx) => {
          const isThisSelected = selectedOptionId === opt.id;
          const isThisTarget = opt.isTargetWord;

          let cardStyle = 'bg-slate-800/90 hover:bg-slate-700/90 text-white border-2 border-slate-700 shadow-[0_6px_0_#1e293b] active:shadow-none active:translate-y-[6px]';

          if (isAnswered) {
            if (isThisTarget) {
              cardStyle = 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-[0_6px_0_#047857] ring-2 ring-emerald-300/50';
            } else if (isThisSelected) {
              cardStyle = 'bg-rose-600 text-white border-2 border-rose-400 shadow-[0_6px_0_#9f1239] animate-shake';
            } else {
              cardStyle = 'opacity-40 bg-slate-900 text-slate-400 border border-slate-800';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(opt.id)}
              className={`
                p-6 rounded-3xl transition-all cursor-pointer text-center flex flex-col items-center justify-between
                min-h-[140px] ${cardStyle}
              `}
            >
              <span className="text-xs font-black uppercase text-slate-400 mb-1">
                Lựa chọn {idx === 0 ? 'A' : 'B'}
              </span>

              <div>
                <h3 className="text-2xl md:text-3xl font-black tracking-wide font-mono">
                  {opt.word}
                </h3>
                <p className="text-sm font-semibold text-rose-300 font-mono mt-1">
                  {opt.ipa}
                </p>
              </div>

              <span className="text-xs text-slate-300 font-medium mt-2">
                {opt.meaningVi}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation & Acoustic Breakdown */}
      {isAnswered && (
        <div
          className={`
            rounded-2xl border-2 p-5 animate-pop-bounce
            ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-rose-950/40 border-rose-500/50'}
          `}
        >
          <div className="flex items-center gap-2 mb-2 font-black text-sm">
            {isCorrect ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Tai Vàng Thính Nhạy! Bạn phân biệt chính xác.</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-rose-400" />
                <span className="text-rose-400">Nhầm lẫn phổ biến! Chú ý vị trí đặt lưỡi & độ dài âm.</span>
              </>
            )}
          </div>

          <p className="text-xs md:text-sm text-slate-300">
            <strong>Phân biệt ngữ âm: </strong> 
            {phoneticFocus}. Hãy lắng nghe độ mở của miệng và độ dài hơi phát ra giữa 2 từ.
          </p>

          <div className="mt-4 flex justify-end">
            <Button variant="primary" size="md" onClick={onNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Cặp Tiếp Theo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
