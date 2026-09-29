using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/shop")]
[Authorize]
public class ShopController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenLedgerService _tokenLedgerService;

    public ShopController(AppDbContext context, ITokenLedgerService tokenLedgerService)
    {
        _context = context;
        _tokenLedgerService = tokenLedgerService;
    }

    [HttpGet("items")]
    [HttpGet("catalog")]
    public async Task<ActionResult<ShopCatalogResponse>> GetCatalog(
        [FromQuery] string? category,
        [FromQuery] string? rarity,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var userId = GetCurrentUserId();

        var query = _context.ShopItems.Where(i => i.IsPurchasable).AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(i => i.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(rarity) && !rarity.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(i => i.RarityTier.ToLower() == rarity.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(i => i.NameVi.ToLower().Contains(s) || i.NameEn.ToLower().Contains(s) || i.ItemCode.ToLower().Contains(s));
        }

        var total = await query.CountAsync();

        var ownedItemIds = await _context.UserInventories
            .Where(x => x.UserId == userId)
            .Select(x => x.ItemId)
            .ToListAsync();

        var ownedSet = new HashSet<Guid>(ownedItemIds);

        var items = await query
            .OrderBy(i => i.TokenPrice)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new ShopItemDto
            {
                Id = i.Id,
                ItemCode = i.ItemCode,
                NameEn = i.NameEn,
                NameVi = i.NameVi,
                Description = i.Description,
                Category = i.Category,
                LayerSlot = i.LayerSlot,
                RarityTier = i.RarityTier,
                TokenPrice = i.TokenPrice,
                RequiredLevel = i.RequiredLevel,
                IsPurchasable = i.IsPurchasable,
                IsLimitedEdition = i.IsLimitedEdition,
                AssetSvgKey = i.AssetSvgKey,
                ZIndex = i.ZIndex,
                IsOwned = false
            })
            .ToListAsync();

        foreach (var item in items)
        {
            item.IsOwned = ownedSet.Contains(item.Id);
        }

        return Ok(new ShopCatalogResponse
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpPost("purchase")]
    [HttpPost("buy")]
    public async Task<ActionResult<PurchaseResultDto>> Purchase([FromBody] PurchaseItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ItemCode))
        {
            return BadRequest(new { message = "Mã vật phẩm không hợp lệ." });
        }

        var userId = GetCurrentUserId();

        try
        {
            var result = await _tokenLedgerService.PurchaseItemAsync(userId, request.ItemCode, request.AutoEquip);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            if (ex.Message.Contains("đã sở hữu", StringComparison.OrdinalIgnoreCase))
            {
                return Conflict(new { errorCode = "ITEM_ALREADY_OWNED", message = ex.Message });
            }

            return BadRequest(new { errorCode = "INSUFFICIENT_FUNDS", message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Đã xảy ra lỗi khi thực hiện giao dịch.", details = ex.Message });
        }
    }

    [HttpPost("purchase-bundle")]
    public async Task<ActionResult<PurchaseBundleResultDto>> PurchaseBundle([FromBody] PurchaseBundleRequest request)
    {
        if (request.ItemCodes == null || request.ItemCodes.Count == 0)
        {
            return BadRequest(new { message = "Danh sách vật phẩm không được để trống." });
        }

        var userId = GetCurrentUserId();

        try
        {
            var result = await _tokenLedgerService.PurchaseBundleAsync(userId, request.ItemCodes, request.AutoEquip);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { errorCode = "PURCHASE_FAILED", message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Đã xảy ra lỗi khi mua giỏ hàng.", details = ex.Message });
        }
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
