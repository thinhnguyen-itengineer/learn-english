import React from 'react';
import { Sparkles, Check, X, Flame, BookMarked, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface CollocationOption {
  id: string;
  word: string;
  isCorrect: boolean;
}

export interface CollocationSatelliteCardProps {
  coreWord: string; // e.g. "DECISION"
  coreWordType?: string; // e.g. "Noun (Danh từ)"
  targetCollocation: string; // e.g. "make a decision"
  exampleSentence: string; // e.g. "It took the committee weeks to make a final decision."
  meaningVi: string; // e.g. "Đưa ra quyết định (Thay vì dùng sai 'take a decision')"
  options: CollocationOption[];
  selectedOptionId?: string;
  comboMultiplier?: number; // e.g. 1.5, 2.0
  isAnswered: boolean;
  onSelectOption: (optionId: string) => void;
  onNext?: () => void;
  className?: string;
}

export const CollocationSatelliteCard: React.FC<CollocationSatelliteCardProps> = ({
  coreWord,
  coreWordType = 'Danh từ học thuật',
  targetCollocation,
  exampleSentence,
  meaningVi,
  options,
  selectedOptionId,
  comboMultiplier = 1.0,
  isAnswered,
  onSelectOption,
  onNext,
  className = '',
}) => {
  const selectedOption = options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  return (
    <div
      className={`
        w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/95 border-2 border-slate-800
        shadow-2xl p-6 md:p-8 space-y-6 ${className}
      `}
    >
      {/* Header with Combo Counter */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            Writing: Academic Collocation Chain
          </span>
        </div>

        {comboMultiplier > 1.0 && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-black animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-current" />
            COMBO x{comboMultiplier.toFixed(1)}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400 font-semibold mb-1">
          Chọn động từ / tính từ kết hợp tự nhiên nhất với từ trung tâm:
        </p>
      </div>

      {/* Orbit Layout: Core Word at Center, Satellites Around */}
      <div className="relative py-8 flex flex-col items-center justify-center">
        {/* Central Core Word Card */}
        <div
          className={`
            relative z-10 px-8 py-5 rounded-3xl border-2 text-center
            shadow-2xl transition-all duration-300
            ${
              isAnswered && isCorrect
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105'
                : isAnswered && !isCorrect
                ? 'bg-slate-900 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500/60 shadow-[0_8px_0_#312e81]'
            }
          `}
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 block mb-1">
            {coreWordType}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest font-mono">
            {coreWord}
          </h2>
          {isAnswered && isCorrect && (
            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-200 mt-2">
              <Check className="w-4 h-4" /> {targetCollocation}
            </span>
          )}
        </div>

        {/* 4 Satellite Candidates Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-8">
          {options.map((opt) => {
            const isThisSelected = selectedOptionId === opt.id;
            const isThisCorrect = opt.isCorrect;

            let buttonStyle = 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 shadow-[0_4px_0_#1e293b] active:shadow-none active:translate-y-[4px]';

            if (isAnswered) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-600 text-white border-2 border-emerald-500 shadow-[0_4px_0_#047857] ring-2 ring-emerald-400/60';
              } else if (isThisSelected) {
                buttonStyle = 'bg-rose-600 text-white border-2 border-rose-500 shadow-[0_4px_0_#b91c1c] animate-shake';
              } else {
                buttonStyle = 'opacity-40 bg-slate-800 text-slate-400 border border-slate-700';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isAnswered}
                onClick={() => onSelectOption(opt.id)}
                className={`
                  p-4 rounded-2xl font-black text-base md:text-lg tracking-wide transition-all cursor-pointer
                  flex items-center justify-center gap-2
                  ${buttonStyle}
                `}
              >
                <span>{opt.word}</span>
                {isAnswered && isThisCorrect && <Check className="w-5 h-5 text-emerald-200" />}
                {isAnswered && isThisSelected && !isThisCorrect && <X className="w-5 h-5 text-rose-200" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Post-Answer Deep Learning Box */}
      {isAnswered && (
        <div
          className={`
            rounded-2xl border-2 p-5 animate-pop-bounce
            ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-950 border-amber-500/40'}
          `}
        >
          <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Cụm từ chuẩn xác & Ngữ cảnh:</span>
          </div>

          <p className="text-sm md:text-base font-bold text-white mb-1">
            "{exampleSentence}"
          </p>
          <p className="text-xs text-slate-300">
            <strong>Ý nghĩa: </strong> {meaningVi}
          </p>

          <div className="mt-4 flex justify-end">
            <Button variant="primary" size="md" onClick={onNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Cụm Tiếp Theo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
