using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IEnrollmentRepository
    {
        Task<EnrollmentAddResponseDto> InsertEnrollmentAsync(Enrollment enrollment);
        Task<List<EnrollmentReadResponseDto>> SelectEnrollmentByIdAsync(Guid userId);
        Task<EnrollmentCloseResponseDto> UpdateEnrollmentsAsync(Guid CourseId);
    }
}
