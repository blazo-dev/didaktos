using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class Enrollment
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        public string Status { get; set; } = string.Empty;

        [Required]
        public Guid InstructorId { get; set; }

        [Required]
        public Guid CourseId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
