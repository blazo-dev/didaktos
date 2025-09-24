using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using Npgsql;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly string _connectionString;

    public EnrollmentRepository(IConfiguration configuration)
    {
        _connectionString =
            configuration.GetConnectionString("SupabaseConnection")
            ?? throw new InvalidOperationException("Supabase connection string is not configured");
    }

    public async Task<EnrollmentAddResponseDto> InsertEnrollmentAsync(Enrollment enrollment)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        const string sql =
            @"
                INSERT INTO enrollments (id, status, student_id, course_id, created_at, updated_at)
                VALUES (@id, @status, @student_id, @course_id, @created_At, @updated_At)
                RETURNING id, status, student_id, course_id, created_at, updated_at";
        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", enrollment.Id);
        command.Parameters.AddWithValue("@status", enrollment.Status);
        command.Parameters.AddWithValue("@student_id", enrollment.StudentId);
        command.Parameters.AddWithValue("@course_id", enrollment.CourseId);
        command.Parameters.AddWithValue("@created_at", enrollment.CreatedAt);
        command.Parameters.AddWithValue("@updated_at", enrollment.UpdatedAt);
        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new EnrollmentAddResponseDto
            {
                Id = (Guid)reader["id"],
                Status = (string)reader["status"],
                StudentId = (Guid)reader["student_id"],
                CourseId = (Guid)reader["course_id"],
            };
        }
        throw new InvalidOperationException("Failed to Enroll");
    }

    public async Task<List<EnrollmentReadResponseDto>> SelectEnrollmentByIdAsync(Guid userId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        const string sql =
            @"
                SELECT id, student_id, course_id, status 
                FROM enrollments
                WHERE student_id = @userId AND status = 'active'";

        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);

        var enrollment = new List<EnrollmentReadResponseDto>();
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            enrollment.Add(
                new EnrollmentReadResponseDto
                {
                    Id = (Guid)reader["id"],
                    StudentId = (Guid)reader["student_id"],
                    CourseId = (Guid)reader["course_id"],
                    Status = (String)reader["status"],
                }
            );
        }

        return enrollment;
    }

    public async Task<EnrollmentCloseResponseDto> UpdateEnrollmentsAsync(Guid CourseId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        const string sql =
            @"
                UPDATE enrollments 
                SET status = 'completed', updated_at = @updatedAt
                WHERE course_id = @id
                RETURNING status, course_id";

        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", CourseId);
        command.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new EnrollmentCloseResponseDto
            {
                Status = (string)reader["status"],
                CourseId = (Guid)reader["course_id"],
            };
        }

        throw new InvalidOperationException("Failed to close enrollment");
    }
}
