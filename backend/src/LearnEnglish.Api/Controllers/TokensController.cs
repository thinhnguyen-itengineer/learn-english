using System.Security.Claims;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/tokens")]
[Authorize]
public class TokensController : ControllerBase
{
    private readonly ITokenLedgerService _tokenLedgerService;

    public TokensController(ITokenLedgerService tokenLedgerService)
    {
        _tokenLedgerService = tokenLedgerService;
    }

    [HttpGet("transactions")]
    [HttpGet("ledger")]
    public async Task<ActionResult<TokenLedgerResponse>> GetTransactions(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20)
    {
        var userId = GetCurrentUserId();
        try
        {
            var result = await _tokenLedgerService.GetLedgerAsync(userId, page, pageSize);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("balance")]
    public async Task<ActionResult<TokenBalanceResponse>> GetBalance()
    {
        var userId = GetCurrentUserId();
        try
        {
            var result = await _tokenLedgerService.GetBalanceAsync(userId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
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
