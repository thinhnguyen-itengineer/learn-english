import React from 'react';
import { X, Trophy, Medal, Award, User } from 'lucide-react';
import { LeaderboardResponse } from '../types/game';

interface LeaderboardModalProps {
  data: LeaderboardResponse | null;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Bảng Xếp Hạng Tuần</h3>
              <p className="text-xs text-slate-400">Xếp hạng theo tổng điểm kinh nghiệm (XP) trong tuần</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
          {!data ? (
            <div className="text-center py-10 text-slate-500 text-xs">Đang tải bảng xếp hạng...</div>
          ) : data.topRankings.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">Chưa có người chơi nào tham gia tuần này.</div>
          ) : (
            data.topRankings.map((user) => {
              const isTop1 = user.rank === 1;
              const isTop2 = user.rank === 2;
              const isTop3 = user.rank === 3;

              return (
                <div
                  key={user.rank}
                  className={`p-3.5 rounded-2xl flex items-center justify-between border transition ${
                    isTop1
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : isTop2
                      ? 'bg-slate-300/10 border-slate-400/30'
                      : isTop3
                      ? 'bg-amber-700/10 border-amber-700/30'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-7 h-7 flex items-center justify-center font-black text-sm">
                      {isTop1 ? (
                        <Medal className="w-6 h-6 text-amber-400 fill-amber-400" />
                      ) : isTop2 ? (
                        <Medal className="w-6 h-6 text-slate-300 fill-slate-300" />
                      ) : isTop3 ? (
                        <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />
                      ) : (
                        <span className="text-slate-400">#{user.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.displayName} className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                    {/* Name & Level */}
                    <div>
                      <p className="font-bold text-white text-xs sm:text-sm">{user.displayName}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Cấp độ {user.currentLevel}</p>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-emerald-400">{user.weeklyXp.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 ml-1">XP</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* My Rank Footer */}
        {data?.myRank && (
          <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Thứ hạng của bạn:</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-bold text-xs">
                #{data.myRank.rank}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-xs text-emerald-400">{data.myRank.weeklyXp} XP</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
