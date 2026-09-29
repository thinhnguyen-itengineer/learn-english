namespace LearnEnglish.Api.DTOs;

public class AvatarConfigDto
{
    public string BodyType { get; set; } = "neutral";
    public string SkinColor { get; set; } = "#E8B898";
    public string HairStyleId { get; set; } = "short_crop";
    public string HairColor { get; set; } = "#1C1917";
    public string EyeExpression { get; set; } = "friendly_smile";
    public string MouthExpression { get; set; } = "smile_open";
    public string TopsId { get; set; } = "starter_tee_white";
    public string BottomsId { get; set; } = "starter_jeans_blue";
    public string FootwearId { get; set; } = "starter_sneakers_white";
    public string? HeadwearId { get; set; }
    public string? EyewearId { get; set; }
    public string? NeckwearId { get; set; }
    public string? HandheldId { get; set; }
    public string? AuraBackgroundId { get; set; } = "pedestal_wood_circle";
    public string? WingsId { get; set; }
}

public class OutfitPresetDto
{
    public int PresetIndex { get; set; }
    public string PresetName { get; set; } = string.Empty;
    public AvatarConfigDto ConfigData { get; set; } = new();
    public DateTime UpdatedAt { get; set; }
}

public class SavePresetRequest
{
    public string PresetName { get; set; } = string.Empty;
    public AvatarConfigDto? Config { get; set; }
}

public class ShopItemDto
{
    public Guid Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameVi { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty; // tops, bottoms, footwear, headwear, eyewear, neckwear, handheld, aura_background, consumable
    public string LayerSlot { get; set; } = string.Empty;
    public string RarityTier { get; set; } = "common";
    public int TokenPrice { get; set; }
    public int RequiredLevel { get; set; } = 1;
    public bool IsPurchasable { get; set; } = true;
    public bool IsLimitedEdition { get; set; } = false;
    public string AssetSvgKey { get; set; } = string.Empty;
    public int ZIndex { get; set; } = 50;
    public bool IsOwned { get; set; }
}

public class ShopCatalogResponse
{
    public List<ShopItemDto> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

public class PurchaseItemRequest
{
    public string ItemCode { get; set; } = string.Empty;
    public bool AutoEquip { get; set; } = false;
}

public class PurchaseResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public string? NameVi { get; set; }
    public int TokenSpent { get; set; }
    public int NewBalance { get; set; }
    public bool IsEquipped { get; set; }
}

public class PurchaseBundleRequest
{
    public List<string> ItemCodes { get; set; } = new();
    public bool AutoEquip { get; set; } = false;
}

public class PurchaseBundleResultDto
{
    public bool Success { get; set; }
    public int ItemsPurchased { get; set; }
    public int TotalSpent { get; set; }
    public int NewBalance { get; set; }
    public List<string> PurchasedItemCodes { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}

public class InventoryItemDto
{
    public Guid Id { get; set; }
    public Guid ItemId { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameVi { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string LayerSlot { get; set; } = string.Empty;
    public string RarityTier { get; set; } = "common";
    public string AssetSvgKey { get; set; } = string.Empty;
    public int ZIndex { get; set; }
    public bool IsEquipped { get; set; }
    public DateTime AcquiredAt { get; set; }
}

public class EquipItemResultDto
{
    public bool Success { get; set; }
    public string EquippedSlot { get; set; } = string.Empty;
    public AvatarConfigDto ActiveConfig { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}

public class UnequipItemResultDto
{
    public bool Success { get; set; }
    public string UnequippedSlot { get; set; } = string.Empty;
    public AvatarConfigDto ActiveConfig { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}

public class TokenTransactionDto
{
    public Guid Id { get; set; }
    public int Amount { get; set; }
    public int BalanceAfter { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public string? SourceCategory { get; set; }
    public string? ReferenceId { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class TokenLedgerResponse
{
    public List<TokenTransactionDto> Transactions { get; set; } = new();
    public int Total { get; set; }
    public int CurrentBalance { get; set; }
    public int DailyTokensEarned { get; set; }
    public int DailyTokensCap { get; set; } = 600;
}

public class TokenBalanceResponse
{
    public int TokenBalance { get; set; }
    public int TotalTokensEarned { get; set; }
    public int DailyTokensEarned { get; set; }
    public int DailyTokensCap { get; set; } = 600;
}

public class UpdateBioRequest
{
    public string Bio { get; set; } = string.Empty;
}

public class UpdateTitleRequest
{
    public string NewTitle { get; set; } = string.Empty;
}

public class SkillsMasteryDto
{
    public decimal ListeningScore { get; set; }
    public decimal ReadingScore { get; set; }
    public decimal WritingScore { get; set; }
    public decimal SpeakingScore { get; set; }
}

public class FullUserProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string CurrentTitle { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public int TokenBalance { get; set; }
    public int TotalTokensEarned { get; set; }
    public int DailyTokensEarned { get; set; }
    public int DailyTokensCap { get; set; } = 600;
    public int Level { get; set; }
    public int Xp { get; set; }
    public int TotalXp { get; set; }
    public int CurrentStreak { get; set; }
    public int HighestStreak { get; set; }
    public int StreakDays { get; set; }
    public int UnlockedPresetSlots { get; set; }
    public int ActivePresetSlot { get; set; }
    public AvatarConfigDto AvatarConfig { get; set; } = new();
    public SkillsMasteryDto SkillsMastery { get; set; } = new();
}
