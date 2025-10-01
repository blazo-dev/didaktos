using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<List<AssignmentDto>> GetModuleAssignmentsWithSubmissionsAsync(
            Guid moduleId,
            Guid? userId = null,
            bool isInstructor = false
        );
        Task<Assignment> CreateAssignmentAsync(Assignment assignment);
        Task<Assignment?> GetAssignmentByIdAsync(Guid assignmentId);
        Task<bool> AssignmentExistsAsync(Guid assignmentId);
        Task<Guid> GetAssignmentModuleIdAsync(Guid assignmentId);
        Task<Assignment> UpdateAssignmentAsync(Assignment assignment);
        Task<bool> DeleteAssignmentAsync(Guid assignmentId);
    }
}
