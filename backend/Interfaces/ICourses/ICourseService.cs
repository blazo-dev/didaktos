using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ICourseService
    {
        Task<HttpResponseDto<object>> GetCoursesAsync();
        Task<HttpResponseDto<object>> CreateCourseAsync(
            CourseRequestDto request,
            Guid instructorId
        );

        Task<HttpResponseDto<object>> EditCourseAsync(CourseEditDto course, Guid userId);
        Task<HttpResponseDto<object>> DeleteCourseAsync(Guid courseId, Guid userId);
    }
}
