using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class Submission
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public int Grade { get; set; }

        [Required]
        public Guid AssignmentId { get; set; }

        [Required]
        public Guid StudentId { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
