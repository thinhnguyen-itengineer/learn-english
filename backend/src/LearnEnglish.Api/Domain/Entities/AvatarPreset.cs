namespace LearnEnglish.Api.Domain.Entities;

public class AvatarPreset
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }

    public int PresetIndex { get; set; } // 1, 2, 3
    public string PresetName { get; set; } = string.Empty;
    public string ConfigData { get; set; } = "{}"; // JSON formatted AvatarConfigDto
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public UserProfile Profile { get; set; } = null!;
}
