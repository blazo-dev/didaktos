using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using Npgsql;

namespace didaktos.backend.Repositories
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

        public async Task<List<CourseReadResponseDto>> SelectCoursesAsync()
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT courses.id, title, description, instructor_id, name  
                FROM courses
                JOIN users ON courses.instructor_id = users.id;";

            using var command = new NpgsqlCommand(sql, connection);

            var courses = new List<CourseReadResponseDto>();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                courses.Add(
                    new CourseReadResponseDto
                    {
                        Id = (Guid)reader["id"],
                        Title = (string)reader["title"],
                        Description = (string)reader["description"],
                        InstructorId = (Guid)reader["instructor_id"],
                        InstructorName = (string)reader["name"],
                    }
                );
            }

            return courses;
        }

        public async Task<CourseEditDto> UpdateCourseAsync(CourseEditDto Course)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                UPDATE courses 
                SET description = @description, title = @title, updated_at = @updatedAt
                WHERE id = @id
                RETURNING title, id, description";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", Course.Id);
            command.Parameters.AddWithValue("@description", Course.Description);
            command.Parameters.AddWithValue("@title", Course.Title);
            command.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new CourseEditDto
                {
                    Title = (string)reader["title"],
                    Id = (Guid)reader["id"],
                    Description = (string)reader["description"],
                };
            }

            throw new InvalidOperationException("Failed to update course");
        }

        public async Task<bool> CourseExistsAsync(Guid courseId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT COUNT(1) FROM courses WHERE id = @courseId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@courseId", courseId);

            var count = await command.ExecuteScalarAsync();
            return Convert.ToInt32(count) > 0;
        }

        public async Task<bool> IsUserInstructorOfCourseAsync(Guid userId, Guid courseId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                "SELECT COUNT(1) FROM courses WHERE id = @courseId AND instructor_id = @userId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@courseId", courseId);
            command.Parameters.AddWithValue("@userId", userId);

            var count = await command.ExecuteScalarAsync();
            return Convert.ToInt32(count) > 0;
        }

        public async Task<bool> IsUserEnrolledInCourseAsync(Guid userId, Guid courseId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            // Assuming there's an enrollments table - you can adjust this based on your actual structure
            const string sql =
                "SELECT COUNT(1) FROM enrollments WHERE student_id = @userId AND course_id = @courseId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@userId", userId);
            command.Parameters.AddWithValue("@courseId", courseId);

            var count = await command.ExecuteScalarAsync();
            return Convert.ToInt32(count) > 0;
        }
    }
}
