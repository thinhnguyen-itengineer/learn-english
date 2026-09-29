namespace LearnEnglish.Api.Domain.Entities;

public class StudySquad
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SquadCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid LeaderUserId { get; set; }
    public int MaxMembers { get; set; } = 10;
    public int CurrentMembersCount { get; set; } = 1;
    public int TotalAccumulatedXp { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User Leader { get; set; } = null!;
    public virtual ICollection<SquadMember> Members { get; set; } = new List<SquadMember>();
}
