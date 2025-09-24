using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class EnrollmentCloseResponseDto
    {
        public Guid CourseId { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}
