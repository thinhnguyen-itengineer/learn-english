import React, { useState, useEffect, useRef } from 'react';
import { Volume2, HelpCircle, Check, ArrowLeft, RotateCcw, Sparkles, Timer } from 'lucide-react';
import { CompleteSessionRequest, SentenceScrambleInitResponse, SentenceScrambleItem, TokenChip } from '../types/game';
import { sound } from '../utils/sound';

interface SentenceScrambleGameProps {
  data: SentenceScrambleInitResponse;
  onComplete: (result: CompleteSessionRequest) => void;
  onExit: () => void;
}

export const SentenceScrambleGame: React.FC<SentenceScrambleGameProps> = ({ data, onComplete, onExit }) => {
  const [sentences] = useState<SentenceScrambleItem[]>(data.sentences);
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Chips in source bank vs placed in dropzone
  const [sourceChips, setSourceChips] = useState<TokenChip[]>([]);
  const [placedChips, setPlacedChips] = useState<TokenChip[]>([]);

  // State
  const [timeLeft, setTimeLeft] = useState<number>(data.totalTimeLimitSeconds || 180);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintUsedThisQuestion, setHintUsedThisQuestion] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean>(false);

  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const startTimeRef = useRef<number>(Date.now());
  const currentSentence = sentences[currentIdx];

  // Initialize chips for current sentence
  useEffect(() => {
    if (currentSentence) {
      setSourceChips([...currentSentence.shuffledTokens]);
      setPlacedChips([]);
      setShowHint(false);
      setHintUsedThisQuestion(false);
      setIsError(false);
      setIsCorrectFeedback(false);
    }
  }, [currentIdx]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame('TimeOut');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChipClick = (chip: TokenChip, fromDropzone: boolean) => {
    sound.playClick();
    if (fromDropzone) {
      // Remove from dropzone back to pool
      setPlacedChips(prev => prev.filter(c => c.id !== chip.id));
      setSourceChips(prev => [...prev, chip]);
    } else {
      // Place into dropzone
      setSourceChips(prev => prev.filter(c => c.id !== chip.id));
      setPlacedChips(prev => [...prev, chip]);
    }
    setIsError(false);
  };

  const handleReset = () => {
    if (!currentSentence) return;
    setSourceChips([...currentSentence.shuffledTokens]);
    setPlacedChips([]);
    setIsError(false);
  };

  const handleCheck = () => {
    if (!currentSentence) return;

    setTotalAttempts(prev => prev + 1);

    const assembledWords = placedChips.map(c => c.word);
    const targetWords = currentSentence.correctOrderTokens;

    const isMatch = assembledWords.length === targetWords.length &&
      assembledWords.every((w, i) => w.toLowerCase() === targetWords[i].toLowerCase());

    if (isMatch) {
      // SUCCESS!
      sound.playSuccess();
      sound.speak(targetWords.join(' '));

      const points = hintUsedThisQuestion ? 100 : 150;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setIsCorrectFeedback(true);

      setTimeout(() => {
        if (currentIdx + 1 < sentences.length) {
          setCurrentIdx(prev => prev + 1);
        } else {
          sound.playVictory();
          finishGame('Completed');
        }
      }, 1000);
    } else {
      // WRONG!
      sound.playError();
      setIsError(true);
      setTimeout(() => setIsError(false), 600);
    }
  };

  const finishGame = (status: string) => {
    const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    onComplete({
      sessionId: data.sessionId,
      score,
      durationSeconds: duration,
      totalAttempts: Math.max(totalAttempts, correctAnswers),
      correctAnswers,
      maxCombo: correctAnswers,
      status
    });
  };

  if (!currentSentence) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-2xl">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Về Sảnh
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
          <Timer className="w-4 h-4 text-emerald-400" />
          <span>{timeLeft}s</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-slate-400">Câu</span>
            <p className="text-sm font-bold text-emerald-400">{currentIdx + 1} / {sentences.length}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Điểm</span>
            <p className="text-lg font-black text-white">{score}</p>
          </div>
        </div>
      </div>

      {/* Vietnamese Prompt Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-800 to-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Dịch nghĩa câu sau sang tiếng Anh</span>
          <button
            onClick={() => {
              setShowHint(!showHint);
              setHintUsedThisQuestion(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Gợi ý {hintUsedThisQuestion ? '' : '(-25% điểm)'}
          </button>
        </div>

        <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          "{currentSentence.vietnameseTranslation}"
        </p>

        {showHint && currentSentence.hintText && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
            💡 <strong>Gợi ý:</strong> {currentSentence.hintText}
          </div>
        )}
      </div>

      {/* Dropzone (Target assembled sentence) */}
      <div className={`min-h-[110px] p-5 rounded-3xl bg-slate-900/90 border-2 border-dashed transition-all duration-200 flex flex-wrap items-center gap-2.5 ${
        isCorrectFeedback
          ? 'border-emerald-500 bg-emerald-950/20'
          : isError
          ? 'border-rose-500 bg-rose-950/20 animate-shake'
          : placedChips.length > 0
          ? 'border-indigo-500/70 bg-indigo-950/10'
          : 'border-slate-700'
      }`}>
        {placedChips.length === 0 ? (
          <p className="w-full text-center text-xs text-slate-500 select-none">
            Chạm vào các từ bên dưới theo thứ tự để lắp ghép câu hoàn chỉnh
          </p>
        ) : (
          placedChips.map((chip, idx) => (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip, true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm sm:text-base shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {chip.word}
            </button>
          ))
        )}
      </div>

      {/* Source Word Chips Pool */}
      <div className="p-5 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Kho từ xáo trộn</span>
          {placedChips.length > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {sourceChips.map(chip => (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip, false)}
              className="px-4 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-200 font-bold text-sm sm:text-base shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              {chip.word}
            </button>
          ))}
        </div>
      </div>

      {/* Check Answer Button */}
      <button
        disabled={placedChips.length === 0 || isCorrectFeedback}
        onClick={handleCheck}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all duration-200"
      >
        <Check className="w-5 h-5" />
        Kiểm Tra Đáp Án
      </button>
    </div>
  );
};
