using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class UpdateLessonRequestDto
    {
        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(1)]
        public string Content { get; set; } = string.Empty;
    }
}
