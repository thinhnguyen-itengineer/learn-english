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
  Heart,
  Zap,
  Users,
} from 'lucide-react';
import { Item3DCard, AvatarItem3DData, Slot3D, Rarity3D, Gender3D } from './Item3DCard';
import { OrbitControlsHUD, CameraPreset, LightingTheme } from './OrbitControlsHUD';
import { FittingRoomActionDock } from './FittingRoomActionDock';
import { PresetSelector3D, AvatarPreset3DItem } from './PresetSelector3D';
import { AnimationStateHUD, AnimationState3D } from './AnimationStateHUD';
import { TokenBalanceBadge } from './TokenBalanceBadge';
import { CharacterGenderSelector, CharacterSelectionMode } from './CharacterGenderSelector';
import { WardrobeItemCompatibilityBadge } from './WardrobeItemCompatibilityBadge';
import { DualCharacterShowcase } from './DualCharacterShowcase';

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

// Sample 3D catalog items across 6 slots tailored for Female (Aoi), Male (Ren) & Unisex
export const DEFAULT_3D_CATALOG: AvatarItem3DData[] = [
  // 1. BASE BODY
  {
    id: 'body_chibi_female_aoi',
    name: 'Thân Nữ Chibi Aoi (Meshy AI .glb Gốc)',
    description: 'Khung cơ thể Chibi Nữ tỷ lệ vàng 1:2.8, tối ưu từ file Meshy AI 426k tris',
    slot: 'BASE_BODY',
    rarity: 'COMMON',
    gender: 'FEMALE',
    modelUrl: '/models/3d/Meshy_AI_Chibi_Figure_0930081629_texture.glb',
    thumbnailUrl: '',
    priceTokens: 0,
    polyCount: 4800,
    fileSizeBytes: 524288,
  },
  {
    id: 'body_chibi_male_ren',
    name: 'Thân Nam Chibi Ren (Khung Xương Đối Ứng)',
    description: 'Khung cơ thể Chibi Nam tỷ lệ 1:2.8, vai thể thao, rig xương Humanoid 42 bones',
    slot: 'BASE_BODY',
    rarity: 'COMMON',
    gender: 'MALE',
    modelUrl: '/models/3d/chibi_male_ren_master_rig.glb',
    thumbnailUrl: '',
    priceTokens: 0,
    polyCount: 4900,
    fileSizeBytes: 535000,
  },
  {
    id: 'body_chibi_tan_athletic_01',
    name: 'Thân Chibi Thể Thao Bánh Mật',
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
    id: 'hair_twin_tails_cherry_01',
    name: 'Tóc Cột Hai Bên Sakura Pop',
    description: 'Tóc bím hai bên bồng bềnh phong cách Anime Idol Nhật Bản',
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
    id: 'hair_short_bob_scholar_01',
    name: 'Tóc Ngắn Bob Học Đường Anime',
    description: 'Mái tóc ngắn ôm cằm xinh xắn của nữ sinh chăm chỉ',
    slot: 'HAIR',
    rarity: 'COMMON',
    gender: 'FEMALE',
    modelUrl: '/models/3d/hair_short_bob_scholar_01.glb',
    thumbnailUrl: '',
    priceTokens: 250,
    polyCount: 2600,
    fileSizeBytes: 210000,
  },
  {
    id: 'hair_side_part_scholar_01',
    name: 'Tóc Học Giả Rẽ Ngôi 7/3',
    description: 'Mái tóc rẽ ngôi 7/3 gọn gàng, phong thái điềm tĩnh của Ren',
    slot: 'HAIR',
    rarity: 'COMMON',
    gender: 'MALE',
    modelUrl: '/models/3d/hair_side_part_scholar_01.glb',
    thumbnailUrl: '',
    priceTokens: 200,
    polyCount: 2100,
    fileSizeBytes: 180000,
  },
  {
    id: 'hair_anime_spiky_layer_01',
    name: 'Tóc Layer Gai Học Trưởng Cool Ngầu',
    description: 'Lọn tóc vuốt nhọn anime cá tính với ánh highlight xanh cyan',
    slot: 'HAIR',
    rarity: 'EPIC',
    gender: 'MALE',
    modelUrl: '/models/3d/hair_anime_spiky_layer_01.glb',
    thumbnailUrl: '',
    priceTokens: 750,
    polyCount: 2950,
    fileSizeBytes: 225000,
  },
  {
    id: 'hair_anime_spiky_blue_01',
    name: 'Tóc Anime Gai Xanh Điện Unisex',
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

  // 3. TOP
  {
    id: 'top_chibi_female_sailor_01',
    name: 'Áo Thủy Thủ Nữ Sinh Kèm Nơ Đỏ',
    description: 'Đồng phục nữ sinh kinh điển với cổ áo thủy thủ và nơ đỏ may mắn',
    slot: 'TOP',
    rarity: 'RARE',
    gender: 'FEMALE',
    modelUrl: '/models/3d/top_chibi_female_sailor_01.glb',
    thumbnailUrl: '',
    priceTokens: 550,
    polyCount: 2750,
    fileSizeBytes: 250000,
    maskedBodyParts: ['Mat_Torso'],
  },
  {
    id: 'top_chibi_female_hoodie_pink_01',
    name: 'Áo Hoodie Chibi Tai Thỏ Pastel',
    description: 'Áo nỉ hồng pastel ấm áp với mũ trùm đầu hình tai thỏ đáng yêu',
    slot: 'TOP',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/top_chibi_female_hoodie_pink_01.glb',
    thumbnailUrl: '',
    priceTokens: 850,
    polyCount: 3150,
    fileSizeBytes: 290000,
    maskedBodyParts: ['Mat_Torso'],
    hideSlotsWhenEquipped: ['HAIR'],
  },
  {
    id: 'top_chibi_male_vest_gilet_01',
    name: 'Áo Gile Len Kèm Sơ Mi Trắng',
    description: 'Set áo sơ mi cổ bẻ phối gile len học viện Oxford lịch thiệp',
    slot: 'TOP',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/top_chibi_male_vest_gilet_01.glb',
    thumbnailUrl: '',
    priceTokens: 600,
    polyCount: 2900,
    fileSizeBytes: 265000,
    maskedBodyParts: ['Mat_Torso'],
  },
  {
    id: 'top_chibi_male_cyber_jacket_01',
    name: 'Áo Khoác Techwear Cyan Electric',
    description: 'Áo khoác phong cách tương lai Cyberpunk có dải LED dạ quang',
    slot: 'TOP',
    rarity: 'EPIC',
    gender: 'MALE',
    modelUrl: '/models/3d/top_chibi_male_cyber_jacket_01.glb',
    thumbnailUrl: '',
    priceTokens: 900,
    polyCount: 3300,
    fileSizeBytes: 300000,
    maskedBodyParts: ['Mat_Torso'],
  },
  {
    id: 'top_school_blazer_oxford_01',
    name: 'Áo Blazer Học Viện Hoàng Gia',
    description: 'Áo vest nỉ xanh navy viền vàng gold quý tộc, mặc vừa cả Nam & Nữ',
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
    description: 'Trang phục vinh quang độc quyền dành cho học viên Top 1 Rank',
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
    id: 'bottom_chibi_female_pleated_01',
    name: 'Váy Xếp Ly Đồng Phục Học Viện',
    description: 'Váy ngắn xếp ly ca rô đỏ nổi bật, đường may tinh xảo',
    slot: 'BOTTOM',
    rarity: 'COMMON',
    gender: 'FEMALE',
    modelUrl: '/models/3d/bottom_chibi_female_pleated_01.glb',
    thumbnailUrl: '',
    priceTokens: 200,
    polyCount: 1950,
    fileSizeBytes: 160000,
  },
  {
    id: 'bottom_chibi_female_denim_01',
    name: 'Quần Short Yếm Denim Trẻ Trung',
    description: 'Yếm bò ngắn cá tính kèm thắt lưng da thời thượng',
    slot: 'BOTTOM',
    rarity: 'RARE',
    gender: 'FEMALE',
    modelUrl: '/models/3d/bottom_chibi_female_denim_01.glb',
    thumbnailUrl: '',
    priceTokens: 450,
    polyCount: 2200,
    fileSizeBytes: 195000,
  },
  {
    id: 'bottom_chibi_male_slacks_01',
    name: 'Quần Âu Thể Thao Dáng Ôm',
    description: 'Quần âu đen xám co giãn, dáng đứng thanh lịch',
    slot: 'BOTTOM',
    rarity: 'COMMON',
    gender: 'MALE',
    modelUrl: '/models/3d/bottom_chibi_male_slacks_01.glb',
    thumbnailUrl: '',
    priceTokens: 200,
    polyCount: 1850,
    fileSizeBytes: 155000,
  },
  {
    id: 'bottom_cargo_shorts_01',
    name: 'Quần Cargo Techwear Túi Hộp',
    description: 'Quần túi hộp đường phố nhiều ngăn chứa đồ học tập',
    slot: 'BOTTOM',
    rarity: 'COMMON',
    gender: 'UNISEX',
    modelUrl: '/models/3d/bottom_cargo_shorts_01.glb',
    thumbnailUrl: '',
    priceTokens: 150,
    polyCount: 1800,
    fileSizeBytes: 150000,
  },
  {
    id: 'bottom_hologram_tech_skirt_01',
    name: 'Váy Hologram Neon Dạ Quang',
    description: 'Váy công nghệ đổi màu theo ánh đèn sân khấu 1v1',
    slot: 'BOTTOM',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/bottom_hologram_tech_skirt_01.glb',
    thumbnailUrl: '',
    priceTokens: 750,
    polyCount: 2100,
    fileSizeBytes: 185000,
  },

  // 5. SHOES
  {
    id: 'shoes_chibi_female_oxford_01',
    name: 'Giày Oxford Nữ Kèm Vớ Cổ Ngắn',
    description: 'Đôi giày da bóng loáng kết hợp vớ trắng ren viền nơ',
    slot: 'SHOES',
    rarity: 'COMMON',
    gender: 'FEMALE',
    modelUrl: '/models/3d/shoes_chibi_female_oxford_01.glb',
    thumbnailUrl: '',
    priceTokens: 150,
    polyCount: 1600,
    fileSizeBytes: 140000,
  },
  {
    id: 'shoes_chibi_male_sneaker_cyan_01',
    name: 'Giày Sneaker Cổ Cao Đế Khí Cyan',
    description: 'Giày thể thao công nghệ đệm khí êm ái, bứt tốc trong mini-game',
    slot: 'SHOES',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/shoes_chibi_male_sneaker_cyan_01.glb',
    thumbnailUrl: '',
    priceTokens: 400,
    polyCount: 1800,
    fileSizeBytes: 155000,
  },
  {
    id: 'shoes_runner_sneakers_01',
    name: 'Giày Thể Thao Siêu Nhẹ Neon',
    description: 'Đôi sneaker chạy bộ siêu nhẹ, tăng độ bật nảy Chibi',
    slot: 'SHOES',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/shoes_runner_sneakers_01.glb',
    thumbnailUrl: '',
    priceTokens: 400,
    polyCount: 1850,
    fileSizeBytes: 160000,
  },
  {
    id: 'shoes_high_boots_cyber_01',
    name: 'Bốt Chiến Binh Cyber 2077',
    description: 'Đôi bốt da cao cổ chống trầy xước với đèn LED phát quang',
    slot: 'SHOES',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/shoes_high_boots_cyber_01.glb',
    thumbnailUrl: '',
    priceTokens: 700,
    polyCount: 2200,
    fileSizeBytes: 190000,
  },

  // 6. ACCESSORY
  {
    id: 'acc_chibi_female_star_clip_01',
    name: 'Kẹp Tóc Ngôi Sao Vàng May Mắn',
    description: 'Kẹp tóc ngôi sao vàng lấp lánh trên mái tóc của Aoi',
    slot: 'ACCESSORY',
    rarity: 'COMMON',
    gender: 'FEMALE',
    modelUrl: '/models/3d/acc_chibi_female_star_clip_01.glb',
    thumbnailUrl: '',
    priceTokens: 100,
    polyCount: 850,
    fileSizeBytes: 75000,
  },
  {
    id: 'acc_chibi_female_cat_headphones_01',
    name: 'Tai Nghe Tai Mèo Phát Quang RGB',
    description: 'Tai nghe gaming tai mèo phát quang theo nhịp điệu bài nghe',
    slot: 'ACCESSORY',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/acc_chibi_female_cat_headphones_01.glb',
    thumbnailUrl: '',
    priceTokens: 900,
    polyCount: 1350,
    fileSizeBytes: 125000,
  },
  {
    id: 'acc_chibi_male_smart_glasses_01',
    name: 'Kính Mắt Trí Tuệ AR Scanner',
    description: 'Kính hiển thị ngữ pháp và gợi ý từ vựng nâng cao',
    slot: 'ACCESSORY',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/acc_chibi_male_smart_glasses_01.glb',
    thumbnailUrl: '',
    priceTokens: 450,
    polyCount: 950,
    fileSizeBytes: 85000,
  },
  {
    id: 'acc_chibi_male_cyber_headset_01',
    name: 'Tai Nghe Bluetooth Chụp Tai Studio',
    description: 'Tai nghe chống ồn chủ động chuyên luyện Audio Blitz của Ren',
    slot: 'ACCESSORY',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/acc_chibi_male_cyber_headset_01.glb',
    thumbnailUrl: '',
    priceTokens: 500,
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
  ownedItemIds: initialOwned = ['body_chibi_female_aoi', 'bottom_chibi_female_pleated_01'],
  presets = [],
  activePresetSlot = 1,
  onPurchaseItem,
  onPurchaseAll,
  onEquipItem,
  onSavePreset,
  onApplyPreset,
  className = '',
}) => {
  // Navigation / Character State
  const [activeCharacter, setActiveCharacter] = useState<CharacterSelectionMode>('FEMALE');
  const [activeMainTab, setActiveMainTab] = useState<'wardrobe' | 'presets'>('wardrobe');
  const [activeSlot, setActiveSlot] = useState<Slot3D>('TOP');
  const [filterGender, setFilterGender] = useState<'ALL' | 'FEMALE' | 'MALE' | 'UNISEX'>('ALL');
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
    // Default starter outfit for female Aoi
    const starterBody = catalogItems.find((i) => i.id === 'body_chibi_female_aoi');
    const starterTop = catalogItems.find((i) => i.id === 'top_chibi_female_sailor_01');
    const starterBottom = catalogItems.find((i) => i.id === 'bottom_chibi_female_pleated_01');
    const starterHair = catalogItems.find((i) => i.id === 'hair_twin_tails_cherry_01');
    const starterShoes = catalogItems.find((i) => i.id === 'shoes_chibi_female_oxford_01');
    return {
      BASE_BODY: starterBody,
      TOP: starterTop,
      BOTTOM: starterBottom,
      HAIR: starterHair,
      SHOES: starterShoes,
    };
  });

  // Items currently being previewed / tried on (overriding equipped)
  const [previewItems, setPreviewItems] = useState<Partial<Record<Slot3D, AvatarItem3DData>>>({});

  // Owned item IDs set
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set(initialOwned));

  // Switch default outfit when user switches character
  const handleCharacterSwitch = (char: CharacterSelectionMode) => {
    setActiveCharacter(char);
    if (char === 'FEMALE') {
      setFilterGender('FEMALE');
      const femaleBody = catalogItems.find((i) => i.id === 'body_chibi_female_aoi');
      if (femaleBody) {
        setEquipped((prev) => ({ ...prev, BASE_BODY: femaleBody }));
      }
    } else if (char === 'MALE') {
      setFilterGender('MALE');
      const maleBody = catalogItems.find((i) => i.id === 'body_chibi_male_ren');
      if (maleBody) {
        setEquipped((prev) => ({ ...prev, BASE_BODY: maleBody }));
      }
    } else {
      setFilterGender('ALL');
    }
  };

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

  // Total tokens cost of all previewed items that the user doesn't own yet
  const totalPreviewCost = useMemo(() => {
    return previewItemList.reduce((sum, item) => {
      if (ownedIds.has(item.id)) return sum;
      return sum + item.priceTokens;
    }, 0);
  }, [previewItemList, ownedIds]);

  if (!isOpen) return null;

  // Filter catalog items
  const filteredItems = catalogItems.filter((item) => {
    if (item.slot !== activeSlot) return false;
    if (filterGender !== 'ALL') {
      if (item.gender && item.gender !== filterGender && item.gender !== 'UNISEX') return false;
    }
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
  };

  // 3D Camera Controls
  const handleRotateLeft = () => setYawAngle((prev) => (prev - 45 + 360) % 360);
  const handleRotateRight = () => setYawAngle((prev) => (prev + 45) % 360);
  const handleFlip180 = () => setYawAngle((prev) => (prev + 180) % 360);
  const handleToggleAutoRotate = () => setIsAutoRotating((prev) => !prev);
  const handleZoomIn = () => setZoomDistance((prev) => Math.max(1.2, +(prev - 0.3).toFixed(1)));
  const handleZoomOut = () => setZoomDistance((prev) => Math.min(3.0, +(prev + 0.3).toFixed(1)));
  const handleResetView = () => {
    setYawAngle(0);
    setZoomDistance(2.3);
    setCameraPreset('front');
  };

  // Slot Navigation Tabs Config
  const slotTabs: { id: Slot3D; label: string; icon: React.ReactNode }[] = [
    { id: 'TOP', label: 'Áo', icon: <Shirt className="w-3.5 h-3.5" /> },
    { id: 'BOTTOM', label: 'Quần / Váy', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'HAIR', label: 'Tóc', icon: <Scissors className="w-3.5 h-3.5" /> },
    { id: 'SHOES', label: 'Giày', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'ACCESSORY', label: 'Phụ Kiện', icon: <Crown className="w-3.5 h-3.5" /> },
    { id: 'BASE_BODY', label: 'Cơ Thể Chibi', icon: <User className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-7xl h-[94vh] max-h-[950px] flex flex-col rounded-3xl bg-slate-900 border-2 overflow-hidden shadow-2xl transition-all duration-300 ${
          activeCharacter === 'FEMALE'
            ? 'border-rose-500/50 shadow-glow-female/20'
            : activeCharacter === 'MALE'
            ? 'border-cyan-500/50 shadow-glow-male/20'
            : 'border-purple-500/50 shadow-glow-duo/20'
        } ${className}`}
      >
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl p-0.5 flex items-center justify-center text-white ${
                activeCharacter === 'FEMALE'
                  ? 'bg-rose-500 shadow-3d-female'
                  : activeCharacter === 'MALE'
                  ? 'bg-cyan-500 text-slate-950 shadow-3d-male'
                  : 'bg-purple-500 shadow-3d-duo'
              }`}
            >
              <Sparkles className="w-5 h-5" />
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
                Hệ thống nhân vật Chibi Nữ (Aoi) & Nam (Ren) với tủ đồ module 6 slot
              </p>
            </div>
          </div>

          {/* Center Character Switcher */}
          <CharacterGenderSelector
            selectedCharacter={activeCharacter}
            onSelectCharacter={handleCharacterSwitch}
            variant="compact-tabs"
            allowDuoMode={true}
          />

          {/* Right Token Balance & Close */}
          <div className="flex items-center gap-3">
            <TokenBalanceBadge
              balance={userTokenBalance}
              showSoftCap={false}
              className="hidden sm:flex"
            />

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-90 cursor-pointer"
              aria-label="Đóng phòng thử đồ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode: If DUO MODE selected, show DualCharacterShowcase */}
        {activeCharacter === 'DUO' ? (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
            <DualCharacterShowcase
              userTokenBalance={userTokenBalance}
              canvas3DNode={canvas3DNode}
            />
          </div>
        ) : (
          /* Master Split-View Body: 45% 3D Viewport (Left) / 55% Wardrobe Controls (Right) */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            {/* =========================================================================
                LEFT PANEL: 3D Viewport (45%)
               ========================================================================= */}
            <div className="lg:w-[45%] h-[40vh] lg:h-full relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden select-none">
              {/* 3D Canvas Container */}
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                {canvas3DNode ? (
                  <div className="w-full h-full absolute inset-0 z-0">{canvas3DNode}</div>
                ) : (
                  /* Stylized 3D Turntable Fallback */
                  <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40 [perspective:800px] [transform:rotateX(65deg)]" />

                    {/* Turntable Pedestal */}
                    <div
                      className={`relative w-48 sm:w-64 h-48 sm:h-64 rounded-full border-4 bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl flex items-center justify-center transition-transform duration-300 ${
                        activeCharacter === 'FEMALE' ? 'border-rose-500/40 shadow-glow-female/40' : 'border-cyan-500/40 shadow-glow-male/40'
                      } ${isAutoRotating ? 'animate-orbit-spin-slow' : ''}`}
                      style={{
                        transform: `rotateY(${yawAngle}deg)`,
                      }}
                    >
                      <div className="absolute -top-16 flex flex-col items-center">
                        <div
                          className={`w-28 sm:w-36 h-40 sm:h-52 rounded-3xl border-2 flex flex-col items-center justify-center p-3 text-center transition-all ${
                            activeCharacter === 'FEMALE'
                              ? 'bg-rose-950/40 border-rose-500/70 shadow-glow-female'
                              : 'bg-cyan-950/40 border-cyan-500/70 shadow-glow-male'
                          } ${
                            animationState === 'TRYON'
                              ? 'animate-sparkle-float'
                              : animationState === 'STREAK'
                              ? 'animate-streak-flame ring-4 ring-orange-500'
                              : animationState === 'CONFUSED'
                              ? 'animate-dizzy-wobble'
                              : 'animate-avatar-breathe'
                          }`}
                        >
                          <div className="text-3xl mb-1">
                            {activeCharacter === 'FEMALE' ? '👧' : '👦'}
                          </div>
                          <span className="text-xs font-black text-white">
                            {activeCharacter === 'FEMALE' ? 'Aoi (Chibi 0.95m)' : 'Ren (Chibi 0.98m)'}
                          </span>
                          <span className="text-[10px] text-slate-300 font-medium line-clamp-1 mt-1">
                            {activeOutfit.TOP?.name || 'Áo Mặc Định'}
                          </span>
                          <span className="text-[9px] text-slate-400 line-clamp-1">
                            {activeOutfit.BOTTOM?.name || 'Váy/Quần Mặc Định'}
                          </span>

                          {/* Try-On Glowing Indicator */}
                          {previewItemList.length > 0 && (
                            <span className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 shadow-glow-tryon animate-pulse">
                              ✨ ĐANG THỬ {previewItemList.length} MÓN
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="absolute inset-0 rounded-full border border-dashed border-slate-600/40 animate-aura-rotate" />
                    </div>
                  </div>
                )}

                {/* Orbit Controls HUD */}
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

              {/* Animation State Controller HUD */}
              <div className="absolute top-3 left-3 max-w-md hidden md:block">
                <AnimationStateHUD
                  activeAnimation={animationState}
                  onTriggerAnimation={setAnimationState}
                  compact
                />
              </div>

              {/* FittingRoomActionDock */}
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeMainTab === 'wardrobe'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Tủ Đồ & Cửa Hàng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMainTab('presets')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeMainTab === 'presets'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>5 Bộ Preset</span>
                  </button>
                </div>

                {/* Search Input */}
                {activeMainTab === 'wardrobe' && (
                  <div className="relative w-44 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm trang phục..."
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
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
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

                  {/* Sub-Filters: Gender Compatibility, Ownership & Rarity */}
                  <div className="flex flex-wrap items-center justify-between p-2 border-b border-slate-800/60 bg-slate-900/20 text-xs gap-2">
                    {/* Gender Compatibility Filter */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      {(['ALL', 'FEMALE', 'MALE', 'UNISEX'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFilterGender(g)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            filterGender === g
                              ? g === 'FEMALE'
                                ? 'bg-rose-500 text-white'
                                : g === 'MALE'
                                ? 'bg-cyan-500 text-slate-950'
                                : g === 'UNISEX'
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {g === 'ALL' ? 'Tất cả giới tính' : g === 'FEMALE' ? 'Nữ (Aoi)' : g === 'MALE' ? 'Nam (Ren)' : 'Unisex'}
                        </button>
                      ))}
                    </div>

                    {/* Ownership Switcher */}
                    <div className="flex items-center gap-1">
                      {(['ALL', 'OWNED', 'SHOP'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setFilterOwnership(mode)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            filterOwnership === mode
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {mode === 'ALL' ? 'Tất cả' : mode === 'OWNED' ? 'Đã có' : 'Chưa mua'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div className="flex-1 p-3 overflow-y-auto">
                    {filteredItems.length === 0 ? (
                      <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
                        <span>Không tìm thấy vật phẩm nào phù hợp bộ lọc này</span>
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
        )}
      </div>
    </div>
  );
};
