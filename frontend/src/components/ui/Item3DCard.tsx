import React from 'react';
import {
  Sparkles,
  Coins,
  Check,
  Lock,
  Eye,
  AlertTriangle,
  Shirt,
  Scissors,
  Crown,
  Layers,
  HardDrive,
  User,
} from 'lucide-react';
import { RarityBadge } from './RarityBadge';
import { WardrobeItemCompatibilityBadge } from './WardrobeItemCompatibilityBadge';

export type Slot3D = 'BASE_BODY' | 'HAIR' | 'TOP' | 'BOTTOM' | 'SHOES' | 'ACCESSORY';
export type Rarity3D = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type Gender3D = 'MALE' | 'FEMALE' | 'UNISEX';

export interface AvatarItem3DData {
  id: string;
  name: string;
  description?: string;
  slot: Slot3D;
  rarity: Rarity3D;
  gender?: Gender3D;
  modelUrl: string;
  thumbnailUrl: string;
  priceTokens: number;
  levelRequired?: number;
  boneBindingRoot?: string;
  hideSlotsWhenEquipped?: string[];
  maskedBodyParts?: string[];
  polyCount?: number;
  fileSizeBytes?: number;
}

export interface Item3DCardProps {
  item: AvatarItem3DData;
  isEquipped?: boolean;
  isPreviewing?: boolean;
  isOwned?: boolean;
  userLevel?: number;
  userTokens?: number;
  onPreview?: (item: AvatarItem3DData) => void;
  onEquip?: (item: AvatarItem3DData) => void;
  onBuy?: (item: AvatarItem3DData) => void;
  className?: string;
}

export const Item3DCard: React.FC<Item3DCardProps> = ({
  item,
  isEquipped = false,
  isPreviewing = false,
  isOwned = false,
  userLevel = 1,
  userTokens = 0,
  onPreview,
  onEquip,
  onBuy,
  className = '',
}) => {
  const isLevelLocked = item.levelRequired !== undefined && userLevel < item.levelRequired;
  const canAfford = userTokens >= item.priceTokens;

  // Format polycount (e.g. 2840 -> "2.8k")
  const formattedPolys = item.polyCount
    ? item.polyCount >= 1000
      ? `${(item.polyCount / 1000).toFixed(1)}k tris`
      : `${item.polyCount} tris`
    : null;

  // Format filesize (e.g. 245760 -> "240 KB")
  const formattedSize = item.fileSizeBytes
    ? `${Math.round(item.fileSizeBytes / 1024)} KB`
    : null;

  // Slot icon and label
  const slotMeta: Record<Slot3D, { label: string; icon: React.ReactNode; color: string }> = {
    BASE_BODY: { label: 'Thân Chibi', icon: <User className="w-3 h-3" />, color: 'text-rose-400 bg-rose-950/60 border-rose-600/40' },
    HAIR: { label: 'Tóc Chibi', icon: <Scissors className="w-3 h-3" />, color: 'text-amber-400 bg-amber-950/60 border-amber-600/40' },
    TOP: { label: 'Áo Thời Trang', icon: <Shirt className="w-3 h-3" />, color: 'text-blue-400 bg-blue-950/60 border-blue-600/40' },
    BOTTOM: { label: 'Quần / Váy', icon: <Layers className="w-3 h-3" />, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/40' },
    SHOES: { label: 'Giày Sneaker', icon: <Layers className="w-3 h-3" />, color: 'text-purple-400 bg-purple-950/60 border-purple-600/40' },
    ACCESSORY: { label: 'Phụ Kiện', icon: <Crown className="w-3 h-3" />, color: 'text-pink-400 bg-pink-950/60 border-pink-600/40' },
  };

  const currentSlot = slotMeta[item.slot] || slotMeta.TOP;

  // Rarity styling border
  const rarityBorderClasses: Record<Rarity3D, string> = {
    COMMON: 'border-slate-700 hover:border-slate-500 shadow-sm',
    RARE: 'border-emerald-600/70 hover:border-emerald-500 shadow-glow-rare/30',
    EPIC: 'border-purple-600/80 hover:border-purple-400 shadow-glow-epic/40',
    LEGENDARY: 'border-amber-500 hover:border-yellow-400 shadow-glow-legendary/50',
  };

  // Convert rarity to lowercase for RarityBadge component
  const rarityLower = item.rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary';

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-slate-900/90 backdrop-blur-sm border-2 p-3 transition-all duration-200 select-none ${
        isPreviewing
          ? 'border-amber-400 bg-amber-950/20 shadow-glow-tryon scale-[1.02] ring-2 ring-amber-400/50'
          : isEquipped
          ? 'border-emerald-500 bg-emerald-950/20 shadow-glow-emerald/30'
          : rarityBorderClasses[item.rarity] || 'border-slate-700'
      } ${isLevelLocked ? 'opacity-70 grayscale-[30%]' : 'hover:-translate-y-1 hover:shadow-2xl'} ${className}`}
    >
      {/* Top Header: Slot Tag & Status Badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${currentSlot.color}`}
        >
          {currentSlot.icon}
          {currentSlot.label}
        </span>

        {/* Priority Badge: Previewing > Equipped > Rarity */}
        {isPreviewing ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] tracking-wide shadow-sm animate-pulse">
            <Sparkles className="w-3 h-3" />
            ĐANG THỬ
          </span>
        ) : isEquipped ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wide shadow-sm">
            <Check className="w-3 h-3 stroke-[3]" />
            ĐANG MẶC
          </span>
        ) : (
          <RarityBadge rarity={rarityLower} size="sm" showIcon={false} />
        )}
      </div>

      {/* 3D Thumbnail Showcase with Click-to-Preview */}
      <div
        onClick={() => onPreview?.(item)}
        className="relative w-full aspect-square rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-950 flex items-center justify-center overflow-hidden cursor-pointer border border-slate-700/50 group-hover:border-slate-500 transition-colors"
        title="Nhấn để mặc thử 3D"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPreview?.(item);
          }
        }}
      >
        {/* Subtle grid turntable lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

        {/* 3D Model Thumbnail Image */}
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            {currentSlot.icon}
          </div>
        )}

        {/* Level Lock Overlay */}
        {isLevelLocked && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
            <Lock className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-xs font-black text-amber-300">Yêu cầu Cấp {item.levelRequired}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Hiện tại: Lv.{userLevel}</span>
          </div>
        )}

        {/* Quick Preview Hover Pill */}
        {!isLevelLocked && (
          <div className="absolute bottom-1.5 inset-x-2 py-1 px-2 rounded-lg bg-slate-900/85 backdrop-blur-sm border border-slate-700/80 text-[10px] font-bold text-cyan-300 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="w-3 h-3" />
            Thử lên 3D
          </div>
        )}
      </div>

      {/* Item Metadata: Name, Polycount, Conflict warnings */}
      <div className="mt-2.5 flex flex-col gap-1">
        <h4 className="font-bold text-white text-xs md:text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">
          {item.name}
        </h4>

        {item.description && (
          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
        )}

        {/* 3D Specs Chips & Gender Compatibility Badge */}
        <div className="flex items-center flex-wrap gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
          {item.gender && (
            <WardrobeItemCompatibilityBadge gender={item.gender} size="xs" />
          )}
          {formattedPolys && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Layers className="w-2.5 h-2.5 text-cyan-400" />
              {formattedPolys}
            </span>
          )}
          {formattedSize && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <HardDrive className="w-2.5 h-2.5 text-blue-400" />
              {formattedSize}
            </span>
          )}
        </div>

        {/* Slot Conflict Warning (hide_slots_when_equipped) */}
        {item.hideSlotsWhenEquipped && item.hideSlotsWhenEquipped.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-amber-400/90 font-medium bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-800/40">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">Ẩn {item.hideSlotsWhenEquipped.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Footer Actions: Equip / Buy / Price */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
        {isOwned ? (
          /* Owned: Equip / Equipped Button */
          isEquipped ? (
            <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Đang trang bị
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onEquip?.(item)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold border border-slate-600 hover:border-blue-500 transition-all active:translate-y-[2px] shadow-3d-slate hover:shadow-3d-blue flex items-center justify-center gap-1"
            >
              Trang bị
            </button>
          )
        ) : (
          /* Not Owned: Buy with Tokens */
          <button
            type="button"
            disabled={isLevelLocked || !canAfford}
            onClick={() => onBuy?.(item)}
            className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isLevelLocked
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : canAfford
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-3d-gold active:translate-y-[2px]'
                : 'bg-slate-800 text-rose-400 border border-rose-900/60 cursor-not-allowed'
            }`}
            title={!canAfford ? 'Không đủ Token để mua món này' : undefined}
          >
            <Coins className="w-3.5 h-3.5 fill-amber-300 text-amber-600" />
            <span>{item.priceTokens === 0 ? 'Miễn phí' : `${item.priceTokens} Tokens`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
