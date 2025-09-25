using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IEnrollmentService
    {
        Task<HttpResponseDto<EnrollmentAddResponseDto>> CreateEnrollmentAsync(
            EnrollmentAddRequestDto request,
            Guid studentId
        );
        Task<HttpResponseDto<List<EnrollmentReadResponseDto>>> GetEnrollmentsAsync(Guid userId);

        Task<HttpResponseDto<EnrollmentCloseResponseDto>> CloseEnrollmentsAsync(
            Guid courseId,
            Guid studentId
        );
    }
}
