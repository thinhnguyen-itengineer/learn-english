import React from 'react';
import { Coins, Check, Eye, Lock } from 'lucide-react';
import { RarityBadge, RarityTier } from './RarityBadge';
import { Button } from './Button';

export interface ShopItem {
  id: string;
  itemCode: string;
  name: string;
  description?: string;
  category: 'tops' | 'bottoms' | 'footwear' | 'hair' | 'headwear' | 'eyewear' | 'neckwear' | 'wings' | 'companion' | 'aura' | 'preset_slot';
  rarity: RarityTier;
  tokenPrice: number;
  previewSvg?: React.ReactNode;
  isTintable?: boolean;
}

export interface ShopItemCardProps {
  item: ShopItem;
  userTokenBalance: number;
  isOwned?: boolean;
  isEquipped?: boolean;
  isTryingOn?: boolean;
  onTryOn?: (item: ShopItem) => void;
  onBuy?: (item: ShopItem) => void;
  onEquip?: (item: ShopItem) => void;
  className?: string;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  userTokenBalance,
  isOwned = false,
  isEquipped = false,
  isTryingOn = false,
  onTryOn,
  onBuy,
  onEquip,
  className = '',
}) => {
  const canAfford = userTokenBalance >= item.tokenPrice;

  // Category label in Vietnamese
  const categoryLabels: Record<string, string> = {
    tops: 'Áo Trang Phục',
    bottoms: 'Quần & Váy',
    footwear: 'Giày Dép',
    hair: 'Kiểu Tóc',
    headwear: 'Mũ Nón',
    eyewear: 'Kính Mắt',
    neckwear: 'Phụ Kiện Cổ',
    wings: 'Đôi Cánh',
    companion: 'Thú Cưng / Bạn',
    aura: 'Hào Quang & Bục',
    preset_slot: 'Slot Trang Phục',
  };

  const rarityBorders: Record<RarityTier, string> = {
    common: 'border-slate-700/80 hover:border-slate-500 shadow-[0_4px_0_#1e293b]',
    rare: 'border-emerald-500/80 hover:border-emerald-400 shadow-[0_4px_0_#047857]',
    epic: 'border-purple-500/80 hover:border-purple-400 shadow-[0_4px_0_#6d28d9] ring-1 ring-purple-500/30',
    legendary: 'border-amber-500 hover:border-amber-400 shadow-[0_4px_0_#c2410c] ring-1 ring-amber-400/50',
  };

  return (
    <div
      className={`
        relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 backdrop-blur-sm
        transition-all duration-200 border-2 select-none
        ${rarityBorders[item.rarity]}
        ${isTryingOn ? 'ring-2 ring-emerald-400 border-emerald-400 scale-[1.02]' : ''}
        ${className}
      `}
    >
      {/* Top Bar: Rarity + Category */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <RarityBadge rarity={item.rarity} size="xs" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
          {categoryLabels[item.category] || item.category}
        </span>
      </div>

      {/* Item Visual Preview Box */}
      <div className="relative w-full aspect-square rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center p-3 mb-3 overflow-hidden group">
        {item.previewSvg ? (
          <div className="w-full h-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            {item.previewSvg}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <span className="text-3xl mb-1">🎁</span>
            <span className="text-[10px] font-medium text-slate-400">Vật phẩm</span>
          </div>
        )}

        {/* Owned or Equipped Badge Overlay */}
        {isEquipped ? (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg bg-emerald-500 text-white shadow-sm flex items-center gap-1">
            <Check className="w-3 h-3" /> Đang Mặc
          </span>
        ) : isOwned ? (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg bg-blue-600 text-white shadow-sm">
            Đã Sở Hữu
          </span>
        ) : null}

        {/* Live Try-On Active Tag */}
        {isTryingOn && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg bg-emerald-600/90 text-emerald-200 border border-emerald-400 shadow-sm animate-pulse flex items-center gap-1">
            <Eye className="w-3 h-3" /> Đang Thử
          </span>
        )}
      </div>

      {/* Name & Description */}
      <div className="mb-3">
        <h4 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
          {item.name}
        </h4>
        {item.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer: Price + Action Button */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/60 mt-auto">
        {/* Token Price */}
        {!isOwned ? (
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <span className={`text-sm font-black tabular-nums ${canAfford ? 'text-amber-300' : 'text-slate-400'}`}>
              {item.tokenPrice.toLocaleString()}
            </span>
          </div>
        ) : (
          <span className="text-xs font-bold text-slate-400">Trong kho</span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Try On Button (if not owned or equipped) */}
          {onTryOn && !isEquipped && (
            <Button
              variant={isTryingOn ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onTryOn(item)}
              className="text-xs px-2.5 py-1"
              title="Thử đồ trên Avatar"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              {isTryingOn ? 'Bỏ thử' : 'Thử'}
            </Button>
          )}

          {/* Buy or Equip Button */}
          {isOwned ? (
            onEquip && (
              <Button
                variant={isEquipped ? 'secondary' : 'primary'}
                size="sm"
                disabled={isEquipped}
                onClick={() => onEquip(item)}
                className="text-xs px-3 py-1"
              >
                {isEquipped ? 'Đang Mặc' : 'Mặc'}
              </Button>
            )
          ) : (
            onBuy && (
              <Button
                variant={canAfford ? 'token' : 'secondary'}
                size="sm"
                disabled={!canAfford}
                onClick={() => onBuy(item)}
                className="text-xs px-3 py-1 font-black"
              >
                {!canAfford && <Lock className="w-3 h-3 mr-1" />}
                Mua
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
