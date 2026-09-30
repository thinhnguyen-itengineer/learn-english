using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface IShop3DCheckoutService
{
    Task<Shop3DListResponse> GetCatalogAsync(Guid userId, string? slot = null, string? rarity = null, int page = 1, int pageSize = 50);
    Task<Purchase3DItemResponse> PurchaseItemAsync(Guid userId, string itemId);
}
