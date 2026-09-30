namespace LearnEnglish.Api.Domain.Entities;

public class AvatarPreset3D
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }

    public int PresetSlot { get; set; } = 1;
    public string PresetName { get; set; } = string.Empty;
    public string Config { get; set; } = "{}";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
