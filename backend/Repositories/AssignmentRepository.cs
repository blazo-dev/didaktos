using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using Npgsql;

namespace didaktos.backend.Repositories
{
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly string _connectionString;

        public AssignmentRepository(IConfiguration configuration)
        {
            _connectionString =
                configuration.GetConnectionString("SupabaseConnection")
                ?? throw new InvalidOperationException(
                    "Supabase connection string is not configured"
                );
        }

        public async Task<List<AssignmentDto>> GetModuleAssignmentsWithSubmissionsAsync(
            Guid moduleId,
            Guid? userId = null,
            bool isInstructor = false
        )
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            string sql =
                @"
                SELECT 
                    a.id as assignment_id, 
                    a.title, 
                    a.description, 
                    a.module_id, 
                    a.created_at, 
                    a.updated_at, 
                    a.due_date,
                    s.id as submission_id,
                    s.student_id as submission_student_id,
                    s.content as submission_content,
                    s.submitted_at,
                    s.grade,
                    u.name as student_name
                FROM assignments a
                LEFT JOIN submissions s ON a.id = s.assignment_id
                LEFT JOIN users u ON s.student_id = u.id";

            // Add WHERE clause based on user role
            if (isInstructor)
            {
                sql += " WHERE a.module_id = @moduleId";
            }
            else
            {
                sql +=
                    " WHERE a.module_id = @moduleId AND (s.student_id = @studentId OR s.student_id IS NULL)";
            }

            sql += " ORDER BY a.created_at ASC, s.submitted_at ASC";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@moduleId", moduleId);
            if (!isInstructor && userId.HasValue)
            {
                command.Parameters.AddWithValue("@studentId", userId.Value);
            }

            var assignmentDict = new Dictionary<Guid, AssignmentDto>();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var assignmentId = (Guid)reader["assignment_id"];

                if (!assignmentDict.TryGetValue(assignmentId, out var assignment))
                {
                    assignment = new AssignmentDto
                    {
                        Id = assignmentId,
                        Title = (string)reader["title"],
                        Description = (string)reader["description"],
                        ModuleId = (Guid)reader["module_id"],
                        DueDate = reader["due_date"] as DateTime?,
                        CreatedAt = (DateTime)reader["created_at"],
                        UpdatedAt = (DateTime)reader["updated_at"],
                        Submissions = new List<SubmissionReadResponseDto>(),
                    };
                    assignmentDict[assignmentId] = assignment;
                }

                // Add submission if it exists
                if (reader["submission_id"] != DBNull.Value)
                {
                    var submissionDto = new SubmissionReadResponseDto
                    {
                        Id = (Guid)reader["submission_id"],
                        StudentId = (Guid)reader["submission_student_id"],
                        AssignmentId = assignmentId,
                        Content = reader["submission_content"]?.ToString() ?? string.Empty,
                        SubmittedAt = (DateTime)reader["submitted_at"],
                        Grade = reader["grade"] as int?,
                        Name = reader["student_name"]?.ToString() ?? string.Empty,
                    };
                    assignment.Submissions.Add(submissionDto);
                }
            }

            return assignmentDict.Values.ToList();
        }

        public async Task<Assignment> CreateAssignmentAsync(Assignment assignment)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
        INSERT INTO assignments (id, title, description, module_id, created_at, updated_at, due_date)
        VALUES (@id, @title, @description, @moduleId, @createdAt, @updatedAt, @dueDate)
        RETURNING id, title, description, module_id, created_at, updated_at, due_date";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", assignment.Id);
            command.Parameters.AddWithValue("@title", assignment.Title);
            command.Parameters.AddWithValue("@description", assignment.Description);
            command.Parameters.AddWithValue("@moduleId", assignment.ModuleId);
            command.Parameters.AddWithValue("@createdAt", assignment.CreatedAt);
            command.Parameters.AddWithValue("@updatedAt", assignment.UpdatedAt);

            command.Parameters.AddWithValue(
                "@dueDate",
                (object?)assignment.DueDate ?? DBNull.Value
            );

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Assignment
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    ModuleId = (Guid)reader["module_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                    DueDate = reader["due_date"] as DateTime?,
                };
            }

            throw new InvalidOperationException("Failed to create Assignment");
        }

        public async Task<Assignment?> GetAssignmentByIdAsync(Guid assignmentId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, description, module_id, created_at, updated_at, due_date
                FROM assignments 
                WHERE id = @assignmentId";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@assignmentId", assignmentId);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Assignment
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    ModuleId = (Guid)reader["module_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                    DueDate = (DateTime?)reader["due_date"],
                };
            }

            return null;
        }

        public async Task<bool> AssignmentExistsAsync(Guid assignmentId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT COUNT(1) FROM assignments WHERE id = @assignmentId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@assignmentId", assignmentId);

            var count = await command.ExecuteScalarAsync();
            return Convert.ToInt32(count) > 0;
        }

        public async Task<Guid> GetAssignmentModuleIdAsync(Guid assignmentId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT module_id FROM assignments WHERE id = @assignmentId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@assignmentId", assignmentId);

            var result = await command.ExecuteScalarAsync();
            if (result != null)
            {
                return (Guid)result;
            }

            throw new InvalidOperationException("Assignment not found or has no module ID");
        }

        public async Task<Assignment> UpdateAssignmentAsync(Assignment assignment)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                UPDATE assignments
                SET title = @title, description = @description, updated_at = @updatedAt, due_date = @dueDate
                WHERE id = @id
                RETURNING id, title, description, module_id, created_at, updated_at, due_date";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", assignment.Id);
            command.Parameters.AddWithValue("@title", assignment.Title);
            command.Parameters.AddWithValue("@description", assignment.Description);
            command.Parameters.AddWithValue("@updatedAt", assignment.UpdatedAt);
            command.Parameters.AddWithValue(
                "@dueDate",
                (object?)assignment.DueDate ?? DBNull.Value
            );

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Assignment
                {
                    Id = (Guid)reader["id"],
                    Title = (string)reader["title"],
                    Description = (string)reader["description"],
                    ModuleId = (Guid)reader["module_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                    DueDate = reader["due_date"] as DateTime?,
                };
            }

            throw new InvalidOperationException("Failed to update assignment");
        }

        public async Task<bool> DeleteAssignmentAsync(Guid assignmentId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "DELETE FROM assignments WHERE id = @assignmentId";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@assignmentId", assignmentId);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
    }
}
