using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ICourseRepository
    {
        Task<Course?> GetCourseByIdAsync(Guid courseId);

        Task<List<CourseReadResponseDto>> SelectCoursesAsync(Guid userId);
        Task<CourseResponseDto> InsertCourseAsync(Course course);
        Task<CourseResponseDto> UpdateCourseAsync(Course course);
        Task<bool> CourseExistsAsync(Guid courseId);
        Task<bool> IsUserInstructorOfCourseAsync(Guid userId, Guid courseId);
        Task<bool> IsUserEnrolledInCourseAsync(Guid userId, Guid courseId);
        Task<bool> DeleteCourseAsync(Guid courseId);
    }
}
