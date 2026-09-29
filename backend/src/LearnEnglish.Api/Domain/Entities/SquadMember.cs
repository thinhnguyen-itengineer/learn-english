namespace LearnEnglish.Api.Domain.Entities;

public class SquadMember
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SquadId { get; set; }
    public Guid UserId { get; set; }
    public string Role { get; set; } = "Member"; // Leader, Member
    public int WeeklyContributedXp { get; set; } = 0;
    public bool HasClaimedWeeklyChest { get; set; } = false;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public virtual StudySquad Squad { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
