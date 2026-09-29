import React, { useEffect } from 'react';
import { Shuffle, Delete, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface LetterTile {
  id: string;
  char: string;
  isDistractor?: boolean;
}

export interface LetterTileBankProps {
  /** Target word length or total number of letter slots */
  wordLength: number;
  /** Currently slotted letters (in order from left to right) */
  slottedLetters: Array<{ id: string; char: string }>;
  /** Available letter tiles in the bank */
  bankTiles: LetterTile[];
  /** Validation status of current input */
  status?: 'idle' | 'correct' | 'wrong';
  /** Expected correct word to display on timeout or reveal */
  revealedWord?: string;
  /** Triggered when user clicks/taps an available tile in the bank */
  onSelectTile: (tile: LetterTile) => void;
  /** Triggered when user clicks/taps a letter already in an input slot to return it */
  onRemoveSlottedLetter: (index: number) => void;
  /** Triggered when user clicks Shuffle button */
  onShuffle: () => void;
  /** Triggered when user clicks Backspace button */
  onBackspace: () => void;
  /** Triggered when user clicks Clear All button */
  onClearAll: () => void;
  /** Triggered when user presses Enter or submits */
  onSubmit?: () => void;
  /** Whether keyboard listening is enabled */
  enableKeyboard?: boolean;
  /** Custom extra styling classes */
  className?: string;
}

export const LetterTileBank: React.FC<LetterTileBankProps> = ({
  wordLength,
  slottedLetters,
  bankTiles,
  status = 'idle',
  revealedWord,
  onSelectTile,
  onRemoveSlottedLetter,
  onShuffle,
  onBackspace,
  onClearAll,
  onSubmit,
  enableKeyboard = true,
  className = '',
}) => {
  // Physical keyboard listener
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when focusing an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();

      if (key === 'backspace') {
        e.preventDefault();
        onBackspace();
      } else if (key === 'enter') {
        e.preventDefault();
        if (onSubmit && slottedLetters.length === wordLength) {
          onSubmit();
        }
      } else if (/^[a-z]$/.test(key)) {
        // Find matching letter in bank
        const availableTile = bankTiles.find(
          (tile) =>
            tile.char.toLowerCase() === key &&
            !slottedLetters.some((s) => s.id === tile.id)
        );
        if (availableTile && slottedLetters.length < wordLength) {
          e.preventDefault();
          onSelectTile(availableTile);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, bankTiles, slottedLetters, wordLength, onBackspace, onSubmit, onSelectTile]);

  // Check if tile is already slotted
  const isTileSlotted = (tileId: string) => {
    return slottedLetters.some((s) => s.id === tileId);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto flex flex-col items-center gap-6 select-none ${className}`}>
      {/* 1. Target Word Input Slots */}
      <div className="w-full flex flex-col items-center">
        <div
          className={`
            flex flex-wrap items-center justify-center gap-2 md:gap-2.5 p-4 rounded-3xl
            bg-slate-950/70 border-2 transition-all duration-300
            ${status === 'correct'
              ? 'border-emerald-500 bg-emerald-950/30 animate-pop-bounce'
              : status === 'wrong'
                ? 'border-rose-500 bg-rose-950/30 animate-shake'
                : 'border-slate-800'}
          `}
        >
          {Array.from({ length: wordLength }).map((_, index) => {
            const letter = slottedLetters[index];
            const isCurrentSlot = index === slottedLetters.length && status === 'idle';
            const displayChar = revealedWord ? revealedWord[index] : letter?.char;

            return (
              <button
                key={index}
                type="button"
                disabled={!letter && !revealedWord}
                onClick={() => letter && onRemoveSlottedLetter(index)}
                aria-label={letter ? `Xóa chữ cái ${letter.char} ở vị trí ${index + 1}` : `Ô chữ số ${index + 1}`}
                className={`
                  relative w-11 h-13 md:w-13 md:h-16 rounded-2xl
                  flex items-center justify-center text-xl md:text-2xl font-black uppercase
                  transition-all duration-150 cursor-pointer
                  ${letter || revealedWord
                    ? status === 'correct'
                      ? 'bg-emerald-500 text-white shadow-[0_4px_0_#047857]'
                      : status === 'wrong'
                        ? 'bg-rose-500 text-white shadow-[0_4px_0_#b91c1c]'
                        : revealedWord
                          ? 'bg-amber-500 text-yellow-950 shadow-[0_4px_0_#a16207]'
                          : 'bg-slate-800 text-cyan-300 border-2 border-cyan-500/60 shadow-[0_4px_0_#0e7490] hover:scale-105 active:translate-y-1'
                    : isCurrentSlot
                      ? 'bg-slate-900 border-2 border-dashed border-amber-400/80 animate-pulse text-transparent shadow-inner'
                      : 'bg-slate-900/60 border-2 border-dashed border-slate-700/60 text-transparent'}
                `}
              >
                <span>{displayChar || ''}</span>

                {/* Slot index indicator underneath */}
                <span className="absolute bottom-0.5 text-[9px] font-mono text-slate-500 select-none">
                  {index + 1}
                </span>

                {/* Blinking typing cursor */}
                {isCurrentSlot && (
                  <span className="w-2 h-0.5 bg-amber-400 rounded-full animate-bounce" />
                )}
              </button>
            );
          })}
        </div>

        {/* Status notification tag */}
        {status === 'correct' && (
          <div className="flex items-center gap-1.5 mt-3 text-emerald-400 font-black text-sm animate-pop-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Chính xác tuyệt đối!</span>
          </div>
        )}
        {status === 'wrong' && (
          <div className="flex items-center gap-1.5 mt-3 text-rose-400 font-black text-sm animate-shake">
            <AlertCircle className="w-4 h-4" />
            <span>Chưa chính xác! Thử lại nhé.</span>
          </div>
        )}
      </div>

      {/* 2. Letter Tiles Bank */}
      <div className="w-full flex flex-col items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Ngân hàng ký tự (Chạm để điền):
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 max-w-xl">
          {bankTiles.map((tile) => {
            const slotted = isTileSlotted(tile.id);

            return (
              <button
                key={tile.id}
                type="button"
                disabled={slotted || status !== 'idle' || !!revealedWord}
                onClick={() => onSelectTile(tile)}
                className={`
                  relative w-12 h-13 md:w-14 md:h-15 rounded-2xl
                  flex items-center justify-center text-lg md:text-xl font-black uppercase
                  transition-all duration-150 cursor-pointer select-none
                  ${slotted
                    ? 'opacity-20 scale-90 pointer-events-none bg-slate-900 border border-slate-800 text-slate-600'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-b-4 border-slate-950 shadow-[0_4px_0_#1e293b] active:translate-y-1 active:shadow-none hover:scale-105 active:border-b-0'}
                `}
              >
                <span>{tile.char}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Utility Control Toolbar (Shuffle, Backspace, Clear All) */}
      <div className="flex items-center justify-center gap-2 md:gap-3 mt-2 w-full">
        <button
          type="button"
          onClick={onShuffle}
          disabled={status !== 'idle' || !!revealedWord}
          className="
            px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs
            border border-slate-700 shadow-[0_3px_0_#1e293b] active:translate-y-[2px] active:shadow-none
            transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40
          "
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-400" />
          <span>Đổi vị trí</span>
        </button>

        <button
          type="button"
          onClick={onBackspace}
          disabled={slottedLetters.length === 0 || status !== 'idle' || !!revealedWord}
          className="
            px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs
            border border-slate-700 shadow-[0_3px_0_#1e293b] active:translate-y-[2px] active:shadow-none
            transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40
          "
        >
          <Delete className="w-3.5 h-3.5 text-rose-400" />
          <span>Xóa lùi (⌫)</span>
        </button>

        <button
          type="button"
          onClick={onClearAll}
          disabled={slottedLetters.length === 0 || status !== 'idle' || !!revealedWord}
          className="
            px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs
            border border-slate-700 shadow-[0_3px_0_#1e293b] active:translate-y-[2px] active:shadow-none
            transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40
          "
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Xóa hết</span>
        </button>
      </div>
    </div>
  );
};
