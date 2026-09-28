import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, Flame, Sparkles, Target, Zap, ArrowRight, RotateCcw, 
  Award, CheckCircle 
} from 'lucide-react';
import { CompleteSessionResponse } from '../types/game';

interface SummaryModalProps {
  result: CompleteSessionResponse;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ result, onPlayAgain, onBackToLobby }) => {
  useEffect(() => {
    // Fire festive celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
        {/* Top Header Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-amber-500/20">
          <Trophy className="w-8 h-8 text-white" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-white">Hoàn Thành Ván Chơi!</h3>
          <p className="text-xs text-slate-400 mt-1">Bạn đã hoàn thành xuất sắc thử thách này</p>
        </div>

        {/* Level Up Banner (if leveled up) */}
        {result.isNewLevel && result.newLevel && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider">Thăng Cấp!</p>
              <p className="text-sm font-extrabold text-white">Chúc mừng bạn đã đạt Cấp {result.newLevel}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* XP Earned */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              XP Nhận Được
            </div>
            <p className="text-2xl font-black text-emerald-400">+{result.xpEarned}</p>
          </div>

          {/* Score */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
              <Target className="w-3.5 h-3.5" />
              Điểm Số
            </div>
            <p className="text-2xl font-black text-white">{result.score}</p>
          </div>

          {/* Accuracy */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Độ Chính Xác
            </div>
            <p className="text-xl font-bold text-white">{result.accuracyRate}%</p>
          </div>

          {/* Streak */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              Chuỗi Học Tập
            </div>
            <p className="text-xl font-bold text-amber-400">
              {result.currentStreak} <span className="text-xs text-slate-400 font-normal">ngày</span>
            </p>
          </div>
        </div>

        {/* Unlocked Badges */}
        {result.unlockedBadges && result.unlockedBadges.length > 0 && (
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Huy hiệu đạt được</span>
            <div className="space-y-2">
              {result.unlockedBadges.map((badge, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{badge.badgeName}</h5>
                    <p className="text-[11px] text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Chơi Lại Ván Này
          </button>

          <button
            onClick={onBackToLobby}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            Về Sảnh Chọn Game Khác
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
