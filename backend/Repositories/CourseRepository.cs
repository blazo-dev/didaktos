using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using Npgsql;

namespace didaktos.backend.Services
{
    public class CourseRepository : ICourseRepository
    {
        private readonly string _connectionString;

        public CourseRepository(IConfiguration configuration)
        {
            _connectionString =
                configuration.GetConnectionString("SupabaseConnection")
                ?? throw new InvalidOperationException(
                    "Supabase connection string is not configured"
                );
        }

        public async Task<Course> CreateCourseAsync(Course course)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                INSERT INTO users (id, title, description, instructor_id, created_at, updated_at)
                VALUES (@id, @title, @description, @instructor_id, @createdAt, @updatedAt)
                RETURNING id, title, description, instructor_id, created_at, updated_at";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", course.Id);
            command.Parameters.AddWithValue("@title", course.Title);
            command.Parameters.AddWithValue("@description", course.Description);
            command.Parameters.AddWithValue("@instructor_id", course.InstructorId);
            command.Parameters.AddWithValue("@createdAt", course.CreatedAt);
            command.Parameters.AddWithValue("@updatedAt", course.UpdatedAt);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Course
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    InstructorId = (Guid)reader["instructor_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            throw new InvalidOperationException("Failed to create course");
        }

        public async Task<Course?> GetCourseByInstructorIdAsync(Guid Instructor_id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, description, instructor_id, role, created_at, updated_at 
                FROM courses
                WHERE id = @id";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", Instructor_id);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Course
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    InstructorId = (Guid)reader["instructor_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            return null;
        }
    }
}
