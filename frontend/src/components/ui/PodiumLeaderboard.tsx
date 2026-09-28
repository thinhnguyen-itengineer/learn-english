import React, { useState } from 'react';
import { Crown, Trophy, Target, Flame, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { RankBadge, RankTier, RankDivision, TrophyBadge } from './RankBadge';
import { Button } from './Button';

export interface LeaderboardItem {
  rankPosition: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  tier: RankTier;
  division?: RankDivision;
  trophy: number;
  winRate: number;
  winStreak?: number;
  isCurrentUser?: boolean;
}

export interface SeasonInfo {
  name: string;
  seasonNumber: number;
  daysRemaining: number;
}

export interface PodiumLeaderboardProps {
  items: LeaderboardItem[];
  myRank?: LeaderboardItem | null;
  season?: SeasonInfo;
  activeTab?: 'Season' | 'AllTime';
  onTabChange?: (tab: 'Season' | 'AllTime') => void;
  onPlayBattleClick?: () => void;
  className?: string;
}

export const PodiumLeaderboard: React.FC<PodiumLeaderboardProps> = ({
  items,
  myRank,
  season,
  activeTab = 'Season',
  onTabChange,
  onPlayBattleClick,
  className = '',
}) => {
  const [tab, setTab] = useState<'Season' | 'AllTime'>(activeTab);

  const handleTabSwitch = (newTab: 'Season' | 'AllTime') => {
    setTab(newTab);
    onTabChange?.(newTab);
  };

  const top1 = items.find((i) => i.rankPosition === 1);
  const top2 = items.find((i) => i.rankPosition === 2);
  const top3 = items.find((i) => i.rankPosition === 3);
  const restItems = items.filter((i) => i.rankPosition > 3);

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col pb-24 select-none ${className}`}>
      {/* Header with Season Banner and Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Bảng Xếp Hạng Đấu Thủ
            </h1>
          </div>
          {season && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{season.name}</span>
              <span className="text-yellow-400 font-bold">• Còn {season.daysRemaining} ngày</span>
            </div>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => handleTabSwitch('Season')}
            className={`
              px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer
              ${
                tab === 'Season'
                  ? 'bg-amber-500 text-yellow-950 font-black shadow-[0_2px_0_#ca8a04]'
                  : 'text-slate-400 hover:text-white'
              }
            `}
          >
            Mùa Hiện Tại
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('AllTime')}
            className={`
              px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer
              ${
                tab === 'AllTime'
                  ? 'bg-blue-600 text-white font-black shadow-[0_2px_0_#1d4ed8]'
                  : 'text-slate-400 hover:text-white'
              }
            `}
          >
            Toàn Thời Gian
          </button>
        </div>
      </div>

      {/* ================= TOP 3 PODIUM DISPLAY ================= */}
      <div className="relative pt-8 pb-4 mb-6 bg-gradient-to-b from-slate-850/60 to-slate-900/80 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-xl overflow-hidden">
        <div className="flex items-end justify-center gap-2 sm:gap-6 max-w-xl mx-auto min-h-[260px] sm:min-h-[300px]">
          {/* Top 2: Silver (Left) */}
          {top2 ? (
            <div className="flex flex-col items-center flex-1 z-10">
              <div className="relative mb-2">
                <Crown className="w-6 h-6 text-slate-300 absolute -top-5 left-1/2 -translate-x-1/2 filter drop-shadow" />
                <img
                  src={top2.avatarUrl}
                  alt={top2.displayName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-slate-300 object-cover shadow-[0_0_15px_rgba(203,213,225,0.4)] bg-slate-800"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full border border-slate-200">
                  #2
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-[90px] sm:max-w-[120px] text-center mt-1">
                {top2.displayName}
              </p>
              <TrophyBadge trophy={top2.trophy} size="sm" className="mt-1" />

              {/* Pedestal Top 2 */}
              <div className="w-full h-24 sm:h-28 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-2 border-l border-r border-slate-400/50 flex flex-col items-center justify-center shadow-lg">
                <span className="text-3xl sm:text-4xl font-black text-slate-400 font-mono">2</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Huy Chương Bạc</span>
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Top 1: Gold (Center - Tallest) */}
          {top1 ? (
            <div className="flex flex-col items-center flex-1 z-20">
              <div className="relative mb-2">
                <Crown className="w-8 h-8 text-yellow-400 absolute -top-7 left-1/2 -translate-x-1/2 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.7)] animate-crown-float" />
                <img
                  src={top1.avatarUrl}
                  alt={top1.displayName}
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl border-3 border-yellow-400 object-cover shadow-[0_0_25px_rgba(234,179,8,0.6)] bg-slate-800"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-yellow-950 text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-yellow-200 shadow">
                  #1
                </span>
              </div>
              <p className="text-sm sm:text-base font-black text-yellow-300 truncate max-w-[100px] sm:max-w-[140px] text-center mt-1">
                {top1.displayName}
              </p>
              <TrophyBadge trophy={top1.trophy} size="sm" className="mt-1" />

              {/* Pedestal Top 1 */}
              <div className="w-full h-34 sm:h-40 mt-3 rounded-t-2xl bg-gradient-to-t from-yellow-950/80 via-amber-800/80 to-yellow-600/80 border-t-3 border-l-2 border-r-2 border-yellow-300 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.3)]">
                <span className="text-4xl sm:text-5xl font-black text-yellow-300 font-mono">1</span>
                <span className="text-[11px] text-yellow-100 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  Vương Giả
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Top 3: Bronze (Right) */}
          {top3 ? (
            <div className="flex flex-col items-center flex-1 z-10">
              <div className="relative mb-2">
                <Crown className="w-5 h-5 text-amber-600 absolute -top-4.5 left-1/2 -translate-x-1/2 filter drop-shadow" />
                <img
                  src={top3.avatarUrl}
                  alt={top3.displayName}
                  className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl border-2 border-amber-600 object-cover shadow-[0_0_15px_rgba(180,83,9,0.35)] bg-slate-800"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 text-[10px] font-black px-2 py-0.2 rounded-full border border-amber-500">
                  #3
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-[90px] sm:max-w-[120px] text-center mt-1">
                {top3.displayName}
              </p>
              <TrophyBadge trophy={top3.trophy} size="sm" className="mt-1" />

              {/* Pedestal Top 3 */}
              <div className="w-full h-18 sm:h-22 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-900 to-amber-950/70 border-t-2 border-l border-r border-amber-700/60 flex flex-col items-center justify-center shadow">
                <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">3</span>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Huy Chương Đồng</span>
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>

      {/* ================= SCROLLABLE TOP 4 - 100 LIST ================= */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-3 py-2 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">HẠNG</span>
            <span>NGƯỜI CHƠI</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-12">
            <span className="hidden sm:inline">BẬC RANK</span>
            <span className="hidden sm:inline">TỶ LỆ THẮNG</span>
            <span>ĐIỂM CÚP</span>
          </div>
        </div>

        {restItems.map((item) => (
          <div
            key={item.userId}
            className={`
              flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-colors
              ${
                item.isCurrentUser
                  ? 'bg-blue-900/30 border-2 border-blue-500/70 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40'
              }
            `}
          >
            {/* Rank Position + Avatar + Name */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <span className="w-8 text-center text-sm sm:text-base font-black font-mono text-slate-300">
                #{item.rankPosition}
              </span>
              <img
                src={item.avatarUrl}
                alt={item.displayName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-700 object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[120px] sm:max-w-[200px]">
                  {item.displayName}
                  {item.isCurrentUser && <span className="text-blue-400 ml-1 font-normal">(Bạn)</span>}
                </p>
                {item.winStreak && item.winStreak >= 3 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-orange-400 font-bold">
                    <Flame className="w-2.5 h-2.5 fill-orange-400" />
                    Chuỗi {item.winStreak}
                  </span>
                )}
              </div>
            </div>

            {/* Badges and Metrics */}
            <div className="flex items-center gap-3 sm:gap-8">
              <div className="hidden sm:block">
                <RankBadge tier={item.tier} division={item.division} size="sm" />
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <Target className="w-3.5 h-3.5" />
                <span>{item.winRate.toFixed(1)}%</span>
              </div>
              <TrophyBadge trophy={item.trophy} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= STICKY BOTTOM "YOUR RANK" FOOTER ================= */}
      {myRank && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t-2 border-blue-500/80 backdrop-blur-xl p-3 sm:p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 sm:w-10 text-center font-black font-mono text-base sm:text-lg text-blue-400">
                #{myRank.rankPosition}
              </div>
              <img
                src={myRank.avatarUrl}
                alt={myRank.displayName}
                className="w-10 h-10 rounded-xl border-2 border-blue-400 object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-slate-100 truncate">
                  Vị trí của bạn: <span className="text-blue-300">{myRank.displayName}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <RankBadge tier={myRank.tier} division={myRank.division} size="sm" />
                  <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                    Tỷ lệ thắng: {myRank.winRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TrophyBadge trophy={myRank.trophy} size="md" />
              {onPlayBattleClick && (
                <Button
                  variant="gold"
                  size="md"
                  onClick={onPlayBattleClick}
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Đấu 1v1 Ngay
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
