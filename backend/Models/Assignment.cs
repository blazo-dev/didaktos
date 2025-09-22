using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class Assignment
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Title must be at least 8 characters")]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public Guid ModuleId { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
