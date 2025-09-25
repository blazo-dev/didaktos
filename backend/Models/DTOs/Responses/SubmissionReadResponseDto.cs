using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class SubmissionReadResponseDto
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public int? Grade { get; set; }

        [Required]
        public Guid AssignmentId { get; set; }

        [Required]
        public Guid StudentId { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public string Name { get; set; } = string.Empty;
    }
}
