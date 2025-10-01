using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class CreateModuleRequestDto
    {
        [Required]
        [StringLength(255, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;
    }
}
