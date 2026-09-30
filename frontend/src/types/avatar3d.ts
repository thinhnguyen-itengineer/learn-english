export type Slot3D = 'BASE_BODY' | 'HAIR' | 'TOP' | 'BOTTOM' | 'SHOES' | 'ACCESSORY';

export type Rarity3D = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export type Gender3D = 'MALE' | 'FEMALE' | 'UNISEX';

export type AnimationState3D =
  | 'IDLE'
  | 'RUN'
  | 'HOLD_ITEM'
  | 'THINKING'
  | 'CORRECT'
  | 'STREAK'
  | 'CONFUSED'
  | 'TRYON'
  | 'VICTORY'
  | 'DEFEAT';

export interface AvatarItem3D {
  id: string;
  name: string;
  description?: string | null;
  slot: Slot3D;
  rarity: Rarity3D;
  gender: Gender3D;
  genderCompatibility?: Gender3D;
  sourceAiReference?: string | null;
  meshVariantFemaleUrl?: string | null;
  meshVariantMaleUrl?: string | null;
  modelUrl: string;
  thumbnailUrl: string;
  priceTokens: number;
  levelRequired: number;
  boneBindingRoot: string;
  hideSlotsWhenEquipped: string[];
  maskedBodyParts: string[];
  polyCount: number;
  fileSizeBytes: number;
  isActive: boolean;
  isOwned: boolean;
}

export interface UserAvatar3DConfig {
  userId: string;
  activeGender?: 'FEMALE' | 'MALE' | 'DUO';
  baseBodyId: string;
  hairId: string;
  topId: string;
  bottomId: string;
  shoesId: string;
  accessoryId?: string | null;
  activeAnimation: AnimationState3D;
  updatedAt: string;
  hiddenSlots: string[];
  maskedBodyParts: string[];
}

export interface Equip3DRequest {
  slot: Slot3D;
  itemId: string;
}

export interface Equip3DResponse {
  success: boolean;
  message: string;
  data: UserAvatar3DConfig;
}

export interface AvatarPreset3D {
  id: string;
  userId: string;
  presetSlot: number;
  presetName: string;
  config: Partial<UserAvatar3DConfig>;
  createdAt: string;
  updatedAt: string;
}

export interface SavePreset3DRequest {
  presetSlot: number;
  presetName: string;
  config?: UserAvatar3DConfig;
}

export interface CameraConfig3D {
  fov: number;
  initialPosition: [number, number, number];
  target: [number, number, number];
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
}

export interface LightingRigConfig3D {
  ambientIntensity: number;
  keyLightIntensity: number;
  fillLightIntensity: number;
  rimLightIntensity: number;
  keyLightColor: string;
  fillLightColor: string;
  rimLightColor: string;
}

export interface Manifest3D {
  version: string;
  masterSkeletonBonesCount: number;
  masterBones: string[];
  defaultCamera: CameraConfig3D;
  lightingRig: LightingRigConfig3D;
  availableAnimations: string[];
}

export interface Shop3DListResponse {
  items: AvatarItem3D[];
  totalCount: number;
  userTokenBalance: number;
}

export interface Purchase3DItemResponse {
  success: boolean;
  message: string;
  newBalance: number;
  item: AvatarItem3D;
  equippedConfig: UserAvatar3DConfig;
}

export interface MatchingOutfitSet {
  id: string;
  name: string;
  theme: string;
  description: string;
  badgeText: string;
  tokenPriceTotal: number;
  discountPercentage?: number;
  femaleItems?: string[];
  maleItems?: string[];
  femaleItemIds?: string[];
  maleItemIds?: string[];
  femalePreviewNames?: string[];
  malePreviewNames?: string[];
  baseBodyId?: string;
  hairId?: string;
  topId?: string;
  accessoryId?: string;
  isOwned?: boolean;
  canAfford?: boolean;
}

export interface PurchaseMatchingSetResponse {
  success: boolean;
  message: string;
  newBalance: number;
  matchingSet: MatchingOutfitSet;
  unlockedItemIds: string[];
}

export interface ActiveCharacterData {
  activeGender: 'FEMALE' | 'MALE' | 'DUO';
  characterName: string;
  vietnameseName: string;
  height: string;
  role: string;
  baseBodyId: string;
  equippedConfig: UserAvatar3DConfig;
}
