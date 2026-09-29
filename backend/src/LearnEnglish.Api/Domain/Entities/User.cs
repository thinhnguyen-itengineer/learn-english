namespace LearnEnglish.Api.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Email { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public bool IsGuest { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public UserProfile? Profile { get; set; }
    public UserRank? Rank { get; set; }
    public ICollection<GameSession> GameSessions { get; set; } = new List<GameSession>();
    public ICollection<MatchParticipant> MatchParticipations { get; set; } = new List<MatchParticipant>();
    public ICollection<UserSkillProgress> SkillProgresses { get; set; } = new List<UserSkillProgress>();
    public ICollection<DailyBalancedProgress> DailyBalancedProgresses { get; set; } = new List<DailyBalancedProgress>();
    public UserHabitState? HabitState { get; set; }
    public ICollection<UserMistakeBank> MistakeBanks { get; set; } = new List<UserMistakeBank>();
    public ICollection<WeeklyLeagueMember> LeagueMemberships { get; set; } = new List<WeeklyLeagueMember>();
    public ICollection<SquadMember> SquadMemberships { get; set; } = new List<SquadMember>();
}
