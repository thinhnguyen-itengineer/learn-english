import React from 'react';
import { Sparkles, Shield, Flame, Star } from 'lucide-react';

export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary';

export interface RarityBadgeProps {
  rarity: RarityTier;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const tierConfig: Record<
  RarityTier,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    containerClass: string;
    iconClass: string;
  }
> = {
  common: {
    label: 'Common',
    icon: Star,
    containerClass: 'bg-slate-800/80 border-slate-600/70 text-slate-300 shadow-[0_2px_0_#334155]',
    iconClass: 'text-slate-400',
  },
  rare: {
    label: 'Rare',
    icon: Sparkles,
    containerClass: 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_2px_0_#047857] shadow-emerald-900/30',
    iconClass: 'text-emerald-400 animate-pulse-subtle',
  },
  epic: {
    label: 'Epic',
    icon: Shield,
    containerClass: 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-[0_2px_0_#6d28d9] ring-1 ring-purple-500/40 shadow-purple-900/40',
    iconClass: 'text-purple-300 animate-pulse',
  },
  legendary: {
    label: 'Legendary',
    icon: Flame,
    containerClass: 'bg-gradient-to-r from-amber-950/90 via-orange-950/90 to-amber-950/90 border-amber-500 text-amber-200 shadow-[0_2px_0_#c2410c] ring-1 ring-amber-400/60 shadow-amber-600/30 animate-pulse-subtle',
    iconClass: 'text-amber-300 animate-bounce',
  },
};

const sizeStyles = {
  xs: {
    badge: 'px-1.5 py-0.5 text-[10px] font-black gap-1 rounded-md border',
    icon: 'w-2.5 h-2.5',
  },
  sm: {
    badge: 'px-2 py-0.5 text-xs font-black gap-1.5 rounded-lg border',
    icon: 'w-3 h-3',
  },
  md: {
    badge: 'px-2.5 py-1 text-xs font-black tracking-wide gap-1.5 rounded-xl border-2',
    icon: 'w-3.5 h-3.5',
  },
  lg: {
    badge: 'px-3.5 py-1.5 text-sm font-black tracking-wide gap-2 rounded-2xl border-2',
    icon: 'w-4 h-4',
  },
};

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = 'sm',
  showIcon = true,
  className = '',
}) => {
  const config = tierConfig[rarity] || tierConfig.common;
  const sizeStyle = sizeStyles[size];
  const IconComponent = config.icon;

  return (
    <span
      className={`
        inline-flex items-center select-none uppercase font-extrabold tracking-wider
        ${config.containerClass}
        ${sizeStyle.badge}
        ${className}
      `}
    >
      {showIcon && <IconComponent className={`${sizeStyle.icon} ${config.iconClass} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
