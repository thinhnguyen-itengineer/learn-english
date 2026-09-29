namespace LearnEnglish.Api.Domain.Entities;

public class WeeklyLeague
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int LeagueTier { get; set; } = 1; // 1: Bronze, 2: Silver, 3: Gold, 4: Sapphire, 5: Diamond
    public DateOnly WeekStartDate { get; set; }
    public DateOnly WeekEndDate { get; set; }
    public string RoomCode { get; set; } = string.Empty;
    public int MaxParticipants { get; set; } = 30;
    public string Status { get; set; } = "Active"; // Active, Finalized
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<WeeklyLeagueMember> Members { get; set; } = new List<WeeklyLeagueMember>();
}
