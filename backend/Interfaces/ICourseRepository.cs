using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using didaktos.backend.Models.DTOs.Response;

namespace didaktos.backend.Interfaces
{
    public interface ICourseRepository
    {
        Task<CourseReadResponseDto?> SelectCoursesAsync();
        Task<CourseResponseDto> InsertCourseAsync(Course course);
    }
}
