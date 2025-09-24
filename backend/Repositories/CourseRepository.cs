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
                        Enrollments = new List<Guid>(),
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

            // Fetch all modules, lessons, assignments, and enrollments in a single query using JOINs
            var courseIds = coursesDict.Keys.ToList();
            var courseIdsParams = string.Join(
                ", ",
                courseIds.Select((id, index) => $"@courseId{index}")
            );

            var joinSql = $@"
                SELECT 
                    c.id as course_id, c.title as course_title, c.description as course_description,
                    m.id as module_id, m.title as module_title, m.description as module_description,
                    l.id as lesson_id, l.title as lesson_title, l.content as lesson_content,
                    a.id as assignment_id, a.title as assignment_title, a.description as assignment_description,
                    e.id as enrollment_id, e.user_id as enrollment_user_id
                FROM courses c
                LEFT JOIN modules m ON m.course_id = c.id
                LEFT JOIN lessons l ON l.module_id = m.id
                LEFT JOIN assignments a ON a.module_id = m.id
                LEFT JOIN enrollments e ON e.course_id = c.id
                WHERE c.id IN ({courseIdsParams})
                ORDER BY c.title, m.title, l.title, a.title;";

            using var joinCommand = new NpgsqlCommand(joinSql, connection);
            for (int i = 0; i < courseIds.Count; i++)
            {
                joinCommand.Parameters.AddWithValue($"@courseId{i}", courseIds[i]);
            }

            using var reader = await joinCommand.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var courseId = reader["course_id"] == DBNull.Value ? Guid.Empty : (Guid)reader["course_id"];
                var moduleId = reader["module_id"] == DBNull.Value ? Guid.Empty : (Guid)reader["module_id"];
                var lessonId = reader["lesson_id"] == DBNull.Value ? Guid.Empty : (Guid)reader["lesson_id"];
                var assignmentId = reader["assignment_id"] == DBNull.Value ? Guid.Empty : (Guid)reader["assignment_id"];
                var enrollmentId = reader["enrollment_id"] == DBNull.Value ? Guid.Empty : (Guid)reader["enrollment_id"];

                // Modules
                if (moduleId != Guid.Empty && modulesDict.ContainsKey(moduleId))
                {
                    var moduleDto = modulesDict[moduleId];

                    // Lessons
                    if (lessonId != Guid.Empty && !moduleDto.Lessons.Any(l => l.Id == lessonId))
                    {
                        var lessonDto = new LessonDto
                        {
                            Id = lessonId,
                            Title = reader["lesson_title"] == DBNull.Value ? null : (string)reader["lesson_title"],
                            Content = reader["lesson_content"] == DBNull.Value ? null : (string)reader["lesson_content"],
                            ModuleId = moduleId,
                        };
                        moduleDto.Lessons.Add(lessonDto);
                    }

                    // Assignments
                    if (assignmentId != Guid.Empty && !moduleDto.Assignments.Any(a => a.Id == assignmentId))
                    {
                        var assignmentDto = new AssignmentDto
                        {
                            Id = assignmentId,
                            Title = reader["assignment_title"] == DBNull.Value ? null : (string)reader["assignment_title"],
                            Description = reader["assignment_description"] == DBNull.Value ? null : (string)reader["assignment_description"],
                            ModuleId = moduleId,
                        };
                        moduleDto.Assignments.Add(assignmentDto);
                    }
                }

                // Enrollments
                if (enrollmentId != Guid.Empty && coursesDict.ContainsKey(courseId))
                {
                    var courseDto = coursesDict[courseId];
                    if (!courseDto.Enrollments.Any(e => e.Id == enrollmentId))
                    {
                        var enrollmentDto = new EnrollmentDto
                        {
                            Id = enrollmentId,
                            UserId = reader["enrollment_user_id"] == DBNull.Value ? Guid.Empty : (Guid)reader["enrollment_user_id"],
                            CourseId = courseId,
                        };
                        courseDto.Enrollments.Add(enrollmentDto);
                    }
                }
            }
            await reader.CloseAsync();
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
            await assignmentsReader.CloseAsync();

            // Get all enrollments for the retrieved courses
            var enrollmentsSql =
                $@"
                SELECT student_id, course_id
                FROM enrollments
                WHERE course_id IN ({courseIdsParams}) AND status = 'active';";

            using var enrollmentsCommand = new NpgsqlCommand(enrollmentsSql, connection);
            for (int i = 0; i < courseIds.Count; i++)
            {
                enrollmentsCommand.Parameters.AddWithValue($"@courseId{i}", courseIds[i]);
            }

            using var enrollmentsReader = await enrollmentsCommand.ExecuteReaderAsync();
            while (await enrollmentsReader.ReadAsync())
            {
                var courseId = (Guid)enrollmentsReader["course_id"];
                var studentId = (Guid)enrollmentsReader["student_id"];
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
