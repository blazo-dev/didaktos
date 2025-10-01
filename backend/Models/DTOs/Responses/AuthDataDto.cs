namespace didaktos.backend.Models.DTOs
{
    public class AuthDataDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }
}
