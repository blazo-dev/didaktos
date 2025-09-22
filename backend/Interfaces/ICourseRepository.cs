using didaktos.backend.Models;

namespace didaktos.backend.Interfaces
{
    public interface ICourseRepository
    {
        Task<Course?> GetCourseByIdAsync(Guid courseId);
        Task<bool> CourseExistsAsync(Guid courseId);
        Task<bool> IsUserInstructorOfCourseAsync(Guid userId, Guid courseId);
        Task<bool> IsUserEnrolledInCourseAsync(Guid userId, Guid courseId);
    }
}
