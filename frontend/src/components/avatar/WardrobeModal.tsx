import React, { useEffect, useState } from 'react';
import { ModularAvatar } from './ModularAvatar';
import { useAvatarStore } from '../../services/useAvatarStore';
import { useProfileAndInventoryStore } from '../../services/useProfileAndInventoryStore';
import { AvatarConfigDto, InventoryItemDto } from '../../types/avatarAndShop';

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShop?: () => void;
}

const SKIN_TONES = [
  { hex: '#FDDFDF', name: 'Porcelain' },
  { hex: '#F8D5C2', name: 'Fair' },
  { hex: '#E8B898', name: 'Warm Ivory' },
  { hex: '#D09B74', name: 'Tan' },
  { hex: '#BA7B54', name: 'Olive' },
  { hex: '#9B5B32', name: 'Honey Bronze' },
  { hex: '#6C3E1F', name: 'Deep Chestnut' },
  { hex: '#3D2314', name: 'Dark Espresso' }
];

const HAIR_COLORS = [
  { hex: '#1C1917', name: 'Jet Black' },
  { hex: '#3B2219', name: 'Dark Espresso' },
  { hex: '#5C3317', name: 'Chestnut Brown' },
  { hex: '#854D0E', name: 'Caramel Honey' },
  { hex: '#CA8A04', name: 'Golden Blonde' },
  { hex: '#78350F', name: 'Auburn Copper' },
  { hex: '#DC2626', name: 'Crimson Flame' },
  { hex: '#64748B', name: 'Platinum Silver' }
];

const HAIR_STYLES = [
  { id: 'short_crop', name: 'Tóc ngắn gọn (Short Crop)' },
  { id: 'side_part', name: 'Tóc rẽ ngôi (Side Part)' },
  { id: 'messy_fringe', name: 'Mái bồng bềnh (Messy Fringe)' },
  { id: 'bob_cut', name: 'Tóc Bob cá tính (Bob Cut)' },
  { id: 'long_waves', name: 'Tóc dài uốn lượn (Long Waves)' }
];

const EYE_EXPRESSIONS = [
  { id: 'friendly_smile', label: 'Thân thiện 😊' },
  { id: 'intellectual_focus', label: 'Tập trung 🧐' },
  { id: 'playful_wink', label: 'Nháy mắt tinh nghịch 😉' }
];

const MOUTH_EXPRESSIONS = [
  { id: 'smile_open', label: 'Cười tươi 😄' },
  { id: 'confident_grin', label: 'Mỉm cười tự tin 😏' },
  { id: 'smile_calm', label: 'Điềm tĩnh 🙂' }
];

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  onOpenShop
}) => {
  const { config, fetchConfig, updatePreview, saveConfig, presets, fetchPresets, savePreset, applyPreset } = useAvatarStore();
  const { inventory, fetchInventory, equipItem, unequipItem, profile, fetchProfile } = useProfileAndInventoryStore();

  const [activeTab, setActiveTab] = useState<'wardrobe' | 'presets' | 'appearance'>('wardrobe');
  const [invCategory, setInvCategory] = useState<string>('all');
  const [editingPresetSlot, setEditingPresetSlot] = useState<number | null>(null);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
      fetchInventory();
      fetchPresets();
      fetchProfile();
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEquip = async (item: InventoryItemDto) => {
    const success = await equipItem(item.itemId);
    if (success) {
      showToast(`Đã mặc ${item.nameVi}`);
    }
  };

  const handleUnequip = async (item: InventoryItemDto) => {
    const success = await unequipItem(item.itemId);
    if (success) {
      showToast(`Đã tháo bỏ ${item.nameVi}`);
    }
  };

  const handleSavePreset = async (slot: number) => {
    if (!presetNameInput.trim()) return;
    const ok = await savePreset(slot, presetNameInput.trim());
    if (ok) {
      showToast(`Đã lưu trang phục vào Slot ${slot}!`);
      setEditingPresetSlot(null);
      setPresetNameInput('');
    }
  };

  const handleApplyPreset = async (slot: number) => {
    const ok = await applyPreset(slot);
    if (ok) {
      showToast(`Đã kích hoạt Preset ${slot}!`);
      fetchInventory();
    }
  };

  const handleSaveAppearance = async () => {
    const ok = await saveConfig(config);
    if (ok) {
      showToast('Đã lưu diện mạo mới thành công!');
    }
  };

  const filteredInventory = inventory.filter(i => {
    if (invCategory === 'all') return true;
    return i.category.toLowerCase() === invCategory.toLowerCase();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] max-h-[820px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-xl text-indigo-600 shadow-sm border border-indigo-200/60">
              👔
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Tủ Đồ & Bộ Phối Trang Phục
              </h2>
              <p className="text-xs text-slate-500">
                Quản lý các vật phẩm đã sở hữu, lưu tối đa 3 bộ trang phục yêu thích và tùy biến diện mạo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenShop && (
              <button
                onClick={onOpenShop}
                className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <span>🛍️</span> Đến Cửa Hàng
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="mx-6 mt-3 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium flex items-center justify-between shadow-sm animate-bounce">
            <span>✨ {toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-indigo-600 hover:text-indigo-900">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'wardrobe'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>🧥</span> Tủ Đồ Của Tôi ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>⭐</span> Bộ Phối Yêu Thích (Presets 1..3)
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>🎨</span> Tóc, Da & Biểu Cảm
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Avatar Preview Left column */}
          <div className="md:col-span-4 bg-gradient-to-b from-slate-50 via-white to-indigo-50/20 p-5 flex flex-col items-center justify-center border-r border-slate-200">
            <div className="w-full max-w-[280px] drop-shadow-xl">
              <ModularAvatar config={config} size="100%" animateBreath={true} mode="full" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs font-bold text-slate-800">
                {profile?.displayName ?? 'Người học'}
              </p>
              <p className="text-[11px] text-indigo-600 font-medium">
                {profile?.currentTitle ?? 'Người Học Mới'}
              </p>
            </div>
          </div>

          {/* Tab Content Right column */}
          <div className="md:col-span-8 p-5 overflow-y-auto bg-white">
            
            {/* TAB 1: WARDROBE */}
            {activeTab === 'wardrobe' && (
              <div className="space-y-4">
                {/* Category filters */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['all', 'tops', 'bottoms', 'footwear', 'headwear', 'eyewear', 'handheld', 'wings', 'aura_background'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setInvCategory(cat)}
                      className={`px-3 py-1 rounded-xl font-medium transition-all ${
                        invCategory === cat
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' && 'Tất cả'}
                      {cat === 'tops' && 'Áo'}
                      {cat === 'bottoms' && 'Quần'}
                      {cat === 'footwear' && 'Giày'}
                      {cat === 'headwear' && 'Nón'}
                      {cat === 'eyewear' && 'Kính'}
                      {cat === 'handheld' && 'Cầm tay'}
                      {cat === 'wings' && 'Cánh'}
                      {cat === 'aura_background' && 'Hào quang'}
                    </button>
                  ))}
                </div>

                {filteredInventory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <span className="text-4xl mb-2">🧺</span>
                    <p className="text-sm font-semibold">Chưa có trang phục nào trong mục này</p>
                    <p className="text-xs">Ghé thăm Cửa hàng để sở hữu thêm vật phẩm đẹp mắt</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredInventory.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                          item.isEquipped
                            ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-400/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-500 uppercase">{item.rarityTier}</span>
                          {item.isEquipped && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold">
                              ✓ Đang mặc
                            </span>
                          )}
                        </div>

                        <div className="py-2 text-center">
                          <span className="text-2xl block mb-1">
                            {item.category === 'tops' && '👔'}
                            {item.category === 'bottoms' && '👖'}
                            {item.category === 'footwear' && '👟'}
                            {item.category === 'headwear' && '🎩'}
                            {item.category === 'eyewear' && '👓'}
                            {item.category === 'handheld' && '📖'}
                            {item.category === 'aura_background' && '🔥'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.nameVi}</h4>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          {item.isEquipped ? (
                            <button
                              onClick={() => handleUnequip(item)}
                              className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                            >
                              Tháo ra
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEquip(item)}
                              className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                              Mặc vào
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Lưu diện mạo hoàn chỉnh vào 1 trong 3 slot để thay đổi tức thời trước khi đấu ván 1v1 hoặc lên Bảng xếp hạng.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map(slot => {
                    const preset = presets.find(p => p.presetIndex === slot);
                    const isUnlocked = slot <= (profile?.unlockedPresetSlots ?? 1);
                    const isEditing = editingPresetSlot === slot;

                    return (
                      <div
                        key={slot}
                        className={`p-4 rounded-2xl border flex flex-col justify-between ${
                          !isUnlocked
                            ? 'border-slate-200 bg-slate-50 opacity-60'
                            : preset
                            ? 'border-indigo-300 bg-indigo-50/20 shadow-sm'
                            : 'border-dashed border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-700">Slot {slot}</span>
                            {!isUnlocked ? (
                              <span className="text-[10px] font-bold text-slate-400">🔒 Chưa mở</span>
                            ) : preset ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                                Đã lưu
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Trống</span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 mb-2">
                            {preset ? preset.presetName : `Bộ Phối ${slot}`}
                          </h4>

                          {preset && (
                            <p className="text-[10px] text-slate-500 mb-3">
                              Cập nhật: {new Date(preset.updatedAt).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          {isUnlocked ? (
                            isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder="Nhập tên bộ phối..."
                                  value={presetNameInput}
                                  onChange={e => setPresetNameInput(e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                                />
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleSavePreset(slot)}
                                    className="flex-1 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={() => setEditingPresetSlot(null)}
                                    className="px-2 py-1 rounded-lg text-xs text-slate-500 bg-slate-100"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {preset && (
                                  <button
                                    onClick={() => handleApplyPreset(slot)}
                                    className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                                  >
                                    ⚡ Áp Dụng Ngay
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingPresetSlot(slot);
                                    setPresetNameInput(preset?.presetName ?? `Bộ Trang Phục ${slot}`);
                                  }}
                                  className="w-full py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                  {preset ? 'Lưu đè diện mạo này' : 'Lưu diện mạo hiện tại'}
                                </button>
                              </>
                            )
                          ) : (
                            <button
                              disabled
                              className="w-full py-2 rounded-xl text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
                            >
                              Mở thêm slot trong Shop
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="space-y-5">
                {/* Skin tones */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">1. Màu da tự nhiên (Skin Tone)</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {SKIN_TONES.map(s => (
                      <button
                        key={s.hex}
                        onClick={() => updatePreview({ skinColor: s.hex })}
                        className={`w-9 h-9 rounded-full border-2 transition-transform ${
                          config.skinColor === s.hex
                            ? 'ring-2 ring-indigo-500 scale-110 shadow-md'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: s.hex }}
                        title={s.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair color */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">2. Màu tóc (Hair Color)</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {HAIR_COLORS.map(h => (
                      <button
                        key={h.hex}
                        onClick={() => updatePreview({ hairColor: h.hex })}
                        className={`w-9 h-9 rounded-full border-2 transition-transform ${
                          config.hairColor === h.hex
                            ? 'ring-2 ring-indigo-500 scale-110 shadow-md'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: h.hex }}
                        title={h.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair style */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">3. Kiểu tóc (Hair Style)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {HAIR_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => updatePreview({ hairStyleId: style.id })}
                        className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                          config.hairStyleId === style.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye and mouth expressions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2">Ánh mắt (Eyes)</h4>
                    <div className="space-y-1.5">
                      {EYE_EXPRESSIONS.map(e => (
                        <button
                          key={e.id}
                          onClick={() => updatePreview({ eyeExpression: e.id })}
                          className={`w-full p-2 rounded-xl border text-xs text-left font-medium ${
                            config.eyeExpression === e.id
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                              : 'border-slate-200 text-slate-700'
                          }`}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2">Nụ cười (Mouth)</h4>
                    <div className="space-y-1.5">
                      {MOUTH_EXPRESSIONS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => updatePreview({ mouthExpression: m.id })}
                          className={`w-full p-2 rounded-xl border text-xs text-left font-medium ${
                            config.mouthExpression === m.id
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                              : 'border-slate-200 text-slate-700'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveAppearance}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-colors"
                  >
                    💾 Lưu Diện Mạo Mới
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
