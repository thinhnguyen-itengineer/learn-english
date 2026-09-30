using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/shop/3d-items")]
public class Shop3DController : ControllerBase
{
    private readonly IShop3DCheckoutService _shop3DCheckoutService;
    private readonly AppDbContext _context;
    private readonly ILogger<Shop3DController> _logger;

    public Shop3DController(
        IShop3DCheckoutService shop3DCheckoutService,
        AppDbContext context,
        ILogger<Shop3DController> logger)
    {
        _shop3DCheckoutService = shop3DCheckoutService;
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<Shop3DListResponse>> GetCatalog(
        [FromQuery] string? slot,
        [FromQuery] string? rarity,
        [FromQuery] string? gender,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var userId = await GetCurrentUserIdAsync();
        var result = await _shop3DCheckoutService.GetCatalogAsync(userId, slot, rarity, gender, page, pageSize);
        return Ok(result);
    }

    [HttpGet("matching-sets")]
    [HttpGet("/api/v1/shop/matching-sets")]
    public async Task<ActionResult<List<AvatarMatchingSet3DDto>>> GetMatchingSets()
    {
        var userId = await GetCurrentUserIdAsync();
        var sets = await _shop3DCheckoutService.GetMatchingSetsAsync(userId);
        return Ok(sets);
    }

    [HttpPost("matching-sets/{id}/purchase-duo")]
    [HttpPost("/api/v1/shop/matching-sets/{id}/purchase-duo")]
    public async Task<ActionResult<PurchaseMatchingSetResponse>> PurchaseMatchingSet(string id)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            var result = await _shop3DCheckoutService.PurchaseMatchingSetDuoAsync(userId, id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi mua bộ trang phục đôi {SetId}", id);
            return StatusCode(500, new { message = "Lỗi máy chủ khi mua bộ trang phục đôi." });
        }
    }

    [HttpPost("{id}/purchase")]
    public async Task<ActionResult<Purchase3DItemResponse>> Purchase(string id)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            var result = await _shop3DCheckoutService.PurchaseItemAsync(userId, id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi mua vật phẩm 3D {ItemId}", id);
            return StatusCode(500, new { message = "Lỗi máy chủ khi mua vật phẩm 3D." });
        }
    }

    private async Task<Guid> GetCurrentUserIdAsync()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;

        if (Guid.TryParse(claim, out var id))
        {
            return id;
        }

        var firstUser = await _context.Users.OrderBy(u => u.CreatedAt).FirstOrDefaultAsync();
        if (firstUser != null)
        {
            return firstUser.Id;
        }

        throw new UnauthorizedAccessException("Người dùng chưa được xác thực danh tính.");
    }
}
