using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs.Response;
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

        public async Task<CourseResponseDto> InsertCourseAsync(Course course)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                INSERT INTO courses (id, title, description, instructor_id, created_at, updated_at)
                VALUES (@id, @title, @description, @instructor_id, @createdAt, @updatedAt)
                RETURNING id, title, description, instructor_id";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", course.Id);
            command.Parameters.AddWithValue("@title", course.Title);
            command.Parameters.AddWithValue("@description", course.Description);
            command.Parameters.AddWithValue("@instructor_id", course.InstructorId);
            command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
            command.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new CourseResponseDto
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    InstructorId = (Guid)reader["instructor_id"],
                };
            }

            throw new InvalidOperationException("Failed to create course");
        }

        public async Task<CourseReadResponseDto?> SelectCoursesAsync()
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT courses.id, title, description, instructor_id, name  
                FROM courses
                JOIN users ON courses.instructor_id = users.id;";

            using var command = new NpgsqlCommand(sql, connection);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new CourseReadResponseDto
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    InstructorId = (Guid)reader["instructor_id"],
                    InstructorName = (string)reader["name"],
                };
            }

            return null;
        }
    }
}
