import { create } from 'zustand';
import {
  FullUserProfileDto,
  InventoryItemDto,
  TokenTransactionDto
} from '../types/avatarAndShop';
import { avatarShopService } from './avatarShopService';
import { useAvatarStore } from './useAvatarStore';

interface ProfileAndInventoryState {
  profile: FullUserProfileDto | null;
  inventory: InventoryItemDto[];
  transactions: TokenTransactionDto[];
  totalTransactions: number;
  loading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateTitle: (title: string) => Promise<boolean>;
  updateBio: (bio: string) => Promise<boolean>;
  fetchInventory: () => Promise<void>;
  equipItem: (itemId: string) => Promise<boolean>;
  unequipItem: (itemId: string) => Promise<boolean>;
  fetchTransactions: (page?: number, pageSize?: number) => Promise<void>;
  refreshTokens: () => Promise<void>;
}

export const useProfileAndInventoryStore = create<ProfileAndInventoryState>((set, get) => ({
  profile: null,
  inventory: [],
  transactions: [],
  totalTransactions: 0,
  loading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ loading: true, error: null });
      const profile = await avatarShopService.getProfile();
      set({ profile, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải hồ sơ cá nhân', loading: false });
    }
  },

  updateTitle: async (title: string) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.updateTitle(title);
      set(state => ({
        profile: state.profile ? { ...state.profile, currentTitle: res.currentTitle } : null,
        loading: false
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi cập nhật danh hiệu', loading: false });
      return false;
    }
  },

  updateBio: async (bio: string) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.updateBio(bio);
      set(state => ({
        profile: state.profile ? { ...state.profile, bio: res.bio } : null,
        loading: false
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi cập nhật bio', loading: false });
      return false;
    }
  },

  fetchInventory: async () => {
    try {
      set({ loading: true, error: null });
      const inventory = await avatarShopService.getInventory();
      set({ inventory, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải tủ đồ', loading: false });
    }
  },

  equipItem: async (itemId: string) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.equipItem(itemId);
      
      // Update inventory isEquipped flags
      set(state => ({
        inventory: state.inventory.map(item => ({
          ...item,
          isEquipped: item.itemId === itemId ? true : (item.layerSlot === res.equippedSlot ? false : item.isEquipped)
        })),
        loading: false
      }));

      // Update avatar store config
      useAvatarStore.getState().updatePreview(res.activeConfig);
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi trang bị vật phẩm', loading: false });
      return false;
    }
  },

  unequipItem: async (itemId: string) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.unequipItem(itemId);

      set(state => ({
        inventory: state.inventory.map(item => 
          item.itemId === itemId ? { ...item, isEquipped: false } : item
        ),
        loading: false
      }));

      useAvatarStore.getState().updatePreview(res.activeConfig);
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tháo vật phẩm', loading: false });
      return false;
    }
  },

  fetchTransactions: async (page = 1, pageSize = 20) => {
    try {
      const res = await avatarShopService.getTokenTransactions(page, pageSize);
      set(state => ({
        transactions: res.transactions,
        totalTransactions: res.total,
        profile: state.profile ? { ...state.profile, tokenBalance: res.currentBalance } : null
      }));
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải lịch sử giao dịch' });
    }
  },

  refreshTokens: async () => {
    try {
      const res = await avatarShopService.getTokenBalance();
      set(state => ({
        profile: state.profile ? {
          ...state.profile,
          tokenBalance: res.tokenBalance,
          totalTokensEarned: res.totalTokensEarned,
          dailyTokensEarned: res.dailyTokensEarned
        } : null
      }));
    } catch {
      // Ignore
    }
  }
}));
