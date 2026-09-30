import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  X,
  Volume2,
  Bookmark,
  Coins,
  ShieldAlert,
} from 'lucide-react';
import { useAvatar3DStore } from '../../services/useAvatar3DStore';
import { Avatar3DCanvas } from './Avatar3DCanvas';
import { Slot3D, Rarity3D } from '../../types/avatar3d';

interface FittingRoom3DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: Slot3D | 'ALL'; icon: string }[] = [
  { label: 'Tất cả', value: 'ALL', icon: '✨' },
  { label: 'Thân', value: 'BASE_BODY', icon: '👤' },
  { label: 'Tóc', value: 'HAIR', icon: '💇' },
  { label: 'Áo', value: 'TOP', icon: '👕' },
  { label: 'Quần/Váy', value: 'BOTTOM', icon: '👖' },
  { label: 'Giày', value: 'SHOES', icon: '👟' },
  { label: 'Phụ kiện', value: 'ACCESSORY', icon: '🎒' },
];

const RARITIES: { label: string; value: string; color: string }[] = [
  { label: 'Tất cả độ hiếm', value: 'ALL', color: 'text-slate-300' },
  { label: 'Phổ biến (Common)', value: 'COMMON', color: 'text-slate-400' },
  { label: 'Hiếm (Rare)', value: 'RARE', color: 'text-cyan-400' },
  { label: 'Sử thi (Epic)', value: 'EPIC', color: 'text-pink-400' },
  { label: 'Huyền thoại (Legendary)', value: 'LEGENDARY', color: 'text-amber-400' },
];

export const FittingRoom3DModal: React.FC<FittingRoom3DModalProps> = ({ isOpen, onClose }) => {
  const {
    equipped,
    previewEquipped,
    previewingItem,
    catalog,
    presets,
    userTokenBalance,
    isLoading,
    selectedCategory,
    selectedRarity,
    fetchEquipped,
    fetchCatalog,
    fetchPresets,
    tryOnItem,
    revertTryOn,
    equipItem,
    purchaseItem,
    savePreset,
    applyPreset,
    setSelectedCategory,
    setSelectedRarity,
    triggerGamificationFeedback,
  } = useAvatar3DStore();

  const [savingPresetSlot, setSavingPresetSlot] = useState<number | null>(null);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchEquipped();
      fetchCatalog();
      fetchPresets();
    }
  }, [isOpen, fetchEquipped, fetchCatalog, fetchPresets]);

  // Text-to-speech voice greeting
  const speakVoiceGreeting = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredItems = catalog.filter((item) => {
    if (selectedCategory !== 'ALL' && item.slot !== selectedCategory) return false;
    if (selectedRarity !== 'ALL' && item.rarity !== selectedRarity) return false;
    return true;
  });

  const getRarityBadgeStyle = (rarity: Rarity3D) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/20';
      case 'EPIC':
        return 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-400/40 shadow-sm shadow-pink-500/20';
      case 'RARE':
        return 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleItemClick = (item: typeof catalog[0]) => {
    tryOnItem(item);
    speakVoiceGreeting(item.name);
  };

  const handlePurchaseOrEquip = async (item: typeof catalog[0]) => {
    if (item.isOwned) {
      await equipItem(item.slot, item.id);
      triggerGamificationFeedback('correct');
      setFeedbackMessage(`Đã trang bị '${item.name}'!`);
    } else {
      if (userTokenBalance < item.priceTokens) {
        setFeedbackMessage('Không đủ Token để mua vật phẩm này!');
        return;
      }
      const ok = await purchaseItem(item.id);
      if (ok) {
        setFeedbackMessage(`Mua và trang bị thành công '${item.name}'!`);
        speakVoiceGreeting('Awesome! You look fabulous!');
      }
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleSavePresetClick = async (slot: number) => {
    const name = presetNameInput || `Preset Thời Trang ${slot}`;
    await savePreset(slot, name);
    setSavingPresetSlot(null);
    setPresetNameInput('');
    setFeedbackMessage(`Đã lưu trang phục vào Preset ${slot}!`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  Phòng Thử Đồ 3D ZingSpeed Chibi
                </h3>
                <p className="text-xs text-slate-400">
                  Thời trang đường phố tốc độ • Three.js WebGL Realtime Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Token balance pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-inner">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{userTokenBalance.toLocaleString()} Token</span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Split-View */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column: 3D Viewport (45%) */}
            <div className="lg:col-span-5 h-[340px] lg:h-full relative flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="flex-1 w-full h-full relative">
                <Avatar3DCanvas showControlsOverlay={true} />

                {/* Instant Try-On Badge */}
                {previewingItem && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/30 backdrop-blur-md"
                  >
                    <span className="animate-spin text-sm">✨</span>
                    <span>Đang thử: {previewingItem.name}</span>
                  </motion.div>
                )}

                {/* Voice button */}
                <button
                  onClick={() => speakVoiceGreeting("Ready for the race track! Let's go!")}
                  className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-white/10 shadow-lg backdrop-blur-md transition-all"
                  title="Nghe giọng chào Chibi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Dock Action Bar */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2 z-20">
                {previewingItem ? (
                  <>
                    <button
                      onClick={revertTryOn}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Hủy thử đồ
                    </button>

                    <button
                      onClick={() => handlePurchaseOrEquip(previewingItem)}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                        previewingItem.isOwned
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25'
                          : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-orange-500/25'
                      }`}
                    >
                      {previewingItem.isOwned ? (
                        <>
                          <Check className="w-4 h-4" />
                          Trang bị ngay
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4" />
                          Mua ngay ({previewingItem.priceTokens} Token)
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Chọn món đồ bất kỳ để ướm thử lên nhân vật 3D
                    </span>
                    <button
                      onClick={() => triggerGamificationFeedback('streak')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-300 text-[11px] font-bold border border-indigo-500/30 transition-all"
                    >
                      🔥 Nhảy Streak 360°
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Wardrobe & Shop Catalog (55%) */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-slate-900/60">
              {/* Category tabs */}
              <div className="flex items-center gap-1.5 p-3 overflow-x-auto border-b border-slate-800/80 scrollbar-none bg-slate-900/40">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.value
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Rarity & Presets Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/60 bg-slate-900/20 text-xs">
                {/* Rarity select */}
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-cyan-500"
                >
                  {RARITIES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>

                {/* Presets Quick Slots (1 to 5) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" /> Presets:
                  </span>
                  {[1, 2, 3, 4, 5].map((slot) => {
                    const preset = presets.find((p) => p.presetSlot === slot);
                    return (
                      <div key={slot} className="relative group">
                        <button
                          onClick={() => {
                            if (preset) applyPreset(preset.id);
                            else setSavingPresetSlot(slot);
                          }}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                            preset
                              ? 'bg-indigo-600/30 border-indigo-400/40 text-indigo-200 hover:bg-indigo-600 hover:text-white'
                              : 'bg-slate-800/40 border-dashed border-slate-700 text-slate-500 hover:text-white'
                          }`}
                          title={preset ? preset.presetName : `Lưu vào ô Preset ${slot}`}
                        >
                          {slot}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Alert toast */}
              {feedbackMessage && (
                <div className="mx-4 mt-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-medium flex items-center justify-between">
                  <span>{feedbackMessage}</span>
                  <button onClick={() => setFeedbackMessage(null)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Save Preset Dialog */}
              {savingPresetSlot !== null && (
                <div className="mx-4 mt-2 p-3 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Tên cho Preset ${savingPresetSlot}...`}
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-400"
                  />
                  <button
                    onClick={() => handleSavePresetClick(savingPresetSlot)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setSavingPresetSlot(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Catalog Items Grid */}
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {filteredItems.map((item) => {
                  const isCurrentEquipped =
                    previewEquipped.baseBodyId === item.id ||
                    previewEquipped.hairId === item.id ||
                    previewEquipped.topId === item.id ||
                    previewEquipped.bottomId === item.id ||
                    previewEquipped.shoesId === item.id ||
                    previewEquipped.accessoryId === item.id;

                  const isSavedEquipped =
                    equipped.baseBodyId === item.id ||
                    equipped.hairId === item.id ||
                    equipped.topId === item.id ||
                    equipped.bottomId === item.id ||
                    equipped.shoesId === item.id ||
                    equipped.accessoryId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleItemClick(item)}
                      className={`relative flex flex-col p-3 rounded-2xl border transition-all cursor-pointer select-none bg-slate-800/70 hover:bg-slate-800 ${
                        isCurrentEquipped
                          ? 'border-cyan-400/80 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRarityBadgeStyle(
                            item.rarity
                          )}`}
                        >
                          {item.rarity}
                        </span>

                        {isSavedEquipped && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            <Check className="w-3 h-3" /> Đang mặc
                          </span>
                        )}
                      </div>

                      {/* Item Visual Thumbnail Placeholder */}
                      <div className="h-24 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden mb-2">
                        <span className="text-3xl filter drop-shadow">
                          {item.slot === 'BASE_BODY' && '👤'}
                          {item.slot === 'HAIR' && '💇'}
                          {item.slot === 'TOP' && '🧥'}
                          {item.slot === 'BOTTOM' && '👖'}
                          {item.slot === 'SHOES' && '👟'}
                          {item.slot === 'ACCESSORY' && (item.id.includes('wings') ? '🪽' : '🎒')}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-mono">
                          {item.polyCount} tris
                        </span>
                      </div>

                      {/* Name & details */}
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mb-3">
                        {item.description}
                      </p>

                      {/* Price / Owned bottom action */}
                      <div className="mt-auto pt-2 border-t border-slate-700/40 flex items-center justify-between">
                        {item.isOwned ? (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Đã sở hữu
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-400" /> {item.priceTokens} 🪙
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchaseOrEquip(item);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            item.isOwned
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20'
                          }`}
                        >
                          {item.isOwned ? 'Mặc' : 'Mua'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
