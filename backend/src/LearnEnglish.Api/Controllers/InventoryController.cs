using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnEnglish.Api.Services;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/inventory")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public InventoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<InventoryItemDto>>> GetInventory()
    {
        var userId = GetCurrentUserId();

        var inventory = await _context.UserInventories
            .Where(i => i.UserId == userId)
            .Include(i => i.Item)
            .OrderByDescending(i => i.AcquiredAt)
            .Select(i => new InventoryItemDto
            {
                Id = i.Id,
                ItemId = i.ItemId,
                ItemCode = i.Item.ItemCode,
                NameEn = i.Item.NameEn,
                NameVi = i.Item.NameVi,
                Category = i.Item.Category,
                LayerSlot = i.Item.LayerSlot,
                RarityTier = i.Item.RarityTier,
                AssetSvgKey = i.Item.AssetSvgKey,
                ZIndex = i.Item.ZIndex,
                IsEquipped = i.IsEquipped,
                AcquiredAt = i.AcquiredAt
            })
            .ToListAsync();

        return Ok(inventory);
    }

    [HttpPost("{itemId:guid}/equip")]
    public async Task<ActionResult<EquipItemResultDto>> EquipItem(Guid itemId)
    {
        var userId = GetCurrentUserId();
        var inventoryItem = await _context.UserInventories
            .Include(i => i.Item)
            .FirstOrDefaultAsync(i => i.UserId == userId && i.ItemId == itemId);

        if (inventoryItem == null)
        {
            return NotFound(new { message = "Vật phẩm không tồn tại trong tủ đồ của bạn." });
        }

        var config = await _context.AvatarConfigs.FirstOrDefaultAsync(c => c.UserId == userId);
        if (config == null)
        {
            config = new AvatarConfig { Id = Guid.NewGuid(), UserId = userId };
            _context.AvatarConfigs.Add(config);
        }

        var item = inventoryItem.Item;
        var slot = item.LayerSlot.ToLowerInvariant();
        var cat = item.Category.ToLowerInvariant();

        if (slot == "bundle" || cat == "bundle")
        {
            var codes = TokenLedgerService.GetBundleConstituentCodes(item.ItemCode);
            var subItems = await _context.ShopItems.Where(x => codes.Contains(x.ItemCode)).ToListAsync();
            foreach (var sub in subItems)
            {
                string subSlot = sub.LayerSlot.ToLowerInvariant();
                string subCategory = sub.Category.ToLowerInvariant();
                if (subSlot == "tops" || subCategory == "tops") config.TopsId = sub.ItemCode;
                else if (subSlot == "bottoms" || subCategory == "bottoms") config.BottomsId = sub.ItemCode;
                else if (subSlot == "footwear" || subCategory == "footwear") config.FootwearId = sub.ItemCode;
                else if (subSlot == "headwear" || subCategory == "headwear") config.HeadwearId = sub.ItemCode;
                else if (subSlot == "eyewear" || subCategory == "eyewear") config.EyewearId = sub.ItemCode;
                else if (subSlot == "neckwear" || subCategory == "neckwear") config.NeckwearId = sub.ItemCode;
                else if (subSlot == "handheld" || subCategory == "handheld") config.HandheldId = sub.ItemCode;
                else if (subSlot == "pedestal_aura" || subCategory == "aura_background") config.AuraBackgroundId = sub.ItemCode;
                else if (subSlot == "wings" || subCategory == "wings") config.WingsId = sub.ItemCode;
            }
        }
        else if (slot == "tops" || cat == "tops") config.TopsId = item.ItemCode;
        else if (slot == "bottoms" || cat == "bottoms") config.BottomsId = item.ItemCode;
        else if (slot == "footwear" || cat == "footwear") config.FootwearId = item.ItemCode;
        else if (slot == "headwear" || cat == "headwear") config.HeadwearId = item.ItemCode;
        else if (slot == "eyewear" || cat == "eyewear") config.EyewearId = item.ItemCode;
        else if (slot == "neckwear" || cat == "neckwear") config.NeckwearId = item.ItemCode;
        else if (slot == "handheld" || cat == "handheld") config.HandheldId = item.ItemCode;
        else if (slot == "pedestal_aura" || cat == "aura_background") config.AuraBackgroundId = item.ItemCode;
        else if (slot == "wings" || cat == "wings") config.WingsId = item.ItemCode;
        else
        {
            return BadRequest(new { message = "Vật phẩm này không thể trang bị lên Avatar." });
        }

        config.UpdatedAt = DateTime.UtcNow;

        // Update isEquipped flags for items in the same slot
        var sameSlotItems = await _context.UserInventories
            .Include(i => i.Item)
            .Where(i => i.UserId == userId && (i.Item.LayerSlot == item.LayerSlot || i.Item.Category == item.Category))
            .ToListAsync();

        foreach (var s in sameSlotItems)
        {
            s.IsEquipped = (s.ItemId == itemId);
        }

        await _context.SaveChangesAsync();

        return Ok(new EquipItemResultDto
        {
            Success = true,
            EquippedSlot = slot,
            ActiveConfig = new AvatarConfigDto
            {
                BodyType = config.BodyType,
                SkinColor = config.SkinColor,
                HairStyleId = config.HairStyleId,
                HairColor = config.HairColor,
                EyeExpression = config.EyeExpression,
                MouthExpression = config.MouthExpression,
                TopsId = config.TopsId,
                BottomsId = config.BottomsId,
                FootwearId = config.FootwearId,
                HeadwearId = config.HeadwearId,
                EyewearId = config.EyewearId,
                NeckwearId = config.NeckwearId,
                HandheldId = config.HandheldId,
                AuraBackgroundId = config.AuraBackgroundId,
                WingsId = config.WingsId
            },
            Message = $"Đã trang bị '{item.NameVi}' thành công."
        });
    }

    [HttpPost("{itemId:guid}/unequip")]
    public async Task<ActionResult<UnequipItemResultDto>> UnequipItem(Guid itemId)
    {
        var userId = GetCurrentUserId();
        var inventoryItem = await _context.UserInventories
            .Include(i => i.Item)
            .FirstOrDefaultAsync(i => i.UserId == userId && i.ItemId == itemId);

        if (inventoryItem == null)
        {
            return NotFound(new { message = "Vật phẩm không tồn tại trong tủ đồ của bạn." });
        }

        var config = await _context.AvatarConfigs.FirstOrDefaultAsync(c => c.UserId == userId);
        if (config == null)
        {
            return NotFound(new { message = "Chưa có cấu hình Avatar." });
        }

        var item = inventoryItem.Item;
        var slot = item.LayerSlot.ToLowerInvariant();
        var cat = item.Category.ToLowerInvariant();

        if (slot == "headwear" || cat == "headwear")
        {
            config.HeadwearId = null;
        }
        else if (slot == "eyewear" || cat == "eyewear")
        {
            config.EyewearId = null;
        }
        else if (slot == "neckwear" || cat == "neckwear")
        {
            config.NeckwearId = null;
        }
        else if (slot == "handheld" || cat == "handheld")
        {
            config.HandheldId = null;
        }
        else if (slot == "wings" || cat == "wings")
        {
            config.WingsId = null;
        }
        else if (slot == "pedestal_aura" || cat == "aura_background")
        {
            config.AuraBackgroundId = "pedestal_wood_circle";
        }
        else
        {
            return BadRequest(new { message = "Trang phục cơ bản (Áo, Quần, Giày) không thể tháo rời, chỉ có thể thay thế bằng món đồ khác." });
        }

        inventoryItem.IsEquipped = false;
        config.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new UnequipItemResultDto
        {
            Success = true,
            UnequippedSlot = slot,
            ActiveConfig = new AvatarConfigDto
            {
                BodyType = config.BodyType,
                SkinColor = config.SkinColor,
                HairStyleId = config.HairStyleId,
                HairColor = config.HairColor,
                EyeExpression = config.EyeExpression,
                MouthExpression = config.MouthExpression,
                TopsId = config.TopsId,
                BottomsId = config.BottomsId,
                FootwearId = config.FootwearId,
                HeadwearId = config.HeadwearId,
                EyewearId = config.EyewearId,
                NeckwearId = config.NeckwearId,
                HandheldId = config.HandheldId,
                AuraBackgroundId = config.AuraBackgroundId,
                WingsId = config.WingsId
            },
            Message = $"Đã tháo bỏ '{item.NameVi}'."
        });
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;

        if (Guid.TryParse(claim, out var id))
        {
            return id;
        }

        throw new UnauthorizedAccessException("Người dùng chưa được xác thực danh tính.");
    }
}
