import { create } from 'zustand';
import { AvatarConfigDto, OutfitPresetDto } from '../types/avatarAndShop';
import { avatarShopService } from './avatarShopService';

interface AvatarState {
  config: AvatarConfigDto;
  activeConfig: AvatarConfigDto;
  presets: OutfitPresetDto[];
  loading: boolean;
  error: string | null;

  fetchConfig: () => Promise<void>;
  updatePreview: (partial: Partial<AvatarConfigDto>) => void;
  saveConfig: (fullConfig: AvatarConfigDto) => Promise<boolean>;
  fetchPresets: () => Promise<void>;
  savePreset: (index: number, name: string, config?: AvatarConfigDto) => Promise<boolean>;
  applyPreset: (index: number) => Promise<boolean>;
}

const DEFAULT_CONFIG: AvatarConfigDto = {
  bodyType: 'neutral',
  skinColor: '#E8B898',
  hairStyleId: 'short_crop',
  hairColor: '#1C1917',
  eyeExpression: 'friendly_smile',
  mouthExpression: 'smile_open',
  topsId: 'starter_tee_white',
  bottomsId: 'starter_jeans_blue',
  footwearId: 'starter_sneakers_white',
  headwearId: null,
  eyewearId: null,
  neckwearId: null,
  handheldId: null,
  auraBackgroundId: 'pedestal_wood_circle'
};

export const useAvatarStore = create<AvatarState>((set, get) => ({
  config: DEFAULT_CONFIG,
  activeConfig: DEFAULT_CONFIG,
  presets: [],
  loading: false,
  error: null,

  fetchConfig: async () => {
    try {
      set({ loading: true, error: null });
      const config = await avatarShopService.getAvatarConfig();
      set({ config, activeConfig: config, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải cấu hình Avatar', loading: false });
    }
  },

  updatePreview: (partial: Partial<AvatarConfigDto>) => {
    set(state => {
      const next = { ...state.config, ...partial };
      return {
        config: next,
        activeConfig: next
      };
    });
  },

  saveConfig: async (fullConfig: AvatarConfigDto) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.updateAvatarConfig(fullConfig);
      set({ config: res.updatedConfig, loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi lưu cấu hình Avatar', loading: false });
      return false;
    }
  },

  fetchPresets: async () => {
    try {
      const presets = await avatarShopService.getPresets();
      set({ presets });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải danh sách preset' });
    }
  },

  savePreset: async (index: number, name: string, config?: AvatarConfigDto) => {
    try {
      set({ loading: true, error: null });
      const targetConfig = config || get().config;
      const res = await avatarShopService.savePreset(index, { presetName: name, config: targetConfig });
      set(state => {
        const next = state.presets.filter(p => p.presetIndex !== index);
        next.push(res);
        next.sort((a, b) => a.presetIndex - b.presetIndex);
        return { presets: next, loading: false };
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi lưu preset', loading: false });
      return false;
    }
  },

  applyPreset: async (index: number) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.applyPreset(index);
      set({ config: res.activeConfig, loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi áp dụng preset', loading: false });
      return false;
    }
  }
}));
