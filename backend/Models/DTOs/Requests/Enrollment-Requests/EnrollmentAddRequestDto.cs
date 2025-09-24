using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class EnrollmentAddRequestDto
    {
        [Required]
        public Guid CourseId { get; set; }
    }
}
