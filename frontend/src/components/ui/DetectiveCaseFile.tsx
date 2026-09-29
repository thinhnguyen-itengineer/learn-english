import React from 'react';
import { Search, ShieldAlert, Sparkles, AlertCircle, FileText } from 'lucide-react';

export interface SentenceToken {
  id: string;
  word: string;
  isPunctuation?: boolean;
  isCulprit?: boolean;
}

export interface DetectiveCaseFileProps {
  /** Case number and identifier (e.g. 'VỤ ÁN #03 / 05') */
  caseNumber?: string;
  /** Crime/grammar category (e.g. 'Lỗi thì hoàn thành & Giới từ thời gian') */
  caseTitle: string;
  /** Mission instruction text */
  missionInstruction?: string;
  /** Available magnifier lives remaining (0 to 3) */
  magnifiers: number;
  /** Total initial magnifiers */
  maxMagnifiers?: number;
  /** Array of tokenized words and punctuations */
  tokens: SentenceToken[];
  /** Currently selected/clicked token ID */
  selectedTokenId?: string;
  /** ID of the culprit token if revealed/caught */
  caughtCulpritId?: string;
  /** Array of token IDs that the user wrongly clicked */
  innocentTokenIds?: string[];
  /** Triggered when user clicks a token */
  onSelectToken: (token: SentenceToken) => void;
  /** Whether interaction is disabled (e.g. time out or phase 2 active) */
  disabled?: boolean;
  /** Custom extra styling classes */
  className?: string;
}

export const DetectiveCaseFile: React.FC<DetectiveCaseFileProps> = ({
  caseNumber = 'HỒ SƠ VỤ ÁN #01',
  caseTitle,
  missionInstruction = 'Chạm vào TỪ hoặc CỤM TỪ bị lỗi ngữ pháp trong câu dưới đây',
  magnifiers = 3,
  maxMagnifiers = 3,
  tokens,
  selectedTokenId,
  caughtCulpritId,
  innocentTokenIds = [],
  onSelectToken,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      className={`
        w-full max-w-2xl mx-auto rounded-3xl p-6 md:p-8
        bg-slate-900/95 border-2 border-amber-600/60 shadow-[0_8px_0_#451a03]
        backdrop-blur-md select-none transition-all duration-300
        ${className}
      `}
    >
      {/* 1. Case File Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-amber-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-mono">
                {caseNumber}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                MẬT
              </span>
            </div>
            <h3 className="text-sm md:text-base font-black text-slate-100 mt-0.5">
              {caseTitle}
            </h3>
          </div>
        </div>

        {/* Magnifiers / Lives (Kính lúp điều tra) */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Kính lúp:
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxMagnifiers }).map((_, i) => {
              const isAvailable = i < magnifiers;
              return (
                <div
                  key={i}
                  className={`
                    w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isAvailable
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-30 scale-90'}
                  `}
                >
                  <Search className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Directive / Mission Prompt */}
      <div className="my-4 flex items-center gap-2 text-xs md:text-sm font-semibold text-amber-200/90 bg-amber-950/30 p-3 rounded-2xl border border-amber-800/40">
        <Search className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{missionInstruction}</span>
      </div>

      {/* 3. Interactive Tokenized Sentence Area */}
      <div className="my-6 p-6 rounded-3xl bg-slate-950/90 border-2 border-slate-800/90 min-h-[140px] flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 leading-loose">
          {tokens.map((token) => {
            const isCulpritCaught = caughtCulpritId === token.id;
            const isInnocentClicked = innocentTokenIds.includes(token.id);
            const isSelected = selectedTokenId === token.id;

            // Pure punctuation (e.g. '.', ',', '?', '!')
            if (token.isPunctuation) {
              return (
                <span
                  key={token.id}
                  className="text-lg md:text-xl font-black text-slate-500 px-0.5 select-none"
                >
                  {token.word}
                </span>
              );
            }

            let chipStyle = 'bg-slate-800/90 hover:bg-slate-750 text-slate-100 border-slate-700 shadow-[0_3px_0_#1e293b]';

            if (isCulpritCaught) {
              chipStyle =
                'bg-amber-400 text-yellow-950 font-black border-amber-300 ring-4 ring-amber-400/50 shadow-[0_4px_0_#a16207] animate-pop-bounce';
            } else if (isInnocentClicked) {
              chipStyle =
                'bg-rose-950/40 text-rose-300 border-rose-500/60 shadow-[0_2px_0_#991b1b] animate-shake opacity-80';
            } else if (isSelected) {
              chipStyle = 'bg-blue-600 text-white border-blue-400 shadow-[0_3px_0_#1d4ed8]';
            }

            return (
              <button
                key={token.id}
                type="button"
                disabled={disabled || isCulpritCaught || isInnocentClicked}
                onClick={() => onSelectToken(token)}
                className={`
                  relative px-3.5 py-2 md:px-4 md:py-2.5 rounded-2xl border-2
                  text-base md:text-lg font-bold transition-all duration-150 cursor-pointer
                  hover:scale-105 active:translate-y-1 active:shadow-none select-none
                  disabled:cursor-not-allowed
                  ${chipStyle}
                `}
              >
                <span>{token.word}</span>

                {/* Culprit Found Badge */}
                {isCulpritCaught && (
                  <span className="absolute -top-3 -right-2 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow">
                    Thủ phạm!
                  </span>
                )}

                {/* Innocent buzzer mark */}
                {isInnocentClicked && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center font-bold">
                    ✕
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Hint & Evidence Status */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Bắt đúng thủ phạm lần đầu: <strong className="text-amber-300">+60 điểm</strong></span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-mono">
          <span>{tokens.filter((t) => !t.isPunctuation).length} đối tượng tình nghi</span>
        </div>
      </div>
    </div>
  );
};
