using didaktos.backend.Models;

namespace didaktos.backend.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<List<Assignment>> GetModuleAssignmentsAsync(Guid moduleId);
        Task<Assignment> CreateAssignmentAsync(Assignment assignment);
        Task<Assignment?> GetAssignmentByIdAsync(Guid assignmentId);
        Task<bool> AssignmentExistsAsync(Guid assignmentId);
        Task<Guid> GetAssignmentModuleIdAsync(Guid assignmentId);
        Task<Assignment> UpdateAssignmentAsync(Assignment assignment);
        Task<bool> DeleteAssignmentAsync(Guid assignmentId);
    }
}
