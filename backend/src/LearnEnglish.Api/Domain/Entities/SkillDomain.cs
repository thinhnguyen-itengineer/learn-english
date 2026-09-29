namespace LearnEnglish.Api.Domain.Entities;

public class SkillDomain
{
    public string Code { get; set; } = null!; // LISTENING, READING, WRITING, SPEAKING
    public string NameVi { get; set; } = null!;
    public string NameEn { get; set; } = null!;
    public string? Description { get; set; }
    public string IconName { get; set; } = null!;
    public string ThemeColor { get; set; } = null!;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<SkillDomainGame> Games { get; set; } = new List<SkillDomainGame>();
    public virtual ICollection<UserSkillProgress> UserProgresses { get; set; } = new List<UserSkillProgress>();
}
