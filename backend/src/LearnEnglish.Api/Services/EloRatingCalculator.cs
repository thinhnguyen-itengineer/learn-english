using LearnEnglish.Api.Domain.Entities;

namespace LearnEnglish.Api.Services;

public record EloCalculationResult(
    int TrophyChange,
    int NewTrophy,
    RankTier NewTier,
    string NewDivision,
    bool IsPromotion,
    bool IsDemoted,
    int ProtectionGamesLeft,
    int NewWinStreak
);

public interface IEloRatingCalculator
{
    EloCalculationResult Calculate(
        UserRank userRank,
        int opponentTrophy,
        MatchResult result,
        bool isForfeit = false
    );

    (RankTier Tier, string Division) GetTierAndDivision(int trophy);
    int GetKFactor(RankTier tier);
}

public class EloRatingCalculator : IEloRatingCalculator
{
    public int GetKFactor(RankTier tier) => tier switch
    {
        RankTier.Bronze => 40,
        RankTier.Silver => 35,
        RankTier.Gold => 30,
        RankTier.Platinum => 25,
        RankTier.Diamond => 20,
        RankTier.Master => 16,
        _ => 30
    };

    public (RankTier Tier, string Division) GetTierAndDivision(int trophy)
    {
        if (trophy < 1000)
        {
            if (trophy <= 333) return (RankTier.Bronze, "III");
            if (trophy <= 666) return (RankTier.Bronze, "II");
            return (RankTier.Bronze, "I");
        }
        if (trophy < 2000)
        {
            if (trophy <= 1333) return (RankTier.Silver, "III");
            if (trophy <= 1666) return (RankTier.Silver, "II");
            return (RankTier.Silver, "I");
        }
        if (trophy < 3000)
        {
            if (trophy <= 2333) return (RankTier.Gold, "III");
            if (trophy <= 2666) return (RankTier.Gold, "II");
            return (RankTier.Gold, "I");
        }
        if (trophy < 4000)
        {
            if (trophy <= 3333) return (RankTier.Platinum, "III");
            if (trophy <= 3666) return (RankTier.Platinum, "II");
            return (RankTier.Platinum, "I");
        }
        if (trophy < 5000)
        {
            if (trophy <= 4333) return (RankTier.Diamond, "III");
            if (trophy <= 4666) return (RankTier.Diamond, "II");
            return (RankTier.Diamond, "I");
        }
        return (RankTier.Master, "I");
    }

    private int GetTierBaseTrophy(RankTier tier) => tier switch
    {
        RankTier.Bronze => 0,
        RankTier.Silver => 1000,
        RankTier.Gold => 2000,
        RankTier.Platinum => 3000,
        RankTier.Diamond => 4000,
        RankTier.Master => 5000,
        _ => 0
    };

    public EloCalculationResult Calculate(
        UserRank userRank,
        int opponentTrophy,
        MatchResult result,
        bool isForfeit = false
    )
    {
        int rA = userRank.Trophy;
        int rB = opponentTrophy;
        double expectedScore = 1.0 / (1.0 + Math.Pow(10, (rB - rA) / 400.0));
        int k = GetKFactor(userRank.Tier);

        int delta;
        int newWinStreak = userRank.WinStreak;
        int protectionLeft = userRank.ProtectionGamesLeft;

        if (result == MatchResult.Win)
        {
            newWinStreak += 1;
            double actualScore = 1.0;
            int rawDelta = (int)Math.Round(k * (actualScore - expectedScore));
            delta = Math.Clamp(rawDelta, 10, 45);

            // Win streak bonus for Bronze, Silver, Gold
            if (userRank.Tier <= RankTier.Gold)
            {
                if (newWinStreak >= 5) delta += 12;
                else if (newWinStreak == 4) delta += 8;
                else if (newWinStreak == 3) delta += 5;
            }
        }
        else if (result == MatchResult.Loss)
        {
            newWinStreak = 0;
            if (isForfeit)
            {
                delta = -35;
            }
            else
            {
                double actualScore = 0.0;
                int rawDelta = (int)Math.Round(k * (actualScore - expectedScore));
                if (userRank.Tier == RankTier.Bronze)
                {
                    delta = Math.Clamp(rawDelta, -10, -5);
                }
                else
                {
                    delta = Math.Clamp(rawDelta, -35, -5);
                }
            }
        }
        else // Draw
        {
            double actualScore = 0.5;
            int rawDelta = (int)Math.Round(k * (actualScore - expectedScore));
            delta = Math.Clamp(rawDelta, -5, 5);
        }

        int targetTrophy = Math.Max(0, userRank.Trophy + delta);
        var currentTier = userRank.Tier;
        int tierBase = GetTierBaseTrophy(currentTier);

        // Protection buffer handling
        if (delta < 0 && protectionLeft > 0)
        {
            protectionLeft--;
            if (targetTrophy < tierBase)
            {
                targetTrophy = tierBase;
                delta = targetTrophy - userRank.Trophy;
            }
        }

        var (calculatedTier, calculatedDiv) = GetTierAndDivision(targetTrophy);
        bool isPromotion = calculatedTier > currentTier;
        bool isDemoted = false;

        if (isPromotion)
        {
            protectionLeft = 3;
        }
        else if (calculatedTier < currentTier)
        {
            // Demotion threshold: only demote if drops below TierBase - 50
            if (targetTrophy < tierBase - 50)
            {
                isDemoted = true;
            }
            else
            {
                // Kept in current tier
                calculatedTier = currentTier;
                calculatedDiv = "III";
            }
        }

        return new EloCalculationResult(
            TrophyChange: delta,
            NewTrophy: targetTrophy,
            NewTier: calculatedTier,
            NewDivision: calculatedDiv,
            IsPromotion: isPromotion,
            IsDemoted: isDemoted,
            ProtectionGamesLeft: protectionLeft,
            NewWinStreak: newWinStreak
        );
    }
}
