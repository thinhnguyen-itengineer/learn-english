import React, { useState } from 'react';
import { 
  Stethoscope, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Award, 
  Lightbulb, 
  ArrowRight,
  Flame,
  BrainCircuit,
  Coins
} from 'lucide-react';
import { Button } from './Button';

export type SM2Rating = 1 | 2 | 4 | 5; // 1: Again, 2: Hard, 4: Good, 5: Easy

export interface MistakeCardData {
  id: string;
  gameType: string;
  gameTypeName?: string;
  targetText: string;
  phonetic?: string;
  promptQuestion: string;
  userWrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  repetitionNumber: number; // n
  intervalDays: number;     // I
  easeFactor: number;       // EF
  failureCount: number;
}

export interface WeaknessClinicCardProps {
  mistakes: MistakeCardData[];
  currentIndex?: number;
  totalDueCount?: number;
  onRateMistake?: (mistakeId: string, rating: SM2Rating) => void;
  onCompleteSession?: () => void;
  isLoading?: boolean;
}

export const WeaknessClinicCard: React.FC<WeaknessClinicCardProps> = ({
  mistakes,
  currentIndex = 0,
  totalDueCount,
  onRateMistake,
  onCompleteSession,
  isLoading = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [localIndex, setLocalIndex] = useState(currentIndex);
  const [completedList, setCompletedList] = useState<string[]>([]);
  const [lastReward, setLastReward] = useState<{ xp: number; coins: number } | null>(null);

  const effectiveTotal = totalDueCount ?? mistakes.length;
  const currentMistake = mistakes[localIndex];
  const isFinished = !currentMistake || completedList.length >= mistakes.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: SM2Rating) => {
    if (!currentMistake) return;

    if (onRateMistake) {
      onRateMistake(currentMistake.id, rating);
    }

    setLastReward({
      xp: rating >= 4 ? 10 : 5,
      coins: rating >= 4 ? 2 : 1,
    });

    setCompletedList(prev => [...prev, currentMistake.id]);
    setIsFlipped(false);

    if (localIndex < mistakes.length - 1) {
      setLocalIndex(prev => prev + 1);
    } else if (onCompleteSession) {
      onCompleteSession();
    }
  };

  // 1. All Due Cards Mastered Screen (Clean Slate State)
  if (isFinished) {
    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 md:p-8 shadow-[0_10px_30px_rgba(16,185,129,0.25)] text-center">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30 mb-5 animate-pop-bounce">
          <Award className="w-14 h-14" />
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
          XÓA SẠCH LỖI SAI! 🎉
        </h3>
        <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto mb-6">
          Tuyệt vời! Bạn đã hoàn thành đợt trị liệu hôm nay và đưa toàn bộ từ vựng vào chu kỳ ghi nhớ dài hạn SuperMemo-2.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            +30 Coins Thưởng Danh Hiệu
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-950/60 border border-teal-500/40 text-teal-300 font-bold text-sm">
            <BrainCircuit className="w-4 h-4 text-teal-400" />
            Huy Hiệu: Bác Sĩ Trị Lỗi
          </div>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          onClick={onCompleteSession}
          className="shadow-3d-green"
        >
          Trở Lại Cổng Học Tập
        </Button>
      </div>
    );
  }

  const progressPercent = Math.round((completedList.length / effectiveTotal) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-teal-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 md:p-7 shadow-[0_8px_30px_rgba(13,148,136,0.2)]">
      {/* Clinic Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Stethoscope className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-600/40">
                Spaced Repetition SM-2
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Chu kỳ {currentMistake.intervalDays} ngày
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white mt-0.5">
              Phòng Khám Lỗi Sai (Weakness Clinic)
            </h2>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-2xl border border-slate-700/60">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-400">Tiến độ hôm nay</div>
            <div className="text-sm font-black text-teal-300">
              {completedList.length + 1} / {effectiveTotal} từ
            </div>
          </div>
          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Interactive Flip Card Area */}
      <div className="relative min-h-[320px] md:min-h-[340px] flex flex-col justify-between">
        {!isFlipped ? (
          /* FRONT OF CARD (Question & Error Diagnosis) */
          <div className="flex flex-col justify-between h-full bg-slate-800/70 border-2 border-slate-700/80 rounded-2xl p-5 md:p-6 shadow-[0_4px_0_#1e293b] transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold border border-slate-700">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Gốc: {currentMistake.gameTypeName || currentMistake.gameType}
                </span>
                <span className="text-xs text-rose-400 font-bold bg-rose-950/60 px-2.5 py-1 rounded-xl border border-rose-800/50 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  Sai {currentMistake.failureCount} lần
                </span>
              </div>

              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Câu hỏi thử thách:
              </div>
              <p className="text-base md:text-lg font-bold text-white mb-6">
                "{currentMistake.promptQuestion}"
              </p>

              {/* Diagnosis Box: What user typed wrongly */}
              <div className="rounded-2xl bg-slate-900/90 border border-rose-500/30 p-4 mb-4">
                <div className="text-xs text-rose-400 font-bold flex items-center gap-1.5 mb-1">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Câu trả lời bạn từng chọn sai:
                </div>
                <div className="text-base font-extrabold text-rose-300 line-through">
                  {currentMistake.userWrongAnswer}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="clinic"
                size="lg"
                fullWidth
                onClick={handleFlip}
                rightIcon={<RotateCw className="w-5 h-5 animate-pulse-subtle" />}
                className="shadow-[0_4px_0_#0f766e]"
              >
                Lật Thẻ Để Xem Đáp Án & Ôn Luyện
              </Button>
            </div>
          </div>
        ) : (
          /* BACK OF CARD (Correct Answer, Grammar Tip & SM-2 Rating) */
          <div className="flex flex-col justify-between h-full bg-slate-800/90 border-2 border-teal-500/60 rounded-2xl p-5 md:p-6 shadow-[0_4px_0_#0f766e] animate-pop-bounce">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-700/50 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Đáp Án Chuẩn Xác
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg">
                  Lần lặp n={currentMistake.repetitionNumber + 1}
                </span>
              </div>

              {/* Core Word / Concept */}
              <div className="mb-4">
                <div className="text-2xl md:text-3xl font-black text-white tracking-wide flex items-baseline gap-3">
                  <span>{currentMistake.correctAnswer}</span>
                  {currentMistake.phonetic && (
                    <span className="text-sm md:text-base font-normal text-teal-300 font-mono">
                      {currentMistake.phonetic}
                    </span>
                  )}
                </div>
              </div>

              {/* Pedagogical Explanation */}
              <div className="rounded-2xl bg-teal-950/40 border border-teal-600/40 p-3.5 mb-5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-300 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Giải thích ngữ pháp / Ghi nhớ nhanh:
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                  {currentMistake.explanation}
                </p>
              </div>

              <div className="text-center text-xs font-bold text-slate-400 mb-2">
                Mức độ nhớ từ vựng này của bạn thế nào? (Thuật toán SM-2)
              </div>
            </div>

            {/* 4 SuperMemo-2 Rating Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleRate(1)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-600/60 shadow-[0_4px_0_#991b1b] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
              >
                <span className="text-xs font-black uppercase text-rose-400">1. Quên Hẳn</span>
                <span className="text-[10px] text-slate-400 font-medium">Lặp lại (1 ngày)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate(2)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-600/60 shadow-[0_4px_0_#92400e] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
              >
                <span className="text-xs font-black uppercase text-amber-400">2. Khó Nhớ</span>
                <span className="text-[10px] text-slate-400 font-medium">Ôn sau (2 ngày)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate(4)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 border border-sky-600/60 shadow-[0_4px_0_#0369a1] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
              >
                <span className="text-xs font-black uppercase text-sky-400">3. Nhớ Tốt</span>
                <span className="text-[10px] text-slate-400 font-medium">+10 XP • +2 Coin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate(5)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-600/60 shadow-[0_4px_0_#047857] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
              >
                <span className="text-xs font-black uppercase text-emerald-400">4. Dễ Như Chớp</span>
                <span className="text-[10px] text-slate-400 font-medium">+10 XP • +2 Coin</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info: XP / Coin recovery */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Phục hồi điểm số đã mất trong các ván mini-game trước
        </span>
        {lastReward && (
          <span className="font-extrabold text-emerald-400 animate-pop-bounce flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            +{lastReward.xp} XP / +{lastReward.coins} Coins
          </span>
        )}
      </div>
    </div>
  );
};
