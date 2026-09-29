import { create } from 'zustand';
import { ShopItemDto, PurchaseResultDto, PurchaseBundleResultDto } from '../types/avatarAndShop';
import { avatarShopService } from './avatarShopService';
import { useAvatarStore } from './useAvatarStore';

export const FALLBACK_SHOP_ITEMS: ShopItemDto[] = [
  // Wings Category (Item dạng cánh)
  {
    id: 'wings_angel_celestial',
    itemCode: 'wings_angel_celestial',
    nameEn: 'Celestial Seraph Wings',
    nameVi: 'Đôi Cánh Thiên Thần Tri Thức',
    description: 'Đôi cánh lông vũ vàng kim phát quang rực rỡ, nâng bước học giả vượt ngưỡng giới hạn.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'legendary',
    tokenPrice: 2800,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_angel_celestial.svg',
    zIndex: 5
  },
  {
    id: 'wings_cyber_neon',
    itemCode: 'wings_cyber_neon',
    nameEn: 'Cyber Neon Mech Wings',
    nameVi: 'Đôi Cánh Cơ Khí Cyber Neon',
    description: 'Cánh năng lượng photon phát sáng xanh tím neon chuyển động nhịp nhàng theo hơi thở.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'epic',
    tokenPrice: 1600,
    requiredLevel: 10,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_cyber_neon.svg',
    zIndex: 5
  },
  {
    id: 'wings_phoenix_flame',
    itemCode: 'wings_phoenix_flame',
    nameEn: 'Blazing Phoenix Wings',
    nameVi: 'Đôi Cánh Phượng Hoàng Lửa',
    description: 'Đôi cánh rực lửa thần thoại tỏa tàn tro vàng óng ánh cho người học chăm chỉ nhất.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'legendary',
    tokenPrice: 3500,
    requiredLevel: 25,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_phoenix_flame.svg',
    zIndex: 5
  },

  // Tops
  {
    id: 'top_oxford_blazer',
    itemCode: 'top_oxford_blazer',
    nameEn: 'Oxford Scholar Blazer',
    nameVi: 'Áo Vest Học Giả Oxford',
    description: 'Huy hiệu ngực vàng thêu tinh xảo phong cách quý tộc.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'rare',
    tokenPrice: 450,
    requiredLevel: 5,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/oxford_blazer.svg',
    zIndex: 60
  },
  {
    id: 'top_cyber_hoodie',
    itemCode: 'top_cyber_hoodie',
    nameEn: 'Cyber Neon Hoodie',
    nameVi: 'Áo Hoodie Neon Tương Lai',
    description: 'Dải đèn LED dạ quang chạy dọc tay áo phát sáng trong bóng tối.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'epic',
    tokenPrice: 950,
    requiredLevel: 10,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/cyber_hoodie.svg',
    zIndex: 60
  },
  {
    id: 'top_wizard_robe',
    itemCode: 'top_wizard_robe',
    nameEn: 'Archmage Lexicon Robe',
    nameVi: 'Áo Choàng Đại Pháp Sư Từ Vựng',
    description: 'Cổ áo thêu chòm sao phát sáng huyền ảo của hội phù thủy ngôn từ.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'legendary',
    tokenPrice: 3200,
    requiredLevel: 25,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/wizard_robe.svg',
    zIndex: 60
  },
  {
    id: 'top_scholastic_hoodie',
    itemCode: 'top_scholastic_hoodie',
    nameEn: 'Scholastic Comfort Hoodie',
    nameVi: 'Áo Hoodie Học Giả Trẻ',
    description: 'Áo hoodie nỉ bông ấm áp thoải mái luyện tập cả ngày.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'common',
    tokenPrice: 180,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/scholastic_hoodie.svg',
    zIndex: 60
  },
  {
    id: 'top_cyber_jacket',
    itemCode: 'top_cyber_jacket',
    nameEn: 'Cyberpunk Street Bomber',
    nameVi: 'Áo Khoác Bomber Cyber',
    description: 'Áo khoác bomber phối màu tím neon phong cách tương lai.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'rare',
    tokenPrice: 480,
    requiredLevel: 6,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/cyber_jacket.svg',
    zIndex: 60
  },

  // Bottoms
  {
    id: 'bot_pleated_skirt',
    itemCode: 'bot_pleated_skirt',
    nameEn: 'Academic Pleated Skirt',
    nameVi: 'Váy Xếp Ly Đồng Phục',
    description: 'Chân váy xếp ly trang nhã học đường chuẩn phong cách quý tộc.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'common',
    tokenPrice: 180,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/pleated_skirt.svg',
    zIndex: 50
  },
  {
    id: 'bot_cargo_joggers',
    itemCode: 'bot_cargo_joggers',
    nameEn: 'Urban Cargo Joggers',
    nameVi: 'Quần Túi Hộp Chiến Thuật',
    description: 'Túi hộp đai khóa phong cách Streetwear cực chất.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'rare',
    tokenPrice: 350,
    requiredLevel: 4,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/cargo_joggers.svg',
    zIndex: 50
  },
  {
    id: 'bot_wizard_skirt',
    itemCode: 'bot_wizard_skirt',
    nameEn: 'Runic Mage Trousers',
    nameVi: 'Quần Pháp Sư Thêu Chỉ Vàng',
    description: 'Họa tiết chữ Runes phát sáng viền gấu huyền bí.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'epic',
    tokenPrice: 850,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/wizard_skirt.svg',
    zIndex: 50
  },
  {
    id: 'bot_classic_chinos',
    itemCode: 'bot_classic_chinos',
    nameEn: 'Classic Khaki Chinos',
    nameVi: 'Quần Kaki Chinos Lịch Sự',
    description: 'Quần kaki màu cát trang nhã cho học viên chăm chỉ.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'common',
    tokenPrice: 160,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/classic_chinos.svg',
    zIndex: 50
  },

  // Footwear
  {
    id: 'foot_leather_oxford',
    itemCode: 'foot_leather_oxford',
    nameEn: 'Polished Oxford Shoes',
    nameVi: 'Giày Da Oxford Bóng Bẩy',
    description: 'Ánh sáng bóng loáng phản chiếu đẳng cấp học giả.',
    category: 'footwear',
    layerSlot: 'footwear',
    rarityTier: 'rare',
    tokenPrice: 320,
    requiredLevel: 3,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/footwear/leather_oxford.svg',
    zIndex: 40
  },
  {
    id: 'foot_cyber_kicks',
    itemCode: 'foot_cyber_kicks',
    nameEn: 'Neon Air Striders',
    nameVi: 'Giày Thể Thao Đệm Khí Neon',
    description: 'Đế giày nhấp nháy ánh sáng tím Neon cực kỳ bắt mắt.',
    category: 'footwear',
    layerSlot: 'footwear',
    rarityTier: 'epic',
    tokenPrice: 900,
    requiredLevel: 12,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/footwear/cyber_kicks.svg',
    zIndex: 40
  },
  {
    id: 'foot_hermes_boots',
    itemCode: 'foot_hermes_boots',
    nameEn: 'Hermes Winged Boots',
    nameVi: 'Bốt Thần Gió Có Cánh',
    description: 'Đôi cánh vàng nhỏ vẫy nhẹ ở gót chân thần tốc.',
    category: 'footwear',
    layerSlot: 'footwear',
    rarityTier: 'legendary',
    tokenPrice: 2500,
    requiredLevel: 20,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/footwear/hermes_boots.svg',
    zIndex: 40
  },

  // Headwear
  {
    id: 'head_graduation_cap',
    itemCode: 'head_graduation_cap',
    nameEn: 'Valedictorian Mortarboard',
    nameVi: 'Mũ Cử Nhân Tri Thức',
    description: 'Dải tua rua vàng lay nhẹ trong gió chứng nhận thủ khoa.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 500,
    requiredLevel: 8,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/graduation_cap.svg',
    zIndex: 90
  },
  {
    id: 'head_cyber_headphones',
    itemCode: 'head_cyber_headphones',
    nameEn: 'Cyber Cat Headphones',
    nameVi: 'Tai Nghe Chụp Tai Gaming LED',
    description: 'Vành tai mèo phát sáng đổi 7 màu sống động.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'epic',
    tokenPrice: 1200,
    requiredLevel: 14,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/cyber_headphones.svg',
    zIndex: 90
  },
  {
    id: 'head_olympus_crown',
    itemCode: 'head_olympus_crown',
    nameEn: 'Golden Laurels of Olympus',
    nameVi: 'Vòng Nguyệt Quế Vàng Olympus',
    description: 'Lá vàng óng ánh tỏa bụi sáng lấp lánh vinh danh nhà vô địch.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'legendary',
    tokenPrice: 4000,
    requiredLevel: 30,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/olympus_crown.svg',
    zIndex: 90
  },
  {
    id: 'head_beret_paris',
    itemCode: 'head_beret_paris',
    nameEn: 'Parisian Artist Beret',
    nameVi: 'Mũ Nồi Nghệ Sĩ Paris',
    description: 'Mũ beret nỉ đỏ phong cách quý phái lãng mạn.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 360,
    requiredLevel: 4,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/beret_paris.svg',
    zIndex: 90
  },

  // Eyewear
  {
    id: 'eye_smart_glasses',
    itemCode: 'eye_smart_glasses',
    nameEn: 'Scholastic Wireframe Glasses',
    nameVi: 'Kính Cận Trí Thức Mạ Vàng',
    description: 'Tròng kính phản chiếu ánh sáng thông tuệ của học giả chăm chỉ.',
    category: 'eyewear',
    layerSlot: 'eyewear',
    rarityTier: 'common',
    tokenPrice: 220,
    requiredLevel: 2,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/eyewear/smart_glasses.svg',
    zIndex: 95
  },
  {
    id: 'eye_vr_visor',
    itemCode: 'eye_vr_visor',
    nameEn: 'Cyber Tactical Visor',
    nameVi: 'Kính Thực Tế Ảo Cyber',
    description: 'Màn hình hiển thị dữ liệu số HUD quét liên tục.',
    category: 'eyewear',
    layerSlot: 'eyewear',
    rarityTier: 'epic',
    tokenPrice: 1050,
    requiredLevel: 16,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/eyewear/vr_visor.svg',
    zIndex: 95
  },
  {
    id: 'eye_aviator_shades',
    itemCode: 'eye_aviator_shades',
    nameEn: 'Cool Aviator Sunglasses',
    nameVi: 'Kính Râm Phi Công Cực Ngầu',
    description: 'Gọng mạ bạc bóng bẩy chống tia cực tím từ vựng.',
    category: 'eyewear',
    layerSlot: 'eyewear',
    rarityTier: 'rare',
    tokenPrice: 380,
    requiredLevel: 5,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/eyewear/aviator_shades.svg',
    zIndex: 95
  },

  // Handheld
  {
    id: 'hand_magic_tome',
    itemCode: 'hand_magic_tome',
    nameEn: 'Grimoire of Ancient Grammar',
    nameVi: 'Sách Cổ Ngữ Pháp Cấm Thuật',
    description: 'Sách bay lơ lửng bên tay tự động lật trang ghi chép từ vựng cổ.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'legendary',
    tokenPrice: 3500,
    requiredLevel: 25,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/magic_tome.svg',
    zIndex: 100
  },
  {
    id: 'hand_golden_mic',
    itemCode: 'hand_golden_mic',
    nameEn: 'Golden Voice Champion Mic',
    nameVi: 'Micro Mạ Vàng Thần Thoại',
    description: 'Sóng âm nhạc nốt vàng tỏa ra xung quanh nâng tầm giọng nói.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'epic',
    tokenPrice: 1500,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/golden_mic.svg',
    zIndex: 100
  },
  {
    id: 'hand_quill_pen',
    itemCode: 'hand_quill_pen',
    nameEn: 'Scholar Golden Quill',
    nameVi: 'Bút Lông Vũ Cổ Điển',
    description: 'Bút lông ngỗng vàng ngòi kim sa viết nên bài luận hoàn hảo.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'rare',
    tokenPrice: 450,
    requiredLevel: 7,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/quill_pen.svg',
    zIndex: 100
  },

  // Aura & Pedestal
  {
    id: 'aura_floating_books',
    itemCode: 'aura_floating_books',
    nameEn: 'Orbiting Lexicon Runes',
    nameVi: 'Vòng Xoáy Sách Tri Thức',
    description: '4 quyển từ điển thu nhỏ bay xoay quanh người tiếp thêm cảm hứng.',
    category: 'aura_background',
    layerSlot: 'pedestal_aura',
    rarityTier: 'epic',
    tokenPrice: 1600,
    requiredLevel: 18,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/aura/floating_books.svg',
    zIndex: 0
  },
  {
    id: 'aura_golden_triumph',
    itemCode: 'aura_golden_triumph',
    nameEn: 'Aura of Victorious Flames',
    nameVi: 'Hào Quang Lửa Vàng Vinh Quang',
    description: 'Lửa thần vàng rực bốc lên từ bục chân tôn vinh sự kiên trì.',
    category: 'aura_background',
    layerSlot: 'pedestal_aura',
    rarityTier: 'legendary',
    tokenPrice: 4500,
    requiredLevel: 35,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/aura/golden_triumph.svg',
    zIndex: 0
  },

  // Consumables
  {
    id: 'boost_streak_freeze',
    itemCode: 'boost_streak_freeze',
    nameEn: 'Streak Freeze Shield',
    nameVi: 'Băng Bảo Vệ Chuỗi Ngày Học',
    description: 'Tự động bảo lưu Streak nếu quên học 1 ngày.',
    category: 'consumable',
    layerSlot: 'consumable',
    rarityTier: 'rare',
    tokenPrice: 200,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/streak_freeze.svg',
    zIndex: 0
  },
  {
    id: 'boost_double_xp',
    itemCode: 'boost_double_xp',
    nameEn: '2-Hour Double XP Potion',
    nameVi: 'Bình Nhân Đôi XP 2 Giờ',
    description: 'Gấp đôi kinh nghiệm nhận được từ tất cả mini-game trong 2 giờ.',
    category: 'consumable',
    layerSlot: 'consumable',
    rarityTier: 'rare',
    tokenPrice: 250,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/potion_xp.svg',
    zIndex: 0
  }
];

interface ShopState {
  catalog: ShopItemDto[];
  total: number;
  category: string;
  rarity: string;
  search: string;
  loading: boolean;
  error: string | null;
  // Key is layerSlot, value is ShopItemDto
  tryingOnItems: Record<string, ShopItemDto>;

  fetchCatalog: () => Promise<void>;
  setCategory: (cat: string) => void;
  setRarity: (r: string) => void;
  setSearch: (s: string) => void;
  tryOnItem: (item: ShopItemDto) => void;
  removeTryOn: (slot: string) => void;
  clearTryOn: () => void;
  purchaseItem: (itemCode: string, autoEquip?: boolean) => Promise<PurchaseResultDto | null>;
  purchaseTryOnBundle: (autoEquip?: boolean) => Promise<PurchaseBundleResultDto | null>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  catalog: FALLBACK_SHOP_ITEMS,
  total: FALLBACK_SHOP_ITEMS.length,
  category: 'all',
  rarity: 'all',
  search: '',
  loading: false,
  error: null,
  tryingOnItems: {},

  fetchCatalog: async () => {
    try {
      set({ loading: true, error: null });
      const { category, rarity, search } = get();
      const res = await avatarShopService.getShopCatalog({
        category: category === 'all' ? undefined : category,
        rarity: rarity === 'all' ? undefined : rarity,
        search: search.trim() || undefined,
        pageSize: 100
      });

      if (res && res.items && res.items.length > 0) {
        set({ catalog: res.items, total: res.total, loading: false });
      } else {
        // Filter fallback items
        let items = FALLBACK_SHOP_ITEMS;
        if (category !== 'all') items = items.filter(i => i.category === category);
        if (rarity !== 'all') items = items.filter(i => i.rarityTier === rarity);
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          items = items.filter(i => i.nameVi.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q));
        }
        set({ catalog: items, total: items.length, loading: false });
      }
    } catch (err: any) {
      // Graceful fallback to rich sample items so the shop is never empty
      const { category, rarity, search } = get();
      let items = FALLBACK_SHOP_ITEMS;
      if (category !== 'all') items = items.filter(i => i.category === category);
      if (rarity !== 'all') items = items.filter(i => i.rarityTier === rarity);
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        items = items.filter(i => i.nameVi.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q));
      }
      set({ catalog: items, total: items.length, error: null, loading: false });
    }
  },

  setCategory: (cat: string) => {
    set({ category: cat });
    get().fetchCatalog();
  },

  setRarity: (r: string) => {
    set({ rarity: r });
    get().fetchCatalog();
  },

  setSearch: (s: string) => {
    set({ search: s });
    get().fetchCatalog();
  },

  tryOnItem: (item: ShopItemDto) => {
    const slot = item.layerSlot;
    set(state => {
      const next = { ...state.tryingOnItems };
      if (next[slot]?.itemCode === item.itemCode) {
        // Toggle off if already trying on this specific item
        delete next[slot];
      } else {
        next[slot] = item;
      }
      return { tryingOnItems: next };
    });
  },

  removeTryOn: (slot: string) => {
    set(state => {
      const next = { ...state.tryingOnItems };
      delete next[slot];
      return { tryingOnItems: next };
    });
  },

  clearTryOn: () => {
    set({ tryingOnItems: {} });
  },

  purchaseItem: async (itemCode: string, autoEquip = false) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.purchaseItem({ itemCode, autoEquip });
      
      // Update catalog ownership
      set(state => ({
        catalog: state.catalog.map(i => i.itemCode === itemCode ? { ...i, isOwned: true } : i),
        loading: false
      }));

      // If auto equipped, refresh avatar config
      if (autoEquip) {
        useAvatarStore.getState().fetchConfig();
      }

      return res;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi mua vật phẩm', loading: false });
      return null;
    }
  },

  purchaseTryOnBundle: async (autoEquip = false) => {
    const tryingOn = get().tryingOnItems;
    const itemCodes = Object.values(tryingOn).map(i => i.itemCode);
    if (itemCodes.length === 0) return null;

    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.purchaseBundle({ itemCodes, autoEquip });

      // Update catalog items
      set(state => ({
        catalog: state.catalog.map(i => itemCodes.includes(i.itemCode) ? { ...i, isOwned: true } : i),
        tryingOnItems: {},
        loading: false
      }));

      if (autoEquip) {
        useAvatarStore.getState().fetchConfig();
      }

      return res;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi thanh toán giỏ đồ thử', loading: false });
      return null;
    }
  }
}));
