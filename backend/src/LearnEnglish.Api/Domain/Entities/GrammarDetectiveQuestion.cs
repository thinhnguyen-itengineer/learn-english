namespace LearnEnglish.Api.Domain.Entities;

public class GrammarTokenItem
{
    public int Index { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsError { get; set; }
}

public class GrammarDetectiveQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public string CaseTitle { get; set; } = string.Empty;
    public string RawSentence { get; set; } = string.Empty;
    public List<GrammarTokenItem> TokenSequence { get; set; } = new();
    public int ErrorTokenIndex { get; set; }
    public string ErrorTokenText { get; set; } = string.Empty;
    public List<string> CorrectionOptions { get; set; } = new();
    public string CorrectReplacement { get; set; } = string.Empty;
    public string GrammarRuleExplanation { get; set; } = string.Empty;
    public string DifficultyLevel { get; set; } = "Medium";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
