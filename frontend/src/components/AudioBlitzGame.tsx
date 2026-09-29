import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Volume2, ArrowLeft, Heart, Flame, Sparkles, 
  RotateCcw, Delete, Shuffle, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { AudioBlitzInitResponse, CompleteSessionRequest } from '../types/game';
import { sound } from '../utils/sound';
import { Button } from './ui/Button';

interface AudioBlitzGameProps {
  data: AudioBlitzInitResponse;
  onComplete: (request: CompleteSessionRequest) => void;
  onExit: () => void;
}

interface SlottedLetter {
  id: string; // unique id from tile or keyboard input
  char: string;
}

export const AudioBlitzGame: React.FC<AudioBlitzGameProps> = ({
  data,
  onComplete,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(data.initialLives || 3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameStartTime] = useState(() => Date.now());

  // Current item state
  const currentItem = data.items[currentIndex];
  
  // We deduce target word from letters or bank:
  const [inputSlots, setInputSlots] = useState<SlottedLetter[]>([]);
  const [letterBank, setLetterBank] = useState<{ id: string; char: string; used: boolean }[]>([]);
  
  // Timer per question (15 seconds)
  const [timeLeft, setTimeLeft] = useState(currentItem?.timeLimitSeconds || 15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong' | 'timeout'>('idle');
  const [revealedWord, setRevealedWord] = useState<string | null>(null);
  const [isPerfectEar, setIsPerfectEar] = useState(true);
  const [audioPlayCount, setAudioPlayCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize word tiles for current question
  const initQuestion = useCallback((itemIndex: number) => {
    const item = data.items[itemIndex];
    if (!item) return;

    const bank = item.letterBank.map((char, idx) => ({
      id: `tile_${itemIndex}_${idx}_${char}`,
      char: char.toUpperCase(),
      used: false
    }));

    setLetterBank(bank);
    setInputSlots([]);
    setTimeLeft(item.timeLimitSeconds || 15);
    setIsAnswered(false);
    setAnswerStatus('idle');
    setRevealedWord(null);
    setIsPerfectEar(true);
    setAudioPlayCount(0);
  }, [data.items]);

  useEffect(() => {
    initQuestion(currentIndex);
  }, [currentIndex, initQuestion]);

  // Audio Playback
  const playAudio = useCallback((speed: number = 1.0) => {
    if (!currentItem) return;
    setIsPlayingAudio(true);
    setAudioPlayCount(prev => prev + 1);

    if (speed < 1.0) {
      setIsPerfectEar(false);
    }
    if (audioPlayCount >= 1) {
      setIsPerfectEar(false);
    }

    // Try HTML5 Audio if real URL is valid, or fallback to Web Speech Synthesis
    const audioUrl = speed < 1.0 && currentItem.slowAudioUrl ? currentItem.slowAudioUrl : currentItem.audioUrl;
    if (audioUrl && audioUrl.startsWith('http') && !audioUrl.includes('.local')) {
      const audio = new Audio(audioUrl);
      audio.playbackRate = speed;
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        sound.speak(currentItem.targetWord || currentItem.definitionVi, speed);
        setTimeout(() => setIsPlayingAudio(false), 1000);
      };
      audio.play().catch(() => {
        sound.speak(currentItem.targetWord || currentItem.definitionVi, speed);
        setTimeout(() => setIsPlayingAudio(false), 1000);
      });
    } else {
      // Use clean speech synthesis with target word
      sound.speak(currentItem.targetWord || currentItem.definitionVi, speed);
      setTimeout(() => setIsPlayingAudio(false), 1200);
    }
  }, [currentItem, audioPlayCount]);

  // Auto-play audio on question entry
  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio(1.0);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown Timer
  useEffect(() => {
    if (isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnswered, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Timeout
  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setAnswerStatus('timeout');
    sound.playError();
    setTotalAttempts(prev => prev + 1);
    setCombo(0);

    const newLives = lives - 1;
    setLives(newLives);

    // Form correct word to reveal
    const wordTarget = currentItem?.targetWord || 'TARGET';
    setRevealedWord(wordTarget);

    setTimeout(() => {
      if (newLives <= 0) {
        finishGame(score, correctAnswers, totalAttempts + 1, maxCombo);
      } else {
        advanceNextQuestion();
      }
    }, 1800);
  };

  // Click on tile in bank
  const handleTileClick = (tileId: string) => {
    if (isAnswered) return;
    if (inputSlots.length >= currentItem.targetWordLength) return;

    const tile = letterBank.find(t => t.id === tileId);
    if (!tile || tile.used) return;

    sound.playClick();

    setLetterBank(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    const nextSlots = [...inputSlots, { id: tile.id, char: tile.char }];
    setInputSlots(nextSlots);

    if (nextSlots.length === currentItem.targetWordLength) {
      validateAnswer(nextSlots);
    }
  };

  // Remove letter from input slot
  const handleRemoveSlot = (slotIndex: number) => {
    if (isAnswered) return;
    const removed = inputSlots[slotIndex];
    if (!removed) return;

    sound.playClick();
    setInputSlots(prev => prev.filter((_, idx) => idx !== slotIndex));
    setLetterBank(prev => prev.map(t => t.id === removed.id ? { ...t, used: false } : t));
  };

  // Backspace
  const handleBackspace = () => {
    if (isAnswered || inputSlots.length === 0) return;
    handleRemoveSlot(inputSlots.length - 1);
  };

  // Clear all
  const handleClearAll = () => {
    if (isAnswered) return;
    sound.playClick();
    setInputSlots([]);
    setLetterBank(prev => prev.map(t => ({ ...t, used: false })));
  };

  // Shuffle letter bank
  const handleShuffle = () => {
    if (isAnswered) return;
    sound.playClick();
    setLetterBank(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Validate answer when slots are full
  const validateAnswer = (slots: SlottedLetter[]) => {
    const inputWord = slots.map(s => s.char).join('');
    setTotalAttempts(prev => prev + 1);

    // Check correctness against target word
    const targetWordExpected = (currentItem.targetWord || '').trim().toUpperCase();
    const isCorrect = inputWord.trim().toUpperCase() === targetWordExpected;

    if (isCorrect) {
      // Calculate score according to spec
      // Base: 100, Speed: +50 (<5s elapsed / >10s left), +25 (5-10s), Perfect Ear: +30
      const elapsed = (currentItem.timeLimitSeconds || 15) - timeLeft;
      let speedBonus = 0;
      if (elapsed <= 5) speedBonus = 50;
      else if (elapsed <= 10) speedBonus = 25;

      const perfectBonus = isPerfectEar ? 30 : 0;
      const nextCombo = combo + 1;
      const comboMultiplier = nextCombo >= 7 ? 2.0 : nextCombo >= 5 ? 1.5 : nextCombo >= 3 ? 1.2 : 1.0;

      const questionScore = Math.round((100 + speedBonus + perfectBonus) * comboMultiplier);
      const newScore = score + questionScore;
      const newCorrect = correctAnswers + 1;
      const newMaxCombo = Math.max(maxCombo, nextCombo);

      setScore(newScore);
      setCombo(nextCombo);
      setMaxCombo(newMaxCombo);
      setCorrectAnswers(newCorrect);
      setIsAnswered(true);
      setAnswerStatus('correct');
      sound.playSuccess();

      setTimeout(() => {
        advanceNextQuestion(newScore, newCorrect, newMaxCombo);
      }, 800);
    } else {
      // Wrong answer
      const newLives = lives - 1;
      setLives(newLives);
      setCombo(0);
      setAnswerStatus('wrong');
      sound.playError();

      if (newLives <= 0) {
        setIsAnswered(true);
        setTimeout(() => {
          finishGame(score, correctAnswers, totalAttempts + 1, maxCombo);
        }, 1200);
      } else {
        // Allow retry remaining time
        setTimeout(() => {
          setAnswerStatus('idle');
          handleClearAll();
        }, 600);
      }
    }
  };

  const advanceNextQuestion = (
    currentScore = score,
    currentCorrect = correctAnswers,
    currentMaxCombo = maxCombo
  ) => {
    if (currentIndex + 1 >= data.items.length) {
      // Victory!
      sound.playVictory();
      finishGame(currentScore, currentCorrect, totalAttempts + 1, currentMaxCombo);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const finishGame = (
    finalScore: number, 
    finalCorrect: number, 
    finalAttempts: number, 
    finalCombo: number
  ) => {
    const durationSeconds = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
    onComplete({
      sessionId: data.sessionId,
      score: finalScore,
      durationSeconds,
      totalAttempts: Math.max(finalAttempts, 1),
      correctAnswers: finalCorrect,
      maxCombo: finalCombo,
      status: lives > 0 ? 'Completed' : 'Failed'
    });
  };

  // Keyboard shortcut listener (Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) return;

      if (e.code === 'Space') {
        e.preventDefault();
        playAudio(1.0);
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      // Check if user pressed a letter key
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        // Find unused tile with this char
        const availableTile = letterBank.find(t => t.char === key && !t.used);
        if (availableTile) {
          handleTileClick(availableTile.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, letterBank, inputSlots, playAudio]); // eslint-disable-line react-hooks/exhaustive-deps

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / (currentItem?.timeLimitSeconds || 15)) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top HUD */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Thoát
          </Button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-sm">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            Audio Blitz
          </div>
        </div>

        {/* Lives (Hearts) */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(heartIndex => (
            <Heart
              key={heartIndex}
              className={`w-6 h-6 transition-all duration-300 ${
                heartIndex <= lives
                  ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'text-slate-600 fill-slate-800 opacity-40'
              }`}
            />
          ))}
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono">
            <Sparkles className="w-4 h-4" />
            <span>{score} pts</span>
          </div>

          <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black transition-all ${
            combo >= 2
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse'
              : 'text-slate-400'
          }`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>x{combo >= 7 ? '2.0' : combo >= 5 ? '1.5' : combo >= 3 ? '1.2' : '1.0'}</span>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded-md">
            {currentIndex + 1} / {data.items.length}
          </div>
        </div>
      </div>

      {/* Main Soundwave Player Arena */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Pulsing Soundwave Speaker Button */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            {isPlayingAudio && (
              <>
                <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
                <div className="absolute -inset-3 rounded-full border-2 border-indigo-400/40 animate-pulse pointer-events-none" />
              </>
            )}
            <button
              onClick={() => playAudio(1.0)}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isPlayingAudio
                  ? 'bg-indigo-500 text-white scale-105 shadow-indigo-500/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 shadow-indigo-600/30'
              }`}
              title="Phát âm (Phím cách Space)"
            >
              <Volume2 className={`w-12 h-12 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          {/* Audio Speed Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => playAudio(0.75)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>🐢</span> Nghe chậm 0.75x
            </button>
            <button
              onClick={() => playAudio(1.0)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>⚡</span> Chuẩn 1.0x
            </button>
          </div>

          <span className="text-[11px] text-slate-500">
            Phím tắt: bấm <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Space</kbd> để phát lại âm thanh
          </span>
        </div>

        {/* Phonetic & Clues */}
        <div className="space-y-2">
          <div className="text-2xl font-mono font-bold text-amber-400 tracking-wider">
            {currentItem?.phonetic || '/.../'}
          </div>
          <div className="text-xs sm:text-sm text-slate-300">
            <span className="font-semibold text-indigo-400 capitalize">({currentItem?.partOfSpeech})</span>: {currentItem?.definitionVi}
          </div>

          {currentItem?.contextSentence && (
            <div className="mt-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-slate-300 text-sm italic max-w-lg mx-auto">
              &ldquo;{currentItem.contextSentence}&rdquo;
            </div>
          )}
        </div>

        {/* Word Input Slots */}
        <div className="pt-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: currentItem?.targetWordLength || 6 }).map((_, idx) => {
              const slotted = inputSlots[idx];
              const isCurrentCursor = idx === inputSlots.length && !isAnswered;

              let slotClass = 'bg-slate-800/80 border-slate-600 text-white';
              if (answerStatus === 'correct') {
                slotClass = 'bg-emerald-500 border-emerald-400 text-white scale-105 transition-transform';
              } else if (answerStatus === 'wrong') {
                slotClass = 'bg-rose-500/20 border-rose-500 text-rose-300 animate-shake';
              } else if (answerStatus === 'timeout') {
                slotClass = 'bg-amber-500/20 border-amber-500 text-amber-300';
              } else if (isCurrentCursor) {
                slotClass = 'border-indigo-400 bg-indigo-500/10 ring-2 ring-indigo-500/40';
              }

              return (
                <button
                  key={idx}
                  onClick={() => slotted && handleRemoveSlot(idx)}
                  disabled={!slotted || isAnswered}
                  className={`w-11 h-14 sm:w-13 sm:h-16 rounded-xl border-2 font-mono font-black text-xl sm:text-2xl flex items-center justify-center transition-all ${slotClass}`}
                >
                  {revealedWord ? (
                    <span className="text-amber-300 font-bold">{revealedWord[idx]}</span>
                  ) : (
                    slotted?.char || ''
                  )}
                </button>
              );
            })}
          </div>

          {answerStatus === 'correct' && (
            <div className="mt-3 text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4" /> Chính xác! Tuyệt vời!
            </div>
          )}

          {answerStatus === 'wrong' && (
            <div className="mt-3 text-rose-400 font-bold text-sm flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Sai chính tả rồi, thử lại nhé!
            </div>
          )}

          {answerStatus === 'timeout' && (
            <div className="mt-3 text-amber-400 font-bold text-sm flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Hết giờ! Từ chính xác là: {revealedWord}
            </div>
          )}
        </div>

        {/* Letter Bank Tiles */}
        <div className="space-y-4 pt-2">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
            Ngân hàng ký tự (Letter Tiles)
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
            {letterBank.map(tile => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                disabled={tile.used || isAnswered}
                className={`w-11 h-12 sm:w-12 sm:h-13 rounded-xl font-mono font-black text-lg sm:text-xl border transition-all duration-150 ${
                  tile.used
                    ? 'bg-slate-800/30 border-slate-800 text-slate-600 opacity-30 cursor-not-allowed scale-95'
                    : 'bg-slate-700 hover:bg-indigo-600 active:scale-95 border-slate-600 hover:border-indigo-400 text-white shadow-md'
                }`}
              >
                {tile.char}
              </button>
            ))}
          </div>

          {/* Action Utility Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleShuffle}
              disabled={isAnswered}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Đổi vị trí
            </button>

            <button
              onClick={handleBackspace}
              disabled={isAnswered || inputSlots.length === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Delete className="w-3.5 h-3.5" />
              Xóa lùi
            </button>

            <button
              onClick={handleClearAll}
              disabled={isAnswered || inputSlots.length === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 border border-slate-700 hover:border-rose-700/50 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Xóa hết
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Progress & Timer Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>Thời gian còn lại</span>
          <span className={`font-bold ${timeLeft <= 4 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              timeLeft <= 4 ? 'bg-rose-500' : timeLeft <= 8 ? 'bg-amber-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
