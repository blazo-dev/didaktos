using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class EnrollmentReadResponseDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid StudentId { get; set; }

        public Guid CourseId { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}
