namespace LearnEnglish.Api.Services;

public class Sm2EvaluationResult
{
    public decimal NewEaseFactor { get; set; }
    public int NewIntervalDays { get; set; }
    public int RepetitionCount { get; set; }
    public int ConsecutiveSuccesses { get; set; }
    public DateTime NextReviewDate { get; set; }
    public bool IsGraduated { get; set; }
    public int AwardedCoins { get; set; }
    public int AwardedXp { get; set; }
}

public static class Sm2SpacedRepetitionCalculator
{
    public const decimal MinEaseFactor = 1.30m;
    public const decimal DefaultEaseFactor = 2.50m;

    public static Sm2EvaluationResult Calculate(
        decimal currentEf,
        int currentInterval,
        int currentRepetitions,
        int currentConsecutiveSuccesses,
        int qualityScore, // 0 to 5
        DateTime baseDate)
    {
        // 1. Calculate new Ease Factor
        // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        decimal delta = 0.1m - (5 - qualityScore) * (0.08m + (5 - qualityScore) * 0.02m);
        decimal newEf = Math.Max(MinEaseFactor, Math.Round(currentEf + delta, 2));

        int newInterval;
        int newRepetitions;
        int newConsecutiveSuccesses;
        bool isGraduated = false;
        int coins = 0;
        int xp = 0;

        if (qualityScore < 3)
        {
            // Review failure: Reset interval to 1 day and reset consecutive streak
            newRepetitions = 0;
            newConsecutiveSuccesses = 0;
            newInterval = 1;
            coins = 0;
            xp = 5; // Consolation XP
        }
        else
        {
            // Review success
            newRepetitions = currentRepetitions + 1;
            newConsecutiveSuccesses = currentConsecutiveSuccesses + 1;

            if (newRepetitions == 1)
            {
                newInterval = 1;
            }
            else if (newRepetitions == 2)
            {
                newInterval = 3;
            }
            else
            {
                newInterval = (int)Math.Round(currentInterval * newEf, MidpointRounding.AwayFromZero);
            }

            // Reward based on response quality
            coins = qualityScore == 5 ? 15 : 10;
            xp = qualityScore == 5 ? 30 : 20;

            // Graduation criteria: Mastered status
            if (newRepetitions >= 4 && newEf >= 2.50m && newConsecutiveSuccesses >= 3)
            {
                isGraduated = true;
                coins += 25; // Graduation bonus
                xp += 50;
            }
        }

        return new Sm2EvaluationResult
        {
            NewEaseFactor = newEf,
            NewIntervalDays = newInterval,
            RepetitionCount = newRepetitions,
            ConsecutiveSuccesses = newConsecutiveSuccesses,
            NextReviewDate = baseDate.AddDays(newInterval),
            IsGraduated = isGraduated,
            AwardedCoins = coins,
            AwardedXp = xp
        };
    }
}
