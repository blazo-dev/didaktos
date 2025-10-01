using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Utils;

namespace didaktos.backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public UserService(IUserRepository userRepository, JwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<HttpResponseDto<object>> RegisterAsync(RegisterRequestDto request)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "User with this email already exists",
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
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdUser = await _userRepository.CreateUserAsync(user);
                var token = _jwtTokenGenerator.GenerateJwtToken(createdUser);

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "User registered successfully",
                    Data = new AuthDataDto
                    {
                        Token = token,
                        User = new UserDto
                        {
                            Id = createdUser.Id,
                            Name = createdUser.Name,
                            Email = createdUser.Email,
                        },
                    },
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Registration failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> LoginAsync(LoginRequestDto request)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(request.Email.ToLower());
                if (user == null)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid email or password",
                    };
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid email or password",
                    };
                }

                var token = _jwtTokenGenerator.GenerateJwtToken(user);

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = new AuthDataDto
                    {
                        Token = token,
                        User = new UserDto
                        {
                            Id = user.Id,
                            Name = user.Name,
                            Email = user.Email,
                        },
                    },
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Login failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
