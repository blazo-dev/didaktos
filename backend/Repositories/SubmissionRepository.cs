using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using Npgsql;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly string _connectionString;

    public SubmissionRepository(IConfiguration configuration)
    {
        _connectionString =
            configuration.GetConnectionString("SupabaseConnection")
            ?? throw new InvalidOperationException("Supabase connection string is not configured");
    }

    public async Task<HttpResponseDto<Object>> InsertSubmissionAsync(Submission submission)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        const string sql =
            @"
                INSERT INTO submissions (id, content, grade, student_id, assignment_id, submitted_at, created_at, updated_at)
                VALUES (@id, @content, @grade, @student_id, @assignment_id, @submitted_at, @created_At, @updated_At)";
        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", submission.Id);
        command.Parameters.AddWithValue("@content", submission.Content);
        command.Parameters.AddWithValue("@grade", DBNull.Value);
        command.Parameters.AddWithValue("@student_id", submission.StudentId);
        command.Parameters.AddWithValue("@assignment_id", submission.AssignmentId);
        command.Parameters.AddWithValue("@submitted_at", submission.SubmittedAt);
        command.Parameters.AddWithValue("@created_at", submission.CreatedAt);
        command.Parameters.AddWithValue("@updated_at", submission.UpdatedAt);
        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new HttpResponseDto<object>
            {
                Success = true,
                Message = "Submission copmleted successfully",
            };
        }
        throw new InvalidOperationException("Failed to Enroll");
    }

    public async Task<List<SubmissionReadResponseDto>> SelectAllCourseSubmissionsAsync(
        Guid courseId
    )
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        const string sql =
            @"
                SELECT s.id, s.content, s.grade, s.assignment_id, s.student_id, s.submitted_at, u.name
                FROM submissions s
                JOIN users u ON s.student_id = u.id
                JOIN enrollments e ON s.student_id = e.student_id
                WHERE e.course_id = @courseId";

        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@courseId", courseId);

        var submissions = new List<SubmissionReadResponseDto>();
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            submissions.Add(
                new SubmissionReadResponseDto
                {
                    Id = (Guid)reader["id"],
                    Content = (string)reader["content"],
                    Grade = (int?)reader["grade"],
                    AssignmentId = (Guid)reader["assignment_id"],
                    StudentId = (Guid)reader["student_id"],
                    SubmittedAt = (DateTime)reader["submitted_at"],
                    Name = (string)reader["name"],
                }
            );
        }

        return submissions;
    }

    public async Task<EnrollmentCloseResponseDto> UpdateSubmissionGradeAsync(
        int? grade,
        Guid submissionId
    )
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        const string sql =
            @"
                UPDATE submissions 
                SET grade = @grade, updated_at = @updatedAt
                WHERE id = @id
                RETURNING id, grade";

        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@grade", grade);
        command.Parameters.AddWithValue("@id", submissionId);
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
