import React from 'react';
import { Trophy, Flame, Shield, Award, Crown, Sparkles, Target } from 'lucide-react';

export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
export type RankDivision = 'I' | 'II' | 'III';

export interface RankBadgeProps {
  tier: RankTier;
  division?: RankDivision;
  showDivision?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const tierConfig: Record<RankTier, {
  nameVi: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  glow: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  Bronze: {
    nameVi: 'Đồng',
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-600/70',
    textColor: 'text-amber-400',
    glow: 'shadow-[0_0_12px_rgba(217,119,6,0.3)]',
    icon: Award,
  },
  Silver: {
    nameVi: 'Bạc',
    badgeBg: 'bg-slate-900/70',
    badgeBorder: 'border-slate-400/70',
    textColor: 'text-slate-200',
    glow: 'shadow-[0_0_12px_rgba(148,163,184,0.3)]',
    icon: Award,
  },
  Gold: {
    nameVi: 'Vàng',
    badgeBg: 'bg-yellow-950/60',
    badgeBorder: 'border-yellow-500/80',
    textColor: 'text-yellow-300',
    glow: 'shadow-[0_0_16px_rgba(234,179,8,0.4)]',
    icon: Crown,
  },
  Platinum: {
    nameVi: 'Bạch Kim',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-400/80',
    textColor: 'text-cyan-300',
    glow: 'shadow-[0_0_18px_rgba(6,182,212,0.45)]',
    icon: Sparkles,
  },
  Diamond: {
    nameVi: 'Kim Cương',
    badgeBg: 'bg-blue-950/70',
    badgeBorder: 'border-blue-500/90',
    textColor: 'text-blue-300',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    icon: Sparkles,
  },
  Master: {
    nameVi: 'Cao Thủ',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-500',
    textColor: 'text-purple-300',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.6)] animate-pulse',
    icon: Crown,
  },
};

export const RankBadge: React.FC<RankBadgeProps> = ({
  tier,
  division,
  showDivision = true,
  size = 'md',
  className = '',
}) => {
  const config = tierConfig[tier] || tierConfig.Bronze;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-bold gap-1 rounded-lg border',
    md: 'px-3 py-1 text-sm font-extrabold gap-1.5 rounded-xl border',
    lg: 'px-4 py-1.5 text-base font-black gap-2 rounded-2xl border-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      className={`
        inline-flex items-center select-none backdrop-blur-md
        ${config.badgeBg}
        ${config.badgeBorder}
        ${config.textColor}
        ${config.glow}
        ${sizeClasses}
        ${className}
      `}
    >
      <IconComponent className={`${iconSizes} shrink-0`} />
      <span>{config.nameVi}</span>
      {showDivision && division && tier !== 'Master' && (
        <span className="opacity-90 font-mono tracking-tight">{division}</span>
      )}
    </span>
  );
};

export interface TrophyBadgeProps {
  trophy: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrophyBadge: React.FC<TrophyBadgeProps> = ({
  trophy,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-bold gap-1 rounded-lg',
    md: 'px-3 py-1 text-sm font-black gap-1.5 rounded-xl',
    lg: 'px-4 py-1.5 text-base font-black gap-2 rounded-2xl',
  }[size];

  return (
    <span
      className={`
        inline-flex items-center bg-amber-500/15 border border-amber-500/40 text-amber-300
        shadow-[0_0_10px_rgba(245,158,11,0.25)] select-none
        ${sizeClasses}
        ${className}
      `}
    >
      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
      <span className="font-mono tracking-wide">{trophy.toLocaleString()}</span>
    </span>
  );
};

export interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  size = 'md',
  className = '',
}) => {
  if (streak < 3) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-bold gap-1 rounded-lg',
    md: 'px-3 py-1 text-sm font-black gap-1.5 rounded-xl',
    lg: 'px-4 py-1.5 text-base font-black gap-2 rounded-2xl',
  }[size];

  return (
    <span
      className={`
        inline-flex items-center bg-gradient-to-r from-orange-600/30 to-amber-600/30 
        border border-orange-500/60 text-orange-300
        shadow-[0_0_12px_rgba(249,115,22,0.35)] select-none animate-bounce
        ${sizeClasses}
        ${className}
      `}
    >
      <Flame className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
      <span>{streak} Chuỗi Thắng!</span>
    </span>
  );
};

export interface ShieldBadgeProps {
  shieldGames: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const ShieldBadge: React.FC<ShieldBadgeProps> = ({
  shieldGames,
  size = 'sm',
  className = '',
}) => {
  if (shieldGames <= 0) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-bold gap-1 rounded-lg',
    md: 'px-2.5 py-1 text-sm font-extrabold gap-1.5 rounded-xl',
  }[size];

  return (
    <span
      className={`
        inline-flex items-center bg-blue-500/15 border border-blue-400/50 text-blue-300
        shadow-[0_0_10px_rgba(59,130,246,0.3)] select-none
        ${sizeClasses}
        ${className}
      `}
      title={`${shieldGames} trận bảo vệ rớt hạng`}
    >
      <Shield className="w-3.5 h-3.5 text-blue-400 fill-blue-400/30 shrink-0" />
      <span>{shieldGames} Khiên</span>
    </span>
  );
};

export interface WinRateBadgeProps {
  winRate: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const WinRateBadge: React.FC<WinRateBadgeProps> = ({
  winRate,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1 rounded-lg',
    md: 'px-2.5 py-1 text-sm font-bold gap-1.5 rounded-xl',
  }[size];

  return (
    <span
      className={`
        inline-flex items-center bg-emerald-500/15 border border-emerald-500/40 text-emerald-300
        select-none
        ${sizeClasses}
        ${className}
      `}
    >
      <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span>{winRate.toFixed(1)}% Thắng</span>
    </span>
  );
};
