import React from 'react';
import { BookOpen, Search, CheckCircle2, XCircle, HelpCircle, ArrowRight, Eye } from 'lucide-react';
import { Button } from './Button';

export type TfnAnswer = 'TRUE' | 'FALSE' | 'NOT_GIVEN';

export interface SkimScanCardProps {
  topic: string;
  passageText: string;
  wordCount: number;
  statement: string;
  selectedAnswer?: TfnAnswer;
  correctAnswer?: TfnAnswer;
  evidenceSentence?: string;
  explanationVi?: string;
  isAnswered: boolean;
  onSelectAnswer: (answer: TfnAnswer) => void;
  onNextQuestion?: () => void;
  className?: string;
}

export const SkimScanCard: React.FC<SkimScanCardProps> = ({
  topic,
  passageText,
  wordCount,
  statement,
  selectedAnswer,
  correctAnswer,
  evidenceSentence,
  explanationVi,
  isAnswered,
  onSelectAnswer,
  onNextQuestion,
  className = '',
}) => {
  const isCorrect = isAnswered && selectedAnswer === correctAnswer;

  // Highlight evidence in passage if answered
  const renderPassage = () => {
    if (!isAnswered || !evidenceSentence) {
      return <p className="text-sm md:text-base text-slate-200 leading-relaxed">{passageText}</p>;
    }

    const parts = passageText.split(evidenceSentence);
    if (parts.length < 2) {
      return <p className="text-sm md:text-base text-slate-200 leading-relaxed">{passageText}</p>;
    }

    return (
      <p className="text-sm md:text-base text-slate-200 leading-relaxed">
        {parts[0]}
        <mark className="bg-yellow-400/30 text-yellow-200 px-1 py-0.5 rounded font-semibold border-b-2 border-yellow-400">
          {evidenceSentence}
        </mark>
        {parts[1]}
      </p>
    );
  };

  const getButtonStyles = (type: TfnAnswer) => {
    if (!isAnswered) {
      return 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-2 border-slate-700 shadow-[0_4px_0_#1e293b] active:shadow-none active:translate-y-[4px]';
    }

    const isThisCorrect = correctAnswer === type;
    const isThisSelected = selectedAnswer === type;

    if (isThisCorrect) {
      return 'bg-emerald-600 text-white border-2 border-emerald-500 shadow-[0_4px_0_#047857] ring-2 ring-emerald-400/50';
    }
    if (isThisSelected && !isThisCorrect) {
      return 'bg-rose-600 text-white border-2 border-rose-500 shadow-[0_4px_0_#b91c1c] animate-shake';
    }
    return 'opacity-40 bg-slate-800 text-slate-400 border border-slate-700';
  };

  return (
    <div
      className={`
        w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/95 border-2 border-slate-800
        shadow-2xl overflow-hidden ${className}
      `}
    >
      {/* Header */}
      <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
              IELTS Reading: Skim & Scan Sprint
            </span>
            <h2 className="text-lg font-black text-white">Chủ đề: {topic}</h2>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
          Micro-Passage ({wordCount} words)
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Micro Passage Card */}
        <div className="rounded-2xl bg-slate-950/80 border-2 border-emerald-500/30 p-5 md:p-6 shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-emerald-400">
            <BookOpen className="w-4 h-4" />
            <span>ĐỌC LƯỚT ĐOẠN VĂN:</span>
          </div>
          {renderPassage()}
        </div>

        {/* Statement to verify */}
        <div className="rounded-2xl bg-slate-800/90 border-2 border-slate-700 p-5">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            Nhận định cần xác minh (Statement):
          </span>
          <p className="text-base md:text-lg font-bold text-white mt-1">
            "{statement}"
          </p>
        </div>

        {/* 3 True / False / Not Given Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <button
            type="button"
            disabled={isAnswered}
            onClick={() => onSelectAnswer('TRUE')}
            className={`
              p-4 rounded-2xl font-black text-sm md:text-base transition-all cursor-pointer
              ${getButtonStyles('TRUE')}
            `}
          >
            ✓ TRUE (Đúng)
          </button>

          <button
            type="button"
            disabled={isAnswered}
            onClick={() => onSelectAnswer('FALSE')}
            className={`
              p-4 rounded-2xl font-black text-sm md:text-base transition-all cursor-pointer
              ${getButtonStyles('FALSE')}
            `}
          >
            ✗ FALSE (Sai)
          </button>

          <button
            type="button"
            disabled={isAnswered}
            onClick={() => onSelectAnswer('NOT_GIVEN')}
            className={`
              p-4 rounded-2xl font-black text-sm md:text-base transition-all cursor-pointer
              ${getButtonStyles('NOT_GIVEN')}
            `}
          >
            ? NOT GIVEN (Không có)
          </button>
        </div>

        {/* Evidence & Explanation Drawer */}
        {isAnswered && (
          <div
            className={`
              rounded-2xl border-2 p-5 animate-pop-bounce
              ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-rose-950/40 border-rose-500/60'}
            `}
          >
            <div className="flex items-center gap-2 mb-2 font-black text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400">Chính xác! Phản xạ xuất sắc.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span className="text-rose-400">Chưa chính xác! Xem bằng chứng bên dưới.</span>
                </>
              )}
            </div>

            {explanationVi && (
              <p className="text-xs md:text-sm text-slate-200 mt-1">
                <strong>Giải thích: </strong> {explanationVi}
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="md" onClick={onNextQuestion} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Câu Tiếp Theo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
