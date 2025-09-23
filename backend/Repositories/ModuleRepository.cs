using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using Npgsql;

namespace didaktos.backend.Repositories
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly string _connectionString;

        public ModuleRepository(IConfiguration configuration)
        {
            _connectionString =
                configuration.GetConnectionString("SupabaseConnection")
                ?? throw new InvalidOperationException(
                    "Supabase connection string is not configured"
                );
        }

        public async Task<List<Module>> GetCourseModulesAsync(Guid courseId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, course_id, created_at, updated_at 
                FROM modules 
                WHERE course_id = @courseId
                ORDER BY created_at ASC";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@courseId", courseId);

            var modules = new List<Module>();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                modules.Add(
                    new Module
                    {
                        Id = (Guid)reader["id"],
                        Title = (string)reader["title"],
                        CourseId = (Guid)reader["course_id"],
                        CreatedAt = (DateTime)reader["created_at"],
                        UpdatedAt = (DateTime)reader["updated_at"],
                    }
                );
            }

            return modules;
        }

        public async Task<Module> CreateModuleAsync(Module module)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                INSERT INTO modules (id, title, course_id, created_at, updated_at)
                VALUES (@id, @title, @courseId, @createdAt, @updatedAt)
                RETURNING id, title, course_id, created_at, updated_at";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", module.Id);
            command.Parameters.AddWithValue("@title", module.Title);
            command.Parameters.AddWithValue("@courseId", module.CourseId);
            command.Parameters.AddWithValue("@createdAt", module.CreatedAt);
            command.Parameters.AddWithValue("@updatedAt", module.UpdatedAt);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Module
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    CourseId = (Guid)reader["course_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            throw new InvalidOperationException("Failed to create module");
        }

        public async Task<Module?> GetModuleByIdAsync(Guid moduleId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, course_id, created_at, updated_at 
                FROM modules 
                WHERE id = @moduleId";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@moduleId", moduleId);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Module
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    CourseId = (Guid)reader["course_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            return null;
        }

        public async Task<bool> ModuleExistsAsync(Guid moduleId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT COUNT(1) FROM modules WHERE id = @moduleId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@moduleId", moduleId);

            var count = await command.ExecuteScalarAsync();
            return Convert.ToInt32(count) > 0;
        }

        public async Task<Guid> GetModuleCourseIdAsync(Guid moduleId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT course_id FROM modules WHERE id = @moduleId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@moduleId", moduleId);

            var result = await command.ExecuteScalarAsync();
            if (result != null)
            {
                return (Guid)result;
            }

            throw new InvalidOperationException("Module not found or has no course ID");
        }

        public async Task<Module> UpdateModuleAsync(Module module)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                UPDATE modules 
                SET title = @title, updated_at = @updatedAt
                WHERE id = @id
                RETURNING id, title, course_id, created_at, updated_at";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", module.Id);
            command.Parameters.AddWithValue("@title", module.Title);
            command.Parameters.AddWithValue("@updatedAt", module.UpdatedAt);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Module
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    CourseId = (Guid)reader["course_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            throw new InvalidOperationException("Failed to update module");
        }

        public async Task<bool> DeleteModuleAsync(Guid moduleId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "DELETE FROM modules WHERE id = @moduleId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@moduleId", moduleId);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
    }
}
