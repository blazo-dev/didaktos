using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<object>> CreateCourseAsync(
            CourseRequestDto request,
            Guid instructorId
        )
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

        public async Task<HttpResponseDto<object>> GetCoursesAsync()
        {
            try
            {
                var Courses = await _courseRepository.SelectCoursesAsync();

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Courses retrieved successfully",
                    Data = Courses,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Retrieval of courses failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> EditCourseAsync(
            CourseEditDto Course,
            Guid UserId
        )
        {
            try
            {
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(UserId, Course.Id))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can close the course",
                    };
                }

                var updatedcourseInfo = await _courseRepository.UpdateCourseAsync(Course);

                var courseEditDto = new CourseEditDto
                {
                    Title = updatedcourseInfo.Title,
                    Id = updatedcourseInfo.Id,
                    Description = updatedcourseInfo.Description,
                };

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Enrollments closed Successfully",
                    Data = courseEditDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to close enrollments",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
