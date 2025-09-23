using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class CreateAssignmentRequestDto
    {
        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
