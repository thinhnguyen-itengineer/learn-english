import { api } from './api';
import {
  AvatarConfigDto,
  EquipItemResultDto,
  FullUserProfileDto,
  InventoryItemDto,
  OutfitPresetDto,
  PurchaseBundleRequest,
  PurchaseBundleResultDto,
  PurchaseItemRequest,
  PurchaseResultDto,
  SavePresetRequest,
  ShopCatalogResponse,
  TokenBalanceResponse,
  TokenLedgerResponse,
  UnequipItemResultDto
} from '../types/avatarAndShop';

const API_BASE = '/api/v1';

export const avatarShopService = {
  // Profile
  async getProfile(): Promise<FullUserProfileDto> {
    const res = await api.authFetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Không thể tải hồ sơ người dùng');
    return res.json();
  },

  async updateTitle(newTitle: string): Promise<{ success: boolean; currentTitle: string }> {
    const res = await api.authFetch(`${API_BASE}/profile/title`, {
      method: 'PATCH',
      body: JSON.stringify({ newTitle })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể cập nhật danh hiệu');
    }
    return res.json();
  },

  async updateBio(bio: string): Promise<{ success: boolean; bio: string }> {
    const res = await api.authFetch(`${API_BASE}/profile/bio`, {
      method: 'PATCH',
      body: JSON.stringify({ bio })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể cập nhật giới thiệu');
    }
    return res.json();
  },

  // Avatar Config & Presets
  async getAvatarConfig(): Promise<AvatarConfigDto> {
    const res = await api.authFetch(`${API_BASE}/avatar/config`);
    if (!res.ok) throw new Error('Không thể tải cấu hình Avatar');
    return res.json();
  },

  async updateAvatarConfig(config: AvatarConfigDto): Promise<{ success: boolean; updatedConfig: AvatarConfigDto }> {
    const res = await api.authFetch(`${API_BASE}/avatar/config`, {
      method: 'PUT',
      body: JSON.stringify(config)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Không thể lưu cấu hình Avatar');
    }
    return res.json();
  },

  async getPresets(): Promise<OutfitPresetDto[]> {
    const res = await api.authFetch(`${API_BASE}/avatar/presets`);
    if (!res.ok) throw new Error('Không thể tải danh sách bộ phối đồ');
    return res.json();
  },

  async savePreset(index: number, request: SavePresetRequest): Promise<OutfitPresetDto> {
    const res = await api.authFetch(`${API_BASE}/avatar/presets/${index}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Không thể lưu preset slot ${index}`);
    }
    return res.json();
  },

  async applyPreset(index: number): Promise<{ success: boolean; activeConfig: AvatarConfigDto }> {
    const res = await api.authFetch(`${API_BASE}/avatar/presets/${index}/apply`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Không thể áp dụng preset slot ${index}`);
    }
    return res.json();
  },

  // Shop
  async getShopCatalog(params?: {
    category?: string;
    rarity?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ShopCatalogResponse> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.rarity) query.append('rarity', params.rarity);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());

    const res = await api.authFetch(`${API_BASE}/shop/items?${query.toString()}`);
    if (!res.ok) throw new Error('Không thể tải danh mục Cửa hàng');
    return res.json();
  },

  async purchaseItem(request: PurchaseItemRequest): Promise<PurchaseResultDto> {
    const res = await api.authFetch(`${API_BASE}/shop/purchase`, {
      method: 'POST',
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Giao dịch mua vật phẩm thất bại');
    }
    return res.json();
  },

  async purchaseBundle(request: PurchaseBundleRequest): Promise<PurchaseBundleResultDto> {
    const res = await api.authFetch(`${API_BASE}/shop/purchase-bundle`, {
      method: 'POST',
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Giao dịch mua giỏ hàng thất bại');
    }
    return res.json();
  },

  // Inventory
  async getInventory(): Promise<InventoryItemDto[]> {
    const res = await api.authFetch(`${API_BASE}/inventory`);
    if (!res.ok) throw new Error('Không thể tải tủ đồ');
    return res.json();
  },

  async equipItem(itemId: string): Promise<EquipItemResultDto> {
    const res = await api.authFetch(`${API_BASE}/inventory/${itemId}/equip`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể trang bị vật phẩm');
    }
    return res.json();
  },

  async unequipItem(itemId: string): Promise<UnequipItemResultDto> {
    const res = await api.authFetch(`${API_BASE}/inventory/${itemId}/unequip`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể tháo rời trang phục');
    }
    return res.json();
  },

  // Tokens & Ledger
  async getTokenTransactions(page = 1, pageSize = 20): Promise<TokenLedgerResponse> {
    const res = await api.authFetch(`${API_BASE}/tokens/transactions?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Không thể tải lịch sử giao dịch Token');
    return res.json();
  },

  async getTokenBalance(): Promise<TokenBalanceResponse> {
    const res = await api.authFetch(`${API_BASE}/tokens/balance`);
    if (!res.ok) throw new Error('Không thể tải số dư Token');
    return res.json();
  }
};
