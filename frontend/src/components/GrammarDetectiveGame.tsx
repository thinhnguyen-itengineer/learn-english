import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, Search, Sparkles, CheckCircle2, XCircle, 
  ArrowRight, ShieldAlert, Award, FileText, AlertTriangle 
} from 'lucide-react';
import { GrammarDetectiveInitResponse, CompleteSessionRequest } from '../types/game';
import { sound } from '../utils/sound';
import { Button } from './ui/Button';

interface GrammarDetectiveGameProps {
  data: GrammarDetectiveInitResponse;
  onComplete: (request: CompleteSessionRequest) => void;
  onExit: () => void;
}

export const GrammarDetectiveGame: React.FC<GrammarDetectiveGameProps> = ({
  data,
  onComplete,
  onExit
}) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [magnifiers, setMagnifiers] = useState(data.initialMagnifiers || 3);
  const [score, setScore] = useState(0);
  const [casesSolved, setCasesSolved] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameStartTime] = useState(Date.now());

  const currentCase = data.cases[currentCaseIndex];

  // 2-Phase Investigation States:
  // Phase 1: 'spotting' (identifying the culprit token)
  // Phase 2: 'fixing' (choosing the replacement option)
  // 'resolved': case closed with explanation
  const [phase, setPhase] = useState<'spotting' | 'fixing' | 'resolved'>('spotting');
  const [spotAttemptsForCase, setSpotAttemptsForCase] = useState(0);
  const [wrongClickedTokenIndex, setWrongClickedTokenIndex] = useState<number | null>(null);
  const [selectedCorrection, setSelectedCorrection] = useState<string | null>(null);
  const [isCorrectionCorrect, setIsCorrectionCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(data.timePerCaseSeconds || 60);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize new case
  const initCase = useCallback((index: number) => {
    setPhase('spotting');
    setSpotAttemptsForCase(0);
    setWrongClickedTokenIndex(null);
    setSelectedCorrection(null);
    setIsCorrectionCorrect(false);
    setTimeLeft(data.timePerCaseSeconds || 60);
  }, [data.timePerCaseSeconds]);

  useEffect(() => {
    initCase(currentCaseIndex);
  }, [currentCaseIndex, initCase]);

  // Read raw sentence aloud on entry
  useEffect(() => {
    if (currentCase) {
      sound.speak(currentCase.rawSentence, 0.9);
    }
  }, [currentCaseIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Case Timer
  useEffect(() => {
    if (phase === 'resolved') return;

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
  }, [phase, currentCaseIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimeout = () => {
    sound.playDetectiveBuzzer();
    setPhase('resolved');
    setIsCorrectionCorrect(false);
    setTotalAttempts(prev => prev + 1);

    const newMags = magnifiers - 1;
    setMagnifiers(newMags);

    if (newMags <= 0) {
      setTimeout(() => {
        finishGame(score, casesSolved, totalAttempts + 1);
      }, 1500);
    }
  };

  // Phase 1: Click on token in sentence
  const handleTokenClick = (tokenIndex: number) => {
    if (phase !== 'spotting') return;

    setTotalAttempts(prev => prev + 1);

    if (tokenIndex === currentCase.errorTokenIndex) {
      // Caught the culprit!
      sound.playClueFound();
      setPhase('fixing');
      setWrongClickedTokenIndex(null);
    } else {
      // Picked innocent word
      sound.playDetectiveBuzzer();
      setSpotAttemptsForCase(prev => prev + 1);
      setWrongClickedTokenIndex(tokenIndex);

      const newMags = magnifiers - 1;
      setMagnifiers(newMags);

      if (newMags <= 0) {
        setPhase('resolved');
        setTimeout(() => {
          finishGame(score, casesSolved, totalAttempts + 1);
        }, 1200);
      } else {
        setTimeout(() => {
          setWrongClickedTokenIndex(null);
        }, 800);
      }
    }
  };

  // Phase 2: Choose replacement option
  const handleSelectCorrection = (option: string) => {
    if (phase !== 'fixing') return;

    sound.playClick();
    setSelectedCorrection(option);
    setPhase('resolved');
    setTotalAttempts(prev => prev + 1);

    const isMatch = option.trim().toLowerCase() === currentCase.correctReplacement.trim().toLowerCase();
    setIsCorrectionCorrect(isMatch);

    if (isMatch) {
      sound.playSuccess();
      const newSolved = casesSolved + 1;
      setCasesSolved(newSolved);

      // Scoring formula: (DetectionPoints + CorrectionPoints + RemainingTimeBonus) * MagnifierMultiplier
      const detectionPoints = spotAttemptsForCase === 0 ? 60 : 30;
      const correctionPoints = 60;
      const timeBonus = timeLeft * 3;
      const magnifierMultiplier = magnifiers >= 3 ? 1.5 : magnifiers === 2 ? 1.2 : 1.0;

      const casePoints = Math.round((detectionPoints + correctionPoints + timeBonus) * magnifierMultiplier);
      setScore(prev => prev + casePoints);
    } else {
      sound.playDetectiveBuzzer();
      const newMags = magnifiers - 1;
      setMagnifiers(newMags);

      if (newMags <= 0) {
        setTimeout(() => {
          finishGame(score, casesSolved, totalAttempts + 1);
        }, 1500);
      }
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex + 1 >= data.cases.length) {
      sound.playVictory();
      finishGame(score, casesSolved, totalAttempts + 1);
    } else {
      setCurrentCaseIndex(prev => prev + 1);
    }
  };

  const finishGame = (
    finalScore: number, 
    finalSolved: number, 
    finalAttempts: number
  ) => {
    const durationSeconds = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
    onComplete({
      sessionId: data.sessionId,
      score: finalScore,
      durationSeconds,
      totalAttempts: Math.max(finalAttempts, 1),
      correctAnswers: finalSolved,
      maxCombo: finalSolved,
      status: magnifiers > 0 ? 'Completed' : 'Failed'
    });
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / (data.timePerCaseSeconds || 60)) * 100));

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

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm">
            <Search className="w-4 h-4 text-amber-400" />
            Grammar Detective
          </div>
        </div>

        {/* Magnifiers (Lives) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Kính lúp:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(magIndex => (
              <div
                key={magIndex}
                className={`p-1.5 rounded-lg border transition-all ${
                  magIndex <= magnifiers
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-800/40 border-slate-800 text-slate-600 opacity-40'
                }`}
              >
                <Search className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Score & Case Count */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono">
            <Sparkles className="w-4 h-4" />
            <span>{score} pts</span>
          </div>

          <div className="text-xs text-slate-300 font-mono bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            Vụ án: {currentCaseIndex + 1} / {data.cases.length}
          </div>
        </div>
      </div>

      {/* Case Dossier Container */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800/90 to-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Case File Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              Hồ Sơ Vụ Án #{currentCaseIndex + 1}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentCase?.caseTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Nhiệm vụ: Chạm vào <span className="text-amber-300 font-semibold">TỪ hoặc CỤM TỪ bị lỗi ngữ pháp</span> trong câu dưới
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 hidden sm:block">
            <Award className="w-8 h-8" />
          </div>
        </div>

        {/* Phase 1: Sentence Token Chips Arena */}
        <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-mono font-bold">
            Bằng chứng vụ án (Sentence Evidence)
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {currentCase?.tokens.map(token => {
              const isErrorTarget = token.index === currentCase.errorTokenIndex;
              const isWrongClicked = wrongClickedTokenIndex === token.index;
              const isCaught = (phase === 'fixing' || phase === 'resolved') && isErrorTarget;

              let chipStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 cursor-pointer hover:border-amber-400';

              if (isWrongClicked) {
                chipStyle = 'bg-rose-900/60 border-rose-500 text-rose-200 animate-shake ring-2 ring-rose-500/40';
              } else if (isCaught) {
                if (phase === 'resolved' && isCorrectionCorrect) {
                  chipStyle = 'bg-emerald-500 border-emerald-400 text-white font-bold ring-4 ring-emerald-500/40 shadow-lg';
                } else {
                  chipStyle = 'bg-amber-400 border-amber-300 text-slate-950 font-black ring-4 ring-amber-400/40 shadow-lg animate-pulse';
                }
              }

              // In resolved phase with correct replacement, show replaced word
              const displayText = phase === 'resolved' && isErrorTarget && isCorrectionCorrect
                ? currentCase.correctReplacement
                : token.text;

              return (
                <button
                  key={token.index}
                  onClick={() => handleTokenClick(token.index)}
                  disabled={phase !== 'spotting'}
                  className={`px-3 py-2 rounded-xl border font-mono text-base sm:text-lg transition-all duration-150 active:scale-95 shadow-sm ${chipStyle}`}
                >
                  {displayText}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase 2: Fix the Case Card */}
        {phase === 'fixing' && (
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              Bắt đúng thủ phạm! Hãy chọn phương án sửa chính xác để hoàn tất câu:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentCase?.correctionOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCorrection(opt)}
                  className="p-3.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 hover:border-amber-400 font-bold text-sm text-slate-200 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <span className="font-mono text-xs opacity-60">({idx + 1})</span> {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resolved Case Dossier Summary */}
        {phase === 'resolved' && (
          <div className={`p-6 rounded-2xl border space-y-4 animate-fade-in ${
            isCorrectionCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-base font-bold">
                {isCorrectionCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    Phá Án Thành Công! Vụ án đã được khép lại.
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                    Phá Án Thất Bại! Bắt sai hoặc sửa lỗi chưa chuẩn.
                  </>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNextCase}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentCaseIndex + 1 >= data.cases.length ? 'Tổng Kết Vụ Án' : 'Vụ Án Tiếp Theo'}
              </Button>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm text-slate-300">
              <div className="font-semibold text-slate-200">
                Từ sai: <span className="line-through text-rose-400 font-mono">[{currentCase?.errorTokenText}]</span> &rarr; Từ sửa đúng: <span className="text-emerald-400 font-bold font-mono">[{currentCase?.correctReplacement}]</span>
              </div>
              <p className="mt-2 text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">Quy tắc ngữ pháp: </span>
                {currentCase?.grammarRuleExplanation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Countdown Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>Thời gian vụ án</span>
          <span className={`font-bold ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 25 ? 'bg-amber-500' : 'bg-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
