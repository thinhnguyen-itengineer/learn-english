import React from 'react';
import { Flame, Trophy, Snowflake, Sparkles, Swords, Coins, ShoppingBag, Shirt } from 'lucide-react';
import { UserProfileDto, UserRankProfileDto, RankTier, RankDivision } from '../types/game';
import { RankBadge, TrophyBadge } from './ui/RankBadge';
import { ModularAvatar } from './avatar/ModularAvatar';
import { useAvatarStore } from '../services/useAvatarStore';
import { useProfileAndInventoryStore } from '../services/useProfileAndInventoryStore';

interface NavbarProps {
  profile: UserProfileDto | null;
  myRank: UserRankProfileDto | null;
  onOpenLeaderboard: () => void;
  onOpenBattleLeaderboard: () => void;
  onStart1v1Battle: () => void;
  onReturnToLobby: () => void;
  onOpenProfile?: () => void;
  onOpenFittingRoom?: () => void;
  onOpenWardrobe?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  profile, 
  myRank,
  onOpenLeaderboard, 
  onOpenBattleLeaderboard,
  onStart1v1Battle,
  onReturnToLobby,
  onOpenProfile,
  onOpenFittingRoom,
  onOpenWardrobe
}) => {
  const { activeConfig } = useAvatarStore();
  const { profile: fullProfile } = useProfileAndInventoryStore();

  const tokenBalance = fullProfile?.tokenBalance ?? (profile as any)?.tokenBalance ?? 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={onReturnToLobby}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-indigo-200 to-emerald-300 bg-clip-text text-transparent">
              LearnEnglish Go
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Học tiếng Anh qua Mini-game</p>
          </div>
        </div>

        {/* User Stats / Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {myRank && (
            <div className="flex items-center gap-2">
              <RankBadge
                tier={(myRank.tier as RankTier) || 'Bronze'}
                division={(myRank.division as RankDivision) || 'III'}
                size="sm"
                className="hidden md:inline-flex"
              />
              <TrophyBadge trophy={myRank.trophy} size="sm" />
            </div>
          )}

          {/* Tokens Pill */}
          <div 
            onClick={onOpenFittingRoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer shadow-sm group"
            title="Số dư Token - Bấm để mở Cửa Hàng"
          >
            <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-extrabold text-sm tracking-tight">{tokenBalance.toLocaleString()}</span>
            <span className="text-xs text-amber-300/80 hidden sm:inline">🪙</span>
          </div>

          {profile && (
            <>
              {/* Daily Streak */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400"
                title={`Chuỗi học: ${profile.currentStreak} ngày liên tục`}
              >
                <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
                <span className="font-bold text-sm">{profile.currentStreak}</span>
                <span className="text-xs text-orange-300/80 hidden lg:inline">ngày</span>
              </div>

              {/* Streak Freeze */}
              {profile.streakFreezeCount > 0 && (
                <div 
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                  title="Thẻ bảo lưu Streak khi nghỉ 1 ngày"
                >
                  <Snowflake className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold">{profile.streakFreezeCount}</span>
                </div>
              )}

              {/* Level & XP */}
              <div className="hidden lg:flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Lv.{profile.currentLevel}</span>
                  <span className="text-sm font-bold text-emerald-400">{profile.totalXp} XP</span>
                </div>
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, Math.max(5, (profile.currentLevelXp / Math.max(1, profile.nextLevelXp)) * 100))}%` 
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Quick Shop Button */}
          {onOpenFittingRoom && (
            <button
              onClick={onOpenFittingRoom}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-all cursor-pointer hidden sm:flex"
              title="Cửa hàng thời trang & phụ kiện"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

          {/* Quick Wardrobe Button */}
          {onOpenWardrobe && (
            <button
              onClick={onOpenWardrobe}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer hidden sm:flex"
              title="Tủ đồ & Quản lý Outfit"
            >
              <Shirt className="w-4 h-4" />
            </button>
          )}

          {/* 1v1 Battle Quick Button */}
          <button
            onClick={onStart1v1Battle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Swords className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span className="hidden sm:inline">Đấu 1v1</span>
          </button>

          {/* Leaderboard button */}
          <button
            onClick={onOpenBattleLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 transition-all font-medium text-xs sm:text-sm shadow-sm cursor-pointer"
            title="Bảng xếp hạng đấu thủ"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">BXH</span>
          </button>

          {/* Avatar Profile Circular Pill */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/60 transition-all cursor-pointer group shadow-sm"
              title="Hồ sơ & Avatar cá nhân"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-400/80 bg-slate-950 flex items-center justify-center">
                <ModularAvatar
                  config={activeConfig}
                  mode="head"
                  size={36}
                />
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
