import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Volume2, Pause, Play, RotateCcw, ArrowLeft, Trophy } from 'lucide-react';
import { CompleteSessionRequest, WordMatchCard, WordMatchInitResponse } from '../types/game';
import { sound } from '../utils/sound';

interface WordMatchGameProps {
  data: WordMatchInitResponse;
  onComplete: (result: CompleteSessionRequest) => void;
  onExit: () => void;
}

export const WordMatchGame: React.FC<WordMatchGameProps> = ({ data, onComplete, onExit }) => {
  const [cards, setCards] = useState<WordMatchCard[]>(data.cards);
  const [selectedCards, setSelectedCards] = useState<WordMatchCard[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [mismatchedCardIds, setMismatchedCardIds] = useState<Set<string>>(new Set());
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Stats
  const [timeLeft, setTimeLeft] = useState<number>(data.timeLimitSeconds);
  const [bonusTimeIndicator, setBonusTimeIndicator] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const totalPairs = data.cards.length / 2;

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;

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
  }, [isPaused]);

  // Check completion
  useEffect(() => {
    if (matchedPairIds.size === totalPairs && totalPairs > 0) {
      sound.playVictory();
      finishGame('Completed');
    }
  }, [matchedPairIds.size]);

  const finishGame = (status: string) => {
    const duration = Math.min(
      data.timeLimitSeconds,
      Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
    );

    onComplete({
      sessionId: data.sessionId,
      score,
      durationSeconds: duration,
      totalAttempts: Math.max(totalAttempts, matchedPairIds.size),
      correctAnswers: matchedPairIds.size,
      maxCombo,
      status
    });
  };

  const handleCardClick = (card: WordMatchCard) => {
    if (isLocked || isPaused) return;
    if (matchedPairIds.has(card.pairId)) return;
    if (selectedCards.some(c => c.id === card.id)) return;

    sound.playClick();
    if (card.type === 'EN') {
      sound.speak(card.content);
    }

    const nextSelected = [...selectedCards, card];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setIsLocked(true);
      setTotalAttempts(prev => prev + 1);

      const [c1, c2] = nextSelected;
      if (c1.pairId === c2.pairId) {
        // MATCH!
        sound.playSuccess();
        setMatchedPairIds(prev => new Set(prev).add(c1.pairId));
        setCorrectAnswers(prev => prev + 1);

        // Score formula with combo
        const comboMultiplier = Math.min(2.0, 1.0 + (combo - 1) * 0.2);
        const earnedPoints = Math.round(100 * comboMultiplier);
        setScore(prev => prev + earnedPoints);

        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));

        // Bonus time +2s
        setTimeLeft(prev => Math.min(data.timeLimitSeconds, prev + 2));
        setBonusTimeIndicator(true);
        setTimeout(() => setBonusTimeIndicator(false), 1000);

        setSelectedCards([]);
        setIsLocked(false);
      } else {
        // MISMATCH
        sound.playError();
        setCombo(1);
        setMismatchedCardIds(new Set([c1.id, c2.id]));

        setTimeout(() => {
          setSelectedCards([]);
          setMismatchedCardIds(new Set());
          setIsLocked(false);
        }, 600);
      }
    }
  };

  const timerPercent = (timeLeft / data.timeLimitSeconds) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-2xl">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Về Sảnh
        </button>

        {/* Live Stats */}
        <div className="flex items-center gap-6">
          {/* Combo */}
          <div className="flex items-center gap-1.5 text-amber-400">
            <Zap className={`w-4 h-4 fill-amber-400 ${combo > 1 ? 'animate-bounce' : ''}`} />
            <span className="font-extrabold text-sm sm:text-base">x{combo > 1 ? (1.0 + (combo - 1) * 0.2).toFixed(1) : '1.0'}</span>
          </div>

          {/* Score */}
          <div className="text-right">
            <span className="text-xs text-slate-400">Điểm</span>
            <p className="text-lg sm:text-xl font-black text-white">{score}</p>
          </div>

          {/* Pause */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-indigo-400" />
            Thời gian: {timeLeft}s
          </span>
          {bonusTimeIndicator && (
            <span className="text-emerald-400 font-extrabold animate-bounce">+2s Thưởng!</span>
          )}
          <span>Đã ghép: {matchedPairIds.size}/{totalPairs}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${
              timeLeft <= 10 ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-2">
        {cards.map(card => {
          const isMatched = matchedPairIds.has(card.pairId);
          const isSelected = selectedCards.some(c => c.id === card.id);
          const isMismatched = mismatchedCardIds.has(card.id);

          return (
            <div
              key={card.id}
              onClick={() => !isMatched && handleCardClick(card)}
              className={`relative min-h-[105px] sm:min-h-[125px] p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-200 transform border ${
                isMatched
                  ? 'bg-emerald-950/40 border-emerald-500/40 opacity-40 scale-95 pointer-events-none'
                  : isMismatched
                  ? 'bg-rose-950/50 border-rose-500 animate-shake shadow-lg shadow-rose-500/20'
                  : isSelected
                  ? 'bg-indigo-900/60 border-indigo-400 ring-2 ring-indigo-400/60 scale-105 shadow-xl shadow-indigo-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-slate-600 hover:scale-102 shadow-md'
              }`}
            >
              {/* Type pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  card.type === 'EN' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {card.type === 'EN' ? 'EN' : 'VI'}
                </span>
              </div>

              {/* Speaker icon for EN */}
              {card.type === 'EN' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.speak(card.content);
                  }}
                  className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-white"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Main Text */}
              <p className={`font-bold text-sm sm:text-base leading-snug px-1 ${
                card.type === 'EN' ? 'text-white' : 'text-slate-200'
              }`}>
                {card.content}
              </p>

              {/* Subcontent (Phonetic) */}
              {card.subContent && (
                <p className="mt-1 text-xs text-indigo-300 font-mono tracking-tight">
                  {card.subContent}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Paused Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white">Đang Tạm Dừng</h3>
            <p className="text-slate-400 text-xs">Ván chơi tạm dừng, thời gian đã được giữ nguyên.</p>
            <div className="space-y-3">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Play className="w-4 h-4 fill-white" />
                Tiếp tục chơi
              </button>
              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Rời ván chơi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
