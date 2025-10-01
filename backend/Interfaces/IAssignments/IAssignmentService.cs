using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IAssignmentService
    {
        Task<HttpResponseDto<object>> GetModuleAssignmentsAsync(Guid moduleId, Guid userId);
        Task<HttpResponseDto<AssignmentDto>> CreateAssignmentAsync(
            Guid moduleId,
            CreateAssignmentRequestDto request,
            Guid userId
        );

        Task<HttpResponseDto<AssignmentResponseDto>> UpdateAssignmentAsync(
            Guid assignmentId,
            UpdateAssignmentRequestDto request,
            Guid userId
        );
        Task<HttpResponseDto<object>> DeleteAssignmentAsync(Guid assignmentId, Guid userId);
    }
}
