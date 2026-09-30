import { create } from 'zustand';
import {
  AvatarItem3D,
  UserAvatar3DConfig,
  AvatarPreset3D,
  Manifest3D,
  Slot3D,
  AnimationState3D,
} from '../types/avatar3d';

const API_BASE = '/api/v1';

// Starter / Fallback data
export const FALLBACK_3D_ITEMS: AvatarItem3D[] = [
  // BASE_BODY
  {
    id: 'body_chibi_male_01',
    name: 'Thân Chibi Nam Tiêu Chuẩn (Standard Boy)',
    description: 'Khung cơ thể Chibi nam chuẩn SD tỷ lệ 2.8 đầu, phong cách Vinyl Toy bóng bẩy.',
    slot: 'BASE_BODY',
    rarity: 'COMMON',
    gender: 'MALE',
    modelUrl: '/models/3d/body_chibi_male_01.glb',
    thumbnailUrl: '/thumbnails/3d/body_chibi_male_01.webp',
    priceTokens: 0,
    levelRequired: 1,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 4200,
    fileSizeBytes: 450000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'body_chibi_female_01',
    name: 'Thân Chibi Nữ Tiêu Chuẩn (Standard Girl)',
    description: 'Khung cơ thể Chibi nữ chuẩn SD tỷ lệ 2.8 đầu, đường nét mềm mại dễ thương.',
    slot: 'BASE_BODY',
    rarity: 'COMMON',
    gender: 'FEMALE',
    modelUrl: '/models/3d/body_chibi_female_01.glb',
    thumbnailUrl: '/thumbnails/3d/body_chibi_female_01.webp',
    priceTokens: 0,
    levelRequired: 1,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 4100,
    fileSizeBytes: 440000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'body_chibi_mecha_01',
    name: 'Thân Chibi Cơ Giáp Cyber (Cyber Mecha)',
    description: 'Khung cơ thể bán cơ khí tương lai với đèn LED neon chạy dọc sống lưng.',
    slot: 'BASE_BODY',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/body_chibi_mecha_01.glb',
    thumbnailUrl: '/thumbnails/3d/body_chibi_mecha_01.webp',
    priceTokens: 1500,
    levelRequired: 10,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 4800,
    fileSizeBytes: 520000,
    isActive: true,
    isOwned: false,
  },

  // HAIR
  {
    id: 'hair_zingspeed_spiky_grey',
    name: 'Tóc Vuốt Nhọn Tốc Độ (Zing Racer Grey)',
    description: 'Mái tóc vuốt dựng phong trần xám khói điểm dải highlight vàng chanh.',
    slot: 'HAIR',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/hair_zingspeed_spiky_grey.glb',
    thumbnailUrl: '/thumbnails/3d/hair_zingspeed_spiky_grey.webp',
    priceTokens: 350,
    levelRequired: 2,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 2900,
    fileSizeBytes: 280000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'hair_zingspeed_pink_twintails',
    name: 'Tóc Hai Chùm Idol Kẹo Ngọt (Sweet Idol Twintails)',
    description: 'Mái tóc bồng bềnh hồng pastel buộc hai chùm dài kẹp ngôi sao lấp lánh.',
    slot: 'HAIR',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/hair_zingspeed_pink_twintails.glb',
    thumbnailUrl: '/thumbnails/3d/hair_zingspeed_pink_twintails.webp',
    priceTokens: 600,
    levelRequired: 3,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 3200,
    fileSizeBytes: 310000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'hair_cyber_neon_dreadlocks',
    name: 'Tóc Cyberpunk Dạ Quang (Neon Dreadlocks)',
    description: 'Búi tóc tết dreadlocks phát quang theo nhịp điệu âm nhạc điện tử.',
    slot: 'HAIR',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/hair_cyber_neon_dreadlocks.glb',
    thumbnailUrl: '/thumbnails/3d/hair_cyber_neon_dreadlocks.webp',
    priceTokens: 1200,
    levelRequired: 8,
    boneBindingRoot: 'Head',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 3400,
    fileSizeBytes: 330000,
    isActive: true,
    isOwned: false,
  },

  // TOP
  {
    id: 'top_zingspeed_black_hoodie',
    name: 'Áo Hoodie ZingSpeed Đen Tia Chớp (Speed Lightning Hoodie)',
    description: 'Hoodie đen thời trang đường phố in huy hiệu đôi cánh sấm sét ZingSpeed và sọc dạ quang neon.',
    slot: 'TOP',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/top_zingspeed_black_hoodie.glb',
    thumbnailUrl: '/thumbnails/3d/top_zingspeed_black_hoodie.webp',
    priceTokens: 450,
    levelRequired: 2,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: ['Slot_Neckwear'],
    maskedBodyParts: ['Mat_Torso'],
    polyCount: 3100,
    fileSizeBytes: 300000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'top_zingspeed_white_hoodie',
    name: 'Áo Hoodie Trắng Kem Sweetheart (Sweetheart Oversized Hoodie)',
    description: 'Hoodie trắng kem form rộng siêu dễ thương với logo cánh sấm sét xanh vàng.',
    slot: 'TOP',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/top_zingspeed_white_hoodie.glb',
    thumbnailUrl: '/thumbnails/3d/top_zingspeed_white_hoodie.webp',
    priceTokens: 550,
    levelRequired: 3,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: ['Mat_Torso'],
    polyCount: 3000,
    fileSizeBytes: 295000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'top_cyber_racing_jacket',
    name: 'Áo Jacket Đua Xe Cyber Giáp Quang (Neon Drift Jacket)',
    description: 'Jacket da kết hợp giáp vai sợi carbon với viền LED năng lượng đổi màu.',
    slot: 'TOP',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/top_cyber_racing_jacket.glb',
    thumbnailUrl: '/thumbnails/3d/top_cyber_racing_jacket.webp',
    priceTokens: 1400,
    levelRequired: 9,
    boneBindingRoot: 'Chest',
    hideSlotsWhenEquipped: ['Slot_Neckwear'],
    maskedBodyParts: ['Mat_Torso', 'Mat_Arms'],
    polyCount: 3400,
    fileSizeBytes: 340000,
    isActive: true,
    isOwned: false,
  },

  // BOTTOM
  {
    id: 'bot_zingspeed_cargo_shorts',
    name: 'Quần Short Thể Thao Dáng Rộng (Racer Cargo Shorts)',
    description: 'Quần short túi hộp đen hầm hố có dây đai neon vàng viền viền gối.',
    slot: 'BOTTOM',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/bot_zingspeed_cargo_shorts.glb',
    thumbnailUrl: '/thumbnails/3d/bot_zingspeed_cargo_shorts.webp',
    priceTokens: 300,
    levelRequired: 2,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 2200,
    fileSizeBytes: 210000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'bot_zingspeed_pleated_skirt',
    name: 'Váy Xếp Ly Navy Năng Động (Navy Pleated Skirt)',
    description: 'Chân váy chữ A tennis xếp ly viền trắng tôn dáng Chibi tinh nghịch.',
    slot: 'BOTTOM',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/bot_zingspeed_pleated_skirt.glb',
    thumbnailUrl: '/thumbnails/3d/bot_zingspeed_pleated_skirt.webp',
    priceTokens: 400,
    levelRequired: 3,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 2100,
    fileSizeBytes: 200000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'bot_cyber_neon_joggers',
    name: 'Quần Jogger Cyber Quang Phổ (Hologram Street Joggers)',
    description: 'Quần jogger chất liệu phản quang ba chiều đổi màu theo góc nhìn.',
    slot: 'BOTTOM',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/bot_cyber_neon_joggers.glb',
    thumbnailUrl: '/thumbnails/3d/bot_cyber_neon_joggers.webp',
    priceTokens: 1100,
    levelRequired: 7,
    boneBindingRoot: 'Hips',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 2400,
    fileSizeBytes: 230000,
    isActive: true,
    isOwned: false,
  },

  // SHOES
  {
    id: 'foot_zingspeed_combat_boots',
    name: 'Bốt Đua Cao Cổ Đen Chỉ Vàng (Speed Combat Boots)',
    description: 'Giày bốt da đen cao cổ đan dây gold nổi bật kết hợp tất vàng thể thao.',
    slot: 'SHOES',
    rarity: 'RARE',
    gender: 'MALE',
    modelUrl: '/models/3d/foot_zingspeed_combat_boots.glb',
    thumbnailUrl: '/thumbnails/3d/foot_zingspeed_combat_boots.webp',
    priceTokens: 280,
    levelRequired: 2,
    boneBindingRoot: 'LeftFoot',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: ['Mat_Feet'],
    polyCount: 1900,
    fileSizeBytes: 180000,
    isActive: true,
    isOwned: true,
  },
  {
    id: 'foot_zingspeed_pastel_sneakers',
    name: 'Sneaker Đế Bánh Mì Pastel (Sweet Pastel Platform)',
    description: 'Giày thể thao đế cao màu tím hồng pastel phối cùng tất trắng dài qua gối.',
    slot: 'SHOES',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/foot_zingspeed_pastel_sneakers.glb',
    thumbnailUrl: '/thumbnails/3d/foot_zingspeed_pastel_sneakers.webp',
    priceTokens: 380,
    levelRequired: 3,
    boneBindingRoot: 'LeftFoot',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: ['Mat_Feet'],
    polyCount: 1850,
    fileSizeBytes: 175000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'foot_cyber_maglev_skates',
    name: 'Giày Trượt Từ Tính Đệm Khí (Maglev Hover Boots)',
    description: 'Đôi giày bay từ tính phát ra tia ion xanh lơ mỗi khi di chuyển.',
    slot: 'SHOES',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/foot_cyber_maglev_skates.glb',
    thumbnailUrl: '/thumbnails/3d/foot_cyber_maglev_skates.webp',
    priceTokens: 1250,
    levelRequired: 8,
    boneBindingRoot: 'LeftFoot',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: ['Mat_Feet'],
    polyCount: 2000,
    fileSizeBytes: 190000,
    isActive: true,
    isOwned: false,
  },

  // ACCESSORY
  {
    id: 'acc_cat_paw_sling_bag',
    name: 'Túi Đeo Chéo Chân Mèo Neko (Neko Paw Crossbody Bag)',
    description: 'Túi đeo chéo hình chân mèo 3D đệm hồng phấn siêu dễ thương.',
    slot: 'ACCESSORY',
    rarity: 'EPIC',
    gender: 'FEMALE',
    modelUrl: '/models/3d/acc_cat_paw_sling_bag.glb',
    thumbnailUrl: '/thumbnails/3d/acc_cat_paw_sling_bag.webp',
    priceTokens: 420,
    levelRequired: 2,
    boneBindingRoot: 'Spine',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 1400,
    fileSizeBytes: 135000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'acc_star_choker',
    name: 'Vòng Choker Da Ngôi Sao (Golden Star Choker)',
    description: 'Vòng cổ da đen đính ngôi sao vàng gold cá tính đậm chất tay đua Zing.',
    slot: 'ACCESSORY',
    rarity: 'RARE',
    gender: 'FEMALE',
    modelUrl: '/models/3d/acc_star_choker.glb',
    thumbnailUrl: '/thumbnails/3d/acc_star_choker.webp',
    priceTokens: 200,
    levelRequired: 1,
    boneBindingRoot: 'Neck',
    hideSlotsWhenEquipped: [],
    maskedBodyParts: [],
    polyCount: 800,
    fileSizeBytes: 80000,
    isActive: true,
    isOwned: false,
  },
  {
    id: 'acc_cyber_photon_wings',
    name: 'Đôi Cánh Năng Lượng Photon 3D (Photon Energy Wings)',
    description: 'Cặp cánh photon đa diện tỏa sáng rực rỡ và đập cánh theo nhịp thở.',
    slot: 'ACCESSORY',
    rarity: 'LEGENDARY',
    gender: 'UNISEX',
    modelUrl: '/models/3d/acc_cyber_photon_wings.glb',
    thumbnailUrl: '/thumbnails/3d/acc_cyber_photon_wings.webp',
    priceTokens: 2000,
    levelRequired: 12,
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
  baseBodyId: 'body_chibi_male_01',
  hairId: 'hair_zingspeed_spiky_grey',
  topId: 'top_zingspeed_black_hoodie',
  bottomId: 'bot_zingspeed_cargo_shorts',
  shoesId: 'foot_zingspeed_combat_boots',
  accessoryId: null,
  activeAnimation: 'IDLE',
  updatedAt: new Date().toISOString(),
  hiddenSlots: ['Slot_Neckwear'],
  maskedBodyParts: ['Mat_Torso', 'Mat_Feet'],
};

interface Avatar3DStoreState {
  equipped: UserAvatar3DConfig;
  previewEquipped: UserAvatar3DConfig;
  previewingItem: AvatarItem3D | null;
  activeAnimation: AnimationState3D;
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

  // Actions
  fetchManifest: () => Promise<void>;
  fetchEquipped: () => Promise<void>;
  fetchCatalog: (slot?: Slot3D, rarity?: string) => Promise<void>;
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

    fetchCatalog: async (slot?: Slot3D, rarity?: string) => {
      set({ isLoading: true });
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (slot && slot !== 'BASE_BODY') params.append('slot', slot);
        if (rarity && rarity !== 'ALL') params.append('rarity', rarity);

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
