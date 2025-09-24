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

            // Get all courses with their instructors
            const string coursesSql =
                @"
                SELECT courses.id, title, description, instructor_id, name, email  
                FROM courses
                JOIN users ON courses.instructor_id = users.id
                ORDER BY courses.title;";

            using var command = new NpgsqlCommand(coursesSql, connection);
            var coursesDict = new Dictionary<Guid, CourseReadResponseDto>();

            using var coursesCommand = new NpgsqlCommand(coursesSql, connection);
            using var coursesReader = await coursesCommand.ExecuteReaderAsync();

            while (await coursesReader.ReadAsync())
            {
                var courseId = (Guid)coursesReader["id"];
                if (!coursesDict.ContainsKey(courseId))
                {
                    var courseDto = new CourseReadResponseDto
                    {
                        Id = courseId,
                        Title = (string)coursesReader["title"],
                        Description = coursesReader["description"] as string,
                        Instructor = new UserDto
                        {
                            Id = (Guid)coursesReader["instructor_id"],
                            Name = (string)coursesReader["name"],
                            Email = (string)coursesReader["email"],
                        },
                        Modules = new List<ModuleDto>(),
                    };
                    coursesDict[courseId] = courseDto;
                }
            }
            await coursesReader.CloseAsync();

            if (coursesDict.Count == 0)
            {
                return new List<CourseReadResponseDto>();
            }

            // Get all modules for the retrieved courses
            var courseIds = coursesDict.Keys.ToList();
            var courseIdsParams = string.Join(
                ", ",
                courseIds.Select((id, index) => $"@courseId{index}")
            );

            var modulesSql =
                $@"
                SELECT id, title, course_id
                FROM modules
                WHERE course_id IN ({courseIdsParams})
                ORDER BY title;";

            var modulesDict = new Dictionary<Guid, ModuleDto>();

            using var modulesCommand = new NpgsqlCommand(modulesSql, connection);
            for (int i = 0; i < courseIds.Count; i++)
            {
                modulesCommand.Parameters.AddWithValue($"@courseId{i}", courseIds[i]);
            }

            using var modulesReader = await modulesCommand.ExecuteReaderAsync();
            while (await modulesReader.ReadAsync())
            {
                var moduleId = (Guid)modulesReader["id"];
                var courseId = (Guid)modulesReader["course_id"];
                var moduleDto = new ModuleDto
                {
                    Id = moduleId,
                    Title = (string)modulesReader["title"],
                    CourseId = courseId,
                    Lessons = new List<LessonDto>(),
                    Assignments = new List<AssignmentDto>(),
                };
                modulesDict[moduleId] = moduleDto;

                if (coursesDict.ContainsKey(courseId))
                {
                    coursesDict[courseId].Modules.Add(moduleDto);
                }
            }
            await modulesReader.CloseAsync();

            if (modulesDict.Count == 0)
            {
                return coursesDict.Values.ToList();
            }

            // Get all lessons for the retrieved modules
            var moduleIds = modulesDict.Keys.ToList();
            var moduleIdsParams = string.Join(
                ", ",
                moduleIds.Select((id, index) => $"@moduleId{index}")
            );

            var lessonsSql =
                $@"
                SELECT id, title, content, module_id
                FROM lessons
                WHERE module_id IN ({moduleIdsParams})
                ORDER BY title;";

            using var lessonsCommand = new NpgsqlCommand(lessonsSql, connection);
            for (int i = 0; i < moduleIds.Count; i++)
            {
                lessonsCommand.Parameters.AddWithValue($"@moduleId{i}", moduleIds[i]);
            }

            using var lessonsReader = await lessonsCommand.ExecuteReaderAsync();
            while (await lessonsReader.ReadAsync())
            {
                var lessonDto = new LessonDto
                {
                    Id = (Guid)lessonsReader["id"],
                    Title = (string)lessonsReader["title"],
                    Content = (string)lessonsReader["content"],
                    ModuleId = (Guid)lessonsReader["module_id"],
                };
                var moduleId = lessonDto.ModuleId;
                if (modulesDict.ContainsKey(moduleId))
                {
                    modulesDict[moduleId].Lessons.Add(lessonDto);
                }
            }
            await lessonsReader.CloseAsync();

            // Get all assignments for the retrieved modules
            var assignmentsSql =
                $@"
                SELECT id, title, description, module_id, due_date
                FROM assignments
                WHERE module_id IN ({moduleIdsParams})
                ORDER BY title;";

            using var assignmentsCommand = new NpgsqlCommand(assignmentsSql, connection);
            for (int i = 0; i < moduleIds.Count; i++)
            {
                assignmentsCommand.Parameters.AddWithValue($"@moduleId{i}", moduleIds[i]);
            }

            using var assignmentsReader = await assignmentsCommand.ExecuteReaderAsync();
            while (await assignmentsReader.ReadAsync())
            {
                var assignmentDto = new AssignmentDto
                {
                    Id = (Guid)assignmentsReader["id"],
                    Title = (string)assignmentsReader["title"],
                    Description = assignmentsReader["description"] as string ?? string.Empty,
                    ModuleId = (Guid)assignmentsReader["module_id"],
                    DueDate = assignmentsReader["due_date"] as DateTime?,
                };
                var moduleId = assignmentDto.ModuleId;
                if (modulesDict.ContainsKey(moduleId))
                {
                    modulesDict[moduleId].Assignments.Add(assignmentDto);
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
