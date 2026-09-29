import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, Flame, Sparkles, Lightbulb, Type, CheckCircle2, 
  XCircle, ArrowRight, HelpCircle, BookOpen 
} from 'lucide-react';
import { ClozeMasterInitResponse, CompleteSessionRequest, ClozeOptionDto } from '../types/game';
import { sound } from '../utils/sound';
import { Button } from './ui/Button';

interface ClozeMasterGameProps {
  data: ClozeMasterInitResponse;
  onComplete: (request: CompleteSessionRequest) => void;
  onExit: () => void;
}

export const ClozeMasterGame: React.FC<ClozeMasterGameProps> = ({
  data,
  onComplete,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameStartTime] = useState(Date.now());

  // Current question data
  const currentQuestion = data.questions[currentIndex];
  
  // Power-up states (limited per game)
  const [fiftyFiftyUsedCount, setFiftyFiftyUsedCount] = useState(0);
  const [isFiftyFiftyActiveForCurrent, setIsFiftyFiftyActiveForCurrent] = useState(false);
  const [eliminatedOptionIds, setEliminatedOptionIds] = useState<string[]>([]);
  const [hintFirstLetterActive, setHintFirstLetterActive] = useState(false);

  // Question interaction state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(data.timePerQuestionSeconds || 20);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize new question
  const initQuestion = useCallback((index: number) => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFiftyFiftyActiveForCurrent(false);
    setEliminatedOptionIds([]);
    setHintFirstLetterActive(false);
    setTimeLeft(data.timePerQuestionSeconds || 20);
  }, [data.timePerQuestionSeconds]);

  useEffect(() => {
    initQuestion(currentIndex);
  }, [currentIndex, initQuestion]);

  // Read context sentence aloud with speech synthesis
  useEffect(() => {
    if (currentQuestion) {
      const cleanSentence = currentQuestion.contextSentence
        .replace(/\[\s*BLANK\s*\]/gi, 'blank')
        .replace(/\[\s*________\s*\]/gi, 'blank');
      sound.speak(cleanSentence, 0.95);
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer
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

  // Handle timeout
  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCorrect(false);
    setSelectedOptionId('TIMEOUT');
    setStreak(0);
    setTotalAttempts(prev => prev + 1);
    sound.playError();
  };

  // Determine correct option
  // In our backend seed, the correct option word matches the correct word or definition
  // Or check against question's first option or text match
  const findCorrectOption = useCallback((): ClozeOptionDto | undefined => {
    if (!currentQuestion) return undefined;
    // Check explanation text or matching option
    const found = currentQuestion.options.find(opt => 
      currentQuestion.explanationText.toLowerCase().includes(`'${opt.word.toLowerCase()}'`) ||
      currentQuestion.explanationText.toLowerCase().includes(`"${opt.word.toLowerCase()}"`)
    );
    return found || currentQuestion.options[0];
  }, [currentQuestion]);

  const correctOption = findCorrectOption();

  // Use 50:50 power-up
  const handleUseFiftyFifty = () => {
    if (isAnswered || isFiftyFiftyActiveForCurrent || fiftyFiftyUsedCount >= 2 || !correctOption) return;

    sound.playClick();
    setIsFiftyFiftyActiveForCurrent(true);
    setFiftyFiftyUsedCount(prev => prev + 1);

    const wrongOptions = currentQuestion.options.filter(o => o.id !== correctOption.id);
    // Eliminate 2 wrong options randomly
    const toEliminate = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2).map(o => o.id);
    setEliminatedOptionIds(toEliminate);
  };

  // Use First Letter Hint
  const handleUseFirstLetterHint = () => {
    if (isAnswered || hintFirstLetterActive || !correctOption) return;
    sound.playClick();
    setHintFirstLetterActive(true);
  };

  // Select option handler
  const handleSelectOption = (option: ClozeOptionDto) => {
    if (isAnswered || eliminatedOptionIds.includes(option.id)) return;

    sound.playClick();
    setSelectedOptionId(option.id);
    setIsAnswered(true);
    setTotalAttempts(prev => prev + 1);

    const isAnswerCorrect = correctOption ? option.id === correctOption.id : false;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      sound.playSuccess();
      const nextStreak = streak + 1;
      const newMax = Math.max(maxStreak, nextStreak);
      setStreak(nextStreak);
      setMaxStreak(newMax);
      setCorrectAnswers(prev => prev + 1);

      // Scoring formula: (100 + RemainingSeconds * 5) * StreakMultiplier * (50:50 ? 0.7 : 1.0)
      const streakMultiplier = nextStreak >= 7 ? 2.0 : nextStreak >= 5 ? 1.5 : nextStreak >= 3 ? 1.25 : 1.0;
      const basePoints = 100 + timeLeft * 5;
      const penalty = isFiftyFiftyActiveForCurrent ? 0.7 : 1.0;
      const earned = Math.round(basePoints * streakMultiplier * penalty);

      setScore(prev => prev + earned);
    } else {
      sound.playError();
      setStreak(0);
    }
  };

  // Advance to next question or complete
  const handleNextQuestion = () => {
    if (currentIndex + 1 >= data.questions.length) {
      sound.playVictory();
      const durationSeconds = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
      onComplete({
        sessionId: data.sessionId,
        score,
        durationSeconds,
        totalAttempts: Math.max(totalAttempts, 1),
        correctAnswers,
        maxCombo: maxStreak,
        status: 'Completed'
      });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Keyboard shortcut listener (1-4 or A-D, Enter / Space for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleNextQuestion();
        }
        return;
      }

      const key = e.key.toUpperCase();
      const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

      if (key in keyMap) {
        const optionIndex = keyMap[key];
        const opt = currentQuestion?.options[optionIndex];
        if (opt && !eliminatedOptionIds.includes(opt.id)) {
          handleSelectOption(opt);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQuestion, eliminatedOptionIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / (data.timePerQuestionSeconds || 20)) * 100));

  // Render context sentence with blank placeholder
  const renderSentenceWithBlank = () => {
    if (!currentQuestion) return null;

    let blankContent = '________';
    if (isAnswered && correctOption) {
      blankContent = correctOption.word;
    } else if (hintFirstLetterActive && correctOption) {
      blankContent = `${correctOption.word.charAt(0)}________`;
    }

    const parts = currentQuestion.contextSentence.split(/\[\s*BLANK\s*\]|\[\s*________\s*\]/gi);

    return (
      <p className="text-lg sm:text-2xl font-medium text-slate-100 leading-relaxed">
        {parts[0]}
        <span className={`inline-flex items-center px-3 py-1 mx-1.5 rounded-xl font-bold font-mono transition-all border-2 ${
          isAnswered
            ? isCorrect
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
              : 'bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-500/30'
            : 'bg-indigo-500/10 border-indigo-400/80 text-indigo-300 underline decoration-indigo-400 decoration-wavy'
        }`}>
          {blankContent}
        </span>
        {parts[1] || ''}
      </p>
    );
  };

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

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Cloze Master
          </div>
        </div>

        <div className="text-xs sm:text-sm font-bold text-slate-300">
          Câu: <span className="text-white font-mono">{currentIndex + 1}</span> / {data.questions.length}
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono">
            <Sparkles className="w-4 h-4" />
            <span>{score} pts</span>
          </div>

          <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black transition-all ${
            streak >= 2
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse'
              : 'text-slate-400'
          }`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Streak {streak}</span>
          </div>
        </div>
      </div>

      {/* Question Context Card */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Topic & Part of Speech Hint Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            Gợi ý từ loại: <span className="text-slate-200 capitalize font-normal">{currentQuestion?.partOfSpeechHint}</span>
          </div>

          {/* In-game Power-ups */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseFiftyFifty}
              disabled={isAnswered || isFiftyFiftyActiveForCurrent || fiftyFiftyUsedCount >= 2}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                fiftyFiftyUsedCount >= 2 || isFiftyFiftyActiveForCurrent
                  ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
              }`}
              title="Loại bỏ 2 phương án sai (Dùng tối đa 2 lần)"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              50:50 ({2 - fiftyFiftyUsedCount} còn lại)
            </button>

            <button
              onClick={handleUseFirstLetterHint}
              disabled={isAnswered || hintFirstLetterActive}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                hintFirstLetterActive
                  ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
              }`}
              title="Hiển thị chữ cái đầu tiên của từ"
            >
              <Type className="w-3.5 h-3.5" />
              Gợi ý ký tự đầu
            </button>
          </div>
        </div>

        {/* Sentence Text with Blank */}
        <div className="py-2 text-center">
          {renderSentenceWithBlank()}

          {currentQuestion?.sentenceTranslationVi && (
            <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-slate-400 text-sm max-w-2xl mx-auto">
              <span className="font-semibold text-slate-300">Dịch nghĩa:</span> {currentQuestion.sentenceTranslationVi}
            </div>
          )}
        </div>

        {/* 4 Smart Option Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {currentQuestion?.options.map(option => {
            const isEliminated = eliminatedOptionIds.includes(option.id);
            const isSelected = selectedOptionId === option.id;
            const isThisCorrect = correctOption?.id === option.id;

            let cardStyles = 'bg-slate-800/70 hover:bg-slate-700/80 border-slate-700 hover:border-slate-600 text-slate-100';

            if (isEliminated) {
              cardStyles = 'bg-slate-900/40 border-slate-800/60 text-slate-600 opacity-25 cursor-not-allowed line-through';
            } else if (isAnswered) {
              if (isThisCorrect) {
                cardStyles = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950';
              } else if (isSelected && !isThisCorrect) {
                cardStyles = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 animate-shake';
              } else {
                cardStyles = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered || isEliminated}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-3.5 shadow-md ${cardStyles}`}
              >
                <div className={`w-8 h-8 rounded-xl font-bold font-mono text-sm flex items-center justify-center shrink-0 border ${
                  isAnswered && isThisCorrect
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : isAnswered && isSelected
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-slate-700/80 text-indigo-300 border-slate-600'
                }`}>
                  {option.id}
                </div>

                <div className="flex-1">
                  <div className="font-bold text-base tracking-wide flex items-center justify-between">
                    <span>{option.word}</span>
                    {isAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {option.definitionVi}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Instant Mini Grammar Bite Explanation */}
        {isAnswered && (
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Mini Grammar Bite - Giải Thích Ngữ Pháp:
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNextQuestion}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentIndex + 1 >= data.questions.length ? 'Xem Tổng Kết' : 'Câu Tiếp Theo'}
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentQuestion?.explanationText}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Countdown Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>Thời gian câu hỏi</span>
          <span className={`font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 10 ? 'bg-amber-500' : 'bg-purple-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
