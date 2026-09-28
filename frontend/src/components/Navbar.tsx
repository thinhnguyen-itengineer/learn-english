import React from 'react';
import { Flame, Trophy, Snowflake, Sparkles } from 'lucide-react';
import { UserProfileDto } from '../types/game';

interface NavbarProps {
  profile: UserProfileDto | null;
  onOpenLeaderboard: () => void;
  onReturnToLobby: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, onOpenLeaderboard, onReturnToLobby }) => {
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
        <div className="flex items-center gap-3 sm:gap-6">
          {profile && (
            <>
              {/* Daily Streak */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400"
                title={`Chuỗi học: ${profile.currentStreak} ngày liên tục`}
              >
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                <span className="font-bold text-sm">{profile.currentStreak}</span>
                <span className="text-xs text-amber-300/80 hidden sm:inline">ngày</span>
              </div>

              {/* Streak Freeze */}
              {profile.streakFreezeCount > 0 && (
                <div 
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                  title="Thẻ bảo lưu Streak khi nghỉ 1 ngày"
                >
                  <Snowflake className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold">{profile.streakFreezeCount}</span>
                </div>
              )}

              {/* Level & XP */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Lv.{profile.currentLevel}</span>
                  <span className="text-sm font-bold text-emerald-400">{profile.totalXp} XP</span>
                </div>
                <div className="w-24 sm:w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700/50">
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

          {/* Leaderboard button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 transition-all font-medium text-xs sm:text-sm shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Bảng xếp hạng</span>
          </button>
        </div>
      </div>
    </header>
  );
};
