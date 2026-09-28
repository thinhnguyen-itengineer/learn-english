using LearnEnglish.Api.Domain.Entities;

namespace LearnEnglish.Api.Services;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) GenerateJwtToken(User user);
}
