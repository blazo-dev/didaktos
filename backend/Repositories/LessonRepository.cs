using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using Npgsql;

namespace didaktos.backend.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly string _connectionString;

        public LessonRepository(IConfiguration configuration)
        {
            _connectionString =
                configuration.GetConnectionString("SupabaseConnection")
                ?? throw new InvalidOperationException(
                    "Supabase connection string is not configured"
                );
        }

        public async Task<List<Lesson>> GetModuleLessonsAsync(Guid moduleId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, content, module_id, created_at, updated_at 
                FROM lessons 
                WHERE module_id = @moduleId
                ORDER BY created_at ASC";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@moduleId", moduleId);

            var lessons = new List<Lesson>();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lessons.Add(
                    new Lesson
                    {
                        Id = (Guid)reader["id"],
                        Title = (string)reader["title"],
                        Content = (string)reader["content"],
                        ModuleId = (Guid)reader["module_id"],
                        CreatedAt = (DateTime)reader["created_at"],
                        UpdatedAt = (DateTime)reader["updated_at"],
                    }
                );
            }

            return lessons;
        }

        public async Task<Lesson> CreateLessonAsync(Lesson lesson)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                INSERT INTO lessons (id, title, content, module_id, created_at, updated_at)
                VALUES (@id, @title, @content, @moduleId, @createdAt, @updatedAt)
                RETURNING id, title, content, module_id, created_at, updated_at";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", lesson.Id);
            command.Parameters.AddWithValue("@title", lesson.Title);
            command.Parameters.AddWithValue("@content", lesson.Content);
            command.Parameters.AddWithValue("@moduleId", lesson.ModuleId);
            command.Parameters.AddWithValue("@createdAt", lesson.CreatedAt);
            command.Parameters.AddWithValue("@updatedAt", lesson.UpdatedAt);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Lesson
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Content = (string)reader["content"],
                    ModuleId = (Guid)reader["module_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            throw new InvalidOperationException("Failed to create Lesson");
        }

        public async Task<Lesson?> GetLessonByIdAsync(Guid lessonId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, content, module_id, created_at, updated_at 
                FROM lessons 
                WHERE id = @lessonId";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@lessonId", lessonId);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Lesson
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Content = (string)reader["content"],
                    ModuleId = (Guid)reader["module_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            return null;
        }

        public async Task<bool> LessonExistsAsync(Guid lessonId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT COUNT(1) FROM lessons WHERE id = @lessonId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@lessonId", lessonId);

            var count = await command.ExecuteScalarAsync();
            return Convert.ToInt32(count) > 0;
        }

        public async Task<Guid> GetLessonModuleIdAsync(Guid lessonId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT module_id FROM lessons WHERE id = @lessonId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@lessonId", lessonId);

            var result = await command.ExecuteScalarAsync();
            if (result != null)
            {
                return (Guid)result;
            }

            throw new InvalidOperationException("Lesson not found or has no module ID");
        }

        public async Task<Lesson> UpdateLessonAsync(Lesson lesson)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                UPDATE lessons
                SET title = @title, content = @content, module_id = @moduleId, updated_at = @updatedAt
                WHERE id = @id
                RETURNING id, title, content, module_id, created_at, updated_at";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", lesson.Id);
            command.Parameters.AddWithValue("@title", lesson.Title);
            command.Parameters.AddWithValue("@content", lesson.Content);
            command.Parameters.AddWithValue("@moduleId", lesson.ModuleId);
            command.Parameters.AddWithValue("@updatedAt", lesson.UpdatedAt);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Lesson
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Content = (string)reader["content"],
                    ModuleId = (Guid)reader["module_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            throw new InvalidOperationException("Failed to update lesson");
        }

        public async Task<bool> DeleteLessonAsync(Guid lessonId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "DELETE FROM lessons WHERE id = @lessonId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@lessonId", lessonId);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
    }
}
