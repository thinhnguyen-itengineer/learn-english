export type BodyType = 'male' | 'female' | 'neutral';

export type ItemCategory = 
  | 'tops' 
  | 'bottoms' 
  | 'footwear' 
  | 'headwear' 
  | 'eyewear' 
  | 'neckwear' 
  | 'handheld' 
  | 'wings'
  | 'bundle'
  | 'ticket'
  | 'aura_background' 
  | 'consumable';

export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary';

export interface AvatarConfigDto {
  bodyType: BodyType;
  skinColor: string;
  hairStyleId: string;
  hairColor: string;
  eyeExpression: string;
  mouthExpression: string;
  topsId: string;
  bottomsId: string;
  footwearId: string;
  headwearId?: string | null;
  eyewearId?: string | null;
  neckwearId?: string | null;
  handheldId?: string | null;
  wingsId?: string | null;
  auraBackgroundId?: string | null;
}

export interface OutfitPresetDto {
  presetIndex: number;
  presetName: string;
  configData: AvatarConfigDto;
  updatedAt: string;
}

export interface SavePresetRequest {
  presetName: string;
  config?: AvatarConfigDto;
}

export interface ShopItemDto {
  id: string;
  itemCode: string;
  nameEn: string;
  nameVi: string;
  description: string | null;
  category: ItemCategory;
  layerSlot: string;
  rarityTier: RarityTier;
  tokenPrice: number;
  requiredLevel: number;
  isPurchasable: boolean;
  isLimitedEdition: boolean;
  assetSvgKey: string;
  zIndex: number;
  isOwned?: boolean;
}

export interface ShopCatalogResponse {
  items: ShopItemDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PurchaseItemRequest {
  itemCode: string;
  autoEquip?: boolean;
}

export interface PurchaseResultDto {
  success: boolean;
  message: string;
  itemCode: string;
  nameVi?: string;
  tokenSpent: number;
  newBalance: number;
  isEquipped: boolean;
}

export interface PurchaseBundleRequest {
  itemCodes: string[];
  autoEquip?: boolean;
}

export interface PurchaseBundleResultDto {
  success: boolean;
  itemsPurchased: number;
  totalSpent: number;
  newBalance: number;
  purchasedItemCodes: string[];
  message: string;
}

export interface InventoryItemDto {
  id: string;
  itemId: string;
  itemCode: string;
  nameEn: string;
  nameVi: string;
  category: ItemCategory;
  layerSlot: string;
  rarityTier: RarityTier;
  assetSvgKey: string;
  zIndex: number;
  isEquipped: boolean;
  acquiredAt: string;
}

export interface EquipItemResultDto {
  success: boolean;
  equippedSlot: string;
  activeConfig: AvatarConfigDto;
  message: string;
}

export interface UnequipItemResultDto {
  success: boolean;
  unequippedSlot: string;
  activeConfig: AvatarConfigDto;
  message: string;
}

export interface TokenTransactionDto {
  id: string;
  amount: number;
  balanceAfter: number;
  transactionType: string;
  sourceCategory?: string | null;
  referenceId?: string | null;
  description: string;
  createdAt: string;
}

export interface TokenLedgerResponse {
  transactions: TokenTransactionDto[];
  total: number;
  currentBalance: number;
  dailyTokensEarned: number;
  dailyTokensCap: number;
}

export interface TokenBalanceResponse {
  tokenBalance: number;
  totalTokensEarned: number;
  dailyTokensEarned: number;
  dailyTokensCap: number;
}

export interface FullUserProfileDto {
  id: string;
  userId: string;
  displayName: string;
  currentTitle: string;
  bio: string | null;
  avatarUrl: string | null;
  tokenBalance: number;
  totalTokensEarned: number;
  dailyTokensEarned: number;
  dailyTokensCap: number;
  level: number;
  xp: number;
  totalXp: number;
  currentStreak: number;
  highestStreak: number;
  streakDays: number;
  unlockedPresetSlots: number;
  activePresetSlot: number;
  avatarConfig: AvatarConfigDto;
  skillsMastery: {
    listeningScore: number;
    readingScore: number;
    writingScore: number;
    speakingScore: number;
  };
}
