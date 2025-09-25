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
            // Add null check for the course parameter
            if (course == null)
                throw new ArgumentNullException(nameof(course));

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
            command.Parameters.AddWithValue("@instructor_id", course.InstructorId);
            command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
            command.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);
            command.Parameters.AddWithValue("@description", course.Description);

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

            // Single optimized query to get all data in separate result sets
            const string sql =
                @"
                -- Get courses with instructors
                SELECT c.id, c.title, c.description, c.instructor_id, c.created_at, c.updated_at, u.name, u.email  
                FROM courses c
                JOIN users u ON c.instructor_id = u.id
                ORDER BY c.title;

                -- Get modules
                SELECT m.id, m.title, m.course_id
                FROM modules m
                JOIN courses c ON m.course_id = c.id
                ORDER BY c.title, m.title;

                -- Get lessons
                SELECT l.id, l.title, l.content, l.module_id, l.created_at, l.updated_at
                FROM lessons l
                JOIN modules m ON l.module_id = m.id
                JOIN courses c ON m.course_id = c.id
                ORDER BY c.title, m.title, l.title;

                -- Get assignments
                SELECT a.id, a.title, a.description, a.module_id, a.created_at, a.updated_at, a.due_date
                FROM assignments a
                JOIN modules m ON a.module_id = m.id
                JOIN courses c ON m.course_id = c.id
                ORDER BY c.title, m.title, a.title;

                -- Get enrollments
                SELECT e.course_id, e.student_id
                FROM enrollments e
                JOIN courses c ON e.course_id = c.id
                ORDER BY c.title;";

            using var command = new NpgsqlCommand(sql, connection);
            using var reader = await command.ExecuteReaderAsync();

            // Read courses
            var coursesDict = new Dictionary<Guid, CourseReadResponseDto>();
            while (await reader.ReadAsync())
            {
                var courseId = (Guid)reader["id"];
                coursesDict[courseId] = new CourseReadResponseDto
                {
                    Id = courseId,
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                    Instructor = new UserDto
                    {
                        Id = (Guid)reader["instructor_id"],
                        Name = (string)reader["name"],
                        Email = (string)reader["email"],
                    },
                    Modules = new List<ModuleDto>(),
                    Enrollments = new List<Guid>(),
                };
            }

            // Move to next result set (modules)
            await reader.NextResultAsync();
            var modulesDict = new Dictionary<Guid, ModuleDto>();
            while (await reader.ReadAsync())
            {
                var moduleId = (Guid)reader["id"];
                var courseId = (Guid)reader["course_id"];

                var module = new ModuleDto
                {
                    Id = moduleId,
                    Title = (string)reader["title"],
                    CourseId = courseId,
                    Lessons = new List<LessonDto>(),
                    Assignments = new List<AssignmentDto>(),
                };

                modulesDict[moduleId] = module;
                if (coursesDict.ContainsKey(courseId))
                {
                    coursesDict[courseId].Modules.Add(module);
                }
            }

            // Move to next result set (lessons)
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                var moduleId = (Guid)reader["module_id"];

                if (modulesDict.ContainsKey(moduleId))
                {
                    modulesDict[moduleId]
                        .Lessons.Add(
                            new LessonDto
                            {
                                Id = (Guid)reader["id"],
                                Title = (string)reader["title"],
                                Content = reader["content"] as string ?? string.Empty,
                                ModuleId = moduleId,
                            }
                        );
                }
            }

            // Move to next result set (assignments)
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                var moduleId = (Guid)reader["module_id"];

                if (modulesDict.ContainsKey(moduleId))
                {
                    modulesDict[moduleId]
                        .Assignments.Add(
                            new AssignmentDto
                            {
                                Id = (Guid)reader["id"],
                                Title = (string)reader["title"],
                                Description = reader["description"] as string ?? string.Empty,
                                ModuleId = moduleId,
                                DueDate = reader["due_date"] as DateTime?,
                            }
                        );
                }
            }

            // Move to next result set (enrollments)
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                var courseId = (Guid)reader["course_id"];
                var studentId = (Guid)reader["student_id"];

                if (coursesDict.ContainsKey(courseId))
                {
                    coursesDict[courseId].Enrollments.Add(studentId);
                }
            }

            return coursesDict.Values.ToList();
        }

        public async Task<Course?> GetCourseByIdAsync(Guid courseId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, description, instructor_id
                FROM courses 
                WHERE id = @courseId";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@courseId", courseId);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Course
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    InstructorId = (Guid)reader["instructor_id"],
                };
            }

            return null;
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
            command.Parameters.AddWithValue("@title", Course.Title);
            command.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);
            command.Parameters.AddWithValue(
                "@description",
                (object?)Course.Description ?? DBNull.Value
            );

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

        public async Task<bool> DeleteCourseAsync(Guid courseId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "DELETE FROM courses WHERE id = @courseId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@courseId", courseId);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
    }
}
