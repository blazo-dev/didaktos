using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ISubmissionRepository
    {
        Task<HttpResponseDto<Object>> InsertSubmissionAsync(Submission submission);
        Task<List<SubmissionReadResponseDto>> SelectAllCourseSubmissionsByAssignmentAsync(
            Guid courseId
        );
        Task<SubmissionGradeResponseDto> UpdateSubmissionGradeAsync(int? grade, Guid submissionId);
    }
}
