using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ISubmissionService
    {
        Task<HttpResponseDto<object>> CreateSubmissionAsync(
            SubmissionAddRequestDto request,
            Guid studentId
        );
        Task<HttpResponseDto<List<SubmissionReadResponseDto>>> GetAllCourseSubmissionsAsync(
            Guid userId,
            Guid courseId
        );
        Task<HttpResponseDto<object>> SetSubmissionGradeAsync(
            Guid userId,
            SubmissionGradeRequestDto request
        );
    }
}
