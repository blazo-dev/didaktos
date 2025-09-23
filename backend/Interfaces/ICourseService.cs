using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Models.DTOs.Requests;

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
