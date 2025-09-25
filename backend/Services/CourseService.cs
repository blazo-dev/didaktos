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

        public async Task<HttpResponseDto<CourseResponseDto>> CreateCourseAsync(
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
                    Description = request.Description,
                    InstructorId = instructorId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdCourse = await _courseRepository.InsertCourseAsync(course);

                return new HttpResponseDto<CourseResponseDto>
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
                return new HttpResponseDto<CourseResponseDto>
                {
                    Success = false,
                    Message = "Course creation failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<List<CourseReadResponseDto>>> GetCoursesAsync()
        {
            try
            {
                var Courses = await _courseRepository.SelectCoursesAsync();

                return new HttpResponseDto<List<CourseReadResponseDto>>
                {
                    Success = true,
                    Message = "Courses retrieved successfully",
                    Data = Courses,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<List<CourseReadResponseDto>>
                {
                    Success = false,
                    Message = "Retrieval of courses failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<CourseEditDto>> EditCourseAsync(
            CourseEditDto course,
            Guid userId
        )
        {
            try
            {
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, course.Id))
                {
                    return new HttpResponseDto<CourseEditDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can edit the course",
                    };
                }

                var updatedcourseInfo = await _courseRepository.UpdateCourseAsync(course);

                var courseEditDto = new CourseEditDto
                {
                    Title = updatedcourseInfo.Title,
                    Id = updatedcourseInfo.Id,
                    Description = updatedcourseInfo.Description,
                };

                return new HttpResponseDto<CourseEditDto>
                {
                    Success = true,
                    Message = "Course updated Successfully",
                    Data = courseEditDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<CourseEditDto>
                {
                    Success = false,
                    Message = "Failed to update course",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> DeleteCourseAsync(Guid courseId, Guid userId)
        {
            try
            {
                // Check if course exists
                var existingCourse = await _courseRepository.GetCourseByIdAsync(courseId);
                if (existingCourse == null)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Course not found",
                    };
                }

                // Check permissions
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can delete courses",
                    };
                }

                var deleted = await _courseRepository.DeleteCourseAsync(courseId);

                if (!deleted)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Failed to delete course",
                    };
                }

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Course deleted successfully",
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to delete course",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
