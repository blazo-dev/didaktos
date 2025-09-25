using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models.DTOs
{
    public class CourseReadResponseDto
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "The title must be at least 8 characters")]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public UserDto Instructor { get; set; } = new UserDto();

        public List<Guid> Enrollments { get; set; } = new List<Guid>();
        public List<ModuleDto> Modules { get; set; } = new List<ModuleDto>();
    }
}
