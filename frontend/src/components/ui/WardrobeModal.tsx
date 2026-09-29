import React, { useState } from 'react';
import {
  X,
  Shirt,
  ShoppingBag,
  Sparkles,
  Check,
  Search,
} from 'lucide-react';
import { ShopItem } from './ShopItemCard';
import { AvatarRenderer, AvatarPresetConfig } from './AvatarRenderer';
import { Button } from './Button';
import { RarityBadge } from './RarityBadge';

export interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedItems: ShopItem[];
  equippedPreset: AvatarPresetConfig;
  onEquipItem: (item: ShopItem) => void;
  onUnequipCategory?: (category: string) => void;
  onOpenShop?: () => void;
  onOpenCustomizer?: () => void;
  className?: string;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  ownedItems = [],
  equippedPreset = {},
  onEquipItem,
  onUnequipCategory,
  onOpenShop,
  onOpenCustomizer,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'tops', label: 'Áo' },
    { id: 'bottoms', label: 'Quần & Váy' },
    { id: 'footwear', label: 'Giày Dép' },
    { id: 'headwear', label: 'Mũ Nón' },
    { id: 'eyewear', label: 'Kính Mắt' },
    { id: 'neckwear', label: 'Phụ Kiện' },
    { id: 'companion', label: 'Thú Cưng' },
    { id: 'aura', label: 'Hào Quang' },
  ];

  const filteredItems = ownedItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none ${className}`}>
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[800px] bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Shirt className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Tủ Đồ Cá Nhân (Wardrobe Inventory)
              </h3>
              <p className="text-xs text-slate-400">
                Quản lý các bộ sưu tập và trang phục bạn đã sở hữu ({ownedItems.length} vật phẩm)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenShop && (
              <Button
                variant="gold"
                size="sm"
                onClick={onOpenShop}
                className="text-xs font-black"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Cửa Hàng
              </Button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Live Avatar Preview */}
          <div className="hidden md:flex w-72 lg:w-80 flex-col items-center justify-between p-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-r border-slate-800 shrink-0">
            <div className="text-xs font-bold text-slate-400">Trang phục đang mặc</div>
            <div className="w-full flex-1 flex items-center justify-center">
              <AvatarRenderer
                preset={equippedPreset}
                mode="full"
                size={270}
                isAnimated={true}
              />
            </div>
            {onOpenCustomizer && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={onOpenCustomizer}
                className="text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Tùy Biến Toàn Diện
              </Button>
            )}
          </div>

          {/* RIGHT: Grid of Owned Items */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/60">
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border
                      ${selectedCategory === c.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_2px_0_#4338ca]'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }
                    `}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lọc tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 p-5 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                  <span className="text-4xl mb-3">📦</span>
                  <p className="text-sm font-extrabold text-white">Chưa có vật phẩm nào trong mục này</p>
                  <p className="text-xs text-slate-500 mt-1">Ghé thăm Cửa hàng để sở hữu trang phục mới!</p>
                  {onOpenShop && (
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={onOpenShop}
                      className="mt-4 text-xs font-black"
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" /> Mở Cửa Hàng
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => {
                    const isEquipped =
                      equippedPreset.topsId === item.itemCode ||
                      equippedPreset.bottomsId === item.itemCode ||
                      equippedPreset.footwearId === item.itemCode ||
                      equippedPreset.headwearId === item.itemCode ||
                      equippedPreset.eyewearId === item.itemCode ||
                      equippedPreset.neckwearId === item.itemCode ||
                      equippedPreset.companionId === item.itemCode ||
                      equippedPreset.auraId === item.itemCode;

                    return (
                      <div
                        key={item.id}
                        className={`
                          p-3.5 rounded-2xl bg-slate-800/90 border-2 transition-all flex flex-col justify-between
                          ${isEquipped
                            ? 'border-emerald-500 shadow-[0_4px_0_#047857]'
                            : 'border-slate-700 shadow-[0_4px_0_#1e293b]'
                          }
                        `}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <RarityBadge rarity={item.rarity} size="xs" />
                            {isEquipped && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase">
                                <Check className="w-3 h-3" /> Đang Mặc
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-black text-white line-clamp-1">{item.name}</h5>
                          {item.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-end">
                          <Button
                            variant={isEquipped ? 'secondary' : 'primary'}
                            size="sm"
                            disabled={isEquipped}
                            onClick={() => onEquipItem(item)}
                            className="text-xs px-3 py-1 font-bold"
                          >
                            {isEquipped ? 'Đã Trang Bị' : 'Mặc Vào'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
