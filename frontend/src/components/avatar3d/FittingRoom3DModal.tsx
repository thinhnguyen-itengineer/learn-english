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
  Users,
  Heart,
  Zap,
} from 'lucide-react';
import { useAvatar3DStore } from '../../services/useAvatar3DStore';
import { Avatar3DCanvas } from './Avatar3DCanvas';
import { DualAvatar3DCanvas } from './DualAvatar3DCanvas';
import { CharacterGenderSelector, CharacterSelectionMode } from '../ui/CharacterGenderSelector';
import { MATCHING_DUO_SETS } from '../ui/DualCharacterShowcase';
import { Slot3D, Rarity3D, MatchingOutfitSet } from '../../types/avatar3d';

interface FittingRoom3DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: Slot3D | 'ALL'; icon: string }[] = [
  { label: 'Tất cả', value: 'ALL', icon: '✨' },
  { label: 'Màu Da (Trắng & Đen)', value: 'BASE_BODY', icon: '👤' },
  { label: 'Khuôn Mặt Biểu Cảm', value: 'HAIR', icon: '😜' },
  { label: 'Đồ Cầm Tay (Mini Game)', value: 'TOP', icon: '✊' },
  { label: 'Đôi Cánh Thần Thoại', value: 'ACCESSORY', icon: '🪽' },
];

const ACCENT_COLORS = [
  { name: 'Cyan Neon', hex: '#00f2fe' },
  { name: 'Vàng Kim (Gold)', hex: '#ffd700' },
  { name: 'Đỏ Lửa (Crimson)', hex: '#ff4757' },
  { name: 'Xanh Ngọc (Emerald)', hex: '#2ed573' },
  { name: 'Tím Huyền Bí (Purple)', hex: '#a55eea' },
  { name: 'Hồng Đào (Sakura)', hex: '#ff6b81' },
  { name: 'Trắng Sáng (Diamond)', hex: '#ffffff' },
  { name: 'Cam Năng Lượng (Solar)', hex: '#ff7f50' },
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
    activeGender,
    activeCharacter,
    matchingSets,
    accentColor,
    viewMode3D,
    setAccentColor,
    setViewMode3D,
    fetchActiveCharacter,
    switchCharacter,
    fetchMatchingSets,
    previewMatchingSet,
    purchaseMatchingSet,
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

  const [shopTab, setShopTab] = useState<'ITEMS' | 'BUNDLES'>('ITEMS');
  const [savingPresetSlot, setSavingPresetSlot] = useState<number | null>(null);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedDuoSetId, setSelectedDuoSetId] = useState<string>('set_derp_troll_master');

  useEffect(() => {
    if (isOpen) {
      fetchActiveCharacter();
      fetchEquipped();
      fetchCatalog(undefined, undefined, activeGender === 'DUO' ? undefined : activeGender);
      fetchPresets();
      fetchMatchingSets();
    }
  }, [isOpen, fetchActiveCharacter, fetchEquipped, fetchCatalog, fetchPresets, fetchMatchingSets, activeGender]);

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

  const handleSwitchCharacter = async (gender: CharacterSelectionMode) => {
    await switchCharacter(gender);
    if (gender === 'DUO') {
      speakVoiceGreeting('Aoi and Ren, dynamic duo activated!');
    } else if (gender === 'MALE') {
      speakVoiceGreeting('Ren ready for the challenge!');
    } else {
      speakVoiceGreeting('Aoi here, let us shine!');
    }
  };

  const effectiveMatchingSets: MatchingOutfitSet[] =
    matchingSets && matchingSets.length > 0 ? matchingSets : MATCHING_DUO_SETS;

  const handlePurchaseDuoSet = async (set: MatchingOutfitSet) => {
    if (userTokenBalance < set.tokenPriceTotal) {
      setFeedbackMessage('Không đủ Token để mua bộ đôi này!');
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    const res = await purchaseMatchingSet(set.id);
    if (res) {
      setFeedbackMessage(`Mua thành công trọn bộ đôi '${set.name}'!`);
      triggerGamificationFeedback('victory');
      speakVoiceGreeting('Duo matching outfit unlocked!');
    } else {
      setFeedbackMessage('Đã mở khóa bộ đồ đôi này!');
    }
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const filteredItems = catalog.filter((item) => {
    if (activeGender !== 'DUO' && item.gender && item.gender !== 'UNISEX' && item.gender !== activeGender) {
      return false;
    }
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
          {/* Header Bar with Character Gender & Duo Switcher */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  Phòng Thử Đồ Người Que 3D (Stickman Studio)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tùy biến Màu Da • Kiểu Mắt & Kính • Đôi Cánh Thần Thoại
                </p>
              </div>
            </div>

            {/* Compact Character Gender Selector Pill */}
            <div className="flex items-center gap-2">
              <CharacterGenderSelector
                selectedCharacter={activeGender}
                onSelectCharacter={handleSwitchCharacter}
                variant="compact-tabs"
                allowDuoMode={true}
              />
            </div>

            <div className="flex items-center gap-3">
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
                {activeGender === 'DUO' ? (
                  <DualAvatar3DCanvas showControlsOverlay={true} />
                ) : (
                  <Avatar3DCanvas showControlsOverlay={true} />
                )}

                {/* 3D View Mode Switcher (Đứng Tĩnh / Chạy / Cầm Đồ) */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 shadow-lg text-[11px] font-semibold">
                  <button
                    onClick={() => setViewMode3D('IDLE')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      viewMode3D === 'IDLE'
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Dáng đứng chuẩn cân đối cố định"
                  >
                    <span>🧍</span>
                    <span>Đứng Tĩnh</span>
                  </button>

                  <button
                    onClick={() => setViewMode3D('RUN')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      viewMode3D === 'RUN'
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Xem sải chân chạy và đánh tay tốc độ"
                  >
                    <span>🏃</span>
                    <span>Xem Chạy</span>
                  </button>

                  <button
                    onClick={() => setViewMode3D('HOLD_ITEM')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      viewMode3D === 'HOLD_ITEM'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-md shadow-purple-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Xem tư thế nâng đồ vật cầm tay cho Mini Game"
                  >
                    <span>✊</span>
                    <span>Cầm Đồ</span>
                  </button>
                </div>

                {/* Instant Try-On Badge */}
                {previewingItem && activeGender !== 'DUO' && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-14 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/30 backdrop-blur-md"
                  >
                    <span className="animate-spin text-sm">✨</span>
                    <span>Đang thử: {previewingItem.name}</span>
                  </motion.div>
                )}

                {/* Voice button */}
                <button
                  onClick={() =>
                    speakVoiceGreeting(
                      activeGender === 'DUO'
                        ? 'Aoi and Ren, together on the racing stage!'
                        : activeGender === 'MALE'
                        ? 'Ren reporting for training!'
                        : 'Aoi ready to race!'
                    )
                  }
                  className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-white/10 shadow-lg backdrop-blur-md transition-all"
                  title="Nghe giọng chào Chibi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Accent Color Palette Bar (Màu Tỏa Sáng cho Vật Phẩm) */}
              <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-2 z-20">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5 whitespace-nowrap">
                  <span>🎨</span> Màu Tỏa Sáng:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                  {ACCENT_COLORS.map((c) => {
                    const isSelected = accentColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.hex}
                        onClick={() => setAccentColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-5 h-5 rounded-full transition-all shrink-0 relative flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-white scale-110 shadow-md shadow-white/30'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={`${c.name} (${c.hex})`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Dock Action Bar */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2 z-20">
                {activeGender !== 'DUO' && previewingItem ? (
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
                      {activeGender === 'DUO'
                        ? 'Chế độ Bộ Đôi 3D: Đồng bộ biểu cảm & trang phục đôi'
                        : 'Chọn món đồ bất kỳ để ướm thử lên nhân vật 3D'}
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

            {/* Right Column: Wardrobe Catalog OR Matching Sets (55%) */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-slate-900/60">
              {/* Top Mode Switcher Bar */}
              <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setShopTab('ITEMS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      shopTab === 'ITEMS' && activeGender !== 'DUO'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    👕 Từng Món Lẻ
                  </button>
                  <button
                    onClick={() => setShopTab('BUNDLES')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      shopTab === 'BUNDLES' || activeGender === 'DUO'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/25'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🎁</span> Bán Trọn Bộ 5 Phong Cách
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {shopTab === 'BUNDLES' || activeGender === 'DUO'
                    ? '1-Click Trọn Gói: Da + Mặt + Tướng Đứng + Cánh'
                    : 'Tự do mix & match từng món'}
                </span>
              </div>

              {shopTab === 'BUNDLES' || activeGender === 'DUO' ? (
                /* BUNDLES / MATCHING SETS SHOWCASE */
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                    {effectiveMatchingSets.map((set) => {
                      const isSelected = selectedDuoSetId === set.id;
                      return (
                        <motion.div
                          key={set.id}
                          whileHover={{ y: -2 }}
                          onClick={() => {
                            setSelectedDuoSetId(set.id);
                            previewMatchingSet(set);
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-slate-800/60 hover:bg-slate-800 ${
                            isSelected
                              ? 'border-indigo-400/80 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-400/40'
                              : 'border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                {set.badgeText || 'Trọn Bộ'}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">
                                {set.theme}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-400" />
                              {set.tokenPriceTotal.toLocaleString()} Token
                            </span>
                          </div>

                          <h5 className="text-sm font-bold text-slate-100 mb-1">
                            {set.name}
                          </h5>
                          <p className="text-xs text-slate-400 mb-3">
                            {set.description}
                          </p>

                          {/* 4 Items in Bundle Preview Pill */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">🎨</span>
                              <div>
                                <div className="text-[10px] text-slate-400 font-medium">Màu Da</div>
                                <div className="text-slate-200 font-bold text-[11px] truncate">
                                  {set.femaleItems?.[3] || 'Da Đặc Trưng'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">😜</span>
                              <div>
                                <div className="text-[10px] text-slate-400 font-medium">Biểu Cảm</div>
                                <div className="text-slate-200 font-bold text-[11px] truncate">
                                  {set.femaleItems?.[0] || 'Khuôn Mặt'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">🕺</span>
                              <div>
                                <div className="text-[10px] text-slate-400 font-medium">Tướng Đứng</div>
                                <div className="text-slate-200 font-bold text-[11px] truncate">
                                  {set.femaleItems?.[1] || 'Dáng Đứng'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">🪽</span>
                              <div>
                                <div className="text-[10px] text-slate-400 font-medium">Đôi Cánh</div>
                                <div className="text-slate-200 font-bold text-[11px] truncate">
                                  {set.femaleItems?.[2] || 'Cánh Thần Thoại'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                previewMatchingSet(set);
                                speakVoiceGreeting(set.name);
                              }}
                              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-700/80 hover:bg-slate-600 text-cyan-300 border border-cyan-400/30 transition-all flex items-center gap-1.5"
                            >
                              <span>👁️</span> Ướm Thử Cả Bộ
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePurchaseDuoSet(set);
                              }}
                              disabled={isLoading}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Mua Trọn Bộ 1-Click ({set.tokenPriceTotal.toLocaleString()} 🪙)
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* SINGLE MODE: Individual Wardrobe & Catalog */
                <>
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

                          {/* Item Visual Thumbnail Placeholder with Expressive Humor Icons */}
                          <div className="h-24 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden mb-2">
                            <span className="text-3xl filter drop-shadow">
                              {item.slot === 'BASE_BODY' && (
                                item.id.includes('black') || item.id.includes('obsidian') ? '🖤' :
                                item.id.includes('pearl') || item.id.includes('white') ? '🤍' : '👤'
                              )}
                              {item.slot === 'HAIR' && (
                                item.id.includes('chad') || item.id.includes('smirk') ? '🗿' :
                                item.id.includes('derp') || item.id.includes('troll') ? '🤪' :
                                item.id.includes('rage') || item.id.includes('flame') ? '💢' :
                                item.id.includes('crying') || item.id.includes('tear') ? '😭' :
                                item.id.includes('cyber') || item.id.includes('matrix') ? '🕶️' :
                                item.id.includes('waku') || item.id.includes('anime') ? '✨' : '😜'
                              )}
                              {item.slot === 'TOP' && (
                                item.id.includes('trophy') || item.id.includes('cup') ? '🏆' :
                                item.id.includes('sword') || item.id.includes('saber') ? '🗡️' :
                                item.id.includes('wand') || item.id.includes('magic') ? '🪄' :
                                item.id.includes('torch') || item.id.includes('flashlight') ? '🔦' :
                                item.id.includes('mic') ? '🎤' :
                                item.id.includes('blaster') || item.id.includes('gun') ? '🔫' : '✊'
                              )}
                              {item.slot === 'ACCESSORY' && (
                                item.id.includes('angel') ? '🪽' :
                                item.id.includes('demon') || item.id.includes('devil') ? '🦇' :
                                item.id.includes('fairy') || item.id.includes('neon') ? '🦋' :
                                item.id.includes('phoenix') || item.id.includes('fire') ? '🔥' :
                                item.id.includes('plasma') || item.id.includes('cyber') || item.id.includes('mecha') ? '⚡' : '🪽'
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 font-mono">
                              {item.slot === 'TOP' ? 'Đồ Cầm Tay' : item.slot === 'BASE_BODY' ? 'Màu Da' : `${item.polyCount} tris`}
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
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
