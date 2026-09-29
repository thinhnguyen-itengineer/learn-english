import React from 'react';
import { HelpCircle, Sparkles, Check, X, Tag, BookOpen } from 'lucide-react';

export interface ClozeOption {
  id: string;
  key: 'A' | 'B' | 'C' | 'D';
  word: string;
  nuanceVi?: string;
  isCorrect?: boolean;
}

export interface ClozeQuestionCardProps {
  /** Topic category name (e.g. Office & Business / Giao tiếp công sở) */
  topic?: string;
  /** Difficulty level (e.g. Easy, Medium, Hard) */
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  /** Current question index and total (e.g. { current: 4, total: 10 }) */
  questionProgress?: { current: number; total: number };
  /** Context sentence split into before blank and after blank */
  sentenceBefore: string;
  sentenceAfter: string;
  /** Hint for the blank (e.g. 'verb - nguyên mẫu') */
  partOfSpeechHint?: string;
  /** Vietnamese translation of the full context sentence */
  sentenceMeaningVi?: string;
  /** First letter hint revealed (e.g. 'e') */
  firstLetterHint?: string;
  /** 4 smart options */
  options: ClozeOption[];
  /** Selected option ID */
  selectedOptionId?: string;
  /** IDs of options eliminated by 50:50 power-up */
  eliminatedOptionIds?: string[];
  /** State of answer verification */
  answerState?: 'idle' | 'correct' | 'wrong';
  /** Correct option ID (revealed upon answer) */
  correctOptionId?: string;
  /** Whether 50:50 powerup is available or already used */
  is5050Available?: boolean;
  /** Whether First Letter Hint powerup is available or already used */
  isFirstLetterAvailable?: boolean;
  /** Triggered when user selects an option */
  onSelectOption: (optionId: string) => void;
  /** Triggered when user clicks 50:50 powerup */
  onUse5050?: () => void;
  /** Triggered when user clicks First Letter Hint powerup */
  onUseFirstLetterHint?: () => void;
  /** Custom extra styling classes */
  className?: string;
}

export const ClozeQuestionCard: React.FC<ClozeQuestionCardProps> = ({
  topic = 'Giao tiếp hàng ngày',
  difficulty = 'Medium',
  questionProgress,
  sentenceBefore,
  sentenceAfter,
  partOfSpeechHint,
  sentenceMeaningVi,
  firstLetterHint,
  options,
  selectedOptionId,
  eliminatedOptionIds = [],
  answerState = 'idle',
  correctOptionId,
  is5050Available = true,
  isFirstLetterAvailable = true,
  onSelectOption,
  onUse5050,
  onUseFirstLetterHint,
  className = '',
}) => {
  const isAnswered = answerState !== 'idle';

  return (
    <div className={`w-full max-w-2xl mx-auto flex flex-col gap-6 select-none ${className}`}>
      {/* 1. Header Bar: Topic Tag, Difficulty, Power-ups */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {topic && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
              <Tag className="w-3.5 h-3.5 text-teal-400" />
              {topic}
            </span>
          )}
          {difficulty && (
            <span
              className={`
                px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider
                ${difficulty === 'Hard'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : difficulty === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}
              `}
            >
              {difficulty}
            </span>
          )}
        </div>

        {/* In-game Power-ups Bar (50:50 & First Letter Hint) */}
        <div className="flex items-center gap-2">
          {onUse5050 && (
            <button
              type="button"
              disabled={!is5050Available || isAnswered}
              onClick={onUse5050}
              className={`
                px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5
                transition-all cursor-pointer border
                ${is5050Available && !isAnswered
                  ? 'bg-amber-500 hover:bg-amber-400 text-yellow-950 border-amber-600 shadow-[0_3px_0_#a16207] active:translate-y-[2px] active:shadow-none'
                  : 'bg-slate-900 text-slate-500 border-slate-800 opacity-40 cursor-not-allowed'}
              `}
            >
              <span>💡</span>
              <span>50:50</span>
            </button>
          )}

          {onUseFirstLetterHint && (
            <button
              type="button"
              disabled={!isFirstLetterAvailable || isAnswered || !!firstLetterHint}
              onClick={onUseFirstLetterHint}
              className={`
                px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5
                transition-all cursor-pointer border
                ${isFirstLetterAvailable && !isAnswered && !firstLetterHint
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-700 shadow-[0_3px_0_#0e7490] active:translate-y-[2px] active:shadow-none'
                  : 'bg-slate-900 text-slate-500 border-slate-800 opacity-40 cursor-not-allowed'}
              `}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gợi ý ký tự</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Context Sentence Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border-2 border-slate-700/80 shadow-[0_8px_0_#1e293b] backdrop-blur-md">
        <div className="text-base md:text-lg lg:text-xl font-bold text-slate-100 leading-relaxed text-center">
          <span>&ldquo;{sentenceBefore} </span>

          {/* Blank Slot */}
          <span
            className={`
              inline-flex items-center justify-center min-w-[120px] px-3 py-1 mx-1.5 rounded-xl
              border-2 font-mono font-black transition-all duration-200
              ${isAnswered
                ? answerState === 'correct'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_3px_0_#047857]'
                  : 'bg-rose-500 text-white border-rose-400 shadow-[0_3px_0_#b91c1c]'
                : firstLetterHint
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-950/80 text-cyan-400 border-dashed border-cyan-500/80'}
            `}
          >
            {isAnswered ? (
              options.find((o) => o.id === (correctOptionId || selectedOptionId))?.word || '____'
            ) : firstLetterHint ? (
              <span>[ {firstLetterHint}______ ]</span>
            ) : (
              <span>[ ________ ]</span>
            )}
          </span>

          <span> {sentenceAfter}&rdquo;</span>
        </div>

        {/* Sub-hints: Part of Speech & Vietnamese Meaning */}
        {(partOfSpeechHint || sentenceMeaningVi) && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            {partOfSpeechHint && (
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                <span className="uppercase tracking-wider">Từ loại cần điền:</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 font-mono">
                  {partOfSpeechHint}
                </span>
              </div>
            )}
            {sentenceMeaningVi && (
              <p className="text-center text-xs md:text-sm font-medium text-slate-400 italic">
                Nghĩa: {sentenceMeaningVi}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. Smart Distractors: 4 Choice Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isEliminated = eliminatedOptionIds.includes(option.id);
          const isCorrectAnswer = correctOptionId === option.id;

          let cardStyle = 'bg-slate-800 hover:bg-slate-750 text-slate-100 border-slate-700 shadow-[0_4px_0_#1e293b]';
          let badgeStyle = 'bg-slate-700 text-slate-200';

          if (isEliminated) {
            cardStyle = 'opacity-25 bg-slate-900 border-slate-800 text-slate-600 line-through pointer-events-none shadow-none';
          } else if (isAnswered) {
            if (isCorrectAnswer) {
              cardStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-[0_4px_0_#047857] ring-2 ring-emerald-300 animate-pop-bounce';
              badgeStyle = 'bg-emerald-800 text-emerald-100';
            } else if (isSelected && answerState === 'wrong') {
              cardStyle = 'bg-rose-600 text-white border-rose-400 shadow-[0_4px_0_#b91c1c] animate-shake';
              badgeStyle = 'bg-rose-800 text-rose-100';
            } else {
              cardStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
            }
          } else if (isSelected) {
            cardStyle = 'bg-blue-600 text-white border-blue-400 shadow-[0_4px_0_#1d4ed8] translate-y-1';
            badgeStyle = 'bg-blue-800 text-blue-100';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isEliminated || isAnswered}
              onClick={() => onSelectOption(option.id)}
              className={`
                relative p-4 md:p-5 rounded-2xl border-2 text-left
                flex items-start gap-3.5 transition-all duration-150 cursor-pointer select-none
                active:translate-y-1 active:shadow-none
                ${cardStyle}
              `}
            >
              {/* Option Key Badge [A, B, C, D] */}
              <span
                className={`
                  w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0
                  transition-colors
                  ${badgeStyle}
                `}
              >
                {option.key}
              </span>

              {/* Word and Vietnamese Nuance */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-base md:text-lg font-black tracking-wide truncate">
                  {option.word}
                </span>
                {option.nuanceVi && (
                  <span className="text-xs font-medium opacity-85 mt-0.5 line-clamp-2">
                    {option.nuanceVi}
                  </span>
                )}
              </div>

              {/* Status Icons */}
              {isAnswered && (
                <div className="shrink-0 pt-1">
                  {isCorrectAnswer && <Check className="w-5 h-5 text-emerald-200" />}
                  {isSelected && answerState === 'wrong' && <X className="w-5 h-5 text-rose-200" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
