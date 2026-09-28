import React from 'react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';

export type CardState = 'idle' | 'selected' | 'matched' | 'wrong' | 'disabled';
export type CardLanguage = 'en' | 'vi';

export interface FlipCardProps {
  id: string;
  text: string;
  language: CardLanguage;
  state?: CardState;
  phonetic?: string;
  onClick?: () => void;
  onAudioClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  text,
  language,
  state = 'idle',
  phonetic,
  onClick,
  onAudioClick,
  className = '',
}) => {
  const isSelected = state === 'selected';
  const isMatched = state === 'matched';
  const isWrong = state === 'wrong';
  const isDisabled = state === 'disabled' || isMatched;

  const stateStyles = {
    idle: `
      bg-slate-800/90 hover:bg-slate-750 text-slate-100 border-2 border-slate-700
      shadow-[0_4px_0_#1e293b] active:shadow-none active:translate-y-[4px]
    `,
    selected: `
      bg-blue-600 text-white border-2 border-blue-400
      shadow-[0_4px_0_#1d4ed8] shadow-[0_0_15px_rgba(59,130,246,0.6)] translate-y-[2px]
    `,
    matched: `
      bg-emerald-600/90 text-white border-2 border-emerald-400
      shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-95 opacity-80 cursor-default
    `,
    wrong: `
      bg-rose-600 text-white border-2 border-rose-400
      shadow-[0_4px_0_#b91c1c] shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-shake
    `,
    disabled: `
      bg-slate-900/60 text-slate-500 border border-slate-800 opacity-40 cursor-not-allowed
    `,
  }[state];

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={`
        relative flex flex-col justify-between items-center p-3.5 sm:p-4 rounded-2xl
        min-h-[96px] sm:min-h-[110px] w-full select-none
        transition-all duration-150 ease-out cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        ${stateStyles}
        ${className}
      `}
    >
      {/* Top Header Row: Language Pill & Audio Trigger */}
      <div className="w-full flex justify-between items-center">
        <span
          className={`
            text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full
            ${
              language === 'en'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            }
          `}
        >
          {language === 'en' ? 'ENG' : 'VIE'}
        </span>

        {language === 'en' && onAudioClick && !isMatched && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAudioClick(e);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Nghe phát âm"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        )}

        {isMatched && (
          <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-pop-bounce" />
        )}

        {isWrong && (
          <XCircle className="w-4 h-4 text-rose-200 animate-pulse" />
        )}
      </div>

      {/* Main Text in Center */}
      <div className="my-auto text-center px-1">
        <p className="text-base sm:text-lg font-black tracking-tight leading-snug break-words">
          {text}
        </p>
        {phonetic && language === 'en' && !isMatched && (
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            {phonetic}
          </p>
        )}
      </div>

      {/* Subtle indicator bar at the bottom */}
      <div className="w-full h-1 rounded-full bg-white/10 mt-1" />
    </button>
  );
};
