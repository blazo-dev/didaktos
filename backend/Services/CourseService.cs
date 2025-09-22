using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Models.DTOs.Requests;
using didaktos.backend.Models.DTOs.Response;
namespace didaktos.backend.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<object>> CreateCourseAsync(CourseRequestDto request, Guid instructorId)
        {
            try
            {
                // Create Course
                var course = new Course
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Description = request.Description.ToLower(),
                    InstructorId = instructorId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdCourse = await _courseRepository.InsertCourseAsync(course);

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Course created successfully",
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
                    Message = "Course creation failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public Task<Course?> GetCourseByInstructorIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
