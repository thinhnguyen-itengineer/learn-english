import React from 'react';
import { Volume2, VolumeX, FastForward, Sparkles, Keyboard } from 'lucide-react';

export interface AudioSoundwavePlayerProps {
  /** Whether audio is currently actively playing */
  isPlaying?: boolean;
  /** Playback speed (0.75 for slow / 1.0 for normal) */
  speed?: 0.75 | 1.0;
  /** Triggered when speed toggle button is clicked */
  onSpeedChange?: (speed: 0.75 | 1.0) => void;
  /** Triggered when user clicks Play / Replay button or presses Spacebar */
  onPlayAudio?: () => void;
  /** IPA international phonetic transcription (e.g. /ˌkɒm.prɪˈhen.ʃən/) */
  ipa?: string;
  /** Part of speech in English/Vietnamese (e.g. Noun / Danh từ) */
  partOfSpeech?: string;
  /** Concise Vietnamese meaning / translation */
  meaningVi?: string;
  /** Context sentence with target word masked as blank line */
  contextSentence?: string;
  /** Times audio has been played for the current question */
  playCount?: number;
  /** Eligible for +30 Perfect Ear bonus (first listen, 1.0x only) */
  isPerfectEarEligible?: boolean;
  /** Custom extra styling classes */
  className?: string;
}

export const AudioSoundwavePlayer: React.FC<AudioSoundwavePlayerProps> = ({
  isPlaying = false,
  speed = 1.0,
  onSpeedChange,
  onPlayAudio,
  ipa,
  partOfSpeech,
  meaningVi,
  contextSentence,
  playCount = 1,
  isPerfectEarEligible = true,
  className = '',
}) => {
  // Soundwave bars height pattern
  const waveHeights = [20, 45, 80, 55, 95, 70, 35, 90, 65, 40, 85, 50, 75, 30];

  return (
    <div
      className={`
        relative w-full max-w-2xl mx-auto rounded-3xl p-6 md:p-8
        bg-slate-900/95 border-2 border-slate-700/80 shadow-[0_8px_0_#1e293b]
        backdrop-blur-md flex flex-col items-center select-none
        transition-all duration-300
        ${className}
      `}
    >
      {/* Top Header: Perfect Ear Bonus indicator & Play count */}
      <div className="w-full flex items-center justify-between mb-4 text-xs font-bold">
        <div className="flex items-center gap-1.5">
          {isPerfectEarEligible ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Perfect Ear (+30 pts)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Nghe {playCount} lần
            </span>
          )}
        </div>

        {/* Speed switch: 0.75x (Turtle) vs 1.0x (Normal) */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => onSpeedChange?.(0.75)}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1
              ${speed === 0.75
                ? 'bg-amber-500 text-yellow-950 shadow-[0_2px_0_#b45309]'
                : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <span>🐢</span>
            <span>0.75x Chậm</span>
          </button>
          <button
            type="button"
            onClick={() => onSpeedChange?.(1.0)}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1
              ${speed === 1.0
                ? 'bg-emerald-500 text-white shadow-[0_2px_0_#047857]'
                : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <span>⚡</span>
            <span>1.0x Chuẩn</span>
          </button>
        </div>
      </div>

      {/* Main Soundwave Center Area */}
      <div className="flex flex-col items-center justify-center my-2 w-full">
        {/* Pulsing Play Button */}
        <div className="relative group my-2">
          {/* Animated Glow Aura when playing */}
          {isPlaying && (
            <div className="absolute -inset-3 rounded-full bg-cyan-500/30 blur-xl animate-pulse pointer-events-none" />
          )}

          <button
            type="button"
            onClick={onPlayAudio}
            aria-label="Phát âm thanh từ vựng"
            className={`
              relative w-24 h-24 md:w-28 md:h-28 rounded-full
              flex flex-col items-center justify-center cursor-pointer
              transition-all duration-150 ease-out active:scale-95 active:shadow-none
              ${isPlaying
                ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_6px_0_#0e7490] ring-4 ring-cyan-300/40'
                : 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_6px_0_#047857] hover:scale-105 hover:from-emerald-300 hover:to-teal-500'}
            `}
          >
            <Volume2 className={`w-10 h-10 md:w-12 md:h-12 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-wider mt-1 opacity-90">
              {isPlaying ? 'Đang phát...' : 'Phát âm'}
            </span>
          </button>
        </div>

        {/* Audio Soundwave Visualization Bars */}
        <div className="flex items-center justify-center gap-1.5 md:gap-2 h-12 my-3 px-4 py-2 bg-slate-950/60 rounded-2xl border border-slate-800/80 w-full max-w-md">
          {waveHeights.map((h, i) => (
            <span
              key={i}
              className={`
                w-1.5 md:w-2 rounded-full transition-all duration-200
                ${isPlaying
                  ? 'bg-gradient-to-t from-cyan-500 to-emerald-400'
                  : 'bg-slate-700/60'}
              `}
              style={{
                height: isPlaying ? `${Math.max(12, h * (speed === 0.75 ? 0.75 : 1))}%` : '20%',
                animation: isPlaying ? `soundwave-pulse 0.9s ease-in-out infinite ${i * 0.08}s` : 'none',
              }}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <Keyboard className="w-3.5 h-3.5 text-slate-500" />
          <span>Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[10px]">Space</kbd> để nghe lại</span>
        </div>
      </div>

      {/* IPA Pronunciation & Part of Speech */}
      <div className="mt-4 flex flex-col items-center gap-2 text-center w-full">
        {ipa && (
          <div className="text-xl md:text-2xl font-mono font-bold text-amber-400 tracking-wider bg-slate-950/70 px-4 py-1.5 rounded-xl border border-amber-500/30">
            {ipa}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {partOfSpeech && (
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {partOfSpeech}
            </span>
          )}
          {meaningVi && (
            <span className="text-sm font-medium text-slate-300 italic">
              — {meaningVi}
            </span>
          )}
        </div>
      </div>

      {/* Context Sentence Hint */}
      {contextSentence && (
        <div className="mt-4 w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
          <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
            Gợi ý ngữ cảnh:
          </span>
          <p className="text-sm md:text-base font-semibold text-slate-200 leading-relaxed">
            &ldquo;{contextSentence}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
