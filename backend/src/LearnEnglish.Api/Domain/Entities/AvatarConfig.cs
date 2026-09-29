namespace LearnEnglish.Api.Domain.Entities;

public class AvatarConfig
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }

    public string BodyType { get; set; } = "neutral"; // male, female, neutral
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
    public bool IsActive { get; set; } = true;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public UserProfile Profile { get; set; } = null!;
}
