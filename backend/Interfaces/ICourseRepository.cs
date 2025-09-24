using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ICourseRepository
    {
        Task<List<CourseReadResponseDto>> SelectCoursesAsync();
        Task<CourseResponseDto> InsertCourseAsync(Course course);
        Task<CourseEditDto> UpdateCourseAsync(CourseEditDto Course);
    }
}
