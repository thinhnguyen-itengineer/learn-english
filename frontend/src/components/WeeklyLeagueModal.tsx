import React, { useEffect } from 'react';
import { X, Trophy, Shield, ArrowUp, ArrowDown, Clock, Sparkles } from 'lucide-react';
import { useRetentionStore } from '../services/useRetentionStore';

interface WeeklyLeagueModalProps {
  onClose: () => void;
}

export const WeeklyLeagueModal: React.FC<WeeklyLeagueModalProps> = ({ onClose }) => {
  const { currentLeague, loadLeague, loading, error } = useRetentionStore();

  useEffect(() => {
    loadLeague();
  }, [loadLeague]);

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days} ngày ${hours} giờ`;
    return `${hours} giờ ${mins} phút`;
  };

  const tierColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    Bronze: { bg: 'from-amber-900/30 to-amber-950/20', border: 'border-amber-600/40', text: 'text-amber-400', icon: '🥉' },
    Silver: { bg: 'from-slate-700/30 to-slate-900/20', border: 'border-slate-400/40', text: 'text-slate-200', icon: '🥈' },
    Gold: { bg: 'from-yellow-600/30 to-amber-950/20', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: '🥇' },
    Sapphire: { bg: 'from-blue-600/30 to-indigo-950/20', border: 'border-blue-400/40', text: 'text-blue-400', icon: '💎' },
    Diamond: { bg: 'from-cyan-500/30 to-teal-950/20', border: 'border-cyan-400/40', text: 'text-cyan-300', icon: '👑' },
  };

  const currentTier = currentLeague?.leagueTierName || 'Bronze';
  const tierStyle = tierColors[currentTier] || tierColors.Bronze;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
              {tierStyle.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Giải Đấu Tuần: Hạng {currentTier}
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Phòng 30 người
                </span>
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Thời gian còn lại: {currentLeague ? formatCountdown(currentLeague.timeRemainingSeconds) : '...'}
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

        {/* User Status Bar */}
        {currentLeague && (
          <div className="px-6 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Vị trí của bạn:</span>
              <span className="font-extrabold text-amber-400 text-sm">#{currentLeague.currentUserRank}</span>
              <span className="text-slate-400">({currentLeague.currentUserXp} XP tuần)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ArrowUp className="w-3 h-3" /> Top 1-7: Thăng hạng
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <ArrowDown className="w-3 h-3" /> Top 26-30: Xuống hạng
              </span>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {loading && (
            <div className="py-20 text-center text-slate-400 text-sm">
              Đang tải danh sách đấu thủ 30 người...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {!loading && currentLeague?.leaderboard.map((player) => {
            const isTop3 = player.rank <= 3;
            const isPromotion = player.zone === 'Promotion';
            const isDemotion = player.zone === 'Demotion';

            let rowBg = 'bg-slate-850/50 border-slate-800 hover:bg-slate-800/60';
            if (player.isCurrentUser) {
              rowBg = 'bg-indigo-950/60 border-indigo-500/50 shadow-md shadow-indigo-500/10';
            } else if (isTop3) {
              rowBg = 'bg-amber-950/20 border-amber-500/20';
            }

            return (
              <div
                key={player.userId}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-xs ${rowBg}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                      player.rank === 1
                        ? 'bg-amber-500 text-slate-950'
                        : player.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : player.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {player.rank}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-slate-300 font-bold text-xs">
                      {player.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className={`font-semibold block ${player.isCurrentUser ? 'text-indigo-300 font-bold' : 'text-slate-200'}`}>
                        {player.userName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isPromotion ? '🟢 Vùng Thăng Hạng' : isDemotion ? '🔴 Vùng Xuống Hạng' : '⚪ An Toàn'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-white text-sm">
                    {player.weeklyXp.toLocaleString()} <span className="text-xs text-amber-400 font-normal">XP</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Giải đấu chốt kết quả vào 23:59:59 Chủ Nhật hàng tuần.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
