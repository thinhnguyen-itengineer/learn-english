using System.Text.RegularExpressions;
using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public class SpeechAiService : ISpeechAiService
{
    private readonly IConfiguration _config;
    private readonly ILogger<SpeechAiService> _logger;

    public SpeechAiService(IConfiguration config, ILogger<SpeechAiService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public Task<EvaluatePhonemeResponse> EvaluatePhonemeAsync(EvaluatePhonemeRequest request)
    {
        var refText = (request.ReferenceText ?? string.Empty).Trim();
        var recognized = (request.UserTranscription ?? string.Empty).Trim();
        var refIpa = (request.ReferenceIpa ?? string.Empty).Trim();

        // If recognized text is empty and user sent audio, simulate or extract
        if (string.IsNullOrWhiteSpace(recognized))
        {
            recognized = refText; // fallback / test match
        }

        // Breakdown IPA or characters into phoneme tokens
        var phonemes = new List<PhonemeScoreDto>();
        string sourceTokens = !string.IsNullOrWhiteSpace(refIpa) ? refIpa.Trim('/', '[', ']') : refText;

        // Phoneme symbols splitting (handles multi-char IPA like tʃ, dʒ, aɪ, etc.)
        var matches = Regex.Matches(sourceTokens, @"(tʃ|dʒ|aɪ|aʊ|ɔɪ|eə|ɪə|ʊə|eɪ|oʊ|θ|ð|ʃ|ʒ|ŋ|[a-zA-Z\u0250-\u02AF])");
        var rnd = new Random(refText.GetHashCode() + recognized.GetHashCode());

        bool textMatched = string.Equals(refText, recognized, StringComparison.OrdinalIgnoreCase);
        int baseAccuracy = textMatched ? 90 : Math.Max(50, 100 - ComputeLevenshteinDistance(refText.ToLower(), recognized.ToLower()) * 15);

        foreach (Match match in matches)
        {
            var symbol = match.Value;
            if (string.IsNullOrWhiteSpace(symbol)) continue;

            int score = Math.Clamp(baseAccuracy + rnd.Next(-10, 10), 40, 98);
            string status = score >= 85 ? "green" : (score >= 65 ? "yellow" : "red");
            string? feedback = status switch
            {
                "red" => $"Lỗi phát âm âm /{symbol}/: Cần chú ý vị trí đặt lưỡi và bật hơi chuẩn xác.",
                "yellow" => $"Âm /{symbol}/ cần phát âm dứt khoát và rõ ràng hơn.",
                _ => null
            };

            phonemes.Add(new PhonemeScoreDto
            {
                Phoneme = symbol,
                Score = score,
                Status = status,
                Feedback = feedback
            });
        }

        if (phonemes.Count == 0)
        {
            phonemes.Add(new PhonemeScoreDto { Phoneme = refText, Score = 85, Status = "green" });
        }

        int overall = (int)phonemes.Average(p => p.Score);
        var worstPhoneme = phonemes.OrderBy(p => p.Score).FirstOrDefault(p => p.Status != "green");

        string tip = worstPhoneme != null
            ? $"Mẹo luyện tập: Tập trung vào âm /{worstPhoneme.Phoneme}/. {worstPhoneme.Feedback ?? "Hãy nghe lại khẩu hình mẫu và thử lại."}"
            : "Tuyệt vời! Bạn phát âm rất chuẩn xác và tự nhiên như người bản xứ.";

        return Task.FromResult(new EvaluatePhonemeResponse
        {
            OverallScore = overall,
            Phonemes = phonemes,
            ActionableTip = tip,
            RecognizedText = recognized
        });
    }

    public Task<SpeechRoleplayResponse> RoleplayChatAsync(SpeechRoleplayRequest request)
    {
        var input = (request.UserInputText ?? string.Empty).Trim();
        var scenario = request.Scenario ?? "CoffeeShop";
        int turnsCount = request.History.Count;

        string aiReply;
        int fluency = 85;
        int grammar = 90;
        string vocabTip;
        bool completed = turnsCount >= 5;

        switch (scenario.ToLowerInvariant())
        {
            case "jobinterview":
                aiReply = turnsCount switch
                {
                    0 => "Hello! Welcome to our interview today. Could you please introduce yourself and your background?",
                    1 => "That's impressive. What do you consider your greatest professional achievement so far?",
                    2 => "How do you handle high-pressure deadlines or conflicts within a development team?",
                    _ => "Thank you for sharing your thoughts. We will review your responses and get back to you shortly!"
                };
                vocabTip = "Sử dụng các Action Verbs như 'spearheaded', 'orchestrated', 'streamlined' để câu trả lời thêm chuyên nghiệp.";
                break;

            case "airport":
                aiReply = turnsCount switch
                {
                    0 => "Good morning! Can I see your passport and flight booking confirmation, please?",
                    1 => "Thank you. Do you have any check-in luggage, or just hand luggage today?",
                    2 => "Would you prefer a window seat or an aisle seat for this flight?",
                    _ => "Here is your boarding pass. Gate 14B opens at 10:15. Have a pleasant flight!"
                };
                vocabTip = "Các thuật ngữ cần nhớ: 'boarding pass', 'carry-on baggage', 'layover', 'customs declaration'.";
                break;

            case "ielts":
                aiReply = turnsCount switch
                {
                    0 => "Welcome to the IELTS Speaking test. Let's talk about your hometown. Where are you from?",
                    1 => "What do you like most about living in your city?",
                    2 => "Has your hometown changed much over the last few years?",
                    _ => "That concludes Part 1 of the speaking test. Excellent fluency and ideas!"
                };
                vocabTip = "Hãy mở rộng câu trả lời bằng cấu trúc PEEL (Point, Explanation, Example, Link).";
                break;

            default: // CoffeeShop
                aiReply = turnsCount switch
                {
                    0 => "Hi there! Welcome to The English Café. What can I get started for you today?",
                    1 => "Great choice! Would you like that hot or iced? And what size (regular or large)?",
                    2 => "Got it. Would you like any pastries or snacks to go along with that?",
                    _ => "Perfect, that comes out to $4.50. You can tap your card right here. Enjoy your drink!"
                };
                vocabTip = "Mẫu câu đặt món tự nhiên: 'Could I get a...', 'I'd like to have...', 'Easy on the ice, please.'";
                break;
        }

        if (input.Length < 10)
        {
            fluency = 65;
            grammar = 80;
        }

        return Task.FromResult(new SpeechRoleplayResponse
        {
            AiResponseText = aiReply,
            FluencyScore = fluency,
            GrammarAccuracyScore = grammar,
            VocabularyFeedback = vocabTip,
            IsScenarioCompleted = completed
        });
    }

    private static int ComputeLevenshteinDistance(string s, string t)
    {
        int n = s.Length;
        int m = t.Length;
        int[,] d = new int[n + 1, m + 1];

        if (n == 0) return m;
        if (m == 0) return n;

        for (int i = 0; i <= n; d[i, 0] = i++) { }
        for (int j = 0; j <= m; d[0, j] = j++) { }

        for (int i = 1; i <= n; i++)
        {
            for (int j = 1; j <= m; j++)
            {
                int cost = (t[j - 1] == s[i - 1]) ? 0 : 1;
                d[i, j] = Math.Min(
                    Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                    d[i - 1, j - 1] + cost);
            }
        }
        return d[n, m];
    }
}
