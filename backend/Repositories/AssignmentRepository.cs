using didaktos.backend.Interfaces;
using didaktos.backend.Models;
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

        public async Task<List<Assignment>> GetModuleAssignmentsAsync(Guid moduleId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT id, title, description, module_id, created_at, updated_at, due_date
                FROM assignments 
                WHERE module_id = @moduleId
                ORDER BY created_at ASC";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@moduleId", moduleId);

            var assignments = new List<Assignment>();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                assignments.Add(
                    new Assignment
                    {
                        Id = (Guid)reader["id"],
                        Title = (string)reader["title"],
                        Description = (string)reader["description"],
                        ModuleId = (Guid)reader["module_id"],
                        CreatedAt = (DateTime)reader["created_at"],
                        UpdatedAt = (DateTime)reader["updated_at"],
                        DueDate = reader["due_date"] as DateTime?,
                    }
                );
            }

            return assignments;
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

            // Better null handling for due_date
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
            command.Parameters.AddWithValue("@moduleId", assignment.ModuleId);
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
