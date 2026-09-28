import React, { useState, useEffect, useRef } from 'react';
import { Heart, Volume2, Zap, ArrowLeft, Pause, Play, AlertCircle } from 'lucide-react';
import { CompleteSessionRequest, SpeedFallingInitResponse, SpeedFallingWordItem } from '../types/game';
import { sound } from '../utils/sound';

interface SpeedFallingGameProps {
  data: SpeedFallingInitResponse;
  onComplete: (result: CompleteSessionRequest) => void;
  onExit: () => void;
}

export const SpeedFallingGame: React.FC<SpeedFallingGameProps> = ({ data, onComplete, onExit }) => {
  const [words] = useState<SpeedFallingWordItem[]>(data.words);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(data.initialLives || 3);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  // Position of falling word: 0% to 100%
  const [fallProgress, setFallProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  const currentWord = words[currentIndex];

  // Falling animation loop
  useEffect(() => {
    if (!currentWord || isPaused || lives <= 0) return;

    // Reset progress when new word arrives
    setFallProgress(0);
    lastTimeRef.current = performance.now();
    sound.speak(currentWord.term);

    // Duration accelerates with wave index
    const waveSpeedFactor = Math.max(0.55, 1.0 - currentIndex * 0.05);
    const fallDurationMs = currentWord.baseFallDurationMs * waveSpeedFactor;

    const animate = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setFallProgress(prev => {
        const next = prev + (delta / fallDurationMs) * 100;
        if (next >= 100) {
          // Hit bottom! Lose 1 life!
          handleHitBottom();
          return 0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentIndex, isPaused, lives]);

  // Keyboard shortcut listener (keys 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || !currentWord) return;
      const keyIndex = parseInt(e.key, 10) - 1;
      if (keyIndex >= 0 && keyIndex < currentWord.options.length) {
        handleOptionSelect(currentWord.options[keyIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentWord, isPaused]);

  const handleHitBottom = () => {
    sound.playError();
    setCombo(1);
    setTotalAttempts(prev => prev + 1);

    const nextLives = lives - 1;
    setLives(nextLives);

    if (nextLives <= 0) {
      finishGame('Failed');
    } else {
      goToNextWord();
    }
  };

  const handleOptionSelect = (selectedOption: string) => {
    if (!currentWord || isPaused) return;

    setTotalAttempts(prev => prev + 1);

    if (selectedOption === currentWord.correctDefinitionVi) {
      // CORRECT!
      sound.playSuccess();
      const comboMultiplier = Math.min(2.0, 1.0 + (combo - 1) * 0.2);
      // Points higher when caught higher
      const heightBonus = Math.round((100 - fallProgress) * 0.8);
      const earned = Math.round((100 + heightBonus) * comboMultiplier);

      setScore(prev => prev + earned);
      setCorrectAnswers(prev => prev + 1);

      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo(prev => Math.max(prev, nextCombo));

      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        goToNextWord();
      }, 300);
    } else {
      // WRONG OPTION!
      sound.playError();
      setCombo(1);
      const nextLives = lives - 1;
      setLives(nextLives);

      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        if (nextLives <= 0) {
          finishGame('Failed');
        } else {
          goToNextWord();
        }
      }, 400);
    }
  };

  const goToNextWord = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      sound.playVictory();
      finishGame('Completed');
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
      maxCombo,
      status
    });
  };

  if (!currentWord) return null;

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

        {/* Lives (Hearts) */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(heartIdx => (
            <Heart
              key={heartIdx}
              className={`w-6 h-6 transition-all ${
                heartIdx <= lives
                  ? 'fill-rose-500 text-rose-500 scale-100'
                  : 'fill-slate-700 text-slate-600 scale-75'
              }`}
            />
          ))}
        </div>

        {/* Combo & Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-400">
            <Zap className={`w-4 h-4 fill-amber-400 ${combo > 1 ? 'animate-bounce' : ''}`} />
            <span className="font-extrabold text-sm">x{combo > 1 ? (1.0 + (combo - 1) * 0.2).toFixed(1) : '1.0'}</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Điểm</span>
            <p className="text-lg font-black text-white">{score}</p>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Falling Arena */}
      <div className="relative w-full h-[320px] bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-inner flex flex-col justify-between">
        {/* Sky / Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

        {/* Falling Word Object */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-transform duration-75 ease-linear pointer-events-none"
          style={{ top: `${fallProgress * 0.72}%` }}
        >
          <div className={`px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-indigo-600 to-amber-600 text-white font-extrabold text-lg sm:text-2xl shadow-xl border border-white/20 flex items-center gap-3 backdrop-blur-md ${
            feedback === 'wrong' ? 'animate-shake bg-rose-600' : ''
          }`}>
            <span>{currentWord.term}</span>
            {currentWord.phonetic && (
              <span className="text-xs text-amber-200 font-mono hidden sm:inline">
                {currentWord.phonetic}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.speak(currentWord.term);
              }}
              className="pointer-events-auto p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
              title="Phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wave Indicator Top Right */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
          Từ {currentIndex + 1} / {words.length}
        </div>

        {/* Hazard Baseline */}
        <div className="mt-auto w-full h-8 bg-gradient-to-t from-rose-950/60 to-transparent border-b-2 border-rose-500/50 flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80">Vạch Nguy Hiểm</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <p className="text-xs text-center text-slate-400">Chọn nghĩa đúng của từ trước khi chạm vạch nguy hiểm (Phím 1-4)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentWord.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              className="group p-4 rounded-2xl bg-slate-800/80 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 text-left transition-all duration-150 flex items-center justify-between active:scale-98 shadow-md"
            >
              <span className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-indigo-200">
                {option}
              </span>
              <span className="w-6 h-6 rounded-lg bg-slate-700 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white text-xs font-mono font-bold flex items-center justify-center">
                {idx + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
