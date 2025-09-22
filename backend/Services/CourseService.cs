using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Models.DTOs.Requests;
using didaktos.backend.Models.DTOs.Response;
using Npgsql;

namespace didaktos.backend.Services
{
    public class CourseService
    {
        private readonly ICourseRepository _courseRepository;

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<object>> CreateCourseAsync(CourseRequestDto request)
        {
            try
            {
                // Create Course
                var course = new Course
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Description = request.Description.ToLower(),
                    InstructorId = Guid.Parse(ClaimTypes.NameIdentifier),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdCourse = await _courseRepository.InsertCourseAsync(course);

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "User registered successfully",
                    Data = new CourseResponseDto
                    {
                        Id = createdCourse.Id,
                        Title = createdCourse.Title,
                        Description = createdCourse.Description,
                        InstructorId = createdCourse.InstructorId,
                    },
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Registration failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
