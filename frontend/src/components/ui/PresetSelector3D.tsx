import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  Edit2,
  Trash2,
  Save,
  Plus,
  Sparkles,
  Shirt,
  Scissors,
  Layers,
  Crown,
  Eye,
} from 'lucide-react';
import { Slot3D } from './Item3DCard';

export interface AvatarPreset3DConfig {
  baseBodyId: string;
  hairId: string;
  topId: string;
  bottomId: string;
  shoesId: string;
  accessoryId?: string | null;
}

export interface AvatarPreset3DItem {
  id?: string;
  presetSlot: number; // 1 to 5
  presetName: string;
  config?: AvatarPreset3DConfig;
  thumbnailUrl?: string;
  updatedAt?: string;
  isEmpty?: boolean;
}

export interface PresetSelector3DProps {
  presets: AvatarPreset3DItem[];
  activeSlot?: number;
  onApplyPreset?: (preset: AvatarPreset3DItem) => void;
  onSaveCurrentToPreset?: (slot: number, name: string) => void;
  onRenamePreset?: (slot: number, newName: string) => void;
  onDeletePreset?: (slot: number) => void;
  className?: string;
}

export const PresetSelector3D: React.FC<PresetSelector3DProps> = ({
  presets = [],
  activeSlot = 1,
  onApplyPreset,
  onSaveCurrentToPreset,
  onRenamePreset,
  onDeletePreset,
  className = '',
}) => {
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  // Ensure 5 slots exist
  const fullPresets: AvatarPreset3DItem[] = Array.from({ length: 5 }, (_, i) => {
    const slotNum = i + 1;
    const existing = presets.find((p) => p.presetSlot === slotNum);
    return (
      existing || {
        presetSlot: slotNum,
        presetName: `Preset ${slotNum}`,
        isEmpty: true,
      }
    );
  });

  const handleStartRename = (slot: number, currentName: string) => {
    setEditingSlot(slot);
    setEditingName(currentName);
  };

  const handleConfirmRename = (slot: number) => {
    if (editingName.trim()) {
      onRenamePreset?.(slot, editingName.trim());
    }
    setEditingSlot(null);
  };

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-xl ${className}`}
      role="region"
      aria-label="3D Wardrobe Presets Manager"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              Bộ Trang Phục Yêu Thích
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                5 Presets
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Lưu và đổi set đồ 1-click trước khi vào đấu trường 1v1
            </p>
          </div>
        </div>
      </div>

      {/* 5 Preset Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {fullPresets.map((preset) => {
          const isActive = preset.presetSlot === activeSlot && !preset.isEmpty;
          const isSlotEditing = editingSlot === preset.presetSlot;

          return (
            <div
              key={preset.presetSlot}
              className={`relative flex flex-col justify-between p-3 rounded-xl border-2 transition-all select-none ${
                isActive
                  ? 'bg-blue-950/40 border-blue-400 shadow-glow-cyan/40 ring-1 ring-blue-400/50 scale-[1.02]'
                  : preset.isEmpty
                  ? 'bg-slate-950/40 border-dashed border-slate-700/80 hover:border-slate-500'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:shadow-lg'
              }`}
            >
              {/* Top Row: Slot Number & Active / Empty Tag */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="w-5 h-5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-black flex items-center justify-center">
                  #{preset.presetSlot}
                </span>

                {isActive ? (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-500 text-slate-950 text-[9px] font-black uppercase">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    Đang dùng
                  </span>
                ) : preset.isEmpty ? (
                  <span className="text-[10px] text-slate-500 font-medium italic">Trống</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartRename(preset.presetSlot, preset.presetName)}
                      className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                      title="Đổi tên"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {onDeletePreset && (
                      <button
                        type="button"
                        onClick={() => onDeletePreset(preset.presetSlot)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Xóa preset này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Preset Thumbnail / Preview Area */}
              <div className="w-full aspect-[4/3] rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center p-2 mb-2 relative overflow-hidden">
                {preset.isEmpty ? (
                  /* Empty state */
                  <button
                    type="button"
                    onClick={() => onSaveCurrentToPreset?.(preset.presetSlot, `Preset ${preset.presetSlot}`)}
                    className="w-full h-full flex flex-col items-center justify-center text-slate-500 hover:text-cyan-300 transition-colors group"
                  >
                    <Plus className="w-5 h-5 mb-1 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-bold text-center leading-tight">Lưu trang phục hiện tại</span>
                  </button>
                ) : (
                  /* Filled Preset Showcase */
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    {preset.thumbnailUrl ? (
                      <img
                        src={preset.thumbnailUrl}
                        alt={preset.presetName}
                        className="w-full h-full object-contain drop-shadow"
                      />
                    ) : (
                      /* Slot icon pills summary */
                      <div className="grid grid-cols-3 gap-1">
                        <span className="p-1 rounded bg-rose-900/50 text-rose-300 text-[10px] flex items-center justify-center" title="Body">
                          <Eye className="w-3 h-3" />
                        </span>
                        <span className="p-1 rounded bg-amber-900/50 text-amber-300 text-[10px] flex items-center justify-center" title="Hair">
                          <Scissors className="w-3 h-3" />
                        </span>
                        <span className="p-1 rounded bg-blue-900/50 text-blue-300 text-[10px] flex items-center justify-center" title="Top">
                          <Shirt className="w-3 h-3" />
                        </span>
                        <span className="p-1 rounded bg-emerald-900/50 text-emerald-300 text-[10px] flex items-center justify-center" title="Bottom">
                          <Layers className="w-3 h-3" />
                        </span>
                        <span className="p-1 rounded bg-purple-900/50 text-purple-300 text-[10px] flex items-center justify-center" title="Shoes">
                          <Layers className="w-3 h-3" />
                        </span>
                        <span className="p-1 rounded bg-pink-900/50 text-pink-300 text-[10px] flex items-center justify-center" title="Accessory">
                          <Crown className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Preset Name & Renaming Input */}
              {isSlotEditing ? (
                <div className="flex items-center gap-1 mb-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmRename(preset.presetSlot);
                      if (e.key === 'Escape') setEditingSlot(null);
                    }}
                    autoFocus
                    className="w-full text-xs font-bold bg-slate-950 border border-blue-500 rounded px-1.5 py-0.5 text-white outline-none"
                    maxLength={24}
                  />
                  <button
                    type="button"
                    onClick={() => handleConfirmRename(preset.presetSlot)}
                    className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="mb-2">
                  <span
                    className="text-xs font-bold text-white line-clamp-1 cursor-pointer hover:text-blue-300"
                    title={preset.presetName}
                    onClick={() => !preset.isEmpty && handleStartRename(preset.presetSlot, preset.presetName)}
                  >
                    {preset.presetName}
                  </span>
                </div>
              )}

              {/* Slot Actions */}
              {!preset.isEmpty ? (
                <div className="flex items-center gap-1.5 mt-auto">
                  {isActive ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-1 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold flex items-center justify-center gap-1 cursor-default"
                    >
                      <Check className="w-3 h-3" />
                      Đang mặc
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApplyPreset?.(preset)}
                      className="w-full py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-3d-blue active:translate-y-[1px] transition-all flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Mặc set này
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSaveCurrentToPreset?.(preset.presetSlot, `Preset ${preset.presetSlot}`)}
                  className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 flex items-center justify-center gap-1 transition-all active:translate-y-[1px]"
                >
                  <Save className="w-3 h-3 text-cyan-400" />
                  Lưu slot #{preset.presetSlot}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
