using didaktos.backend.Interfaces;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class AssignmentService : IAssignmentService
    {
        public Task<HttpResponseDto<List<AssignmentDto>>> GetModuleAssignmentsAsync(
            Guid moduleId,
            Guid userId
        )
        {
            // TODO: Implement when ready
            return Task.FromResult(
                new HttpResponseDto<List<AssignmentDto>>
                {
                    Success = false,
                    Message = "Assignment functionality not yet implemented",
                }
            );
        }

        public Task<HttpResponseDto<AssignmentDto>> CreateAssignmentAsync(
            Guid moduleId,
            CreateAssignmentRequestDto request,
            Guid userId
        )
        {
            // TODO: Implement when ready
            return Task.FromResult(
                new HttpResponseDto<AssignmentDto>
                {
                    Success = false,
                    Message = "Assignment functionality not yet implemented",
                }
            );
        }
    }
}
