using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;

        public AuthController(IAuthService authService, IUserRepository userRepository)
        {
            _authService = authService;
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<ActionResult<HttpResponseDto<object>>> Register(
            [FromBody] RegisterRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = UserMessages.InvalidData,
                        Errors = ModelState,
                    }
                );
            }

            var result = await _authService.RegisterAsync(request);

            if (result.Success)
            {
                return Ok(result);
            }

            return result.Message == UserMessages.EmailAlreadyExists
                ? Conflict(result)
                : BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<HttpResponseDto<object>>> Login(
            [FromBody] LoginRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = UserMessages.InvalidData,
                        Errors = ModelState,
                    }
                );
            }

            var result = await _authService.LoginAsync(request);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine(userIdClaim ?? "No userId claim found");
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(
                new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                }
            );
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok(new { Message = "Logout successful" });
        }
    }
}

public static class UserMessages
{
    public const string EmailAlreadyExists = "User with this email already exists";
    public const string InvalidData = "Invalid data";
}
