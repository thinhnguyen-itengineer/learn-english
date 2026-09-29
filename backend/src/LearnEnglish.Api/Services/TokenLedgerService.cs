using System.Data;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class TokenLedgerService : ITokenLedgerService
{
    private readonly AppDbContext _context;
    private readonly ILogger<TokenLedgerService> _logger;

    public TokenLedgerService(AppDbContext context, ILogger<TokenLedgerService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<(int Awarded, int NewBalance)> CreditTokensAsync(
        Guid userId, 
        int amount, 
        string transactionType, 
        string? referenceId = null, 
        string description = "Nhận thưởng Token")
    {
        using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);
        try
        {
            var profile = await GetLockedProfileAsync(userId);
            if (profile == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy hồ sơ người dùng với ID: {userId}");
            }

            CheckAndResetDailyCap(profile);

            int awarded = amount;
            if (transactionType.StartsWith("earn_") && transactionType != "earn_streak" && transactionType != "earn_quest")
            {
                if (profile.DailyTokensEarned >= 600)
                {
                    // Soft cap 20%
                    awarded = Math.Max(1, (int)(amount * 0.2));
                }
            }

            profile.TokenBalance += awarded;
            profile.TotalTokensEarned += awarded;
            profile.DailyTokensEarned += awarded;
            profile.Coins = profile.TokenBalance;
            profile.UpdatedAt = DateTime.UtcNow;

            var tx = new TokenTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = awarded,
                BalanceAfter = profile.TokenBalance,
                TransactionType = transactionType,
                ReferenceId = referenceId,
                Description = description,
                CreatedAt = DateTime.UtcNow
            };
            _context.TokenTransactions.Add(tx);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return (awarded, profile.TokenBalance);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Lỗi khi cộng Token cho user {UserId}", userId);
            throw;
        }
    }

    public async Task<int> DebitTokensAsync(
        Guid userId, 
        int amount, 
        string transactionType, 
        string? referenceId = null, 
        string description = "Chi tiêu Token")
    {
        using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);
        try
        {
            var profile = await GetLockedProfileAsync(userId);
            if (profile == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy hồ sơ người dùng với ID: {userId}");
            }

            if (profile.TokenBalance < amount)
            {
                throw new InvalidOperationException($"Số dư Token không đủ. Cần: {amount} 🪙, Hiện có: {profile.TokenBalance} 🪙.");
            }

            profile.TokenBalance -= amount;
            profile.Coins = profile.TokenBalance;
            profile.UpdatedAt = DateTime.UtcNow;

            var tx = new TokenTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = -amount,
                BalanceAfter = profile.TokenBalance,
                TransactionType = transactionType,
                ReferenceId = referenceId,
                Description = description,
                CreatedAt = DateTime.UtcNow
            };
            _context.TokenTransactions.Add(tx);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return profile.TokenBalance;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Lỗi khi trừ Token cho user {UserId}", userId);
            throw;
        }
    }

    public async Task<PurchaseResultDto> PurchaseItemAsync(Guid userId, string itemCode, bool autoEquip = false)
    {
        using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);
        try
        {
            var profile = await GetLockedProfileAsync(userId);
            if (profile == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy hồ sơ người dùng.");
            }

            var item = await _context.ShopItems.FirstOrDefaultAsync(x => x.ItemCode == itemCode && x.IsPurchasable);
            if (item == null)
            {
                throw new KeyNotFoundException($"Vật phẩm '{itemCode}' không tồn tại hoặc đã ngừng mở bán.");
            }

            if (profile.CurrentLevel < item.RequiredLevel)
            {
                throw new InvalidOperationException($"Cần đạt Level {item.RequiredLevel} để mua vật phẩm này (Level hiện tại: {profile.CurrentLevel}).");
            }

            if (item.Category != "consumable")
            {
                var alreadyOwned = await _context.UserInventories.AnyAsync(x => x.UserId == userId && x.ItemId == item.Id);
                if (alreadyOwned)
                {
                    throw new InvalidOperationException($"Bạn đã sở hữu vật phẩm '{item.NameVi}' trong tủ đồ.");
                }
            }

            if (profile.TokenBalance < item.TokenPrice)
            {
                throw new InvalidOperationException($"Số dư Token không đủ để thực hiện giao dịch.");
            }

            profile.TokenBalance -= item.TokenPrice;
            profile.Coins = profile.TokenBalance;
            profile.UpdatedAt = DateTime.UtcNow;

            var tx = new TokenTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = -item.TokenPrice,
                BalanceAfter = profile.TokenBalance,
                TransactionType = "spend_shop_item",
                ReferenceId = item.ItemCode,
                Description = $"Mua {item.NameVi} từ Cửa hàng",
                CreatedAt = DateTime.UtcNow
            };
            _context.TokenTransactions.Add(tx);

            var inventoryItem = new UserInventory
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ItemId = item.Id,
                TokenSpent = item.TokenPrice,
                IsEquipped = autoEquip,
                AcquiredFrom = "shop_purchase",
                AcquiredAt = DateTime.UtcNow
            };
            _context.UserInventories.Add(inventoryItem);

            if (autoEquip)
            {
                await EquipItemInternalAsync(userId, item);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new PurchaseResultDto
            {
                Success = true,
                Message = $"Mua thành công '{item.NameVi}'!",
                ItemCode = item.ItemCode,
                NameVi = item.NameVi,
                TokenSpent = item.TokenPrice,
                NewBalance = profile.TokenBalance,
                IsEquipped = autoEquip
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Lỗi khi mua item {ItemCode} cho user {UserId}", itemCode, userId);
            throw;
        }
    }

    public async Task<PurchaseBundleResultDto> PurchaseBundleAsync(Guid userId, List<string> itemCodes, bool autoEquip = false)
    {
        if (itemCodes == null || itemCodes.Count == 0)
        {
            throw new ArgumentException("Danh sách vật phẩm không được để trống.");
        }

        using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);
        try
        {
            var profile = await GetLockedProfileAsync(userId);
            if (profile == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy hồ sơ người dùng.");
            }

            var items = await _context.ShopItems
                .Where(x => itemCodes.Contains(x.ItemCode) && x.IsPurchasable)
                .ToListAsync();

            if (items.Count == 0)
            {
                throw new KeyNotFoundException("Không tìm thấy vật phẩm hợp lệ nào trong giỏ hàng.");
            }

            var ownedItemIds = await _context.UserInventories
                .Where(x => x.UserId == userId)
                .Select(x => x.ItemId)
                .ToListAsync();

            var itemsToBuy = items.Where(i => i.Category == "consumable" || !ownedItemIds.Contains(i.Id)).ToList();
            if (itemsToBuy.Count == 0)
            {
                throw new InvalidOperationException("Bạn đã sở hữu tất cả vật phẩm trong giỏ thử đồ.");
            }

            int totalCost = itemsToBuy.Sum(x => x.TokenPrice);
            if (profile.TokenBalance < totalCost)
            {
                throw new InvalidOperationException($"Số dư Token không đủ. Cần: {totalCost} 🪙, Hiện có: {profile.TokenBalance} 🪙.");
            }

            profile.TokenBalance -= totalCost;
            profile.Coins = profile.TokenBalance;
            profile.UpdatedAt = DateTime.UtcNow;

            var purchasedCodes = new List<string>();

            foreach (var item in itemsToBuy)
            {
                var tx = new TokenTransaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Amount = -item.TokenPrice,
                    BalanceAfter = profile.TokenBalance,
                    TransactionType = "spend_shop_item",
                    ReferenceId = item.ItemCode,
                    Description = $"Mua {item.NameVi} từ Cửa hàng",
                    CreatedAt = DateTime.UtcNow
                };
                _context.TokenTransactions.Add(tx);

                var inv = new UserInventory
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ItemId = item.Id,
                    TokenSpent = item.TokenPrice,
                    IsEquipped = autoEquip,
                    AcquiredFrom = "shop_purchase",
                    AcquiredAt = DateTime.UtcNow
                };
                _context.UserInventories.Add(inv);
                purchasedCodes.Add(item.ItemCode);

                if (autoEquip)
                {
                    await EquipItemInternalAsync(userId, item);
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new PurchaseBundleResultDto
            {
                Success = true,
                ItemsPurchased = itemsToBuy.Count,
                TotalSpent = totalCost,
                NewBalance = profile.TokenBalance,
                PurchasedItemCodes = purchasedCodes,
                Message = $"Đã mua thành công {itemsToBuy.Count} món đồ với {totalCost} 🪙!"
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Lỗi khi mua bundle cho user {UserId}", userId);
            throw;
        }
    }

    public async Task<TokenLedgerResponse> GetLedgerAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(u => u.UserId == userId);
        if (profile == null)
        {
            throw new KeyNotFoundException("Không tìm thấy hồ sơ người dùng.");
        }

        CheckAndResetDailyCap(profile);

        var query = _context.TokenTransactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt);

        var total = await query.CountAsync();
        var transactions = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TokenTransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                BalanceAfter = t.BalanceAfter,
                TransactionType = t.TransactionType,
                SourceCategory = t.SourceCategory,
                ReferenceId = t.ReferenceId,
                Description = t.Description,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return new TokenLedgerResponse
        {
            Transactions = transactions,
            Total = total,
            CurrentBalance = profile.TokenBalance,
            DailyTokensEarned = profile.DailyTokensEarned,
            DailyTokensCap = 600
        };
    }

    public async Task<TokenBalanceResponse> GetBalanceAsync(Guid userId)
    {
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(u => u.UserId == userId);
        if (profile == null)
        {
            throw new KeyNotFoundException("Không tìm thấy hồ sơ người dùng.");
        }

        CheckAndResetDailyCap(profile);
        await _context.SaveChangesAsync();

        return new TokenBalanceResponse
        {
            TokenBalance = profile.TokenBalance,
            TotalTokensEarned = profile.TotalTokensEarned,
            DailyTokensEarned = profile.DailyTokensEarned,
            DailyTokensCap = 600
        };
    }

    private async Task<UserProfile?> GetLockedProfileAsync(Guid userId)
    {
        if (_context.Database.ProviderName?.Contains("Npgsql", StringComparison.OrdinalIgnoreCase) == true)
        {
            return await _context.UserProfiles
                .FromSqlInterpolated($"SELECT * FROM user_profiles WHERE \"UserId\" = {userId} FOR UPDATE")
                .FirstOrDefaultAsync();
        }

        return await _context.UserProfiles.FirstOrDefaultAsync(u => u.UserId == userId);
    }

    private static void CheckAndResetDailyCap(UserProfile profile)
    {
        var todayUtc = DateTime.UtcNow.Date;
        if (profile.LastTokenResetAt.Date < todayUtc)
        {
            profile.DailyTokensEarned = 0;
            profile.LastTokenResetAt = DateTime.UtcNow;
        }
    }

    private async Task EquipItemInternalAsync(Guid userId, ShopItem item)
    {
        var config = await _context.AvatarConfigs.FirstOrDefaultAsync(c => c.UserId == userId);
        if (config == null)
        {
            config = new AvatarConfig { Id = Guid.NewGuid(), UserId = userId };
            _context.AvatarConfigs.Add(config);
        }

        var slot = item.LayerSlot.ToLowerInvariant();
        var cat = item.Category.ToLowerInvariant();

        if (slot == "tops" || cat == "tops") config.TopsId = item.ItemCode;
        else if (slot == "bottoms" || cat == "bottoms") config.BottomsId = item.ItemCode;
        else if (slot == "footwear" || cat == "footwear") config.FootwearId = item.ItemCode;
        else if (slot == "headwear" || cat == "headwear") config.HeadwearId = item.ItemCode;
        else if (slot == "eyewear" || cat == "eyewear") config.EyewearId = item.ItemCode;
        else if (slot == "neckwear" || cat == "neckwear") config.NeckwearId = item.ItemCode;
        else if (slot == "handheld" || cat == "handheld") config.HandheldId = item.ItemCode;
        else if (slot == "pedestal_aura" || cat == "aura_background") config.AuraBackgroundId = item.ItemCode;
        else if (slot == "wings" || cat == "wings") config.WingsId = item.ItemCode;

        config.UpdatedAt = DateTime.UtcNow;
    }
}
