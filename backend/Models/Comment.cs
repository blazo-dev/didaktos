using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class Comment
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        public string Content { get; set; } = string.Empty;

        [Required]
        public Guid AssignmentId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
