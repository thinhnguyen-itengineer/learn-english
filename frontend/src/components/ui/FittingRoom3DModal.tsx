import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  RotateCcw,
  Coins,
  Shirt,
  Scissors,
  Crown,
  Layers,
  User,
  ShoppingBag,
  Bookmark,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Item3DCard, AvatarItem3DData, Slot3D, Rarity3D } from './Item3DCard';
import { OrbitControlsHUD, CameraPreset, LightingTheme } from './OrbitControlsHUD';
import { FittingRoomActionDock } from './FittingRoomActionDock';
import { PresetSelector3D, AvatarPreset3DItem } from './PresetSelector3D';
import { AnimationStateHUD, AnimationState3D } from './AnimationStateHUD';
import { TokenBalanceBadge } from './TokenBalanceBadge';

export interface FittingRoom3DModalProps {
  /** Modal open state */
  isOpen: boolean;
  /** Modal close callback */
  onClose: () => void;
  /** User's current token balance */
  userTokenBalance: number;
  /** User's current experience level */
  userLevel?: number;
  /** Optional 3D WebGL / R3F Canvas Node passed from Senior Fullstack Engineer */
  canvas3DNode?: React.ReactNode;
  /** Initial or currently equipped items map by slot */
  equippedItems?: Partial<Record<Slot3D, AvatarItem3DData>>;
  /** Catalog of all 3D items available in the shop and wardrobe */
  catalogItems?: AvatarItem3DData[];
  /** IDs of items the user already owns */
  ownedItemIds?: string[];
  /** 5 Preset items */
  presets?: AvatarPreset3DItem[];
  /** Active preset slot (1-5) */
  activePresetSlot?: number;
  /** Callback when user purchases a single 3D item */
  onPurchaseItem?: (item: AvatarItem3DData) => Promise<boolean> | boolean | void;
  /** Callback when user purchases all previewed items in bulk */
  onPurchaseAll?: (items: AvatarItem3DData[]) => Promise<boolean> | boolean | void;
  /** Callback when user equips an owned item */
  onEquipItem?: (item: AvatarItem3DData) => void;
  /** Callback when user saves current outfit into a preset slot */
  onSavePreset?: (slot: number, name: string) => void;
  /** Callback when user applies a saved preset */
  onApplyPreset?: (preset: AvatarPreset3DItem) => void;
  /** Custom container class */
  className?: string;
}

// Sample 3D catalog items across 6 slots if none provided
const DEFAULT_3D_CATALOG: AvatarItem3DData[] = [
  // 1. BASE BODY
  {
    id: 'body_chibi_standard_01',
    name: 'Thân Chibi Tiêu Chuẩn',
    description: 'Bộ khung cơ thể Chibi Anime tỷ lệ vàng 1:2.8',
    slot: 'BASE_BODY',
    rarity: 'COMMON',
    gender: 'UNISEX',
    modelUrl: '/models/3d/body_chibi_standard_01.glb',
    thumbnailUrl: '',
    priceTokens: 0,
    polyCount: 4800,
    fileSizeBytes: 524288,
  },
  {
    id: 'body_chibi_tan_athletic_01',
    name: 'Thân Chibi Thể Thao Da Bánh Mật',
    description: 'Cơ thể thể thao năng động, nước da rám nắng khỏe khoắn',
    slot: 'BASE_BODY',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/body_chibi_tan_athletic_01.glb',
    thumbnailUrl: '',
    priceTokens: 350,
    polyCount: 4950,
    fileSizeBytes: 535000,
  },

  // 2. HAIR
  {
    id: 'hair_anime_spiky_blue_01',
    name: 'Tóc Anime Gai Xanh Điện',
    description: 'Kiểu tóc anime cá tính với lọn tóc gai màu xanh cyan phát sáng',
    slot: 'HAIR',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/hair_anime_spiky_blue_01.glb',
    thumbnailUrl: '',
    priceTokens: 750,
    polyCount: 2900,
    fileSizeBytes: 215000,
  },
  {
    id: 'hair_twin_tails_cherry_01',
    name: 'Tóc Cột Hai Bên Cherry Cute',
    description: 'Tóc bím hai bên bồng bềnh phong cách Idol Nhật Bản',
    slot: 'HAIR',
    rarity: 'RARE',
    gender: 'FEMALE',
    modelUrl: '/models/3d/hair_twin_tails_cherry_01.glb',
    thumbnailUrl: '',
    priceTokens: 500,
    polyCount: 3200,
    fileSizeBytes: 245000,
  },
  {
    id: 'hair_side_part_scholar_01',
    name: 'Tóc Học Giả Rẽ Ngôi Lịch Lãm',
    description: 'Mái tóc rẽ ngôi 7/3 gọn gàng của học sinh gương mẫu',
    slot: 'HAIR',
    rarity: 'COMMON',
    gender: 'MALE',
    modelUrl: '/models/3d/hair_side_part_scholar_01.glb',
    thumbnailUrl: '',
    priceTokens: 200,
    polyCount: 2100,
    fileSizeBytes: 180000,
  },

  // 3. TOP
  {
    id: 'top_hoodie_lightning_01',
    name: 'Áo Hoodie Tia Chớp Cyber',
    description: 'Áo nỉ phong cách tương lai với logo tia chớp dạ quang',
    slot: 'TOP',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/top_hoodie_lightning_01.glb',
    thumbnailUrl: '',
    priceTokens: 850,
    levelRequired: 3,
    polyCount: 3100,
    fileSizeBytes: 285000,
    maskedBodyParts: ['Mat_Torso'],
  },
  {
    id: 'top_school_blazer_oxford_01',
    name: 'Áo Vest Đồng Phục Oxford',
    description: 'Áo vest nỉ trang nhã phong cách học viện quý tộc',
    slot: 'TOP',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/top_school_blazer_oxford_01.glb',
    thumbnailUrl: '',
    priceTokens: 600,
    polyCount: 2850,
    fileSizeBytes: 260000,
  },
  {
    id: 'top_golden_dragon_robe_01',
    name: 'Áo Choàng Hoàng Kim Long',
    description: 'Trang phục vinh quang độc quyền dành cho học viên xuất sắc',
    slot: 'TOP',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/top_golden_dragon_robe_01.glb',
    thumbnailUrl: '',
    priceTokens: 2500,
    levelRequired: 10,
    polyCount: 3450,
    fileSizeBytes: 340000,
  },

  // 4. BOTTOM
  {
    id: 'bottom_cargo_shorts_01',
    name: 'Quần Short Túi Hộp Năng Động',
    description: 'Quần lửng nhiều ngăn tiện dụng cho ngày hè sôi nổi',
    slot: 'BOTTOM',
    rarity: 'COMMON',
    gender: 'UNISEX',
    modelUrl: '/models/3d/bottom_cargo_shorts_01.glb',
    thumbnailUrl: '',
    priceTokens: 250,
    polyCount: 1800,
    fileSizeBytes: 145000,
  },
  {
    id: 'bottom_pleated_skirt_cyber_01',
    name: 'Váy Xếp Ly Viền Neon',
    description: 'Váy học sinh cách tân với dải LED phát quang',
    slot: 'BOTTOM',
    rarity: 'RARE',
    gender: 'FEMALE',
    modelUrl: '/models/3d/bottom_pleated_skirt_cyber_01.glb',
    thumbnailUrl: '',
    priceTokens: 450,
    polyCount: 2200,
    fileSizeBytes: 175000,
  },

  // 5. SHOES
  {
    id: 'shoes_sneaker_chunky_01',
    name: 'Giày Sneaker Chunky Đế Dày',
    description: 'Sneaker phong cách đường phố siêu êm và thời thượng',
    slot: 'SHOES',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/shoes_sneaker_chunky_01.glb',
    thumbnailUrl: '',
    priceTokens: 400,
    polyCount: 1950,
    fileSizeBytes: 160000,
  },
  {
    id: 'shoes_cyber_hover_boots_01',
    name: 'Bốt Bay Phản Lực Không Gian',
    description: 'Bốt gắn động cơ mini giúp nhân vật lơ lửng trên bục',
    slot: 'SHOES',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/shoes_cyber_hover_boots_01.glb',
    thumbnailUrl: '',
    priceTokens: 950,
    levelRequired: 5,
    polyCount: 2150,
    fileSizeBytes: 195000,
  },

  // 6. ACCESSORY
  {
    id: 'acc_cyber_goggles_01',
    name: 'Kính Cyber Goggles Phát Sáng',
    description: 'Kính bảo hộ công nghệ cao quét phân tích từ vựng',
    slot: 'ACCESSORY',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_cyber_goggles_01.glb',
    thumbnailUrl: '',
    priceTokens: 350,
    polyCount: 1200,
    fileSizeBytes: 110000,
  },
  {
    id: 'acc_angel_wings_aurora_01',
    name: 'Đôi Cánh Thiên Thần Bắc Cực Quang',
    description: 'Cánh phát sáng huyền ảo đổi màu theo chuỗi Streak trả lời đúng',
    slot: 'ACCESSORY',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_angel_wings_aurora_01.glb',
    thumbnailUrl: '',
    priceTokens: 3000,
    levelRequired: 8,
    polyCount: 1450,
    fileSizeBytes: 155000,
  },
];

export const FittingRoom3DModal: React.FC<FittingRoom3DModalProps> = ({
  isOpen,
  onClose,
  userTokenBalance,
  userLevel = 5,
  canvas3DNode,
  equippedItems: initialEquipped,
  catalogItems = DEFAULT_3D_CATALOG,
  ownedItemIds: initialOwned = ['body_chibi_standard_01', 'bottom_cargo_shorts_01'],
  presets = [],
  activePresetSlot = 1,
  onPurchaseItem,
  onPurchaseAll,
  onEquipItem,
  onSavePreset,
  onApplyPreset,
  className = '',
}) => {
  // Navigation / Tabs State
  const [activeMainTab, setActiveMainTab] = useState<'wardrobe' | 'presets'>('wardrobe');
  const [activeSlot, setActiveSlot] = useState<Slot3D>('TOP');
  const [filterRarity, setFilterRarity] = useState<Rarity3D | 'ALL'>('ALL');
  const [filterOwnership, setFilterOwnership] = useState<'ALL' | 'OWNED' | 'SHOP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 3D Viewport Controls State
  const [yawAngle, setYawAngle] = useState(0);
  const [zoomDistance, setZoomDistance] = useState(2.3);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('front');
  const [lightingTheme, setLightingTheme] = useState<LightingTheme>('studio');
  const [animationState, setAnimationState] = useState<AnimationState3D>('IDLE');

  // Currently equipped items by slot
  const [equipped, setEquipped] = useState<Partial<Record<Slot3D, AvatarItem3DData>>>(() => {
    if (initialEquipped) return initialEquipped;
    // Default starter outfit
    const starterBody = catalogItems.find((i) => i.id === 'body_chibi_standard_01');
    const starterTop = catalogItems.find((i) => i.id === 'top_school_blazer_oxford_01');
    const starterBottom = catalogItems.find((i) => i.id === 'bottom_cargo_shorts_01');
    const starterHair = catalogItems.find((i) => i.id === 'hair_side_part_scholar_01');
    return {
      BASE_BODY: starterBody,
      TOP: starterTop,
      BOTTOM: starterBottom,
      HAIR: starterHair,
    };
  });

  // Items currently being previewed / tried on (overriding equipped)
  const [previewItems, setPreviewItems] = useState<Partial<Record<Slot3D, AvatarItem3DData>>>({});

  // Owned item IDs set
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set(initialOwned));

  // Current effective outfit being rendered on 3D canvas (equipped overridden by preview)
  const activeOutfit = useMemo(() => {
    return {
      ...equipped,
      ...previewItems,
    };
  }, [equipped, previewItems]);

  // List of items in preview mode
  const previewItemList = useMemo(() => {
    return Object.values(previewItems).filter(Boolean) as AvatarItem3DData[];
  }, [previewItems]);

  // Total tokens cost of unowned preview items
  const totalPreviewCost = useMemo(() => {
    return previewItemList.reduce((sum, item) => {
      if (!ownedIds.has(item.id)) {
        return sum + item.priceTokens;
      }
      return sum;
    }, 0);
  }, [previewItemList, ownedIds]);

  if (!isOpen) return null;

  // Filter catalog items
  const filteredItems = catalogItems.filter((item) => {
    if (item.slot !== activeSlot) return false;
    if (filterRarity !== 'ALL' && item.rarity !== filterRarity) return false;
    if (filterOwnership === 'OWNED' && !ownedIds.has(item.id)) return false;
    if (filterOwnership === 'SHOP' && ownedIds.has(item.id)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Handlers for Try-On & Purchase
  const handlePreview = (item: AvatarItem3DData) => {
    setPreviewItems((prev) => ({
      ...prev,
      [item.slot]: item,
    }));
    setAnimationState('TRYON');
  };

  const handleRemovePreview = (itemId: string) => {
    setPreviewItems((prev) => {
      const next = { ...prev };
      for (const slot of Object.keys(next) as Slot3D[]) {
        if (next[slot]?.id === itemId) {
          delete next[slot];
        }
      }
      return next;
    });
  };

  const handleRevertAll = () => {
    setPreviewItems({});
    setAnimationState('IDLE');
  };

  const handleEquip = (item: AvatarItem3DData) => {
    setEquipped((prev) => ({
      ...prev,
      [item.slot]: item,
    }));
    // Remove from preview if was previewing
    handleRemovePreview(item.id);
    onEquipItem?.(item);
  };

  const handleBuyItem = async (item: AvatarItem3DData) => {
    const success = await onPurchaseItem?.(item);
    if (success !== false) {
      setOwnedIds((prev) => new Set([...prev, item.id]));
      handleEquip(item);
    }
  };

  const handleBuyAll = async () => {
    const unownedPreviews = previewItemList.filter((i) => !ownedIds.has(i.id));
    if (unownedPreviews.length === 0) return;

    const success = await onPurchaseAll?.(unownedPreviews);
    if (success !== false) {
      setOwnedIds((prev) => new Set([...prev, ...unownedPreviews.map((i) => i.id)]));
      setEquipped((prev) => ({
        ...prev,
        ...previewItems,
      }));
      setPreviewItems({});
      setAnimationState('VICTORY');
    }
  };

  const handleEquipAll = () => {
    setEquipped((prev) => ({
      ...prev,
      ...previewItems,
    }));
    setPreviewItems({});
    setAnimationState('CORRECT');
  };

  // Orbit controls handlers
  const handleRotateLeft = (deg = 45) => setYawAngle((prev) => prev - deg);
  const handleRotateRight = (deg = 45) => setYawAngle((prev) => prev + deg);
  const handleFlip180 = () => setYawAngle((prev) => prev + 180);
  const handleToggleAutoRotate = () => setIsAutoRotating((prev) => !prev);
  const handleZoomIn = () => setZoomDistance((prev) => Math.max(1.2, prev - 0.2));
  const handleZoomOut = () => setZoomDistance((prev) => Math.min(3.0, prev + 0.2));
  const handleResetView = () => {
    setYawAngle(0);
    setZoomDistance(2.3);
    setCameraPreset('front');
  };

  const slotTabs: { id: Slot3D; label: string; icon: React.ReactNode }[] = [
    { id: 'TOP', label: 'Áo', icon: <Shirt className="w-4 h-4" /> },
    { id: 'BOTTOM', label: 'Quần / Váy', icon: <Layers className="w-4 h-4" /> },
    { id: 'HAIR', label: 'Kiểu Tóc', icon: <Scissors className="w-4 h-4" /> },
    { id: 'SHOES', label: 'Giày Dép', icon: <Layers className="w-4 h-4" /> },
    { id: 'ACCESSORY', label: 'Phụ Kiện', icon: <Crown className="w-4 h-4" /> },
    { id: 'BASE_BODY', label: 'Thân Chibi', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden ${className}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-7xl h-[94vh] max-h-[960px] bg-slate-950 border-2 border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar: Title, Token Balance, Presets Switcher & Close */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-3d-gold flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Phòng Thử Đồ 3D Chibi Live
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40">
                  WebGL 360°
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tủ đồ module thời gian thực: xoay 360°, thử trang phục và lưu 5 bộ preset
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TokenBalanceBadge
              balance={userTokenBalance}
              showSoftCap={false}
              className="hidden sm:flex"
            />

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-90"
              aria-label="Đóng phòng thử đồ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Split-View Body: 45% 3D Viewport (Left) / 55% Wardrobe Controls (Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* =========================================================================
              LEFT PANEL: 3D Viewport (45%)
             ========================================================================= */}
          <div className="lg:w-[45%] h-[40vh] lg:h-full relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden select-none">
            {/* 3D Canvas Container: Uses canvas3DNode or Stylized Chibi Studio Fallback */}
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
              {canvas3DNode ? (
                /* Real Three.js Canvas Node passed by Senior Fullstack Engineer */
                <div className="w-full h-full absolute inset-0 z-0">{canvas3DNode}</div>
              ) : (
                /* Interactive Stylized 3D Chibi Turntable Stage */
                <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
                  {/* Subtle 3D Grid Floor */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40 [perspective:800px] [transform:rotateX(65deg)]" />

                  {/* Turntable Pedestal with Rotating Rim Light */}
                  <div
                    className={`relative w-48 sm:w-64 h-48 sm:h-64 rounded-full border-4 border-slate-700/80 bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl flex items-center justify-center transition-transform duration-300 ${
                      isAutoRotating ? 'animate-orbit-spin-slow' : ''
                    }`}
                    style={{
                      transform: `rotate(${yawAngle}deg)`,
                      boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.2)',
                    }}
                  >
                    <div className="w-full h-full rounded-full border border-dashed border-cyan-400/40 p-4 flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-widest">
                          Pedestal 360°
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stylized Chibi Representation Card with Active Outfit Badges */}
                  <div
                    className="absolute z-10 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none"
                    style={{
                      transform: `scale(${zoomDistance < 2.0 ? 1.15 : 1}) rotateY(${yawAngle * 0.5}deg)`,
                    }}
                  >
                    {/* Head / Chibi Figure Placeholder with Expression */}
                    <div className="relative flex flex-col items-center animate-avatar-breathe">
                      {/* Emotion Pop Bubble */}
                      {animationState !== 'IDLE' && (
                        <div className="absolute -top-10 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-xs shadow-lg animate-bounce flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {animationState}
                        </div>
                      )}

                      {/* Head Sphere */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-slate-800 shadow-xl flex items-center justify-center relative overflow-hidden">
                        <div className="flex items-center gap-3">
                          {/* Left Eye */}
                          <div className="w-3.5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                            <div className="w-1 h-2 rounded-full bg-white self-start ml-0.5 mt-0.5" />
                          </div>
                          {/* Right Eye */}
                          <div className="w-3.5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                            <div className="w-1 h-2 rounded-full bg-white self-start ml-0.5 mt-0.5" />
                          </div>
                        </div>
                        {/* Smile */}
                        <div className="absolute bottom-4 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
                      </div>

                      {/* Torso with Active Top */}
                      <div className="w-20 sm:w-24 h-16 rounded-2xl bg-blue-600 border-4 border-slate-800 -mt-2 shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                        {activeOutfit.TOP?.name ? (
                          <span className="px-1 text-center truncate">{activeOutfit.TOP.name}</span>
                        ) : (
                          'Áo Chibi'
                        )}
                      </div>

                      {/* Bottom & Shoes */}
                      <div className="flex items-center gap-2 -mt-1">
                        <div className="w-6 h-10 rounded-b-xl bg-emerald-600 border-2 border-slate-800" />
                        <div className="w-6 h-10 rounded-b-xl bg-emerald-600 border-2 border-slate-800" />
                      </div>
                    </div>

                    {/* Active Layers Pill */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-1 max-w-xs">
                      {Object.entries(activeOutfit).map(([slot, item]) => {
                        if (!item) return null;
                        const isPreview = previewItems[slot as Slot3D]?.id === item.id;
                        return (
                          <span
                            key={slot}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                              isPreview
                                ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {isPreview ? '✨ ' : ''}
                            {item.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating OrbitControlsHUD (Bottom of 3D Viewport) */}
            <div className="absolute top-3 right-3 max-w-[280px]">
              <OrbitControlsHUD
                yawAngle={yawAngle}
                zoomDistance={zoomDistance}
                isAutoRotating={isAutoRotating}
                activePreset={cameraPreset}
                activeLighting={lightingTheme}
                onRotateLeft={handleRotateLeft}
                onRotateRight={handleRotateRight}
                onFlip180={handleFlip180}
                onToggleAutoRotate={handleToggleAutoRotate}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
                onSelectPreset={(p) => {
                  setCameraPreset(p);
                  if (p === 'back') setYawAngle(180);
                  if (p === 'front') setYawAngle(0);
                  if (p === 'side') setYawAngle(90);
                }}
                onSelectLighting={setLightingTheme}
              />
            </div>

            {/* Floating Animation State Controller (Top of 3D Viewport) */}
            <div className="absolute top-3 left-3 max-w-md hidden md:block">
              <AnimationStateHUD
                activeAnimation={animationState}
                onTriggerAnimation={setAnimationState}
                compact
              />
            </div>

            {/* Floating FittingRoomActionDock (Bottom Center of 3D Viewport) */}
            {previewItemList.length > 0 && (
              <div className="absolute bottom-3 inset-x-0 z-30">
                <FittingRoomActionDock
                  previewItems={previewItemList}
                  totalTokensCost={totalPreviewCost}
                  userTokens={userTokenBalance}
                  onRemovePreviewItem={handleRemovePreview}
                  onRevertAll={handleRevertAll}
                  onBuyAll={handleBuyAll}
                  onEquipAll={handleEquipAll}
                  onSaveAsPreset={() => setActiveMainTab('presets')}
                />
              </div>
            )}
          </div>

          {/* =========================================================================
              RIGHT PANEL: Modular Wardrobe & Catalog (55%)
             ========================================================================= */}
          <div className="lg:w-[55%] flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* Main Navigation Tabs: Wardrobe Catalog vs 5 Presets */}
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveMainTab('wardrobe')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMainTab === 'wardrobe'
                      ? 'bg-blue-600 text-white shadow-3d-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  Tủ Đồ & Cửa Hàng
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMainTab('presets')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMainTab === 'presets'
                      ? 'bg-blue-600 text-white shadow-3d-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Bộ Trang Phục (Presets)
                </button>
              </div>

              {/* Search Bar */}
              {activeMainTab === 'wardrobe' && (
                <div className="relative w-48 hidden sm:block">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm trang phục 3D..."
                    className="w-full pl-8 pr-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* TAB CONTENT 1: WARDROBE CATALOG */}
            {activeMainTab === 'wardrobe' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 6 Slot Category Tabs */}
                <div className="flex items-center gap-1.5 p-2 overflow-x-auto border-b border-slate-800/80 bg-slate-900/40 scrollbar-none">
                  {slotTabs.map((tab) => {
                    const isSelected = activeSlot === tab.id;
                    const itemsInSlot = catalogItems.filter((i) => i.slot === tab.id).length;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSlot(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                          isSelected
                            ? 'bg-slate-800 text-cyan-300 border-cyan-400/80 shadow-sm'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                        <span className="text-[10px] opacity-60 font-mono">({itemsInSlot})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-Filters: Ownership (All/Owned/Shop) & Rarity */}
                <div className="flex items-center justify-between p-2 border-b border-slate-800/60 bg-slate-900/20 text-xs">
                  {/* Ownership Switcher */}
                  <div className="flex items-center gap-1">
                    {(['ALL', 'OWNED', 'SHOP'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setFilterOwnership(mode)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          filterOwnership === mode
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {mode === 'ALL' ? 'Tất cả' : mode === 'OWNED' ? 'Đã sở hữu' : 'Chưa mua'}
                      </button>
                    ))}
                  </div>

                  {/* Rarity Filter Selector */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                    {(['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFilterRarity(r)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                          filterRarity === r
                            ? 'bg-slate-700 text-white'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items Grid */}
                <div className="flex-1 p-3 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
                      <span>Không tìm thấy vật phẩm nào trong mục này</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
                      {filteredItems.map((item) => {
                        const isEquipped = equipped[item.slot]?.id === item.id;
                        const isPreviewing = previewItems[item.slot]?.id === item.id;
                        const isOwned = ownedIds.has(item.id);

                        return (
                          <Item3DCard
                            key={item.id}
                            item={item}
                            isEquipped={isEquipped}
                            isPreviewing={isPreviewing}
                            isOwned={isOwned}
                            userLevel={userLevel}
                            userTokens={userTokenBalance}
                            onPreview={handlePreview}
                            onEquip={handleEquip}
                            onBuy={handleBuyItem}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: 5 PRESETS MANAGER */}
            {activeMainTab === 'presets' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <PresetSelector3D
                  presets={presets}
                  activeSlot={activePresetSlot}
                  onApplyPreset={onApplyPreset}
                  onSaveCurrentToPreset={onSavePreset}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
