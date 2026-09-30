namespace LearnEnglish.Api.Domain.Entities;

public class AvatarItem3D
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Slot { get; set; } = "BASE_BODY"; // BASE_BODY, HAIR, TOP, BOTTOM, SHOES, ACCESSORY
    public string Rarity { get; set; } = "COMMON"; // COMMON, RARE, EPIC, LEGENDARY
    public string Gender { get; set; } = "UNISEX"; // MALE, FEMALE, UNISEX
    public string ModelUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public int PriceTokens { get; set; } = 0;
    public int LevelRequired { get; set; } = 1;
    public string BoneBindingRoot { get; set; } = "Hips";
    public List<string> HideSlotsWhenEquipped { get; set; } = new();
    public List<string> MaskedBodyParts { get; set; } = new();
    public int PolyCount { get; set; } = 0;
    public int FileSizeBytes { get; set; } = 0;
    public string GenderCompatibility { get; set; } = "UNISEX"; // FEMALE, MALE, UNISEX
    public string? SourceAiReference { get; set; }
    public string? MeshVariantFemaleUrl { get; set; }
    public string? MeshVariantMaleUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
