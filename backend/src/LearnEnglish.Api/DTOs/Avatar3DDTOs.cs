namespace LearnEnglish.Api.DTOs;

public class AvatarItem3DDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Slot { get; set; } = string.Empty;
    public string Rarity { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string GenderCompatibility { get; set; } = "UNISEX";
    public string? SourceAiReference { get; set; }
    public string? MeshVariantFemaleUrl { get; set; }
    public string? MeshVariantMaleUrl { get; set; }
    public string ModelUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public int PriceTokens { get; set; }
    public int LevelRequired { get; set; }
    public string BoneBindingRoot { get; set; } = "Hips";
    public List<string> HideSlotsWhenEquipped { get; set; } = new();
    public List<string> MaskedBodyParts { get; set; } = new();
    public int PolyCount { get; set; }
    public int FileSizeBytes { get; set; }
    public bool IsActive { get; set; }
    public bool IsOwned { get; set; }
}

public class UserAvatar3DConfigDto
{
    public Guid UserId { get; set; }
    public string ActiveGender { get; set; } = "FEMALE";
    public string BaseBodyId { get; set; } = string.Empty;
    public string HairId { get; set; } = string.Empty;
    public string TopId { get; set; } = string.Empty;
    public string BottomId { get; set; } = string.Empty;
    public string ShoesId { get; set; } = string.Empty;
    public string? AccessoryId { get; set; }
    public string ActiveAnimation { get; set; } = "IDLE";
    public DateTime UpdatedAt { get; set; }
    public List<string> HiddenSlots { get; set; } = new();
    public List<string> MaskedBodyParts { get; set; } = new();
}

public class AvatarMatchingSet3DDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BadgeText { get; set; } = string.Empty;
    public int TokenPriceTotal { get; set; }
    public int DiscountPercentage { get; set; }
    public List<string> FemaleItemIds { get; set; } = new();
    public List<string> MaleItemIds { get; set; } = new();
    public List<string> FemalePreviewNames { get; set; } = new();
    public List<string> MalePreviewNames { get; set; } = new();
    public bool IsOwned { get; set; }
    public bool CanAfford { get; set; }
}

public class PurchaseMatchingSetResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int NewBalance { get; set; }
    public AvatarMatchingSet3DDto MatchingSet { get; set; } = null!;
    public List<string> UnlockedItemIds { get; set; } = new();
}

public class ActiveCharacterDto
{
    public string ActiveGender { get; set; } = "FEMALE";
    public string CharacterName { get; set; } = "Aoi";
    public string VietnameseName { get; set; } = "Ánh Dương";
    public string Height { get; set; } = "0.95m";
    public string Role { get; set; } = "Nói & Nghe (Speaking & Listening)";
    public string BaseBodyId { get; set; } = "body_chibi_female_aoi";
    public UserAvatar3DConfigDto EquippedConfig { get; set; } = null!;
}

public class SwitchCharacterRequest
{
    public string Gender { get; set; } = "FEMALE";
}

public class Equip3DRequest
{
    public string Slot { get; set; } = string.Empty; // BASE_BODY, HAIR, TOP, BOTTOM, SHOES, ACCESSORY
    public string ItemId { get; set; } = string.Empty;
}

public class Equip3DResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public UserAvatar3DConfigDto Data { get; set; } = null!;
}

public class AvatarPreset3DDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int PresetSlot { get; set; }
    public string PresetName { get; set; } = string.Empty;
    public object Config { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class SavePreset3DRequest
{
    public int PresetSlot { get; set; }
    public string PresetName { get; set; } = string.Empty;
    public UserAvatar3DConfigDto? Config { get; set; }
}

public class Manifest3DDto
{
    public string Version { get; set; } = "1.0.0";
    public int MasterSkeletonBonesCount { get; set; } = 42;
    public List<string> MasterBones { get; set; } = new();
    public CameraConfig3D DefaultCamera { get; set; } = new();
    public LightingRigConfig3D LightingRig { get; set; } = new();
    public List<string> AvailableAnimations { get; set; } = new();
}

public class CameraConfig3D
{
    public float Fov { get; set; } = 35.0f;
    public float[] InitialPosition { get; set; } = new[] { 0f, 0.6f, 2.3f };
    public float[] Target { get; set; } = new[] { 0f, 0.5f, 0f };
    public float MinDistance { get; set; } = 1.2f;
    public float MaxDistance { get; set; } = 3.0f;
    public float MinPolarAngle { get; set; } = 1.3089f; // Math.PI / 2.4
    public float MaxPolarAngle { get; set; } = 1.7453f; // Math.PI / 1.8
}

public class LightingRigConfig3D
{
    public float AmbientIntensity { get; set; } = 0.6f;
    public float KeyLightIntensity { get; set; } = 1.2f;
    public float FillLightIntensity { get; set; } = 0.5f;
    public float RimLightIntensity { get; set; } = 0.8f;
    public string KeyLightColor { get; set; } = "#FFF5EA";
    public string FillLightColor { get; set; } = "#E8F0FE";
    public string RimLightColor { get; set; } = "#FFFFFF";
}
