using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly JwtSettings _jwtSettings;

        public AuthController(IConfiguration configuration, IOptions<JwtSettings> jwtSettings)
        {
            _connectionString =
                configuration.GetConnectionString("SupabaseConnection")
                ?? throw new InvalidOperationException(
                    "Supabase connection string is not configured"
                );
            _jwtSettings = jwtSettings.Value;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(
            [FromBody] RegisterRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new AuthResponseDto { Success = false, Message = "Invalid request data" }
                );
            }

            try
            {
                // Check if user already exists
                var existingUser = await GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return BadRequest(
                        new AuthResponseDto
                        {
                            Success = false,
                            Message = "User with this email already exists",
                        }
                    );
                }

                // Validate role
                if (request.Role.ToLower() != "student" && request.Role.ToLower() != "instructor")
                {
                    return BadRequest(
                        new AuthResponseDto
                        {
                            Success = false,
                            Message = "Invalid role. Must be 'student' or 'instructor'",
                        }
                    );
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

                var createdUser = await CreateUserAsync(user);
                var token = GenerateJwtToken(createdUser);

                return Ok(
                    new AuthResponseDto
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
                    }
                );
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new AuthResponseDto
                    {
                        Success = false,
                        Message = "Registration failed: " + ex.Message,
                    }
                );
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new AuthResponseDto { Success = false, Message = "Invalid request data" }
                );
            }

            try
            {
                var user = await GetUserByEmailAsync(request.Email.ToLower());
                if (user == null)
                {
                    return BadRequest(
                        new AuthResponseDto
                        {
                            Success = false,
                            Message = "Invalid email or password",
                        }
                    );
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return BadRequest(
                        new AuthResponseDto
                        {
                            Success = false,
                            Message = "Invalid email or password",
                        }
                    );
                }

                var token = GenerateJwtToken(user);

                return Ok(
                    new AuthResponseDto
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
                    }
                );
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new AuthResponseDto { Success = false, Message = "Login failed: " + ex.Message }
                );
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await GetUserByIdAsync(userId);
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
                    Role = user.Role,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                }
            );
        }

        // implement logout once frontend is ready.
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok(new { Message = "Logout successful" });
        }

        // Private helper methods for database operations
        private async Task<User?> GetUserByEmailAsync(string email)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, name, email, password_hash, role, created_at, updated_at 
                FROM users 
                WHERE email = @email";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@email", email);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = (Guid)reader["id"],
                    Name = (string)reader["name"],
                    Email = (string)reader["email"],
                    PasswordHash = (string)reader["password_hash"],
                    Role = (string)reader["role"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            return null;
        }

        private async Task<User?> GetUserByIdAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, name, email, password_hash, role, created_at, updated_at 
                FROM users 
                WHERE id = @id";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", id);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = (Guid)reader["id"],
                    Name = (string)reader["name"],
                    Email = (string)reader["email"],
                    PasswordHash = (string)reader["password_hash"],
                    Role = (string)reader["role"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            return null;
        }

        private async Task<User> CreateUserAsync(User user)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
                VALUES (@id, @name, @email, @passwordHash, @role::user_role, @createdAt, @updatedAt)
                RETURNING id, name, email, password_hash, role, created_at, updated_at";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", user.Id);
            command.Parameters.AddWithValue("@name", user.Name);
            command.Parameters.AddWithValue("@email", user.Email);
            command.Parameters.AddWithValue("@passwordHash", user.PasswordHash);
            command.Parameters.AddWithValue("@role", user.Role);
            command.Parameters.AddWithValue("@createdAt", user.CreatedAt);
            command.Parameters.AddWithValue("@updatedAt", user.UpdatedAt);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = (Guid)reader["id"],
                    Name = (string)reader["name"],
                    Email = (string)reader["email"],
                    PasswordHash = (string)reader["password_hash"],
                    Role = (string)reader["role"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            throw new InvalidOperationException("Failed to create user");
        }

        // Private helper method for JWT token generation
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("userId", user.Id.ToString()),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
