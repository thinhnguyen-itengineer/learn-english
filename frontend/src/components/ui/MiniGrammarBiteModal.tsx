import React from 'react';
import { Lightbulb, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from './Button';

export interface MiniGrammarBiteModalProps {
  /** Whether the user answered correctly */
  isCorrect: boolean;
  /** Correct word or phrase */
  correctAnswer: string;
  /** User's chosen word if incorrect */
  userAnswer?: string;
  /** Concise grammatical explanation / collocation breakdown */
  explanation: string;
  /** Grammar concept rule category (e.g. Collocation, Word Family, Preposition) */
  category?: string;
  /** Example sentence or additional usage tip */
  usageTip?: string;
  /** Triggered when user clicks Continue button */
  onContinue: () => void;
  /** Custom extra styling classes */
  className?: string;
}

export const MiniGrammarBiteModal: React.FC<MiniGrammarBiteModalProps> = ({
  isCorrect,
  correctAnswer,
  userAnswer,
  explanation,
  category = 'Ngữ pháp thực tế',
  usageTip,
  onContinue,
  className = '',
}) => {
  return (
    <div
      className={`
        w-full max-w-2xl mx-auto rounded-3xl p-6 md:p-7
        border-2 shadow-[0_8px_0_#1e293b] backdrop-blur-md select-none
        transition-all duration-300 animate-pop-bounce
        ${isCorrect
          ? 'bg-slate-900/95 border-emerald-500/80 shadow-emerald-950/40'
          : 'bg-slate-900/95 border-rose-500/80 shadow-rose-950/40'}
        ${className}
      `}
    >
      {/* Top Banner: Status Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}

          <div>
            <h4
              className={`
                text-base md:text-lg font-black tracking-wide
                ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}
              `}
            >
              {isCorrect ? '💡 Xuất sắc! Chuẩn xác 100%' : '⚠️ Chưa chính xác! Cùng học lại nhé'}
            </h4>
            <span className="text-xs font-semibold text-slate-400">
              Mini Grammar Bite • {category}
            </span>
          </div>
        </div>

        {/* Category Pill */}
        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 text-teal-300 text-xs font-bold border border-slate-700">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kiến thức cốt lõi</span>
        </span>
      </div>

      {/* Answer comparison when incorrect */}
      {!isCorrect && (
        <div className="flex flex-wrap items-center gap-3 my-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs md:text-sm">
          {userAnswer && (
            <div className="flex items-center gap-1.5 text-rose-300">
              <span className="text-slate-500 font-bold">Lựa chọn của bạn:</span>
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/40 line-through font-bold">
                {userAnswer}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="text-slate-500 font-bold">Đáp án chuẩn:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 font-black">
              {correctAnswer}
            </span>
          </div>
        </div>
      )}

      {/* Explanation Text */}
      <div className="my-4">
        <p className="text-sm md:text-base font-medium text-slate-200 leading-relaxed">
          {explanation}
        </p>

        {usageTip && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium">
            <span className="font-bold mr-1">📌 Mẹo nhớ lâu:</span>
            {usageTip}
          </div>
        )}
      </div>

      {/* Action Footer Button */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex justify-end">
        <Button
          variant={isCorrect ? 'primary' : 'flame'}
          size="md"
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          {isCorrect ? 'Tiếp tục câu sau' : 'Đã hiểu & Tiếp tục'}
        </Button>
      </div>
    </div>
  );
};
