import React from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export interface CorrectionOption {
  id: string;
  word: string;
  explanation?: string;
  isCorrect?: boolean;
}

export interface DetectiveCorrectionModalProps {
  /** The faulty word caught in Phase 1 */
  culpritWord: string;
  /** Full original context sentence */
  sentenceBefore?: string;
  sentenceAfter?: string;
  /** Available correction candidates */
  options: CorrectionOption[];
  /** Selected correction option ID */
  selectedOptionId?: string;
  /** Status of the correction choice */
  status?: 'idle' | 'correct' | 'wrong';
  /** ID of the correct option once resolved */
  correctOptionId?: string;
  /** Rule breakdown explanation */
  ruleExplanation?: string;
  /** Triggered when user picks a correction option */
  onSelectOption: (optionId: string) => void;
  /** Triggered when user clicks Continue / Close Case button */
  onCloseCase: () => void;
  /** Custom extra styling classes */
  className?: string;
}

export const DetectiveCorrectionModal: React.FC<DetectiveCorrectionModalProps> = ({
  culpritWord,
  sentenceBefore = '',
  sentenceAfter = '',
  options,
  selectedOptionId,
  status = 'idle',
  correctOptionId,
  ruleExplanation,
  onSelectOption,
  onCloseCase,
  className = '',
}) => {
  const isResolved = status !== 'idle';

  return (
    <div
      className={`
        w-full max-w-2xl mx-auto rounded-3xl p-6 md:p-8
        bg-slate-900/95 border-2 border-amber-500/80 shadow-[0_8px_0_#451a03]
        backdrop-blur-md select-none transition-all duration-300 animate-pop-bounce
        ${className}
      `}
    >
      {/* 1. Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base md:text-lg font-black text-amber-400">
              Giai đoạn 2: Sửa Chữa Hồ Sơ Vụ Án
            </h4>
            <span className="text-xs font-semibold text-slate-400">
              Bắt đúng thủ phạm: <strong className="text-rose-400 line-through">&ldquo;{culpritWord}&rdquo;</strong> là từ sai!
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Phá án
        </span>
      </div>

      {/* 2. Visual Prompt Card */}
      <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
        <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
          Chọn phương án thay thế chuẩn xác nhất:
        </span>
        <div className="text-sm md:text-base font-bold text-slate-200">
          <span>&ldquo;{sentenceBefore} </span>
          <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500 text-rose-300 line-through">
            {culpritWord}
          </span>
          <span> ➔ </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-dashed border-emerald-400 text-emerald-300 font-mono font-black">
            {isResolved
              ? options.find((o) => o.id === (correctOptionId || selectedOptionId))?.word
              : '[ ? ]'}
          </span>
          <span> {sentenceAfter}&rdquo;</span>
        </div>
      </div>

      {/* 3. Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = correctOptionId === option.id;

          let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-slate-100 border-slate-700 shadow-[0_4px_0_#1e293b]';

          if (isResolved) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-[0_4px_0_#047857] ring-2 ring-emerald-300';
            } else if (isSelected && status === 'wrong') {
              btnStyle = 'bg-rose-600 text-white border-rose-400 shadow-[0_4px_0_#b91c1c] animate-shake';
            } else {
              btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
            }
          } else if (isSelected) {
            btnStyle = 'bg-blue-600 text-white border-blue-400 shadow-[0_4px_0_#1d4ed8]';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isResolved}
              onClick={() => onSelectOption(option.id)}
              className={`
                p-3.5 md:p-4 rounded-2xl border-2 text-center
                flex flex-col items-center justify-center gap-1
                transition-all duration-150 cursor-pointer select-none
                active:translate-y-1 active:shadow-none
                ${btnStyle}
              `}
            >
              <span className="text-xs font-mono font-bold text-amber-300 opacity-80">
                ({idx + 1})
              </span>
              <span className="text-base md:text-lg font-black tracking-wide">
                {option.word}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Resolved Explanation & Rule Report */}
      {isResolved && (
        <div
          className={`
            my-4 p-4 rounded-2xl border transition-all animate-pop-bounce
            ${status === 'correct'
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/60 text-rose-200'}
          `}
        >
          <div className="flex items-center gap-2 mb-2 font-black text-sm">
            {status === 'correct' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Án đã phá thành công! +60 Điểm Sửa Lỗi</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Phương án chưa chuẩn! Đáp án đúng đã được hiển thị</span>
              </>
            )}
          </div>
          {ruleExplanation && (
            <p className="text-xs md:text-sm font-medium leading-relaxed opacity-90">
              {ruleExplanation}
            </p>
          )}
        </div>
      )}

      {/* 5. Footer Continue Button */}
      {isResolved && (
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <Button
            variant="gold"
            size="md"
            onClick={onCloseCase}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Đóng vụ án & Tiếp tục
          </Button>
        </div>
      )}
    </div>
  );
};
