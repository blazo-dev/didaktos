using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Models.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/courses")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetCourses([FromBody] GeminiPrompt prompt)
        //{
        //    return Ok();
        //}

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCourses([FromBody] CourseRequestDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"Creating course for user: {userIdClaim}");
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }


            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid request data",
                        Errors = ModelState,
                    }
                );
            }

            var result = await _courseService.CreateCourseAsync(request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);

        }

        // private async Task<Enrollment> CreateEnrollmentAsync(Enrollment course)
        // {
        //     using var connection = new NpgsqlConnection(_connectionString);
        //     await connection.OpenAsync();

        //     const string sql =
        //         @"
        //         INSERT INTO courses (id, status, instructor_id, course_id, created_at, updated_at)
        //         VALUES (@id, @status, @instructor_id, @course_id, @createdAt, @updatedAt)
        //         RETURNING id, status, instructor_id, course_id, created_at, updated_at";

        //     using var command = new NpgsqlCommand(sql, connection);
        //     command.Parameters.AddWithValue("@id", course.Id);
        //     command.Parameters.AddWithValue("@status", course.Status);
        //     command.Parameters.AddWithValue("@course_id", course.CourseId);
        //     command.Parameters.AddWithValue("@instructor_id", course.InstructorId);
        //     command.Parameters.AddWithValue("@created_at", course.CreatedAt);
        //     command.Parameters.AddWithValue("@updated_at", course.UpdatedAt);

        //     using var reader = await command.ExecuteReaderAsync();
        //     if (await reader.ReadAsync())
        //     {
        //         return new Enrollment
        //         {
        //             Id = (Guid)reader["id"],
        //             Status = (string)reader["status"],
        //             CourseId = (Guid)reader["course_id"],
        //             InstructorId = (Guid)reader["instructor_id"],
        //             CreatedAt = (DateTime)reader["created_at"],
        //             UpdatedAt = (DateTime)reader["updated_at"],
        //         };
        //     }

        //     throw new InvalidOperationException("Failed to Enroll");
        // }
    }
}
