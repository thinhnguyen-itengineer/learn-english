import { create } from 'zustand';
import {
  AvatarItem3D,
  UserAvatar3DConfig,
  AvatarPreset3D,
  Manifest3D,
  Slot3D,
  AnimationState3D,
  ActiveCharacterData,
  MatchingOutfitSet,
  PurchaseMatchingSetResponse,
} from '../types/avatar3d';
import { MATCHING_DUO_SETS } from '../components/ui/DualCharacterShowcase';

const API_BASE = '/api/v1';

// Starter / Fallback data
// Starter / Fallback data for Stickman 3D Customization
export const FALLBACK_3D_ITEMS: AvatarItem3D[] = [
  // 1. MÀU DA ĐẶC TRƯNG (BASE_BODY - CHỈ TRẮNG VÀ ĐEN)
  {
    id: 'body_stickman_black',
    name: 'Người Que Đen Nhám (Matte Black)',
    description: 'Thân người que đen nhám đơn sắc 100% từ trên xuống dưới, phong cách tối giản bí ẩn.',
    slot: 'BASE_BODY',
    rarity: 'COMMON',
    gender: 'UNISEX',
    modelUrl: '/models/3d/body_stickman_black.glb',
    thumbnailUrl: '/thumbnails/3d/body_stickman_black.webp',
    priceTokens: 0,
    levelRequired: 1,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1800,
    fileSizeBytes: 120000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'body_stickman_white',
    name: 'Người Que Trắng Sứ (Pearl White)',
    description: 'Thân người que trắng sứ tinh khiết đơn sắc 100% từ trên xuống dưới thanh thoát.',
    slot: 'BASE_BODY',
    rarity: 'COMMON',
    gender: 'UNISEX',
    modelUrl: '/models/3d/body_stickman_white.glb',
    thumbnailUrl: '/thumbnails/3d/body_stickman_white.webp',
    priceTokens: 0,
    levelRequired: 1,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1800,
    fileSizeBytes: 120000,
    isActive: true,
    isOwned: true,
  },

  // 2. KHUÔN MẶT & BIỂU CẢM HÀI HƯỚC (HAIR / EXPRESSIONS)
  {
    id: 'face_waku_anime',
    name: 'Mặt Anime Waku Waku Mắt To Tròn (:3)',
    description: 'Chân mày uốn cong, mắt to lấp lánh ánh sao, miệng mèo chúm chím và má hồng cute.',
    slot: 'HAIR',
    rarity: 'COMMON',
    gender: 'UNISEX',
    modelUrl: '/models/3d/face_waku_anime.glb',
    thumbnailUrl: '/thumbnails/3d/face_waku_anime.webp',
    priceTokens: 0,
    levelRequired: 1,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 800,
    fileSizeBytes: 70000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'face_chad_smirk',
    name: 'Mặt GigaChad Nhướng Mày The Rock & Cười Nhếch Mép',
    description: 'Chân mày nhướng cao bên trái, mắt nheo ngạo nghễ, mũi cheeky và nụ cười nhếch mép phát sáng.',
    slot: 'HAIR',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/face_chad_smirk.glb',
    thumbnailUrl: '/thumbnails/3d/face_chad_smirk.webp',
    priceTokens: 400,
    levelRequired: 3,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 900,
    fileSizeBytes: 80000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'face_derp_troll',
    name: 'Mặt Troll Ngáo Ngơ Mắt Lé Thè Lưỡi',
    description: 'Chân mày lượn sóng ziczac, mắt lé mỗi hướng, mũi dài Pinocchio và chiếc lưỡi hồng thè lè bựa.',
    slot: 'HAIR',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/face_derp_troll.glb',
    thumbnailUrl: '/thumbnails/3d/face_derp_troll.webp',
    priceTokens: 250,
    levelRequired: 2,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 950,
    fileSizeBytes: 85000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'face_rage_flame',
    name: 'Mặt Chiến Binh Nộ Khí & Gân Máu 💢',
    description: 'Chân mày chữ V quặm lại, mắt bốc lửa vàng, răng nghiến chặt và gân máu đỏ giật giật.',
    slot: 'HAIR',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/face_rage_flame.glb',
    thumbnailUrl: '/thumbnails/3d/face_rage_flame.webp',
    priceTokens: 550,
    levelRequired: 4,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1100,
    fileSizeBytes: 95000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'face_crying_river',
    name: 'Mặt Khóc Dòng Sông Nước Mắt Tuôn Trào',
    description: 'Chân mày rũ rượi, mắt nhắm tịt, 2 dòng thác nước mắt neon tuôn xối xả và miệng há to gào khóc.',
    slot: 'HAIR',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/face_crying_river.glb',
    thumbnailUrl: '/thumbnails/3d/face_crying_river.webp',
    priceTokens: 300,
    levelRequired: 2,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 850,
    fileSizeBytes: 75000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'face_cyber_visor',
    name: 'Kính Visor LED Cyberpunk Ma Trận',
    description: 'Dải kính LED neon cyan phát quang tương lai quét tia laser quét ngang trán.',
    slot: 'HAIR',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/face_cyber_visor.glb',
    thumbnailUrl: '/thumbnails/3d/face_cyber_visor.webp',
    priceTokens: 350,
    levelRequired: 3,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 800,
    fileSizeBytes: 70000,
    isActive: true,
    isOwned: false,
  },

  // 3. ĐỒ CẦM TAY MINI GAME (TOP / HANDHELD PROPS)
  {
    id: 'prop_champion_trophy',
    name: 'Cúp Vàng Vô Địch Mini Game (Champion Trophy 🏆)',
    description: 'Cúp quán quân mạ vàng kim hoàng gia với hai quai cong và ngôi sao danh vọng.',
    slot: 'TOP',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/prop_champion_trophy.glb',
    thumbnailUrl: '/thumbnails/3d/prop_champion_trophy.webp',
    priceTokens: 0,
    levelRequired: 1,
    boneBindingRoot: 'RightHand',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 450,
    fileSizeBytes: 40000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'prop_laser_sword',
    name: 'Kiếm Laser Năng Lượng Cyber (Laser Saber 🗡️)',
    description: 'Thanh kiếm ánh sáng plasma phát quang rực rỡ đổi màu theo hiệu ứng đã chọn.',
    slot: 'TOP',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/prop_laser_sword.glb',
    thumbnailUrl: '/thumbnails/3d/prop_laser_sword.webp',
    priceTokens: 450,
    levelRequired: 3,
    boneBindingRoot: 'RightHand',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 400,
    fileSizeBytes: 38000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'prop_magic_wand',
    name: 'Gậy Phép Tinh Tú Ma Thuật (Celestial Wand 🪄)',
    description: 'Trượng phép ma thuật cổ đại gắn viên tinh thể xoay tròn tỏa hào quang thần bí.',
    slot: 'TOP',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/prop_magic_wand.glb',
    thumbnailUrl: '/thumbnails/3d/prop_magic_wand.webp',
    priceTokens: 350,
    levelRequired: 2,
    boneBindingRoot: 'RightHand',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 420,
    fileSizeBytes: 39000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'prop_explorer_torch',
    name: 'Đèn Pin Thám Hiểm Bí Ẩn (Explorer Torch 🔦)',
    description: 'Đèn pin chuyên dụng rọi luồng sáng xuyên qua bóng đêm của các hầm ngục mini game.',
    slot: 'TOP',
    rarity: 'RARE',
    gender: 'UNISEX',
    modelUrl: '/models/3d/prop_explorer_torch.glb',
    thumbnailUrl: '/thumbnails/3d/prop_explorer_torch.webp',
    priceTokens: 250,
    levelRequired: 2,
    boneBindingRoot: 'RightHand',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 380,
    fileSizeBytes: 35000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'prop_golden_mic',
    name: 'Micro Idol Siêu Sao Âm Nhạc (Golden Mic 🎤)',
    description: 'Chiếc micro vàng lấp lánh dành cho ca sĩ đại tài khuấy động sàn đấu tiếng Anh.',
    slot: 'TOP',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/prop_golden_mic.glb',
    thumbnailUrl: '/thumbnails/3d/prop_golden_mic.webp',
    priceTokens: 400,
    levelRequired: 3,
    boneBindingRoot: 'RightHand',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 360,
    fileSizeBytes: 34000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'prop_energy_blaster',
    name: 'Súng Bắn Tia Laser Tương Lai (Plasma Blaster 🔫)',
    description: 'Súng bắn tia năng lượng sci-fi trang bị cho các mini game bắn bia tốc độ.',
    slot: 'TOP',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/prop_energy_blaster.glb',
    thumbnailUrl: '/thumbnails/3d/prop_energy_blaster.webp',
    priceTokens: 550,
    levelRequired: 4,
    boneBindingRoot: 'RightHand',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 480,
    fileSizeBytes: 42000,
    isActive: true,
    isOwned: false,
  },

  // 4. ĐÔI CÁNH THẦN THOẠI (ACCESSORY / WINGS)
  {
    id: 'acc_angel_celestial_wings',
    name: 'Đôi Cánh Thiên Thần Phát Sáng (Celestial Angel Wings)',
    description: 'Cặp cánh thiên thần đa tầng lông vũ trắng tuyết viền vàng kim rực rỡ.',
    slot: 'ACCESSORY',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_angel_celestial_wings.glb',
    thumbnailUrl: '/thumbnails/3d/acc_angel_celestial_wings.webp',
    priceTokens: 800,
    levelRequired: 5,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1600,
    fileSizeBytes: 160000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'acc_devil_bat_wings',
    name: 'Đôi Cánh Ác Quỷ Dạ Tối (Shadow Demon Wings)',
    description: 'Cặp cánh dơi hắc ám huyền bí phát sáng sắc đỏ tím bóng đêm.',
    slot: 'ACCESSORY',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_devil_bat_wings.glb',
    thumbnailUrl: '/thumbnails/3d/acc_devil_bat_wings.webp',
    priceTokens: 750,
    levelRequired: 4,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1500,
    fileSizeBytes: 150000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'acc_fairy_butterfly_wings',
    name: 'Đôi Cánh Bướm Tiên Neon (Ethereal Fairy Wings)',
    description: 'Cặp cánh bướm tiên đa diện mờ sương xanh ngọc phát quang bồng bềnh.',
    slot: 'ACCESSORY',
    rarity: 'EPIC',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_fairy_butterfly_wings.glb',
    thumbnailUrl: '/thumbnails/3d/acc_fairy_butterfly_wings.webp',
    priceTokens: 650,
    levelRequired: 3,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1400,
    fileSizeBytes: 140000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'acc_phoenix_fire_wings',
    name: 'Đôi Cánh Phượng Hoàng Lửa (Blazing Phoenix Wings)',
    description: 'Đôi cánh phượng hoàng rực cháy tàn lửa thiêu đốt đối thủ.',
    slot: 'ACCESSORY',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_phoenix_fire_wings.glb',
    thumbnailUrl: '/thumbnails/3d/acc_phoenix_fire_wings.webp',
    priceTokens: 900,
    levelRequired: 6,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1800,
    fileSizeBytes: 180000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'acc_cyber_photon_wings',
    name: 'Đôi Cánh Cơ Giáp Năng Lượng (Mecha Plasma Wings)',
    description: 'Cặp cánh laser ion xanh lơ đập cánh theo nhịp thở tương lai.',
    slot: 'ACCESSORY',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_cyber_photon_wings.glb',
    thumbnailUrl: '/thumbnails/3d/acc_cyber_photon_wings.webp',
    priceTokens: 850,
    levelRequired: 6,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1500,
    fileSizeBytes: 150000,
    isActive: true,
    isOwned: false,
  },
];

const DEFAULT_EQUIPPED: UserAvatar3DConfig = {
  userId: 'local-user',
  baseBodyId: 'body_stickman_black',
  hairId: 'face_chad_smirk',
  topId: 'prop_champion_trophy',
  bottomId: '',
  shoesId: '',
  accessoryId: 'acc_wings_demon_dark',
  activeAnimation: 'IDLE',
  updatedAt: new Date().toISOString(),
  hiddenSlots: [],
  maskedBodyParts: [],
};

interface Avatar3DStoreState {
  equipped: UserAvatar3DConfig;
  previewEquipped: UserAvatar3DConfig;
  previewingItem: AvatarItem3D | null;
  activeAnimation: AnimationState3D;
  accentColor: string;
  viewMode3D: 'IDLE' | 'RUN' | 'HOLD_ITEM';
  catalog: AvatarItem3D[];
  presets: AvatarPreset3D[];
  activePresetIndex: number;
  manifest: Manifest3D | null;
  userTokenBalance: number;
  isLoading: boolean;
  error: string | null;
  cameraView: 'front' | 'left' | 'right' | 'back';
  autoRotate: boolean;
  selectedCategory: Slot3D | 'ALL';
  selectedRarity: string;
  activeGender: 'FEMALE' | 'MALE' | 'DUO';
  activeCharacter: ActiveCharacterData | null;
  matchingSets: MatchingOutfitSet[];

  // Actions
  setAccentColor: (color: string) => void;
  setViewMode3D: (mode: 'IDLE' | 'RUN' | 'HOLD_ITEM') => void;
  fetchActiveCharacter: () => Promise<void>;
  switchCharacter: (gender: 'FEMALE' | 'MALE' | 'DUO') => Promise<boolean>;
  fetchMatchingSets: () => Promise<void>;
  previewMatchingSet: (set: MatchingOutfitSet) => void;
  purchaseMatchingSet: (setId: string) => Promise<PurchaseMatchingSetResponse | null>;
  fetchManifest: () => Promise<void>;
  fetchEquipped: () => Promise<void>;
  fetchCatalog: (slot?: Slot3D, rarity?: string, gender?: string) => Promise<void>;
  fetchPresets: () => Promise<void>;
  tryOnItem: (item: AvatarItem3D) => void;
  revertTryOn: () => void;
  equipItem: (slot: Slot3D, itemId: string) => Promise<boolean>;
  purchaseItem: (itemId: string) => Promise<boolean>;
  savePreset: (slot: number, name: string) => Promise<boolean>;
  applyPreset: (presetId: string) => Promise<boolean>;
  setAnimation: (anim: AnimationState3D) => void;
  triggerGamificationFeedback: (outcome: 'correct' | 'streak' | 'mistake' | 'victory' | 'defeat' | 'thinking') => void;
  setCameraView: (view: 'front' | 'left' | 'right' | 'back') => void;
  toggleAutoRotate: () => void;
  setSelectedCategory: (cat: Slot3D | 'ALL') => void;
  setSelectedRarity: (rarity: string) => void;
}

export const useAvatar3DStore = create<Avatar3DStoreState>((set, get) => {
  let animTimer: number | null = null;

  return {
    equipped: DEFAULT_EQUIPPED,
    previewEquipped: DEFAULT_EQUIPPED,
    previewingItem: null,
    activeAnimation: 'IDLE',
    accentColor: '#00f2fe',
    viewMode3D: 'IDLE',
    catalog: FALLBACK_3D_ITEMS,
    presets: [],
    activePresetIndex: 1,
    manifest: null,
    userTokenBalance: 1200,
    isLoading: false,
    error: null,
    cameraView: 'front',
    autoRotate: true,
    selectedCategory: 'ALL',
    selectedRarity: 'ALL',
    activeGender: 'FEMALE',
    activeCharacter: null,
    matchingSets: [],

    setAccentColor: (color: string) => set({ accentColor: color }),
    setViewMode3D: (mode: 'IDLE' | 'RUN' | 'HOLD_ITEM') => set({ viewMode3D: mode, activeAnimation: mode }),

    fetchActiveCharacter: async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/characters/active`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data: ActiveCharacterData = await res.json();
          set({
            activeCharacter: data,
            activeGender: data.activeGender,
            equipped: data.equippedConfig,
            previewEquipped: data.equippedConfig,
          });
          return;
        }
      } catch (err) {
        console.warn('[Avatar3D] Fetch active character fallback:', err);
      }
    },

    switchCharacter: async (gender: 'FEMALE' | 'MALE' | 'DUO') => {
      set({ isLoading: true });
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/characters/switch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ gender }),
        });
        if (res.ok) {
          const data: ActiveCharacterData = await res.json();
          set({
            activeCharacter: data,
            activeGender: data.activeGender,
            equipped: data.equippedConfig,
            previewEquipped: data.equippedConfig,
            previewingItem: null,
            isLoading: false,
          });
          // Refresh catalog for new character
          await get().fetchCatalog(undefined, undefined, gender === 'DUO' ? undefined : gender);
          return true;
        }
      } catch (err) {
        console.warn('[Avatar3D] Switch character fallback:', err);
      }

      // Local fallback for switch
      set((s) => ({
        activeGender: gender,
        previewEquipped: {
          ...s.previewEquipped,
          activeGender: gender,
          baseBodyId: gender === 'MALE' ? 'body_chibi_male_ren' : 'body_chibi_female_aoi',
        },
        isLoading: false,
      }));
      return true;
    },

    fetchMatchingSets: async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/shop/matching-sets`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          set({ matchingSets: data });
          return;
        }
      } catch (err) {
        console.warn('[Avatar3D] Fetch matching sets fallback:', err);
      }
    },

    previewMatchingSet: (setInfo: MatchingOutfitSet) => {
      set((s) => ({
        previewingItem: null,
        previewEquipped: {
          ...s.previewEquipped,
          baseBodyId: setInfo.baseBodyId || s.previewEquipped.baseBodyId,
          hairId: setInfo.hairId || s.previewEquipped.hairId,
          topId: setInfo.topId || s.previewEquipped.topId,
          accessoryId: setInfo.accessoryId || s.previewEquipped.accessoryId,
        },
      }));
    },

    purchaseMatchingSet: async (setId: string) => {
      set({ isLoading: true });
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/shop/matching-sets/${setId}/purchase-duo`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data: PurchaseMatchingSetResponse = await res.json();
          set((s) => ({
            userTokenBalance: data.newBalance,
            matchingSets: s.matchingSets.map((m) =>
              m.id === setId ? { ...m, isOwned: true } : m
            ),
            catalog: s.catalog.map((c) =>
              data.unlockedItemIds.includes(c.id) ? { ...c, isOwned: true } : c
            ),
            isLoading: false,
            activeAnimation: 'VICTORY',
          }));
          return data;
        }
      } catch (err) {
        console.warn('[Avatar3D] Purchase matching set fallback:', err);
      }

      // Offline / Local fallback:
      const matchedSet = MATCHING_DUO_SETS.find((m) => m.id === setId);
      if (matchedSet) {
        const itemIds = [matchedSet.baseBodyId, matchedSet.hairId, matchedSet.topId, matchedSet.accessoryId].filter(Boolean) as string[];
        const newBalance = Math.max(0, get().userTokenBalance - matchedSet.tokenPriceTotal);
        set((s) => {
          const newEquipped = {
            ...s.equipped,
            baseBodyId: matchedSet.baseBodyId || s.equipped.baseBodyId,
            hairId: matchedSet.hairId || s.equipped.hairId,
            topId: matchedSet.topId || s.equipped.topId,
            accessoryId: matchedSet.accessoryId || s.equipped.accessoryId,
          };
          return {
            userTokenBalance: newBalance,
            isLoading: false,
            activeAnimation: 'VICTORY',
            equipped: newEquipped,
            previewEquipped: newEquipped,
            previewingItem: null,
            matchingSets: s.matchingSets.map((m) => (m.id === setId ? { ...m, isOwned: true } : m)),
            catalog: s.catalog.map((c) => (itemIds.includes(c.id) ? { ...c, isOwned: true } : c)),
          };
        });
        return {
          success: true,
          setId,
          matchingSet: matchedSet,
          unlockedItemIds: itemIds,
          newBalance,
          message: `Mua thành công trọn bộ '${matchedSet.name}'!`,
        };
      }

      set({ isLoading: false });
      return null;
    },

    fetchManifest: async () => {
      try {
        const res = await fetch(`${API_BASE}/avatar-3d/manifest`);
        if (res.ok) {
          const data = await res.json();
          set({ manifest: data });
        }
      } catch (err) {
        console.warn('[Avatar3D] Using fallback manifest:', err);
      }
    },

    fetchEquipped: async () => {
      set({ isLoading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/avatar-3d/equipped`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data: UserAvatar3DConfig = await res.json();
          set({
            equipped: data,
            previewEquipped: data,
            previewingItem: null,
            isLoading: false,
          });
          return;
        }
      } catch (err) {
        console.warn('[Avatar3D] Fetch equipped fallback to default:', err);
      }
      set({ isLoading: false });
    },

    fetchCatalog: async (slot?: Slot3D, rarity?: string, gender?: string) => {
      set({ isLoading: true });
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (slot && slot !== 'BASE_BODY') params.append('slot', slot);
        if (rarity && rarity !== 'ALL') params.append('rarity', rarity);
        if (gender && gender !== 'DUO') params.append('gender', gender);

        const res = await fetch(`${API_BASE}/shop/3d-items?${params.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          set({
            catalog: data.items || FALLBACK_3D_ITEMS,
            userTokenBalance: data.userTokenBalance ?? get().userTokenBalance,
            isLoading: false,
          });
          return;
        }
      } catch (err) {
        console.warn('[Avatar3D] Catalog using fallback items:', err);
      }
      set({ catalog: FALLBACK_3D_ITEMS, isLoading: false });
    },

    fetchPresets: async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/avatar-3d/presets`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          set({ presets: data });
        }
      } catch (err) {
        console.warn('[Avatar3D] Presets load fallback:', err);
      }
    },

    tryOnItem: (item: AvatarItem3D) => {
      const current = get().previewEquipped;
      const next: UserAvatar3DConfig = { ...current };

      switch (item.slot) {
        case 'BASE_BODY':
          next.baseBodyId = item.id;
          break;
        case 'HAIR':
          next.hairId = item.id;
          break;
        case 'TOP':
          next.topId = item.id;
          break;
        case 'BOTTOM':
          next.bottomId = item.id;
          break;
        case 'SHOES':
          next.shoesId = item.id;
          break;
        case 'ACCESSORY':
          next.accessoryId = item.id;
          break;
      }

      // Compute dynamic culling and masking
      const hiddenSlots = new Set<string>();
      const maskedParts = new Set<string>();
      const catalog = get().catalog;

      const activeItemIds = [next.baseBodyId, next.hairId, next.topId, next.bottomId, next.shoesId, next.accessoryId];
      activeItemIds.forEach((id) => {
        if (!id) return;
        const it = catalog.find((c) => c.id === id);
        if (it) {
          it.hideSlotsWhenEquipped?.forEach((s) => hiddenSlots.add(s));
          it.maskedBodyParts?.forEach((m) => maskedParts.add(m));
        }
      });

      next.hiddenSlots = Array.from(hiddenSlots);
      next.maskedBodyParts = Array.from(maskedParts);

      set({
        previewEquipped: next,
        previewingItem: item,
        activeAnimation: 'TRYON',
      });

      if (animTimer) clearTimeout(animTimer);
      animTimer = window.setTimeout(() => {
        set({ activeAnimation: 'IDLE' });
      }, 1500);
    },

    revertTryOn: () => {
      set({
        previewEquipped: get().equipped,
        previewingItem: null,
        activeAnimation: 'IDLE',
      });
    },

    equipItem: async (slot: Slot3D, itemId: string) => {
      set({ isLoading: true });
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/avatar-3d/equip`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ slot, itemId }),
        });

        if (res.ok) {
          const result = await res.json();
          set({
            equipped: result.data,
            previewEquipped: result.data,
            previewingItem: null,
            isLoading: false,
          });
          return true;
        }
      } catch (err) {
        console.warn('[Avatar3D] Equip local fallback:', err);
      }

      // Fallback local update
      const current = { ...get().previewEquipped };
      set({
        equipped: current,
        previewingItem: null,
        isLoading: false,
      });
      return true;
    },

    purchaseItem: async (itemId: string) => {
      set({ isLoading: true });
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/shop/3d-items/${itemId}/purchase`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const result = await res.json();
          // Update catalog item ownership
          const updatedCatalog = get().catalog.map((i) =>
            i.id === itemId ? { ...i, isOwned: true } : i
          );

          set({
            catalog: updatedCatalog,
            equipped: result.equippedConfig,
            previewEquipped: result.equippedConfig,
            previewingItem: null,
            userTokenBalance: result.newBalance,
            activeAnimation: 'VICTORY',
            isLoading: false,
          });

          if (animTimer) clearTimeout(animTimer);
          animTimer = window.setTimeout(() => {
            set({ activeAnimation: 'IDLE' });
          }, 2500);

          return true;
        }
      } catch (err) {
        console.warn('[Avatar3D] Purchase fallback:', err);
      }

      // Local purchase simulation
      const item = get().catalog.find((i) => i.id === itemId);
      if (item && get().userTokenBalance >= item.priceTokens) {
        const newBalance = get().userTokenBalance - item.priceTokens;
        const updatedCatalog = get().catalog.map((i) =>
          i.id === itemId ? { ...i, isOwned: true } : i
        );
        const next = { ...get().previewEquipped };
        set({
          catalog: updatedCatalog,
          equipped: next,
          previewEquipped: next,
          previewingItem: null,
          userTokenBalance: newBalance,
          activeAnimation: 'VICTORY',
          isLoading: false,
        });

        if (animTimer) clearTimeout(animTimer);
        animTimer = window.setTimeout(() => {
          set({ activeAnimation: 'IDLE' });
        }, 2500);

        return true;
      }

      set({ isLoading: false });
      return false;
    },

    savePreset: async (slot: number, name: string) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/avatar-3d/presets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            presetSlot: slot,
            presetName: name,
            config: get().previewEquipped,
          }),
        });

        if (res.ok) {
          await get().fetchPresets();
          return true;
        }
      } catch (err) {
        console.warn('[Avatar3D] Save preset fallback:', err);
      }

      // Local preset save
      const presets = [...get().presets];
      const existingIdx = presets.findIndex((p) => p.presetSlot === slot);
      const newPreset: AvatarPreset3D = {
        id: `preset-${slot}`,
        userId: 'local-user',
        presetSlot: slot,
        presetName: name || `Bộ Trang Phục ${slot}`,
        config: get().previewEquipped,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (existingIdx >= 0) {
        presets[existingIdx] = newPreset;
      } else {
        presets.push(newPreset);
      }
      set({ presets });
      return true;
    },

    applyPreset: async (presetId: string) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/avatar-3d/presets/${presetId}/apply`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const updated = await res.json();
          set({
            equipped: updated,
            previewEquipped: updated,
            previewingItem: null,
            activeAnimation: 'TRYON',
          });
          return true;
        }
      } catch (err) {
        console.warn('[Avatar3D] Apply preset fallback:', err);
      }

      const preset = get().presets.find((p) => p.id === presetId);
      if (preset && preset.config) {
        const next: UserAvatar3DConfig = {
          ...get().equipped,
          ...preset.config,
        };
        set({
          equipped: next,
          previewEquipped: next,
          previewingItem: null,
          activeAnimation: 'TRYON',
        });
        return true;
      }
      return false;
    },

    setAnimation: (anim: AnimationState3D) => {
      set({ activeAnimation: anim });
    },

    triggerGamificationFeedback: (outcome) => {
      let anim: AnimationState3D = 'IDLE';
      let duration = 1800;

      switch (outcome) {
        case 'correct':
          anim = 'CORRECT';
          duration = 1500;
          break;
        case 'streak':
          anim = 'STREAK';
          duration = 2000;
          break;
        case 'mistake':
          anim = 'CONFUSED';
          duration = 1800;
          break;
        case 'victory':
          anim = 'VICTORY';
          duration = 2500;
          break;
        case 'defeat':
          anim = 'DEFEAT';
          duration = 2200;
          break;
        case 'thinking':
          anim = 'THINKING';
          duration = 3000;
          break;
      }

      set({ activeAnimation: anim });

      if (animTimer) clearTimeout(animTimer);
      animTimer = window.setTimeout(() => {
        set({ activeAnimation: 'IDLE' });
      }, duration);
    },

    setCameraView: (view) => {
      set({ cameraView: view, autoRotate: false });
    },

    toggleAutoRotate: () => {
      set((s) => ({ autoRotate: !s.autoRotate }));
    },

    setSelectedCategory: (cat) => set({ selectedCategory: cat }),
    setSelectedRarity: (rarity) => set({ selectedRarity: rarity }),
  };
});
