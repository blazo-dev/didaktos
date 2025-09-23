using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IAssignmentService
    {
        Task<HttpResponseDto<List<AssignmentDto>>> GetModuleAssignmentsAsync(
            Guid moduleId,
            Guid userId
        );
        Task<HttpResponseDto<AssignmentDto>> CreateAssignmentAsync(
            Guid moduleId,
            CreateAssignmentRequestDto request,
            Guid userId
        );
    }
}
