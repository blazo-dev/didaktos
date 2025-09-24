using didaktos.backend.Models;

namespace didaktos.backend.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<List<Assignment>> GetModuleAssignmentsAsync(Guid moduleId);
        Task<Assignment> CreateAssignmentAsync(Assignment assignment);
        Task<Assignment?> GetAssignmentByIdAsync(Guid assignmentId);
        Task<bool> AssignmentExistsAsync(Guid assignmentId);
        Task<Guid> GetLessonModuleIdAsync(Guid lessonId);
        Task<Lesson> UpdateLessonAsync(Lesson lesson);
        Task<bool> DeleteLessonAsync(Guid lessonId);
    }
}
