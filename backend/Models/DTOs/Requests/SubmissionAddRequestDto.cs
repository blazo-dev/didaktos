using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class SubmissionAddRequestDto
    {
        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public Guid AssignmentId { get; set; }

        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid CourseId { get; set; }
    }
}
