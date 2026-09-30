namespace LearnEnglish.Api.Domain.Entities;

public class AvatarMatchingSet3D
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BadgeText { get; set; } = string.Empty;
    public int TokenPriceTotal { get; set; }
    public int DiscountPercentage { get; set; } = 15;
    public List<string> FemaleItemIds { get; set; } = new();
    public List<string> MaleItemIds { get; set; } = new();
    public List<string> FemalePreviewNames { get; set; } = new();
    public List<string> MalePreviewNames { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
