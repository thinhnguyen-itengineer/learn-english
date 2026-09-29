using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface ITokenLedgerService
{
    Task<(int Awarded, int NewBalance)> CreditTokensAsync(Guid userId, int amount, string transactionType, string? referenceId = null, string description = "Nhận thưởng Token");
    Task<int> DebitTokensAsync(Guid userId, int amount, string transactionType, string? referenceId = null, string description = "Chi tiêu Token");
    Task<PurchaseResultDto> PurchaseItemAsync(Guid userId, string itemCode, bool autoEquip = false);
    Task<PurchaseBundleResultDto> PurchaseBundleAsync(Guid userId, List<string> itemCodes, bool autoEquip = false);
    Task<TokenLedgerResponse> GetLedgerAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<TokenBalanceResponse> GetBalanceAsync(Guid userId);
}
