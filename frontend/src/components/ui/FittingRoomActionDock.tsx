import React from 'react';
import {
  Sparkles,
  RotateCcw,
  ShoppingBag,
  Coins,
  Bookmark,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { AvatarItem3DData } from './Item3DCard';

export interface FittingRoomActionDockProps {
  /** List of items currently being previewed / tried on */
  previewItems: AvatarItem3DData[];
  /** Total token cost of all previewed unowned items */
  totalTokensCost: number;
  /** User's current token balance */
  userTokens: number;
  /** Callback to remove a single item from try-on */
  onRemovePreviewItem?: (itemId: string) => void;
  /** Callback to revert all previewed items back to original equipped items */
  onRevertAll?: () => void;
  /** Callback to purchase all unowned previewed items */
  onBuyAll?: () => void;
  /** Callback to open Save-to-Preset dialog */
  onSaveAsPreset?: () => void;
  /** Callback to confirm and equip all previewed items (if owned) */
  onEquipAll?: () => void;
  /** Custom container class */
  className?: string;
}

export const FittingRoomActionDock: React.FC<FittingRoomActionDockProps> = ({
  previewItems,
  totalTokensCost,
  userTokens,
  onRemovePreviewItem,
  onRevertAll,
  onBuyAll,
  onSaveAsPreset,
  onEquipAll,
  className = '',
}) => {
  if (previewItems.length === 0) return null;

  const canAffordAll = userTokens >= totalTokensCost;
  const hasUnownedItems = totalTokensCost > 0;

  return (
    <div
      className={`relative z-30 w-full max-w-xl mx-auto px-4 select-none pointer-events-auto transition-all animate-pop-bounce ${className}`}
      role="region"
      aria-label="Fitting Room Action Dock"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400/80 rounded-2xl p-3 md:p-4 shadow-2xl shadow-black/80 ring-2 ring-amber-400/30 flex flex-col gap-3">
        {/* Top Header Row: Preview Status & Revert All Button */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                Đang Mặc Thử 3D ({previewItems.length} món)
              </span>
              <span className="text-[10px] text-amber-300/80 font-medium">
                Xoay 360° để kiểm tra trang phục trước khi quyết định
              </span>
            </div>
          </div>

          {/* Revert Button */}
          <button
            type="button"
            onClick={onRevertAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all active:translate-y-[1px]"
            title="Hủy mọi món đang thử, trả về nhân vật ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hủy thử</span>
          </button>
        </div>

        {/* Middle Item Pills Carousel / Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 shrink-0 text-xs font-medium text-white group"
            >
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="w-6 h-6 object-contain rounded-lg bg-slate-900 p-0.5"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-bold text-amber-400">
                  3D
                </div>
              )}

              <span className="font-bold text-[11px] max-w-[100px] truncate">{item.name}</span>

              {item.priceTokens > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-amber-400">
                  <Coins className="w-2.5 h-2.5 fill-amber-300" />
                  {item.priceTokens}
                </span>
              )}

              {onRemovePreviewItem && (
                <button
                  type="button"
                  onClick={() => onRemovePreviewItem(item.id)}
                  className="p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Gỡ món này ra"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Action Row: Save to Preset & Buy / Equip Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Save to Preset Button */}
          {onSaveAsPreset && (
            <button
              type="button"
              onClick={onSaveAsPreset}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-600 transition-all active:translate-y-[1px] shadow-3d-slate"
              title="Lưu bộ trang phục này vào 1 trong 5 Preset"
            >
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Lưu Preset</span>
            </button>
          )}

          {/* Right Action: Buy All Or Equip All */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {hasUnownedItems ? (
              <button
                type="button"
                disabled={!canAffordAll}
                onClick={onBuyAll}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  canAffordAll
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-3d-gold active:translate-y-[2px]'
                    : 'bg-slate-800 text-rose-400 border border-rose-900/60 cursor-not-allowed'
                }`}
                title={!canAffordAll ? 'Không đủ Token trong ví' : undefined}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Mua toàn bộ</span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 font-mono">
                  <Coins className="w-3 h-3 fill-amber-300 text-amber-700" />
                  {totalTokensCost}
                </span>
              </button>
            ) : (
              /* All items owned: Equip Now */
              <button
                type="button"
                onClick={onEquipAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-3d-green active:translate-y-[2px] transition-all"
              >
                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                Áp dụng trang phục ngay
              </button>
            )}
          </div>
        </div>

        {/* Insufficient token warning alert */}
        {hasUnownedItems && !canAffordAll && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-950/60 border border-rose-800/60 text-[11px] text-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>
              Bạn đang thiếu <strong className="font-mono text-white">{totalTokensCost - userTokens} Tokens</strong> để mua trọn bộ trang phục này.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
