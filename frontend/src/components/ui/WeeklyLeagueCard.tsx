import React from 'react';
import { 
  Trophy, 
  Crown, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  MinusCircle, 
  Clock, 
  Shield, 
  Sparkles, 
  Flame,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { RankTier } from './RankBadge';

export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'sapphire' | 'diamond';

export interface LeagueMemberStanding {
  rankPosition: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  weeklyXp: number;
  zone: 'promotion' | 'safe' | 'demotion';
  isCurrentUser: boolean;
  streakCount?: number;
}

export interface WeeklyLeagueCardProps {
  currentTier: LeagueTier;
  roomNumber: number;
  timeLeftText: string; // e.g. "2 ngày 14 giờ"
  standings: LeagueMemberStanding[];
  currentUserId?: string;
  onViewMemberProfile?: (userId: string) => void;
}

export const WeeklyLeagueCard: React.FC<WeeklyLeagueCardProps> = ({
  currentTier,
  roomNumber,
  timeLeftText,
  standings,
  currentUserId,
  onViewMemberProfile,
}) => {
  const getTierMetadata = (tier: LeagueTier) => {
    switch (tier) {
      case 'bronze':
        return {
          title: 'Giải Đồng (Bronze League)',
          color: 'from-amber-700 to-amber-900',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-600/50',
          iconColor: 'text-amber-400',
        };
      case 'silver':
        return {
          title: 'Giải Bạc (Silver League)',
          color: 'from-slate-400 to-slate-600',
          textColor: 'text-slate-200',
          borderColor: 'border-slate-400/50',
          iconColor: 'text-slate-300',
        };
      case 'gold':
        return {
          title: 'Giải Vàng (Gold League)',
          color: 'from-yellow-400 to-amber-600',
          textColor: 'text-yellow-300',
          borderColor: 'border-yellow-500/50',
          iconColor: 'text-yellow-400',
        };
      case 'sapphire':
        return {
          title: 'Giải Lam Ngọc (Sapphire League)',
          color: 'from-cyan-400 to-blue-600',
          textColor: 'text-cyan-300',
          borderColor: 'border-cyan-500/50',
          iconColor: 'text-cyan-400',
        };
      case 'diamond':
        return {
          title: 'Giải Kim Cương (Diamond League)',
          color: 'from-blue-400 to-purple-600',
          textColor: 'text-blue-300',
          borderColor: 'border-blue-500/50',
          iconColor: 'text-blue-400',
        };
    }
  };

  const meta = getTierMetadata(currentTier);
  const currentUser = standings.find(s => s.isCurrentUser || s.userId === currentUserId);

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700/80 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      {/* Top Banner: League Tier, Room & Timer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl bg-gradient-to-tr ${meta.color} text-white shadow-3d-gold`}>
            <Trophy className="w-7 h-7 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base md:text-lg font-black uppercase tracking-wider ${meta.textColor}`}>
                {meta.title}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                Phòng #{roomNumber} (30 Người)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Thi đua điểm XP tuần cùng những học viên tích cực tương đương
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-amber-400">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">Chốt bảng sau:</span>
          <span className="text-xs md:text-sm font-black font-mono text-amber-300">
            {timeLeftText}
          </span>
        </div>
      </div>

      {/* Rules & Zones Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-5 text-xs font-semibold">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
          <ArrowUpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>Top 1 - 7:</strong> Thăng hạng + Thưởng Rương</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300">
          <MinusCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span><strong>Top 8 - 25:</strong> Giữ vững hạng</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300">
          <ArrowDownCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span><strong>Top 26 - 30:</strong> {currentTier === 'bronze' ? 'Không rớt (Giải khởi đầu)' : 'Rớt hạng tuần tới'}</span>
        </div>
      </div>

      {/* 30-Player Standings List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 pb-16 custom-scrollbar">
        {standings.map((player) => {
          const isTop1 = player.rankPosition === 1;
          const isTop2 = player.rankPosition === 2;
          const isTop3 = player.rankPosition === 3;
          const isPodium = isTop1 || isTop2 || isTop3;
          const isPromotion = player.zone === 'promotion';
          const isDemotion = player.zone === 'demotion';

          let rowBg = 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/50';
          if (player.isCurrentUser) {
            rowBg = 'bg-indigo-950/80 border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]';
          } else if (isPromotion) {
            rowBg = 'bg-emerald-950/20 border-emerald-600/30 hover:bg-emerald-950/30';
          } else if (isDemotion && currentTier !== 'bronze') {
            rowBg = 'bg-rose-950/20 border-rose-600/30 hover:bg-rose-950/30';
          }

          return (
            <div
              key={player.userId}
              onClick={() => onViewMemberProfile && onViewMemberProfile(player.userId)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${rowBg}`}
            >
              {/* Left: Rank & Avatar & Name */}
              <div className="flex items-center gap-3">
                {/* Rank Number Badge */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  isTop1 
                    ? 'bg-amber-500 text-yellow-950 shadow-3d-gold' 
                    : isTop2 
                    ? 'bg-slate-300 text-slate-900 shadow-3d-slate' 
                    : isTop3 
                    ? 'bg-amber-700 text-white' 
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {isTop1 ? <Crown className="w-5 h-5 text-yellow-950" /> : player.rankPosition}
                </div>

                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white overflow-hidden border-2 border-slate-600">
                    {player.avatarUrl ? (
                      <img src={player.avatarUrl} alt={player.displayName} className="w-full h-full object-cover" />
                    ) : (
                      player.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  {isTop1 && (
                    <Crown className="w-4 h-4 text-yellow-400 absolute -top-1.5 -right-1 animate-crown-float" />
                  )}
                </div>

                {/* Player Name & Tag */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${player.isCurrentUser ? 'text-indigo-300 font-black' : 'text-white'}`}>
                      {player.displayName}
                    </span>
                    {player.isCurrentUser && (
                      <span className="text-[10px] uppercase font-black bg-indigo-500 text-white px-2 py-0.2 rounded-md">
                        Bạn
                      </span>
                    )}
                  </div>
                  {player.streakCount && player.streakCount > 0 && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Flame className="w-3 h-3 text-orange-400" />
                      Chuỗi {player.streakCount} ngày
                    </div>
                  )}
                </div>
              </div>

              {/* Right: XP Score & Zone Arrow */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm md:text-base font-black text-amber-400">
                    {player.weeklyXp.toLocaleString()} <span className="text-xs font-bold text-slate-400">XP</span>
                  </div>
                </div>

                {/* Zone Icon */}
                <div className="w-6 flex items-center justify-center">
                  {isPromotion ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400" />
                  ) : isDemotion && currentTier !== 'bronze' ? (
                    <ChevronDown className="w-5 h-5 text-rose-400" />
                  ) : (
                    <span className="text-slate-500 font-bold text-sm">—</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Row: Current User Status */}
      {currentUser && (
        <div className="absolute bottom-3 left-5 right-5 rounded-2xl bg-indigo-950/95 border-2 border-indigo-400 p-3 flex items-center justify-between shadow-[0_4px_20px_rgba(99,102,241,0.5)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white font-black text-xs flex items-center justify-center">
              #{currentUser.rankPosition}
            </div>
            <div>
              <span className="text-xs font-black text-white">Vị trí hiện tại của bạn</span>
              <div className="text-[11px] text-indigo-200">
                {currentUser.zone === 'promotion' 
                  ? '🟢 Đang ở Vùng Thăng Hạng!' 
                  : currentUser.zone === 'demotion' 
                  ? '🔴 Cẩn thận! Đang ở Vùng Rớt Hạng' 
                  : '⚪ Đang ở Vùng Trụ Hạng An Toàn'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-amber-300">
              {currentUser.weeklyXp.toLocaleString()} XP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
