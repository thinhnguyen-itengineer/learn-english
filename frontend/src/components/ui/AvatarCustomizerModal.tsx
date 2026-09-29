import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Save,
  RotateCcw,
  Dices,
  ShoppingBag,
  Check,
  Lock,
} from 'lucide-react';
import { AvatarRenderer, AvatarPresetConfig } from './AvatarRenderer';
import { Button } from './Button';

export interface PresetSlotInfo {
  slot: number;
  name: string;
  isUnlocked: boolean;
  config: AvatarPresetConfig;
}

export interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreset?: AvatarPresetConfig;
  presets?: PresetSlotInfo[];
  activeSlot?: number;
  unlockedSlotsCount?: number;
  onSelectSlot?: (slot: number) => void;
  onSavePreset?: (config: AvatarPresetConfig, slot: number) => void;
  onOpenShop?: (category?: string) => void;
  className?: string;
}

// 8 Universal Skin Tones
const SKIN_TONES = [
  { hex: '#FDDFDF', name: 'Porcelain' },
  { hex: '#F8D5C2', name: 'Fair' },
  { hex: '#E8B898', name: 'Warm Ivory' },
  { hex: '#D09B74', name: 'Tan' },
  { hex: '#BA7B54', name: 'Olive' },
  { hex: '#9B5B32', name: 'Bronze' },
  { hex: '#6C3E1F', name: 'Chestnut' },
  { hex: '#3D2314', name: 'Espresso' },
];

// 10 Natural & Fantasy Hair Colors
const HAIR_COLORS = [
  { hex: '#1C1917', name: 'Jet Black' },
  { hex: '#3B2219', name: 'Espresso' },
  { hex: '#5C3317', name: 'Chestnut' },
  { hex: '#854D0E', name: 'Caramel' },
  { hex: '#CA8A04', name: 'Blonde' },
  { hex: '#78350F', name: 'Auburn' },
  { hex: '#DC2626', name: 'Crimson' },
  { hex: '#64748B', name: 'Platinum' },
  { hex: '#06b6d4', name: 'Cyber Neon' },
  { hex: '#9333ea', name: 'Cosmic Violet' },
];

type CustomizerTab =
  | 'body_skin'
  | 'hair'
  | 'face'
  | 'tops'
  | 'bottoms'
  | 'footwear'
  | 'headwear'
  | 'eyewear'
  | 'neckwear'
  | 'companion'
  | 'aura';

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  initialPreset = {},
  presets = [
    { slot: 1, name: 'Preset 1', isUnlocked: true, config: initialPreset },
    { slot: 2, name: 'Preset 2', isUnlocked: true, config: initialPreset },
    { slot: 3, name: 'Preset 3 (Khóa)', isUnlocked: false, config: initialPreset },
  ],
  activeSlot = 1,
  unlockedSlotsCount = 2,
  onSelectSlot,
  onSavePreset,
  onOpenShop,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('body_skin');
  const [currentSlot, setCurrentSlot] = useState<number>(activeSlot);
  const [editingPreset, setEditingPreset] = useState<AvatarPresetConfig>({
    bodyType: 'neutral',
    skinToneHex: '#F8D5C2',
    hairStyleId: 'hair_front_short_crop',
    hairColorHex: '#3B2219',
    faceExpressionId: 'friendly_smile',
    topsId: 'starter_tee_white',
    bottomsId: 'starter_jeans_blue',
    footwearId: 'starter_sneakers_white',
    headwearId: null,
    eyewearId: null,
    neckwearId: null,
    companionId: null,
    auraId: 'pedestal_wood_circle',
    ...initialPreset,
  });

  if (!isOpen) return null;

  // Tabs configuration
  const tabs: Array<{ id: CustomizerTab; label: string; icon: string }> = [
    { id: 'body_skin', label: 'Dáng & Da', icon: '👤' },
    { id: 'hair', label: 'Tóc & Màu', icon: '✂️' },
    { id: 'face', label: 'Biểu Cảm', icon: '😊' },
    { id: 'tops', label: 'Áo Trang Phục', icon: '👕' },
    { id: 'bottoms', label: 'Quần & Váy', icon: '👖' },
    { id: 'footwear', label: 'Giày Dép', icon: '👟' },
    { id: 'headwear', label: 'Mũ Nón', icon: '🧢' },
    { id: 'eyewear', label: 'Kính Mắt', icon: '👓' },
    { id: 'neckwear', label: 'Phụ Kiện Cổ', icon: '🧣' },
    { id: 'companion', label: 'Thú Cưng / Bạn', icon: '🦉' },
    { id: 'aura', label: 'Hào Quang & Bục', icon: '✨' },
  ];

  // Randomize helper
  const handleRandomize = () => {
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].hex;
    const randomHair = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].hex;
    const hairStyles = ['hair_front_short_crop', 'hair_front_side_part', 'hair_front_messy_fringe', 'hair_front_bob_cut', 'curly_afro'];
    const expressions = ['friendly_smile', 'intellectual_focus', 'playful_wink', 'confident_sparkle'];
    const tops = ['starter_tee_white', 'hoodie_cyber_neon', 'suit_oxford_scholar', 'jacket_detective_sherlock'];
    const bottoms = ['starter_jeans_blue', 'skirt_pleated_navy', 'bottoms_cyber_cargo'];
    const shoes = ['starter_sneakers_white', 'boots_leather_brown', 'footwear_cyber'];
    const hats = [null, 'head_cap_baseball', 'head_beanie_cozy', 'head_beret_artist', 'head_crown_champion'];
    const glasses = [null, 'eyes_glasses_round', 'eyes_shades_cool', 'eyes_cyber_visor'];
    const auras = ['pedestal_wood_circle', 'pedestal_gold_champion', 'aura_fire_legendary', 'aura_stars_cosmic', 'aura_cyber_neon'];

    setEditingPreset({
      ...editingPreset,
      skinToneHex: randomSkin,
      hairColorHex: randomHair,
      hairStyleId: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      faceExpressionId: expressions[Math.floor(Math.random() * expressions.length)],
      topsId: tops[Math.floor(Math.random() * tops.length)],
      bottomsId: bottoms[Math.floor(Math.random() * bottoms.length)],
      footwearId: shoes[Math.floor(Math.random() * shoes.length)],
      headwearId: hats[Math.floor(Math.random() * hats.length)],
      eyewearId: glasses[Math.floor(Math.random() * glasses.length)],
      auraId: auras[Math.floor(Math.random() * auras.length)],
    });
  };

  // Reset to initial
  const handleReset = () => {
    setEditingPreset({ ...initialPreset });
  };

  // Save preset
  const handleSave = () => {
    if (onSavePreset) {
      onSavePreset(editingPreset, currentSlot);
    }
    onClose();
  };

  // Switch preset slot
  const handleSwitchSlot = (slot: number, isUnlocked: boolean) => {
    if (!isUnlocked) {
      if (onOpenShop) onOpenShop('preset_slot');
      return;
    }
    setCurrentSlot(slot);
    if (onSelectSlot) onSelectSlot(slot);
    const targetPreset = presets.find((p) => p.slot === slot);
    if (targetPreset) {
      setEditingPreset(targetPreset.config);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none ${className}`}>
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Phòng Thay Đồ & Tùy Biến Avatar
              </h3>
              <p className="text-xs text-slate-400">
                Thử nghiệm phong cách học giả độc bản của bạn
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body (Split View: 40% Left Preview, 60% Right Controls) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT PANEL: Avatar Live Showcase & Preset Switcher (40%) */}
          <div className="w-full md:w-5/12 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-5 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
            {/* Preset Slots Switcher */}
            <div className="w-full flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3].map((slot) => {
                const isUnlocked = slot <= unlockedSlotsCount;
                const isActive = currentSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSwitchSlot(slot, isUnlocked)}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border-2
                      ${isActive
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_2px_0_#047857]'
                        : isUnlocked
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-amber-500/60'
                      }
                    `}
                  >
                    {!isUnlocked ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Slot {slot}</span>
                      </>
                    ) : (
                      <>
                        <span>Slot {slot}</span>
                        {isActive && <Check className="w-3 h-3" />}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Avatar Canvas */}
            <div className="relative w-full flex-1 flex items-center justify-center p-2 min-h-[260px] max-h-[380px]">
              <AvatarRenderer
                preset={editingPreset}
                mode="full"
                size={340}
                isAnimated={true}
                className="max-h-full"
              />
            </div>

            {/* Quick Action Buttons on Left */}
            <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRandomize}
                title="Tạo ngẫu nhiên diện mạo"
                className="text-xs"
              >
                <Dices className="w-4 h-4 mr-1 text-amber-400" /> Ngẫu Nhiên
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                title="Khôi phục trạng thái ban đầu"
                className="text-xs"
              >
                <RotateCcw className="w-4 h-4 mr-1 text-slate-400" /> Mặc Định
              </Button>

              {onOpenShop && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => onOpenShop()}
                  title="Mở cửa hàng vật phẩm"
                  className="text-xs"
                >
                  <ShoppingBag className="w-4 h-4 mr-1" /> Cửa Hàng
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Customizer Tabs & Items (60%) */}
          <div className="w-full md:w-7/12 flex flex-col bg-slate-900/80 overflow-hidden">
            {/* Scrollable Tab Bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0 bg-slate-900/60">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border
                      ${isActive
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_2px_0_#047857]'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Panel (Scrollable) */}
            <div className="flex-1 p-5 overflow-y-auto">
              {/* TAB 1: DÁNG CƠ THỂ & MÀU DA */}
              {activeTab === 'body_skin' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                      1. Kiểu Khung Thân (Framework)
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'neutral', label: 'Trung Tính', desc: 'Cân đối hiện đại' },
                        { id: 'male', label: 'Nam Tính', desc: 'Vai rộng cơ bắp' },
                        { id: 'female', label: 'Nữ Tính', desc: 'Vai thon duyên dáng' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEditingPreset({ ...editingPreset, bodyType: item.id as any })}
                          className={`
                            p-3 rounded-2xl border-2 text-left transition-all
                            ${editingPreset.bodyType === item.id
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                              : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                            }
                          `}
                        >
                          <div className="text-sm font-extrabold">{item.label}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                      2. Màu Da Chuẩn (8 Universal Skin Tones)
                    </h4>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.hex}
                          type="button"
                          onClick={() => setEditingPreset({ ...editingPreset, skinToneHex: tone.hex })}
                          title={tone.name}
                          className={`
                            aspect-square rounded-2xl border-2 flex items-center justify-center transition-all p-1
                            ${editingPreset.skinToneHex === tone.hex
                              ? 'border-emerald-400 scale-110 shadow-lg ring-2 ring-emerald-400/50'
                              : 'border-slate-700 hover:scale-105'
                            }
                          `}
                        >
                          <div
                            className="w-full h-full rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: tone.hex }}
                          >
                            {editingPreset.skinToneHex === tone.hex && (
                              <Check className="w-4 h-4 text-slate-900 drop-shadow-sm" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TÓC & MÀU TÓC */}
              {activeTab === 'hair' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                      1. Bảng Màu Tóc (10 Shades)
                    </h4>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {HAIR_COLORS.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => setEditingPreset({ ...editingPreset, hairColorHex: color.hex })}
                          title={color.name}
                          className={`
                            aspect-square rounded-2xl border-2 flex items-center justify-center transition-all p-1
                            ${editingPreset.hairColorHex === color.hex
                              ? 'border-emerald-400 scale-110 shadow-lg ring-2 ring-emerald-400/50'
                              : 'border-slate-700 hover:scale-105'
                            }
                          `}
                        >
                          <div
                            className="w-full h-full rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: color.hex }}
                          >
                            {editingPreset.hairColorHex === color.hex && (
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                      2. Kiểu Tóc Phổ Biến
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'hair_front_short_crop', name: 'Tóc Cắt Ngắn Gọn', style: 'short_crop' },
                        { id: 'hair_front_side_part', name: 'Tóc Rẽ Ngôi Lịch Lãm', style: 'side_part' },
                        { id: 'hair_front_messy_fringe', name: 'Tóc Mái Rối Hàn Quốc', style: 'messy_fringe' },
                        { id: 'hair_front_bob_cut', name: 'Tóc Bob Cá Tính', style: 'bob_cut' },
                        { id: 'curly_afro', name: 'Tóc Xoăn Tự Nhiên', style: 'curly_afro' },
                        { id: 'hair_back_long_waves', name: 'Tóc Dài Gợn Sóng', style: 'long_waves' },
                        { id: 'hair_back_ponytail', name: 'Tóc Đuôi Ngựa Năng Động', style: 'ponytail' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEditingPreset({ ...editingPreset, hairStyleId: item.id })}
                          className={`
                            p-3 rounded-2xl border-2 text-left transition-all
                            ${editingPreset.hairStyleId === item.id
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                              : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                            }
                          `}
                        >
                          <div className="text-sm font-bold">{item.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BIỂU CẢM KHUÔN MẶT */}
              {activeTab === 'face' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                    Biểu Cảm Khuôn Mặt & Ánh Mắt
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'friendly_smile', name: 'Nụ Cười Thân Thiện', icon: '😊' },
                      { id: 'intellectual_focus', name: 'Tập Trung Sâu Sắc', icon: '🧐' },
                      { id: 'playful_wink', name: 'Nháy Mắt Tinh Nghịch', icon: '😉' },
                      { id: 'confident_sparkle', name: 'Tỏa Sáng Tự Tin', icon: '🤩' },
                    ].map((expr) => (
                      <button
                        key={expr.id}
                        type="button"
                        onClick={() => setEditingPreset({ ...editingPreset, faceExpressionId: expr.id as any })}
                        className={`
                          p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2
                          ${editingPreset.faceExpressionId === expr.id
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                            : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                          }
                        `}
                      >
                        <span className="text-3xl">{expr.icon}</span>
                        <span className="text-xs font-extrabold">{expr.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ÁO TRANG PHỤC (TOPS) */}
              {activeTab === 'tops' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'starter_tee_white', name: 'Áo Thun Trắng Basic', rarity: 'common' },
                    { id: 'hoodie_cyber_neon', name: 'Áo Hoodie Cyber Neon', rarity: 'epic' },
                    { id: 'suit_oxford_scholar', name: 'Vest Học Giả Oxford', rarity: 'rare' },
                    { id: 'jacket_detective_sherlock', name: 'Măng Tô Thám Tử', rarity: 'legendary' },
                  ].map((top) => (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, topsId: top.id })}
                      className={`
                        p-3.5 rounded-2xl border-2 text-left transition-all
                        ${editingPreset.topsId === top.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                        }
                      `}
                    >
                      <div className="text-sm font-extrabold">{top.name}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {top.rarity}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 5: QUẦN & VÁY (BOTTOMS) */}
              {activeTab === 'bottoms' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'starter_jeans_blue', name: 'Quần Jeans Xanh Cổ Điển', rarity: 'common' },
                    { id: 'skirt_pleated_navy', name: 'Chân Váy Xếp Ly Navy', rarity: 'rare' },
                    { id: 'bottoms_cyber_cargo', name: 'Quần Túi Hộp Cyber', rarity: 'epic' },
                  ].map((bottom) => (
                    <button
                      key={bottom.id}
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, bottomsId: bottom.id })}
                      className={`
                        p-3.5 rounded-2xl border-2 text-left transition-all
                        ${editingPreset.bottomsId === bottom.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                        }
                      `}
                    >
                      <div className="text-sm font-extrabold">{bottom.name}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {bottom.rarity}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 6: GIÀY DÉP (FOOTWEAR) */}
              {activeTab === 'footwear' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'starter_sneakers_white', name: 'Sneaker Trắng Năng Động', rarity: 'common' },
                    { id: 'boots_leather_brown', name: 'Giày Boots Da Nâu', rarity: 'rare' },
                    { id: 'footwear_cyber', name: 'Giày Neon Cyberpunk', rarity: 'epic' },
                  ].map((shoes) => (
                    <button
                      key={shoes.id}
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, footwearId: shoes.id })}
                      className={`
                        p-3.5 rounded-2xl border-2 text-left transition-all
                        ${editingPreset.footwearId === shoes.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                        }
                      `}
                    >
                      <div className="text-sm font-extrabold">{shoes.name}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {shoes.rarity}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 7: MŨ NÓN (HEADWEAR) */}
              {activeTab === 'headwear' && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, headwearId: null })}
                      className="text-xs text-rose-400 hover:underline font-bold"
                    >
                      Bỏ mũ / Không đội
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'head_cap_baseball', name: 'Mũ Lưỡi Trai Đỏ', rarity: 'common' },
                      { id: 'head_beanie_cozy', name: 'Mũ Len Beanie Ấm Áp', rarity: 'rare' },
                      { id: 'head_beret_artist', name: 'Mũ Beret Họa Sĩ', rarity: 'rare' },
                      { id: 'head_crown_champion', name: 'Vương Miện Quán Quân', rarity: 'legendary' },
                    ].map((hat) => (
                      <button
                        key={hat.id}
                        type="button"
                        onClick={() => setEditingPreset({ ...editingPreset, headwearId: hat.id })}
                        className={`
                          p-3.5 rounded-2xl border-2 text-left transition-all
                          ${editingPreset.headwearId === hat.id
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                            : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                          }
                        `}
                      >
                        <div className="text-sm font-extrabold">{hat.name}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {hat.rarity}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: KÍNH MẮT (EYEWEAR) */}
              {activeTab === 'eyewear' && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, eyewearId: null })}
                      className="text-xs text-rose-400 hover:underline font-bold"
                    >
                      Bỏ kính / Không đeo
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'eyes_glasses_round', name: 'Kính Cận Tròn Trí Thức', rarity: 'rare' },
                      { id: 'eyes_shades_cool', name: 'Kính Râm Ngầu Cool', rarity: 'epic' },
                      { id: 'eyes_cyber_visor', name: 'Kính Cyber Visor Phát Sáng', rarity: 'legendary' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEditingPreset({ ...editingPreset, eyewearId: item.id })}
                        className={`
                          p-3.5 rounded-2xl border-2 text-left transition-all
                          ${editingPreset.eyewearId === item.id
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                            : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                          }
                        `}
                      >
                        <div className="text-sm font-extrabold">{item.name}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {item.rarity}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: PHỤ KIỆN CỔ (NECKWEAR) */}
              {activeTab === 'neckwear' && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, neckwearId: null })}
                      className="text-xs text-rose-400 hover:underline font-bold"
                    >
                      Bỏ phụ kiện cổ
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'scarf_gryffindor_red', name: 'Khăn Choàng Đỏ Vàng', rarity: 'rare' },
                      { id: 'neckwear_headphone', name: 'Tai Nghe Gaming Cyber', rarity: 'epic' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEditingPreset({ ...editingPreset, neckwearId: item.id })}
                        className={`
                          p-3.5 rounded-2xl border-2 text-left transition-all
                          ${editingPreset.neckwearId === item.id
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                            : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                          }
                        `}
                      >
                        <div className="text-sm font-extrabold">{item.name}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {item.rarity}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: THÚ CƯNG / BẠN ĐỒNG HÀNH (COMPANION) */}
              {activeTab === 'companion' && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, companionId: null })}
                      className="text-xs text-rose-400 hover:underline font-bold"
                    >
                      Bỏ thú cưng / cầm tay
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'pet_owl_scholar', name: 'Cú Mèo Tri Thức Hedwig', rarity: 'legendary' },
                      { id: 'pet_cat_lucky', name: 'Mèo Cam May Mắn', rarity: 'epic' },
                      { id: 'handheld_english_dictionary', name: 'Từ Điển Oxford Bỏ Túi', rarity: 'rare' },
                      { id: 'handheld_magic_wand', name: 'Đũa Phép Ngữ Pháp', rarity: 'legendary' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEditingPreset({ ...editingPreset, companionId: item.id })}
                        className={`
                          p-3.5 rounded-2xl border-2 text-left transition-all
                          ${editingPreset.companionId === item.id
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                            : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                          }
                        `}
                      >
                        <div className="text-sm font-extrabold">{item.name}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {item.rarity}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 11: HÀO QUANG & BỤC (AURA) */}
              {activeTab === 'aura' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'pedestal_wood_circle', name: 'Bục Gỗ Sồi Tối Giản', rarity: 'common' },
                    { id: 'pedestal_gold_champion', name: 'Bục Vinh Quang Hoàng Kim', rarity: 'epic' },
                    { id: 'aura_fire_legendary', name: 'Hào Quang Rực Lửa Chiến Binh', rarity: 'legendary' },
                    { id: 'aura_stars_cosmic', name: 'Vũ Trụ Ngàn Sao Cosmic', rarity: 'epic' },
                    { id: 'aura_cyber_neon', name: 'Vòng Tròn Ma Trận Cyber', rarity: 'rare' },
                  ].map((aura) => (
                    <button
                      key={aura.id}
                      type="button"
                      onClick={() => setEditingPreset({ ...editingPreset, auraId: aura.id })}
                      className={`
                        p-3.5 rounded-2xl border-2 text-left transition-all
                        ${editingPreset.auraId === aura.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'
                        }
                      `}
                    >
                      <div className="text-sm font-extrabold">{aura.name}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tier: {aura.rarity}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Modal Actions Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/90 shrink-0">
              <Button variant="secondary" size="md" onClick={onClose}>
                Hủy Bỏ
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                leftIcon={<Save className="w-4 h-4" />}
                className="font-black px-6"
              >
                Lưu Vào Slot {currentSlot}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
