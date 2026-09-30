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

    public async Task<Shop3DListResponse> GetCatalogAsync(Guid userId, string? slot = null, string? rarity = null, int page = 1, int pageSize = 50)
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
}
