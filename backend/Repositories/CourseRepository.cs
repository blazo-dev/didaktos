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
            command.Parameters.AddWithValue(
                "@description",
                (object?)course.Description ?? DBNull.Value
            );

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new CourseResponseDto
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = reader["description"] as string,
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
                SELECT 
                    c.id as course_id,
                    c.title as course_title,
                    c.description as course_description,
                    c.instructor_id,
                    u.name as instructor_name,
                    u.email as instructor_email,
                    m.id as module_id,
                    m.title as module_title,
                    l.id as lesson_id,
                    l.title as lesson_title,
                    l.content as lesson_content,
                    l.created_at as lesson_created_at,
                    l.updated_at as lesson_updated_at,
                    a.id as assignment_id,
                    a.title as assignment_title,
                    a.description as assignment_description,
                    a.created_at as assignment_created_at,
                    a.updated_at as assignment_updated_at,
                    a.due_date as assignment_due_date,
                    e.student_id
                FROM courses c
                JOIN users u ON c.instructor_id = u.id
                LEFT JOIN modules m ON c.id = m.course_id
                LEFT JOIN lessons l ON m.id = l.module_id
                LEFT JOIN assignments a ON m.id = a.module_id
                LEFT JOIN enrollments e ON c.id = e.course_id
                ORDER BY c.title, m.title, l.title, a.title;";

            using var command = new NpgsqlCommand(sql, connection);
            using var reader = await command.ExecuteReaderAsync();

            var coursesDict = new Dictionary<Guid, CourseReadResponseDto>();
            var modulesDict = new Dictionary<Guid, ModuleDto>();

            while (await reader.ReadAsync())
            {
                var courseId = (Guid)reader["course_id"];

                // Handle course
                if (!coursesDict.ContainsKey(courseId))
                {
                    coursesDict[courseId] = new CourseReadResponseDto
                    {
                        Id = courseId,
                        Title = (string)reader["course_title"],
                        Description = reader["course_description"] as string,
                        Instructor = new UserDto
                        {
                            Id = (Guid)reader["instructor_id"],
                            Name = (string)reader["instructor_name"],
                            Email = (string)reader["instructor_email"],
                        },
                        Modules = new List<ModuleDto>(),
                        Enrollments = new List<Guid>(),
                    };
                }

                // Handle module
                var moduleIdValue = reader["module_id"];
                if (moduleIdValue != DBNull.Value)
                {
                    var moduleId = (Guid)moduleIdValue;

                    if (!modulesDict.ContainsKey(moduleId))
                    {
                        var module = new ModuleDto
                        {
                            Id = moduleId,
                            Title = (string)reader["module_title"],
                            CourseId = courseId,
                            Lessons = new List<LessonDto>(),
                            Assignments = new List<AssignmentDto>(),
                        };

                        modulesDict[moduleId] = module;
                        coursesDict[courseId].Modules.Add(module);
                    }

                    // Handle lesson
                    var lessonIdValue = reader["lesson_id"];
                    if (lessonIdValue != DBNull.Value)
                    {
                        var lessonId = (Guid)lessonIdValue;
                        var currentModule = modulesDict[moduleId];

                        if (!currentModule.Lessons.Any(l => l.Id == lessonId))
                        {
                            currentModule.Lessons.Add(
                                new LessonDto
                                {
                                    Id = lessonId,
                                    Title = (string)reader["lesson_title"],
                                    Content = reader["lesson_content"] as string ?? string.Empty,
                                    ModuleId = moduleId,
                                }
                            );
                        }
                    }

                    // Handle assignment
                    var assignmentIdValue = reader["assignment_id"];
                    if (assignmentIdValue != DBNull.Value)
                    {
                        var assignmentId = (Guid)assignmentIdValue;
                        var currentModule = modulesDict[moduleId];

                        if (!currentModule.Assignments.Any(a => a.Id == assignmentId))
                        {
                            currentModule.Assignments.Add(
                                new AssignmentDto
                                {
                                    Id = assignmentId,
                                    Title = (string)reader["assignment_title"],
                                    Description =
                                        reader["assignment_description"] as string ?? string.Empty,
                                    ModuleId = moduleId,
                                    DueDate = reader["assignment_due_date"] as DateTime?,
                                }
                            );
                        }
                    }
                }

                // Handle enrollment
                var studentIdValue = reader["student_id"];
                if (studentIdValue != DBNull.Value)
                {
                    var studentId = (Guid)studentIdValue;
                    var currentCourse = coursesDict[courseId];

                    if (!currentCourse.Enrollments.Contains(studentId))
                    {
                        currentCourse.Enrollments.Add(studentId);
                    }
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
                    Description = reader["description"] as string,
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
                    Description = (string?)reader["description"],
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
