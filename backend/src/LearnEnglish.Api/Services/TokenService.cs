using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LearnEnglish.Api.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace LearnEnglish.Api.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public (string Token, DateTime ExpiresAt) GenerateJwtToken(User user)
    {
        var secretKey = _config["Jwt:Key"] ?? "PaperclipLearnEnglishDefaultSecretKeyForJwtAuthentication2026!";
        var issuer = _config["Jwt:Issuer"] ?? "LearnEnglishApi";
        var audience = _config["Jwt:Audience"] ?? "LearnEnglishClient";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTime.UtcNow.AddDays(30);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.Username),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Profile?.DisplayName ?? user.Username)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = creds
        };

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);
        return (handler.WriteToken(token), expiresAt);
    }
}
