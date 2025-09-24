using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IEnrollmentService
    {
        Task<HttpResponseDto<object>> CreateEnrollmentAsync(
            EnrollmentAddRequestDto request,
            Guid studentId
        );
        Task<HttpResponseDto<object>> GetEnrollmentsAsync(Guid userId);

        Task<HttpResponseDto<object>> CloseEnrollmentsAsync(Guid courseId, Guid studentId);
    }
}
