namespace LearnEnglish.Api.Domain.Entities;

public class UserSkillProgress
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string SkillDomainCode { get; set; } = null!;
    public decimal MasteryScore { get; set; } = 0.00m;
    public int TotalXp { get; set; }
    public int GamesPlayed { get; set; }
    public int PerfectGames { get; set; }
    public DateTime? LastPracticedAt { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
    public virtual SkillDomain SkillDomain { get; set; } = null!;
}
