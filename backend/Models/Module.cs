using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class Module
    {
        [Key]
        [Required]
        public Guid Id { get; set; }

        [MinLength(8, ErrorMessage = "Title must be at least 8 characters")]
        public string Title { get; set; } = string.Empty;

        [Required]
        public Guid CourseId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
