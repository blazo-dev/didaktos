using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class Course
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "The title must be at least 8 characters")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public Guid InstructorId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
