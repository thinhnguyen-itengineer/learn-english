namespace LearnEnglish.Api.Domain.Entities;

public class UserAvatarEquip3D
{
    public Guid UserId { get; set; }

    public string BaseBodyId { get; set; } = string.Empty;
    public string HairId { get; set; } = string.Empty;
    public string TopId { get; set; } = string.Empty;
    public string BottomId { get; set; } = string.Empty;
    public string ShoesId { get; set; } = string.Empty;
    public string? AccessoryId { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public AvatarItem3D BaseBody { get; set; } = null!;
    public AvatarItem3D Hair { get; set; } = null!;
    public AvatarItem3D Top { get; set; } = null!;
    public AvatarItem3D Bottom { get; set; } = null!;
    public AvatarItem3D Shoes { get; set; } = null!;
    public AvatarItem3D? Accessory { get; set; }
}
