import React, { useEffect, useState, useMemo } from 'react';
import { Avatar3DCanvas } from '../avatar3d/Avatar3DCanvas';
import { useAvatarStore } from '../../services/useAvatarStore';
import { useShopStore } from '../../services/useShopStore';
import { useProfileAndInventoryStore } from '../../services/useProfileAndInventoryStore';
import { AvatarConfigDto, ItemCategory, RarityTier, ShopItemDto } from '../../types/avatarAndShop';

interface FittingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWardrobe?: () => void;
}

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: '✨' },
  { key: 'bundle', label: 'Nguyên Set', icon: '🎁' },
  { key: 'ticket', label: 'Vé IELTS / TOEIC', icon: '🎟️' },
  { key: 'wings', label: 'Cánh', icon: '🪽' },
  { key: 'tops', label: 'Áo ngoài', icon: '👕' },
  { key: 'bottoms', label: 'Quần / Váy', icon: '👖' },
  { key: 'footwear', label: 'Giày dép', icon: '👟' },
  { key: 'headwear', label: 'Mũ nón', icon: '🎩' },
  { key: 'eyewear', label: 'Kính mắt', icon: '👓' },
  { key: 'handheld', label: 'Cầm tay', icon: '📖' },
  { key: 'aura_background', label: 'Hào quang', icon: '🔥' },
  { key: 'consumable', label: 'Vật phẩm', icon: '🧪' }
];

const RARITIES: { key: string; label: string; badgeClass: string }[] = [
  { key: 'all', label: 'Tất cả độ hiếm', badgeClass: 'bg-slate-100 text-slate-700' },
  { key: 'common', label: 'Common', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' },
  { key: 'rare', label: 'Rare', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { key: 'epic', label: 'Epic', badgeClass: 'bg-purple-50 text-purple-700 border-purple-300' },
  { key: 'legendary', label: 'Legendary', badgeClass: 'bg-amber-50 text-amber-700 border-amber-300' }
];

export const FittingRoomModal: React.FC<FittingRoomModalProps> = ({
  isOpen,
  onClose,
  onOpenWardrobe
}) => {
  const { config: activeConfig, fetchConfig, saveConfig } = useAvatarStore();
  const {
    catalog,
    loading: shopLoading,
    category,
    rarity,
    search,
    tryingOnItems,
    lastReplacementNotice,
    clearReplacementNotice,
    fetchCatalog,
    setCategory,
    setRarity,
    setSearch,
    tryOnItem,
    removeTryOn,
    clearTryOn,
    purchaseItem,
    purchaseTryOnBundle
  } = useShopStore();
  const { profile, fetchProfile, refreshTokens } = useProfileAndInventoryStore();

  const [compareMode, setCompareMode] = useState<'preview' | 'original'>('preview');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // 3D Orbit & Inspection State
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isAutoTurntable, setIsAutoTurntable] = useState(false);
  const [characterModel, setCharacterModel] = useState<'auto' | 'boy' | 'girl' | 'duo'>('auto');

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
      fetchCatalog();
      fetchProfile();
    }
  }, [isOpen]);

  // Turntable smooth 360 rotation effect
  useEffect(() => {
    if (!isAutoTurntable) return;
    const interval = setInterval(() => {
      setRotationY(prev => {
        const next = prev + 1;
        return next > 180 ? next - 360 : next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoTurntable]);

  const handleResetView = () => {
    setRotationY(0);
    setRotationX(0);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setIsAutoTurntable(false);
  };

  // Construct preview config merging activeConfig with tryingOnItems
  const previewConfig: AvatarConfigDto = useMemo(() => {
    const next: AvatarConfigDto = { ...activeConfig };
    Object.values(tryingOnItems).forEach(item => {
      const slot = item.layerSlot.toLowerCase();
      const cat = item.category.toLowerCase();
      if (slot === 'tops' || cat === 'tops') next.topsId = item.itemCode;
      else if (slot === 'bottoms' || cat === 'bottoms') next.bottomsId = item.itemCode;
      else if (slot === 'footwear' || cat === 'footwear') next.footwearId = item.itemCode;
      else if (slot === 'headwear' || cat === 'headwear') next.headwearId = item.itemCode;
      else if (slot === 'eyewear' || cat === 'eyewear') next.eyewearId = item.itemCode;
      else if (slot === 'neckwear' || cat === 'neckwear') next.neckwearId = item.itemCode;
      else if (slot === 'handheld' || cat === 'handheld') next.handheldId = item.itemCode;
      else if (slot === 'wings' || cat === 'wings') next.wingsId = item.itemCode;
      else if (slot === 'pedestal_aura' || cat === 'aura_background') next.auraBackgroundId = item.itemCode;
      else if (cat === 'bundle') {
        const bundleMap: Record<string, Partial<AvatarConfigDto>> = {
          set_cyberpunk_master: { topsId: 'top_cyber_jacket', bottomsId: 'bot_cargo_joggers', eyewearId: 'eye_vr_visor', wingsId: 'wings_cyber_neon', auraBackgroundId: 'aura_floating_books' },
          set_royal_scholar: { topsId: 'top_oxford_blazer', bottomsId: 'bot_classic_chinos', headwearId: 'head_graduation_cap', handheldId: 'hand_quill_pen', wingsId: 'wings_angel_celestial' },
          set_phoenix_warlord: { topsId: 'top_wizard_robe', bottomsId: 'bot_wizard_skirt', headwearId: 'head_olympus_crown', wingsId: 'wings_phoenix_flame', auraBackgroundId: 'aura_golden_triumph' },
          set_detective_holmes: { topsId: 'top_detective_trench', bottomsId: 'bot_suit_pants', headwearId: 'head_detective_hat', eyewearId: 'eye_steampunk_goggles', handheldId: 'hand_quill_pen' },
          set_celestial_angel: { topsId: 'top_scholastic_hoodie', headwearId: 'head_olympus_crown', handheldId: 'hand_golden_mic', wingsId: 'wings_angel_celestial' },
          set_devil_night: { topsId: 'top_devil_hoodie', bottomsId: 'bot_devil_pants', headwearId: 'head_devil_horns', handheldId: 'hand_devil_pitchfork', wingsId: 'wings_devil_demonic' },
          set_angel_divine: { topsId: 'top_angel_tunic', bottomsId: 'bot_angel_skirt', headwearId: 'head_angel_halo', handheldId: 'hand_star_wand', wingsId: 'wings_angel_celestial' },
          set_princess_lolita: { topsId: 'top_princess_lolita', bottomsId: 'bot_lolita_skirt', headwearId: 'head_bunny_ears', handheldId: 'hand_giant_lollipop', wingsId: 'wings_fairy_butterfly' },
          set_zingspeed_boy_racer: { topsId: 'top_zingspeed_black_hoodie', bottomsId: 'bot_zingspeed_cargo_shorts', footwearId: 'foot_zingspeed_combat_boots', hairStyleId: 'hair_zingspeed_spiky_grey', bodyType: 'male' },
          set_zingspeed_girl_idol: { topsId: 'top_zingspeed_white_hoodie', bottomsId: 'bot_zingspeed_pleated_skirt', footwearId: 'foot_zingspeed_pastel_sneakers', hairStyleId: 'hair_zingspeed_pink_twintails', handheldId: 'hand_cat_paw_sling_bag', neckwearId: 'neck_star_choker', bodyType: 'female' }
        };
        const parts = bundleMap[item.itemCode];
        if (parts) Object.assign(next, parts);
      }
    });
    return next;
  }, [activeConfig, tryingOnItems]);

  const displayedConfig = compareMode === 'original' ? activeConfig : previewConfig;

  // Calculate cart summary
  const tryingOnList = Object.values(tryingOnItems);
  const totalCartCost = tryingOnList.reduce((acc, item) => acc + item.tokenPrice, 0);
  const currentTokens = profile?.tokenBalance ?? 350;
  const canAffordBundle = currentTokens >= totalCartCost;

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleBuySingle = async (item: ShopItemDto) => {
    setActionError(null);
    const res = await purchaseItem(item.itemCode, true);
    if (res) {
      showNotification(`🎉 Mua thành công ${item.nameVi}! Đã trừ ${res.tokenSpent} 🪙`);
      refreshTokens();
    } else {
      setActionError(`Không thể mua ${item.nameVi}. Vui lòng kiểm tra số dư Token.`);
    }
  };

  const handleCheckoutBundle = async () => {
    if (tryingOnList.length === 0) return;
    setActionError(null);
    const res = await purchaseTryOnBundle(true);
    if (res) {
      showNotification(`🎉 Mua trọn gói thành công ${res.itemsPurchased} món đồ! (-${res.totalSpent} 🪙)`);
      refreshTokens();
    } else {
      setActionError('Thanh toán giỏ đồ thử thất bại. Vui lòng thử lại.');
    }
  };

  const getRarityBadge = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'legendary':
        return 'border-amber-400 bg-amber-50 text-amber-800 shadow-amber-200';
      case 'epic':
        return 'border-purple-400 bg-purple-50 text-purple-800 shadow-purple-200';
      case 'rare':
        return 'border-emerald-400 bg-emerald-50 text-emerald-800 shadow-emerald-200';
      default:
        return 'border-slate-300 bg-slate-50 text-slate-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-6xl h-[92vh] max-h-[850px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-xl text-amber-600 shadow-sm border border-amber-200/60">
              🛍️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Phòng Thử Đồ & Cửa Hàng Thời Trang
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  Live Fitting Room
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Thử ngay trang phục độc nhất lên nhân vật 3D/2D trước khi quyết định chi tiêu Token
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Token Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-bold shadow-sm">
              <span className="text-lg">🪙</span>
              <span className="text-sm font-extrabold">{currentTokens.toLocaleString()}</span>
              <span className="text-xs font-medium text-amber-700">Tokens</span>
            </div>

            {onOpenWardrobe && (
              <button
                onClick={onOpenWardrobe}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                👔 Tủ Đồ Của Tôi
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications & Error alerts */}
        {successToast && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-sm animate-bounce">
            <span>{successToast}</span>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
          </div>
        )}
        {actionError && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between shadow-sm">
            <span>⚠️ {actionError}</span>
            <button onClick={() => setActionError(null)} className="text-rose-600 hover:text-rose-900">✕</button>
          </div>
        )}

        {/* Modal Body - 2 Columns (Split-View) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* ========================================================
              LEFT COLUMN: LIVE AVATAR STAGE (40% / 5 cols)
          ======================================================== */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-100/70 via-slate-50 to-amber-50/20 p-4 sm:p-5 flex flex-col justify-between border-r border-slate-200/80 overflow-y-auto">
            
            {/* View Switcher: Original vs Preview */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex p-1 rounded-xl bg-slate-200/70 text-xs font-semibold">
                <button
                  onClick={() => setCompareMode('preview')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    compareMode === 'preview'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✨ Sau Khi Phối {tryingOnList.length > 0 && `(${tryingOnList.length})`}
                </button>
                <button
                  onClick={() => setCompareMode('original')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    compareMode === 'original'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Đang Mặc
                </button>
              </div>

              {tryingOnList.length > 0 && (
                <button
                  onClick={clearTryOn}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium underline"
                >
                  Xóa giỏ thử
                </button>
              )}
            </div>

            {/* ZingSpeed 3D Character Quick Switcher */}
            <div className="flex items-center justify-between gap-1.5 mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <span>🎮</span> ZingSpeed 3D:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCharacterModel('boy');
                    const boySet = catalog.find(x => x.itemCode === 'set_zingspeed_boy_racer');
                    if (boySet) tryOnItem(boySet);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                    characterModel === 'boy'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Thử nguyên set Tay Đua Đường Phố ZingSpeed Nam"
                >
                  👦 Tay Đua Nam
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCharacterModel('girl');
                    const girlSet = catalog.find(x => x.itemCode === 'set_zingspeed_girl_idol');
                    if (girlSet) tryOnItem(girlSet);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                    characterModel === 'girl'
                      ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Thử nguyên set Thần Tượng ZingSpeed Nữ"
                >
                  👧 Thần Tượng Nữ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCharacterModel(characterModel === 'duo' ? 'auto' : 'duo');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                    characterModel === 'duo'
                      ? 'bg-cyan-500 text-white border-cyan-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Ngắm cả 2 nhân vật cùng đứng trong Showroom thời trang"
                >
                  👫 Cả Hai (Duo)
                </button>
              </div>
            </div>

            {/* Same-slot Replacement Notice Toast */}
            {lastReplacementNotice && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-medium flex items-center justify-between shadow-sm animate-pulse">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">🔄</span>
                  <span>{lastReplacementNotice}</span>
                </span>
                <button
                  onClick={clearReplacementNotice}
                  className="text-amber-700 hover:text-amber-950 font-bold ml-2 text-sm leading-none"
                  title="Đóng thông báo"
                >
                  ×
                </button>
              </div>
            )}

            {/* 3D WebGL (R3F) Stage Header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <span>⚡</span> Engine hiển thị:
              </span>
              <div className="flex items-center gap-1 bg-slate-200/80 px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-indigo-700">
                <span>🎮 3D WebGL (R3F)</span>
              </div>
            </div>

            {/* Avatar Stage Container */}
            <div className="relative flex-1 flex flex-col items-center justify-center min-h-[320px] rounded-2xl bg-white/40 border border-slate-200/60 p-2 shadow-inner overflow-hidden">
              <div className="w-full h-full min-h-[340px] flex-1 rounded-2xl overflow-hidden relative shadow-inner">
                <Avatar3DCanvas showControlsOverlay={true} />
              </div>

              {/* Status pill on bottom */}
              <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm flex items-center gap-1">
                <span>{compareMode === 'preview' && tryingOnList.length > 0 ? `👗 Thử ${tryingOnList.length} món` : 'Đang mặc'}</span>
                <span className="text-slate-400">|</span>
                <span className="text-amber-600">{Math.round(rotationY)}°</span>
              </div>

              {/* 3D Orbit & Inspection Bar */}
              <div className="w-full mt-3 px-2 py-2 rounded-xl bg-slate-100/90 border border-slate-200 backdrop-blur-sm space-y-2">
                {/* Angle Preset Quick Buttons */}
                <div className="flex items-center justify-between gap-1 text-[11px] font-semibold">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider pl-1">Góc nhìn:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setRotationY(0); setRotationX(0); }}
                      className={`px-2 py-0.5 rounded-md border transition-all ${
                        Math.abs(rotationY) < 5
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Mặt trước"
                    >
                      0° Trước
                    </button>
                    <button
                      onClick={() => { setRotationY(-45); setRotationX(0); }}
                      className={`px-2 py-0.5 rounded-md border transition-all ${
                        Math.abs(rotationY - (-45)) < 5
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Nghiêng 45° sang trái"
                    >
                      -45° Trái
                    </button>
                    <button
                      onClick={() => { setRotationY(45); setRotationX(0); }}
                      className={`px-2 py-0.5 rounded-md border transition-all ${
                        Math.abs(rotationY - 45) < 5
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Nghiêng 45° sang phải"
                    >
                      +45° Phải
                    </button>
                    <button
                      onClick={() => { setRotationY(180); setRotationX(0); }}
                      className={`px-2 py-0.5 rounded-md border transition-all ${
                        Math.abs(Math.abs(rotationY) - 180) < 5
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Xoay ra sau để ngắm cánh và áo"
                    >
                      180° Sau 🪽
                    </button>
                  </div>
                </div>

                {/* Slider + Turntable & Reset controls */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">🔄 Xoay:</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={Math.round(rotationY)}
                    onChange={(e) => setRotationY(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <button
                    onClick={() => setIsAutoTurntable(!isAutoTurntable)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                      isAutoTurntable
                        ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Bật/Tắt tự động xoay 360°"
                  >
                    {isAutoTurntable ? '⏸️ Dừng' : '▶️ Tự xoay'}
                  </button>
                  <button
                    onClick={handleResetView}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    title="Đặt lại góc nhìn ban đầu"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>

              {/* Subtitle Hint */}
              <p className="mt-1 text-[10px] text-slate-400 text-center">
                🖱️ Kéo chuột trực tiếp lên nhân vật để xoay 360° • Xoay 180° để ngắm cánh phía sau
              </p>
            </div>

            {/* Trying-on Cart summary card */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Giỏ thử đồ ({tryingOnList.length} món):</span>
                <span className="font-extrabold text-amber-900 flex items-center gap-1 text-sm">
                  <span>🪙</span> {totalCartCost.toLocaleString()} Tokens
                </span>
              </div>

              {tryingOnList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {tryingOnList.map(item => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      <span>{item.nameVi}</span>
                      <button
                        onClick={() => removeTryOn(item.layerSlot)}
                        className="text-slate-400 hover:text-rose-600 ml-0.5 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Chưa chọn món đồ nào. Bấm vào trang phục bên phải để thử đồ ngay!
                </p>
              )}

              {/* Checkout All Button */}
              <button
                disabled={tryingOnList.length === 0 || !canAffordBundle}
                onClick={handleCheckoutBundle}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  tryingOnList.length === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : canAffordBundle
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-amber-300'
                    : 'bg-rose-50 text-rose-500 border border-rose-200 cursor-not-allowed'
                }`}
              >
                {tryingOnList.length === 0 ? (
                  'Chọn đồ để thử & mua'
                ) : canAffordBundle ? (
                  <>
                    <span>Mua tất cả ({tryingOnList.length} món) & Lưu diện mạo</span>
                    <span>→</span>
                  </>
                ) : (
                  `Thiếu ${(totalCartCost - currentTokens).toLocaleString()} 🪙 để mua trọn gói`
                )}
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: SHOP CATALOG (60% / 7 cols)
          ======================================================== */}
          <div className="lg:col-span-7 flex flex-col h-full bg-white overflow-hidden">
            
            {/* Category Filter Tabs */}
            <div className="p-4 border-b border-slate-100 space-y-3">
              {/* Category buttons horizontally scrollable */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      category === cat.key
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Rarity chips & Search row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {RARITIES.map(r => (
                    <button
                      key={r.key}
                      onClick={() => setRarity(r.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        rarity === r.key
                          ? 'ring-2 ring-slate-800 font-bold ' + r.badgeClass
                          : 'opacity-70 hover:opacity-100 ' + r.badgeClass
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[160px] flex-1 sm:flex-initial">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm kiếm vật phẩm..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                  />
                  <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
                </div>
              </div>
            </div>

            {/* Catalog Grid View */}
            <div className="flex-1 p-4 overflow-y-auto">
              {shopLoading ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-xs font-medium">
                  Đang tải danh mục thời trang...
                </div>
              ) : catalog.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-center">
                  <span className="text-3xl mb-2">📦</span>
                  <p className="text-sm font-semibold">Không tìm thấy vật phẩm nào</p>
                  <p className="text-xs">Hãy thử đổi danh mục hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {catalog.map(item => {
                    const isTrying = !!tryingOnItems[item.layerSlot] && tryingOnItems[item.layerSlot].itemCode === item.itemCode;
                    const canAfford = currentTokens >= item.tokenPrice;
                    const isLevelLocked = (profile?.level ?? 1) < item.requiredLevel;

                    return (
                      <div
                        key={item.id}
                        className={`relative rounded-2xl p-3 border transition-all flex flex-col justify-between group ${
                          isTrying
                            ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-50/20 shadow-md'
                            : item.isOwned
                            ? 'border-slate-200 bg-slate-50/60 opacity-90'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        {/* Top badges */}
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRarityBadge(
                              item.rarityTier
                            )}`}
                          >
                            {item.rarityTier.toUpperCase()}
                          </span>

                          {item.isOwned ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                              ✓ Đã có
                            </span>
                          ) : isLevelLocked ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                              🔒 Lv.{item.requiredLevel}
                            </span>
                          ) : null}
                        </div>

                        {/* Item Icon / Preview art representation */}
                        <div className="flex flex-col items-center justify-center py-2 text-center">
                          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-inner">
                            {item.category === 'tops' && '👔'}
                            {item.category === 'bottoms' && '👖'}
                            {item.category === 'footwear' && '👟'}
                            {item.category === 'headwear' && '🎩'}
                            {item.category === 'eyewear' && '👓'}
                            {item.category === 'handheld' && '📖'}
                            {item.category === 'aura_background' && '🔥'}
                            {item.category === 'consumable' && '🧪'}
                          </div>

                          <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">
                            {item.nameVi}
                          </h4>
                          <p className="text-[10px] text-slate-500 line-clamp-1 italic">
                            {item.nameEn}
                          </p>
                        </div>

                        {/* Price & Action row */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs font-extrabold text-amber-900">
                            <span className="text-[11px] text-slate-400 font-medium">Giá:</span>
                            <span className="flex items-center gap-1">
                              <span>🪙</span> {item.tokenPrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {/* Try On Button */}
                            <button
                              onClick={() => tryOnItem(item)}
                              className={`py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                                isTrying
                                  ? 'bg-cyan-500 text-white shadow-sm'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isTrying ? 'Đang thử' : 'Mặc thử'}
                            </button>

                            {/* Buy Now Button */}
                            {item.isOwned ? (
                              <button
                                disabled
                                className="py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
                              >
                                Đã sở hữu
                              </button>
                            ) : (
                              <button
                                disabled={!canAfford || isLevelLocked}
                                onClick={() => handleBuySingle(item)}
                                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                                  !canAfford || isLevelLocked
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                                }`}
                              >
                                Mua ngay
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Luyện tập bài học 4 kỹ năng & Mini-games hàng ngày để tích lũy Token mua đồ miễn phí.</span>
          <span className="font-semibold text-slate-700">Trần mềm token: 600 🪙/ngày</span>
        </div>
      </div>
    </div>
  );
};
