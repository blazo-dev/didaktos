using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ISubmissionRepository
    {
        Task<HttpResponseDto<Object>> InsertSubmissionAsync(Submission submission);
        Task<List<SubmissionReadResponseDto>> SelectAllCourseSubmissionsAsync(Guid courseId);
        Task<EnrollmentCloseResponseDto> UpdateSubmissionGradeAsync(int? grade, Guid submissionId);
    }
}
