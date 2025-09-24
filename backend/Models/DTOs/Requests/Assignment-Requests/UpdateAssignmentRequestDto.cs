using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class UpdateAssignmentRequestDto
    {
        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(1)]
        public string Description { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
    }
}
