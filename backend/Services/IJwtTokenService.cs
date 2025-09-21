using didaktos.backend.Models;

namespace didaktos.backend.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}
