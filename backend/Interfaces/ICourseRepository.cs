using didaktos.backend.Models;

namespace didaktos.backend.Interfaces
{
    public interface ICourseRepository
    {
        Task<Course?> GetCourseByInstructorIdAsync(Guid id);
        Task<Course> CreateCourseAsync(Course course);
    }
}
