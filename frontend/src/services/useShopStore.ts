import { create } from 'zustand';
import { ShopItemDto, PurchaseResultDto, PurchaseBundleResultDto } from '../types/avatarAndShop';
import { avatarShopService } from './avatarShopService';
import { useAvatarStore } from './useAvatarStore';

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
  catalog: [],
  total: 0,
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
      set({ catalog: res.items, total: res.total, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải danh mục cửa hàng', loading: false });
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
