using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Serialization;
using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Models.DTOs.Requests;
using didaktos.backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly ICourseService _courseService;
        private readonly ICourseRepository _courseRepository;

        public CourseController(ICourseService courseService, ICourseRepository courseRepository)
        {
            _courseService = courseService;
            _courseRepository = courseRepository;
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses([FromBody] GeminiPrompt prompt)
        {
            return Ok();
        }

        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourses([FromBody] CourseRequestDto request)
        {
            {
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

                var result = await _courseService.CreateCourseAsync(request);

                if (result.Success)
                {
                    return Ok(result);
                }

                return result.Message == "User with this email already exists"
                    ? Conflict(result)
                    : BadRequest(result);
            }
        }

        private async Task<Enrollment> CreateEnrollmentAsync(Enrollment course)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                INSERT INTO users (id, status, instructor_id, course_id, created_at, updated_at)
                VALUES (@id, @status, @instructor_id, @course_id, @createdAt, @updatedAt)
                RETURNING id, status, instructor_id, course_id, created_at, updated_at";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@id", course.Id);
            command.Parameters.AddWithValue("@status", course.Status);
            command.Parameters.AddWithValue("@course_id", course.CourseId);
            command.Parameters.AddWithValue("@instructor_id", course.InstructorId);
            command.Parameters.AddWithValue("@created_at", course.CreatedAt);
            command.Parameters.AddWithValue("@updated_at", course.UpdatedAt);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Enrollment
                {
                    Id = (Guid)reader["id"],
                    Status = (string)reader["status"],
                    CourseId = (Guid)reader["course_id"],
                    InstructorId = (Guid)reader["instructor_id"],
                    CreatedAt = (DateTime)reader["created_at"],
                    UpdatedAt = (DateTime)reader["updated_at"],
                };
            }

            throw new InvalidOperationException("Failed to Enroll");
        }
    }
}
