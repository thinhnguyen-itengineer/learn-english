namespace LearnEnglish.Api.Domain.Entities;

public class ShopItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ItemCode { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameVi { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty; // tops, bottoms, footwear, headwear, eyewear, neckwear, handheld, aura_background, consumable
    public string LayerSlot { get; set; } = string.Empty;
    public string RarityTier { get; set; } = "common"; // common, rare, epic, legendary
    public int TokenPrice { get; set; }
    public int RequiredLevel { get; set; } = 1;
    public bool IsPurchasable { get; set; } = true;
    public bool IsLimitedEdition { get; set; } = false;
    public string AssetSvgKey { get; set; } = string.Empty;
    public int ZIndex { get; set; } = 50;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserInventory> UserInventories { get; set; } = new List<UserInventory>();
}
