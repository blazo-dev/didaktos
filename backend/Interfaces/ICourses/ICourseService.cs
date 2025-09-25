using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ICourseService
    {
        Task<HttpResponseDto<List<CourseReadResponseDto>>> GetCoursesAsync();
        Task<HttpResponseDto<CourseResponseDto>> CreateCourseAsync(
            CourseRequestDto request,
            Guid instructorId
        );
        Task<HttpResponseDto<object>> EditCourseAsync(
            Guid courseId,
            CourseEditDto course,
            Guid userId
        );
        Task<HttpResponseDto<object>> DeleteCourseAsync(Guid courseId, Guid userId);
    }
}
