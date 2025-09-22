using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
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

        public async Task<HttpResponseDto<object>> CreateCourseAsync(CourseCreationDto request)
        {
            try
            {
                // Check if Course already exists
                var existingUser = await _courseRepository.GetCourseByInstructorIdAsync(
                    request.InstructorId
                );

                if (existingUser != null)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Course already exists",
                    };
                }

                if (ClaimTypes.Role.ToLower() != "instructor")
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid role. Must be 'instructor'",
                    };
                }

                // Create Course
                var course = new Course
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Description = request.Description.ToLower(),
                    InstructorId = request.InstructorId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdCourse = await _courseRepository.CreateCourseAsync(course);

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "User registered successfully",
                    Data = new CourseCreationDto
                    {
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
