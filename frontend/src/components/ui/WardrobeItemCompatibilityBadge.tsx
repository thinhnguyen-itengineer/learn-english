import React from 'react';
import { Sparkles, Zap, Heart, Users } from 'lucide-react';
import { Gender3D } from './Item3DCard';

export interface WardrobeItemCompatibilityBadgeProps {
  /** Gender compatibility of the 3D wardrobe item */
  gender: Gender3D;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Show full label or compact icon */
  showLabel?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const WardrobeItemCompatibilityBadge: React.FC<WardrobeItemCompatibilityBadgeProps> = ({
  gender,
  size = 'sm',
  showLabel = true,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
  };

  switch (gender) {
    case 'FEMALE':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-300 shadow-sm ${sizeClasses[size]} ${className}`}
          title="Thiết kế vừa vặn cho Nhân vật Nữ (Aoi)"
        >
          <Heart size={iconSizes[size]} className="text-rose-400 fill-rose-400/40" />
          {showLabel && <span>Nữ (Aoi)</span>}
        </span>
      );

    case 'MALE':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-sm ${sizeClasses[size]} ${className}`}
          title="Thiết kế vừa vặn cho Nhân vật Nam (Ren)"
        >
          <Zap size={iconSizes[size]} className="text-cyan-400 fill-cyan-400/40" />
          {showLabel && <span>Nam (Ren)</span>}
        </span>
      );

    case 'UNISEX':
    default:
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-200 shadow-sm ${sizeClasses[size]} ${className}`}
          title="Thiết kế Unisex tương thích cả Nam & Nữ (Cặp đôi đồng điệu)"
        >
          <Sparkles size={iconSizes[size]} className="text-purple-300" />
          {showLabel && (
            <span className="flex items-center gap-1">
              <span>Unisex</span>
              <Users size={iconSizes[size] - 2} className="opacity-70" />
            </span>
          )}
        </span>
      );
  }
};
