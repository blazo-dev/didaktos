using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IAuthService
    {
        Task<HttpResponseDto<object>> RegisterAsync(RegisterRequestDto request);
        Task<HttpResponseDto<object>> LoginAsync(LoginRequestDto request);
    }
}
