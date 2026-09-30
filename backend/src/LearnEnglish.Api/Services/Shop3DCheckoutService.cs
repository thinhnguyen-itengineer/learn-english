using System.Data;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class Shop3DCheckoutService : IShop3DCheckoutService
{
    private readonly AppDbContext _context;
    private readonly ITokenLedgerService _tokenLedgerService;
    private readonly IAvatar3DService _avatar3DService;
    private readonly ILogger<Shop3DCheckoutService> _logger;

    public Shop3DCheckoutService(
        AppDbContext context,
        ITokenLedgerService tokenLedgerService,
        IAvatar3DService avatar3DService,
        ILogger<Shop3DCheckoutService> logger)
    {
        _context = context;
        _tokenLedgerService = tokenLedgerService;
        _avatar3DService = avatar3DService;
        _logger = logger;
    }

    public async Task<Shop3DListResponse> GetCatalogAsync(Guid userId, string? slot = null, string? rarity = null, string? gender = null, int page = 1, int pageSize = 50)
    {
        var query = _context.AvatarItems3D.Where(i => i.IsActive);

        if (!string.IsNullOrWhiteSpace(slot))
        {
            var normalizedSlot = slot.Trim().ToUpperInvariant();
            query = query.Where(i => i.Slot.ToUpper() == normalizedSlot);
        }

        if (!string.IsNullOrWhiteSpace(rarity))
        {
            var normalizedRarity = rarity.Trim().ToUpperInvariant();
            query = query.Where(i => i.Rarity.ToUpper() == normalizedRarity);
        }

        if (!string.IsNullOrWhiteSpace(gender))
        {
            var normalizedGender = gender.Trim().ToUpperInvariant();
            if (normalizedGender == "FEMALE")
            {
                query = query.Where(i => i.Gender.ToUpper() == "FEMALE" || i.Gender.ToUpper() == "UNISEX" || i.GenderCompatibility.ToUpper() == "FEMALE" || i.GenderCompatibility.ToUpper() == "UNISEX");
            }
            else if (normalizedGender == "MALE")
            {
                query = query.Where(i => i.Gender.ToUpper() == "MALE" || i.Gender.ToUpper() == "UNISEX" || i.GenderCompatibility.ToUpper() == "MALE" || i.GenderCompatibility.ToUpper() == "UNISEX");
            }
            else if (normalizedGender == "UNISEX")
            {
                query = query.Where(i => i.Gender.ToUpper() == "UNISEX" || i.GenderCompatibility.ToUpper() == "UNISEX");
            }
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(i => i.Slot)
            .ThenBy(i => i.PriceTokens)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        var balance = profile?.TokenBalance ?? 0;

        // Check ownership: free starter items or currently equipped items or items in inventory
        var equipped = await _avatar3DService.GetEquippedAsync(userId);
        var equippedIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            equipped.BaseBodyId,
            equipped.HairId,
            equipped.TopId,
            equipped.BottomId,
            equipped.ShoesId
        };
        if (!string.IsNullOrEmpty(equipped.AccessoryId))
        {
            equippedIds.Add(equipped.AccessoryId);
        }

        // Also check if user has purchased item before in token transactions
        var purchasedItemIds = await _context.TokenTransactions
            .Where(t => t.UserId == userId && t.TransactionType == "purchase_3d_item" && t.ReferenceId != null)
            .Select(t => t.ReferenceId!)
            .Distinct()
            .ToListAsync();
        var purchasedSet = new HashSet<string>(purchasedItemIds, StringComparer.OrdinalIgnoreCase);

        var itemDtos = items.Select(i => new AvatarItem3DDto
        {
            Id = i.Id,
            Name = i.Name,
            Description = i.Description,
            Slot = i.Slot,
            Rarity = i.Rarity,
            Gender = i.Gender,
            GenderCompatibility = i.GenderCompatibility,
            SourceAiReference = i.SourceAiReference,
            MeshVariantFemaleUrl = i.MeshVariantFemaleUrl,
            MeshVariantMaleUrl = i.MeshVariantMaleUrl,
            ModelUrl = i.ModelUrl,
            ThumbnailUrl = i.ThumbnailUrl,
            PriceTokens = i.PriceTokens,
            LevelRequired = i.LevelRequired,
            BoneBindingRoot = i.BoneBindingRoot,
            HideSlotsWhenEquipped = i.HideSlotsWhenEquipped,
            MaskedBodyParts = i.MaskedBodyParts,
            PolyCount = i.PolyCount,
            FileSizeBytes = i.FileSizeBytes,
            IsActive = i.IsActive,
            IsOwned = i.PriceTokens == 0 || equippedIds.Contains(i.Id) || purchasedSet.Contains(i.Id)
        }).ToList();

        return new Shop3DListResponse
        {
            Items = itemDtos,
            TotalCount = totalCount,
            UserTokenBalance = balance
        };
    }

    public async Task<Purchase3DItemResponse> PurchaseItemAsync(Guid userId, string itemId)
    {
        var item = await _context.AvatarItems3D.FirstOrDefaultAsync(i => i.Id == itemId && i.IsActive);
        if (item == null)
        {
            throw new KeyNotFoundException($"Vật phẩm 3D '{itemId}' không tồn tại hoặc đã ngừng bán.");
        }

        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy hồ sơ người dùng với ID '{userId}'.");
        }

        if (profile.CurrentLevel < item.LevelRequired)
        {
            throw new InvalidOperationException($"Cần đạt cấp độ {item.LevelRequired} để mở khóa vật phẩm này (Hiện tại: Cấp {profile.CurrentLevel}).");
        }

        // Check if already purchased
        var alreadyBought = await _context.TokenTransactions.AnyAsync(t => 
            t.UserId == userId && 
            t.TransactionType == "purchase_3d_item" && 
            t.ReferenceId == itemId);

        int newBalance = profile.TokenBalance;
        if (!alreadyBought && item.PriceTokens > 0)
        {
            newBalance = await _tokenLedgerService.DebitTokensAsync(
                userId,
                item.PriceTokens,
                "purchase_3d_item",
                item.Id,
                $"Mua vật phẩm 3D: {item.Name} ({item.Slot})"
            );
        }

        // Equip the purchased item immediately
        var updatedEquip = await _avatar3DService.EquipAsync(userId, item.Slot, item.Id);

        var itemDto = new AvatarItem3DDto
        {
            Id = item.Id,
            Name = item.Name,
            Description = item.Description,
            Slot = item.Slot,
            Rarity = item.Rarity,
            Gender = item.Gender,
            ModelUrl = item.ModelUrl,
            ThumbnailUrl = item.ThumbnailUrl,
            PriceTokens = item.PriceTokens,
            LevelRequired = item.LevelRequired,
            BoneBindingRoot = item.BoneBindingRoot,
            HideSlotsWhenEquipped = item.HideSlotsWhenEquipped,
            MaskedBodyParts = item.MaskedBodyParts,
            PolyCount = item.PolyCount,
            FileSizeBytes = item.FileSizeBytes,
            IsActive = item.IsActive,
            IsOwned = true
        };

        return new Purchase3DItemResponse
        {
            Success = true,
            Message = $"Mua và trang bị thành công '{item.Name}'!",
            NewBalance = newBalance,
            Item = itemDto,
            EquippedConfig = updatedEquip
        };
    }

    public async Task<List<AvatarMatchingSet3DDto>> GetMatchingSetsAsync(Guid userId)
    {
        var sets = await _context.AvatarMatchingSets3D
            .Where(s => s.IsActive)
            .OrderBy(s => s.TokenPriceTotal)
            .ToListAsync();

        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        var balance = profile?.TokenBalance ?? 0;

        // Check purchased matching sets from token transactions
        var purchasedSetIds = await _context.TokenTransactions
            .Where(t => t.UserId == userId && t.TransactionType == "purchase_3d_matching_set" && t.ReferenceId != null)
            .Select(t => t.ReferenceId!)
            .Distinct()
            .ToListAsync();
        var purchasedSetSet = new HashSet<string>(purchasedSetIds, StringComparer.OrdinalIgnoreCase);

        // Also check if user has purchased individual items
        var purchasedItemIds = await _context.TokenTransactions
            .Where(t => t.UserId == userId && t.TransactionType == "purchase_3d_item" && t.ReferenceId != null)
            .Select(t => t.ReferenceId!)
            .Distinct()
            .ToListAsync();
        var purchasedItemSet = new HashSet<string>(purchasedItemIds, StringComparer.OrdinalIgnoreCase);

        return sets.Select(s =>
        {
            var isPurchased = purchasedSetSet.Contains(s.Id);
            if (!isPurchased)
            {
                // Check if all female and male items are owned
                var allItems = s.FemaleItemIds.Concat(s.MaleItemIds).Distinct().ToList();
                isPurchased = allItems.Count > 0 && allItems.All(id => purchasedItemSet.Contains(id));
            }

            return new AvatarMatchingSet3DDto
            {
                Id = s.Id,
                Name = s.Name,
                Theme = s.Theme,
                Description = s.Description,
                BadgeText = s.BadgeText,
                TokenPriceTotal = s.TokenPriceTotal,
                DiscountPercentage = s.DiscountPercentage,
                FemaleItemIds = s.FemaleItemIds,
                MaleItemIds = s.MaleItemIds,
                FemalePreviewNames = s.FemalePreviewNames,
                MalePreviewNames = s.MalePreviewNames,
                IsOwned = isPurchased,
                CanAfford = balance >= s.TokenPriceTotal
            };
        }).ToList();
    }

    public async Task<PurchaseMatchingSetResponse> PurchaseMatchingSetDuoAsync(Guid userId, string setId)
    {
        var set = await _context.AvatarMatchingSets3D.FirstOrDefaultAsync(s => s.Id == setId && s.IsActive);
        if (set == null)
        {
            throw new KeyNotFoundException($"Bộ trang phục đôi '{setId}' không tồn tại hoặc đã ngừng cung cấp.");
        }

        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy hồ sơ người dùng với ID '{userId}'.");
        }

        // Check if already bought
        var alreadyBought = await _context.TokenTransactions.AnyAsync(t =>
            t.UserId == userId &&
            t.TransactionType == "purchase_3d_matching_set" &&
            t.ReferenceId == setId);

        if (alreadyBought)
        {
            throw new InvalidOperationException($"Bạn đã sở hữu bộ trang phục đôi '{set.Name}' này.");
        }

        if (profile.TokenBalance < set.TokenPriceTotal)
        {
            throw new InvalidOperationException($"Số dư không đủ. Bạn cần {set.TokenPriceTotal} Tokens (Số dư hiện tại: {profile.TokenBalance} Tokens).");
        }

        // Debit tokens for the bundle
        var newBalance = await _tokenLedgerService.DebitTokensAsync(
            userId,
            set.TokenPriceTotal,
            "purchase_3d_matching_set",
            set.Id,
            $"Mua trọn bộ trang phục đôi Chibi: {set.Name}"
        );

        // Unlock all individual items in set
        var allItemIds = set.FemaleItemIds.Concat(set.MaleItemIds).Distinct().ToList();
        foreach (var itemId in allItemIds)
        {
            _context.TokenTransactions.Add(new TokenTransaction
            {
                UserId = userId,
                Amount = 0,
                TransactionType = "purchase_3d_item",
                Description = $"Mở khóa từ Bộ Đôi: {set.Name}",
                ReferenceId = itemId,
                CreatedAt = DateTime.UtcNow
            });
        }
        await _context.SaveChangesAsync();

        var setDto = new AvatarMatchingSet3DDto
        {
            Id = set.Id,
            Name = set.Name,
            Theme = set.Theme,
            Description = set.Description,
            BadgeText = set.BadgeText,
            TokenPriceTotal = set.TokenPriceTotal,
            DiscountPercentage = set.DiscountPercentage,
            FemaleItemIds = set.FemaleItemIds,
            MaleItemIds = set.MaleItemIds,
            FemalePreviewNames = set.FemalePreviewNames,
            MalePreviewNames = set.MalePreviewNames,
            IsOwned = true,
            CanAfford = true
        };

        return new PurchaseMatchingSetResponse
        {
            Success = true,
            Message = $"Chúc mừng bạn đã sở hữu trọn bộ trang phục đôi '{set.Name}' cho Aoi & Ren!",
            NewBalance = newBalance,
            MatchingSet = setDto,
            UnlockedItemIds = allItemIds
        };
    }
}
