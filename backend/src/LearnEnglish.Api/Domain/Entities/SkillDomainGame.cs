namespace LearnEnglish.Api.Domain.Entities;

public class SkillDomainGame
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SkillDomainCode { get; set; } = null!;
    public string GameTypeCode { get; set; } = null!;
    public string DisplayTitle { get; set; } = null!;
    public string DifficultyTier { get; set; } = "B1_B2";
    public bool IsPrimary { get; set; } = true;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual SkillDomain SkillDomain { get; set; } = null!;
}
