using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class CourseRequestDto
    {
        [Required]
        [MinLength(8, ErrorMessage = "The title must be at least 8 characters")]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
