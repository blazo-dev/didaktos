using didaktos.backend.Models;
using Npgsql;

namespace didaktos.backend.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString =
                configuration.GetConnectionString("SupabaseConnection")
                ?? throw new InvalidOperationException(
                    "Supabase connection string is not configured"
                );
        }

        public async Task<User?> GetByEmailAsync(string email)
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

        public async Task<User?> GetByIdAsync(Guid id)
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

        public async Task<User> CreateAsync(User user)
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
    }
}
