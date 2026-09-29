import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, BrainCircuit, Heart, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { useRetentionStore } from '../services/useRetentionStore';
import { ClinicCardDto, ClinicSubmitResponse } from '../types/retention';
import { soundManager } from '../utils/sound';

interface WeaknessClinicModalProps {
  onClose: () => void;
  onFinishedSession?: () => void;
}

export const WeaknessClinicModal: React.FC<WeaknessClinicModalProps> = ({
  onClose,
  onFinishedSession
}) => {
  const { clinicSession, loadClinicSession, submitClinicCard, loading, error } = useRetentionStore();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [submitResult, setSubmitResult] = useState<ClinicSubmitResponse | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState<number>(0);
  const [totalXpEarned, setTotalXpEarned] = useState<number>(0);
  const [graduatedCount, setGraduatedCount] = useState<number>(0);

  useEffect(() => {
    loadClinicSession();
  }, [loadClinicSession]);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setSubmitResult(null);
  }, [currentIndex]);

  const cards: ClinicCardDto[] = clinicSession?.cards || [];
  const currentCard: ClinicCardDto | undefined = cards[currentIndex];

  const playAudio = (text: string) => {
    soundManager.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = async (option: string) => {
    if (selectedAnswer !== null || !currentCard) return;

    setSelectedAnswer(option);
    const responseTimeMs = Date.now() - startTime;

    try {
      const res = await submitClinicCard({
        mistakeId: currentCard.id,
        selectedAnswer: option,
        responseTimeMs,
        usedHint: false
      });

      setSubmitResult(res);
      setTotalCoinsEarned(prev => prev + res.awardedCoins);
      setTotalXpEarned(prev => prev + res.awardedXp);

      if (res.isCorrect) {
        soundManager.playCorrect();
        if (res.isGraduated) {
          setGraduatedCount(prev => prev + 1);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        soundManager.playWrong();
      }
    } catch (err) {
      console.error('Failed to submit clinic card:', err);
    }
  };

  const handleNextCard = () => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Heart className="w-5 h-5 fill-emerald-500/30 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Phòng Khám Lỗi Sai <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">SM-2 Spaced Repetition</span>
              </h2>
              <p className="text-xs text-slate-400">
                {cards.length > 0 && !sessionCompleted
                  ? `Thẻ ôn tập ${currentIndex + 1} / ${cards.length}`
                  : 'Hệ thống chữa dứt điểm lỗi sai qua chu kỳ ghi nhớ ngắt quãng'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Đang tải hồ sơ bệnh án từ vựng của bạn...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && cards.length === 0 && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Tuyệt vời! Bạn không còn lỗi sai nào cần chữa</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Tất cả các từ vựng bạn từng trả lời sai đã được ôn tập đến hạn hoặc tốt nghiệp xuất sắc (Mastered). Hãy chơi thêm các mini-game để tiếp tục mở rộng vốn từ!
              </p>
              <Button variant="primary" onClick={onClose}>
                Quay lại Sảnh Game
              </Button>
            </div>
          )}

          {!loading && !error && currentCard && !sessionCompleted && (
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
              </div>

              {/* Card HUD */}
              <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4 relative">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    Kỹ năng: {currentCard.skillType}
                  </span>
                  <span className="text-slate-400">
                    Nguồn gốc: {currentCard.originGameType}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-100">{currentCard.prompt}</h3>
                    <button
                      onClick={() => playAudio(currentCard.correctAnswer)}
                      className="p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Volume2 className="w-4 h-4" /> Nghe phát âm
                    </button>
                  </div>
                  {currentCard.phonetic && (
                    <p className="text-sm font-mono text-emerald-400/90">{currentCard.phonetic}</p>
                  )}
                </div>

                {currentCard.contextSentence && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm leading-relaxed">
                    <span className="text-slate-400 text-xs block mb-1">Ngữ cảnh câu:</span>
                    <p className="text-slate-200 font-medium">{currentCard.contextSentence}</p>
                  </div>
                )}
              </div>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentCard.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/80';
                  if (selectedAnswer !== null) {
                    if (opt === currentCard.correctAnswer) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (opt === selectedAnswer) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    } else {
                      btnStyle = 'bg-slate-800/40 border-slate-800/40 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-2xl border text-left font-medium transition-all text-sm flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && opt === currentCard.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {selectedAnswer !== null && opt === selectedAnswer && opt !== currentCard.correctAnswer && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & SM-2 Evaluation Box */}
              {submitResult && (
                <div
                  className={`p-5 rounded-2xl border transition-all animate-in fade-in slide-in-from-bottom-2 ${
                    submitResult.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm flex items-center gap-1.5">
                      {submitResult.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Chính xác! (+{submitResult.awardedCoins} Xu, +{submitResult.awardedXp} XP)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" /> Chưa chính xác! (+{submitResult.awardedXp} XP an ủi)
                        </>
                      )}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Chu kỳ ôn tiếp: {submitResult.newIntervalDays} ngày
                    </span>
                  </div>

                  {submitResult.explanation && (
                    <p className="text-xs text-slate-300/90 leading-relaxed mb-3">
                      💡 <strong>Giải thích:</strong> {submitResult.explanation}
                    </p>
                  )}

                  {submitResult.isGraduated && (
                    <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>
                        <strong>Huy hiệu Tốt Nghiệp:</strong> Bạn đã làm chủ hoàn toàn từ vựng này và xóa sạch nó khỏi ngân hàng lỗi sai!
                      </span>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button variant="primary" size="sm" onClick={handleNextCard} className="flex items-center gap-2">
                      {currentIndex + 1 < cards.length ? 'Thẻ tiếp theo' : 'Xem kết quả phiên khám'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Session Summary */}
          {sessionCompleted && (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                <BrainCircuit className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Hoàn Thành Phiên Khám Bệnh!</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Não bộ của bạn đã củng cố liên kết thần kinh cho {cards.length} thẻ từ vựng yếu.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-2xl font-extrabold text-amber-400">+{totalCoinsEarned}</div>
                  <div className="text-xs text-slate-400 mt-1">Xu thưởng</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-2xl font-extrabold text-indigo-400">+{totalXpEarned}</div>
                  <div className="text-xs text-slate-400 mt-1">XP Nhận được</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-2xl font-extrabold text-emerald-400">{graduatedCount}</div>
                  <div className="text-xs text-slate-400 mt-1">Từ Tốt Nghiệp</div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    onFinishedSession?.();
                    onClose();
                  }}
                >
                  Đóng & Nhận Thưởng
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
