using BCrypt.Net;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Services;

namespace didaktos.backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService(IUserRepository userRepository, IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User with this email already exists",
                    };
                }

                // Validate role
                if (request.Role.ToLower() != "student" && request.Role.ToLower() != "instructor")
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid role. Must be 'student' or 'instructor'",
                    };
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Email = request.Email.ToLower(),
                    PasswordHash = passwordHash,
                    Role = request.Role.ToLower(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdUser = await _userRepository.CreateAsync(user);
                var token = _jwtTokenService.GenerateToken(createdUser);

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "User registered successfully",
                    Token = token,
                    User = new UserDto
                    {
                        Id = createdUser.Id,
                        Name = createdUser.Name,
                        Email = createdUser.Email,
                        Role = createdUser.Role,
                        CreatedAt = createdUser.CreatedAt,
                        UpdatedAt = createdUser.UpdatedAt,
                    },
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Registration failed: " + ex.Message,
                };
            }
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(request.Email.ToLower());
                if (user == null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password",
                    };
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password",
                    };
                }

                var token = _jwtTokenService.GenerateToken(user);

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt,
                        UpdatedAt = user.UpdatedAt,
                    },
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Login failed: " + ex.Message,
                };
            }
        }
    }
}
