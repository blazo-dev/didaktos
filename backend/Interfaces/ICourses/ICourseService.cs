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
    }
}
